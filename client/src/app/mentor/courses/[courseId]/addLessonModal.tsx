"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileImage, PlayCircle, XCircle, Loader2 } from "lucide-react";
import { ILessons } from "@/src/types/lessons";
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import { MentorAPIMethods } from "@/src/services/APImethods";

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().positive("Order must be a positive number"),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
});

export type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface AddLessonModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nextOrder: number;
  courseId: string;
  onLessonAdded: () => void;
}

export function AddLessonModal({
  open,
  setOpen,
  nextOrder,
  courseId,
  onLessonAdded,
}: AddLessonModalProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      order: nextOrder,
      thumbnail: "",
      videoUrl: "",
      duration: "",
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedS3VideoUrl, setUploadedS3VideoUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        description: "",
        order: nextOrder,
        thumbnail: "",
        videoUrl: "",
        duration: "",
      });
      setUploadedS3VideoUrl(null);
      setIsUploading(false);
      setThumbnailFile(null);
      setThumbnailPreviewUrl(null);
    }
  }, [open, nextOrder, form]);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedS3VideoUrl(null);

    try {
      const res = await MentorAPIMethods.getS3DirectUploadUrl(file.name, file.type);
      if (!res.ok || !res.data || !res.data.signedUploadUrl || !res.data.publicVideoUrl) {
        throw new Error(res.error?.message || "Failed to get S3 URLs from backend.");
      }

      const { signedUploadUrl, publicVideoUrl } = res.data;
      const uploadResponse = await fetch(signedUploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload file to S3: ${uploadResponse.status} - ${errorText}`);
      }

      form.setValue("videoUrl", publicVideoUrl, { shouldValidate: true });
      setUploadedS3VideoUrl(publicVideoUrl);
      showSuccessToast("Video uploaded!");
    } catch (error: any) {
      console.error("Video upload error:", error);
      showErrorToast(`Upload Failed: ${error.message || "Unexpected error."}`);
      form.setValue("videoUrl", "");
      setUploadedS3VideoUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveVideo = async () => {
    const currentVideoUrl = form.getValues("videoUrl");
    if (!currentVideoUrl) return;

    try {
      const deleteResult = await MentorAPIMethods.deleteS3file(currentVideoUrl);
      if (deleteResult.ok) {
        showSuccessToast("Video removed from S3.");
      } else {
        showErrorToast(`Delete failed: ${deleteResult.error?.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Video removal error:", error);
      showErrorToast(`Delete Error: ${error.message || "Unexpected error."}`);
    } finally {
      form.setValue("videoUrl", "");
      setUploadedS3VideoUrl(null);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

      if (!allowedImageTypes.includes(file.type)) {
        showErrorToast('Please select a valid image file (JPEG, PNG, WEBP, JPG, GIF)');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;
        setThumbnailFile(file);
        setThumbnailPreviewUrl(previewUrl);
        form.setValue("thumbnail", previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    form.setValue("thumbnail", "");
  };

  const handleSubmit = async (data: LessonFormValues) => {
    if (isUploading) {
      showErrorToast("Please wait for the video upload to complete.");
      return;
    }

    if (!data.videoUrl && (data.duration || data.thumbnail)) {
      showErrorToast("Upload a video or clear the duration/thumbnail.");
      return;
    }

    setIsSaving(true);

    const formData = new FormData();

    formData.append("courseId", courseId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("order", String(data.order));
    formData.append("videoUrl", data.videoUrl || "");
    formData.append("duration", data.duration || "");

    if (thumbnailFile instanceof File) {
      formData.append("thumbnail", thumbnailFile);
    } else if (typeof data.thumbnail === "string" && data.thumbnail.startsWith("http")) {
      formData.append("thumbnailUrl", data.thumbnail);
    }

    try {
      const res = await MentorAPIMethods.addLesson(formData);

      if (!res.ok) throw new Error("Failed to add lesson");

      showSuccessToast("Lesson added successfully!");
      onLessonAdded();
      setOpen(false);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to add lesson.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
          <DialogDescription>Create a new lesson for this course.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lesson title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter lesson description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Lesson order within the course.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Video File</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading video...
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Upload a video directly to S3.</FormDescription>
              {uploadedS3VideoUrl && !isUploading && (
                <div className="flex items-center justify-between mt-2 p-2 border rounded-md bg-green-50/50">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700 truncate w-[200px]">
                      Uploaded: {uploadedS3VideoUrl}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveVideo}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              )}
              {form.formState.errors.videoUrl && (
                <FormMessage>{form.formState.errors.videoUrl.message}</FormMessage>
              )}
            </FormItem>
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10 min or 01:25" {...field} />
                  </FormControl>
                  <FormDescription>Estimated video duration.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Optional thumbnail URL"
                        {...field}
                        className="flex-1"
                        disabled={!!thumbnailFile}
                        value={thumbnailFile ? "" : field.value}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="thumbnail-upload"
                        onChange={handleThumbnailChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      >
                        <FileImage className="h-4 w-4" />
                      </Button>
                      {(thumbnailPreviewUrl || field.value) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={clearThumbnail}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Leave blank to use default or click icon to upload image.
                  </FormDescription>
                  {(thumbnailPreviewUrl || field.value) && (
                    <div className="mt-2 relative w-32 h-20 rounded-md overflow-hidden border">
                      <img
                        src={thumbnailPreviewUrl || field.value || "/placeholder.svg?height=80&width=120"}
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isUploading || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Lesson"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
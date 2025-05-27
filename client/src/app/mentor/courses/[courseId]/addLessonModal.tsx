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
import { FileImage, PlayCircle } from "lucide-react";
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

type LessonFormValues = z.infer<typeof lessonFormSchema>;

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

      // 3. Update form and state with the public S3 URL
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

  const handleSubmit = async (data: LessonFormValues) => {
    if (isUploading) {
      showErrorToast("Please wait for the video upload to complete.");
      return;
    }

    if (!data.videoUrl && (data.duration || data.thumbnail)) {
      showErrorToast("Upload a video or clear the duration/thumbnail.");
      return;
    }

    const newLessonData: Partial<ILessons> = {
      title: data.title,
      description: data.description,
      order: data.order,
      thumbnail: data.thumbnail || "/placeholder.svg?height=80&width=120",
      videoUrl: data.videoUrl || "",
      duration: data.duration || "",
    };

    const res = await MentorAPIMethods.addLesson(courseId, newLessonData);
    if (res.ok) {
      showSuccessToast("Lesson added successfully!");
      onLessonAdded();
      setOpen(false);
    } else {
      showErrorToast("Failed to add lesson.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
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
                    <div className="text-sm text-muted-foreground">Uploading video...</div>
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
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input placeholder="Optional thumbnail URL" {...field} />
                      <Button type="button" variant="outline" className="ml-2">
                        <FileImage className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Leave blank to use the default thumbnail.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                Save Lesson
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
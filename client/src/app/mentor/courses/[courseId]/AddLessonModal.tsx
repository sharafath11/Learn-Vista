
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/src/components/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/shared/components/ui/form";
import { Input } from "@/src/components/shared/components/ui/input";
import { Textarea } from "@/src/components/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileImage, PlayCircle, XCircle, Loader2 } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import Image from "next/image";
import { IMentorAddLessonModalProps } from "@/src/types/mentorProps";
import {
  handleS3VideoUpload,
  handleS3VideoDelete,
  handleLocalVideoDuration,
  handleThumbnailFileChange,
} from "@/src/utils/lessonFileHelpers";
import { formatDuration } from "@/src/utils/lessonFileHelpers"; 

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().positive("Order must be a positive number"),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
}).refine(
  (data) => !data.videoUrl || data.duration,
  {
    message: "Video upload requires duration to be calculated.",
    path: ["duration"],
  }
);

export type LessonFormValues = z.infer<typeof lessonFormSchema>;
export function AddLessonModal({
  open,
  setOpen,
  nextOrder,
  courseId,
  onLessonAdded,
}: IMentorAddLessonModalProps) {
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
    mode: "onBlur",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const videoUrlValue = form.watch("videoUrl");
  const thumbnailValue = form.watch("thumbnail");

  const thumbnailPreviewUrl = useMemo(() => {
    if (thumbnailFile) {
      return URL.createObjectURL(thumbnailFile);
    }
    if (thumbnailValue && thumbnailValue.startsWith("http")) {
      return thumbnailValue;
    }
    return null;
  }, [thumbnailFile, thumbnailValue]);


  const resetFormAndState = useCallback(() => {
    form.reset({
      title: "",
      description: "",
      order: nextOrder,
      thumbnail: "",
      videoUrl: "",
      duration: "",
    });
    setIsUploading(false);
    setThumbnailFile(null);
  }, [nextOrder, form]);

  useEffect(() => {
    if (open) {
      resetFormAndState();
    }
    return () => {
      if (thumbnailFile) {
          URL.revokeObjectURL(thumbnailFile.toString());
      }
    };
  }, [open, resetFormAndState, thumbnailFile]);

  const handleVideoUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    form.setValue("videoUrl", "");
    form.setValue("duration", "");
    setIsUploading(true);
    
    try {
      const durationInSeconds = await handleLocalVideoDuration(file);
      const formattedDuration = formatDuration(durationInSeconds);
      const publicVideoUrl = await handleS3VideoUpload(file);
      form.setValue("duration", formattedDuration, { shouldValidate: true });
      form.setValue("videoUrl", publicVideoUrl, { shouldValidate: true });
      showSuccessToast("Video uploaded and duration fetched!");

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Upload Failed: Unexpected error.";
      showErrorToast(errorMessage);
      form.setError("videoUrl", { message: errorMessage });
    } finally {
      setIsUploading(false);
      event.target.value = ''; 
    }
  };

  const handleRemoveVideo = async () => {
    const currentVideoUrl = form.getValues("videoUrl");
    if (!currentVideoUrl) return;

    try {
      await handleS3VideoDelete(currentVideoUrl);
      showSuccessToast("Video removed from S3.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete video.";
      showErrorToast(errorMessage);
      form.setError("videoUrl", { message: `Deletion failed: ${errorMessage}` });
    } finally {
      form.setValue("videoUrl", "");
      form.setValue("duration", "");
      form.clearErrors("videoUrl");
    }
  };

  const handleThumbnailFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleThumbnailFileChange(e);
    if (file) {
      setThumbnailFile(file);
      form.setValue("thumbnail", 'local-file-uploaded'); 
      form.clearErrors("thumbnail");
    } else {
      e.target.value = '';
    }
  };

  const clearThumbnail = () => {
    if (thumbnailFile) {
        URL.revokeObjectURL(thumbnailFile.toString());
    }
    setThumbnailFile(null);
    form.setValue("thumbnail", "");
  };

  const handleSubmit = async (data: LessonFormValues) => {
    if (isUploading) {
      showErrorToast("Please wait for the video upload to complete.");
      return;
    }

    if (!data.videoUrl && data.duration) {
      showErrorToast("Clear the duration field if no video is uploaded.");
      return;
    }    
    if (data.videoUrl && !data.duration) {
        showErrorToast("Cannot save: Video duration could not be fetched.");
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

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    } else if (data.thumbnail && data.thumbnail.startsWith("http")) {
      formData.append("thumbnailUrl", data.thumbnail);
    } else {
      formData.append("thumbnailUrl", ""); 
    }
    
    try {
        const res = await MentorAPIMethods.addLesson(formData);

        if (res.ok) {
          showSuccessToast("Lesson added successfully!");
          onLessonAdded();
          setOpen(false);
          if (thumbnailFile) URL.revokeObjectURL(thumbnailFile.toString());
        } else {
          showErrorToast(res.error?.message || "Failed to add lesson");
        }
    } catch (error) {
        showErrorToast("An error occurred during lesson creation.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
          <DialogDescription>
            Create a new lesson for this course.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
                    <Textarea
                      placeholder="Enter lesson description"
                      {...field}
                    />
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
                  <FormDescription>
                    Lesson order within the course.
                  </FormDescription>
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
                    onChange={handleVideoUploadChange}
                    className="w-full"
                    disabled={isUploading || isSaving}
                  />
                  {isUploading && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading
                      video...
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Upload a video.</FormDescription>
              {videoUrlValue && !isUploading && (
                <div className="flex items-center justify-between mt-2 p-2 border rounded-md bg-green-50/50">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700 truncate w-[200px]">
                      Uploaded: {videoUrlValue}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveVideo}
                    className="text-red-500 hover:bg-red-50"
                    disabled={isSaving}
                  >
                    Remove
                  </Button>
                </div>
              )}
              {form.formState.errors.videoUrl && (
                <FormMessage>
                  {form.formState.errors.videoUrl.message}
                </FormMessage>
              )}
            </FormItem>
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 01:25 or 00:10:30"
                      {...field}
                      readOnly={!!videoUrlValue}
                      disabled={isUploading || isSaving}
                    />
                  </FormControl>
                  <FormDescription>
                    {videoUrlValue
                      ? "Automatically fetched from video."
                      : "Estimated video duration (MM:SS or HH:MM:SS)."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* --- Thumbnail Field --- */}
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
                        disabled={!!thumbnailFile || isUploading || isSaving}
                        value={thumbnailFile ? "" : field.value}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="thumbnail-upload"
                        onChange={handleThumbnailFileInput}
                        disabled={isUploading || isSaving}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("thumbnail-upload")?.click()
                        }
                        disabled={isUploading || isSaving}
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
                          disabled={isUploading || isSaving}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Leave blank to use default or click icon to upload image.
                  </FormDescription>
                  {(thumbnailPreviewUrl) && (
                    <div className="mt-2 relative w-32 h-20 rounded-md overflow-hidden border">
                        <Image
                          src={thumbnailPreviewUrl}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover"
                          fill
                          sizes="128px"
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
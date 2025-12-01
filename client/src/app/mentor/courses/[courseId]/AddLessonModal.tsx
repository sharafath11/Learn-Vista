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
  formatDuration,
} from "@/src/utils/lessonFileHelpers";

const lessonFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    order: z.coerce.number().int().positive("Order must be a positive number"),
    thumbnail: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
  });

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
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // FIX: proper preview URL state
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  const videoUrlValue = form.watch("videoUrl");
  const thumbnailValue = form.watch("thumbnail");

  // FIX: create + cleanup thumbnail preview URL properly
  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setThumbnailPreviewUrl(null);
    }
  }, [thumbnailFile]);

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
    setThumbnailPreviewUrl(null);
  }, [nextOrder, form]);

  useEffect(() => {
    if (open) {
      resetFormAndState();
    }
  }, [open, resetFormAndState]);

  const handleVideoUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // FIX: don’t clear existing video until upload succeeds
    const previousVideoUrl = form.getValues("videoUrl");
    const previousDuration = form.getValues("duration");

    setIsUploading(true);

    try {
      const durationInSeconds = await handleLocalVideoDuration(file);
      const formattedDuration = formatDuration(durationInSeconds);

      const publicVideoUrl = await handleS3VideoUpload(file);

      form.setValue("duration", formattedDuration, { shouldValidate: true });
      form.setValue("videoUrl", publicVideoUrl, { shouldValidate: true });

      showSuccessToast("Video uploaded and duration fetched!");
    } catch (error: unknown) {
      // FIX: revert back to previous values
      form.setValue("videoUrl", previousVideoUrl);
      form.setValue("duration", previousDuration);

      const msg = error instanceof Error ? error.message : "Upload failed.";
      showErrorToast(msg);
      form.setError("videoUrl", { message: msg });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveVideo = async () => {
    const currentVideoUrl = form.getValues("videoUrl");
    if (!currentVideoUrl) return;

    try {
      await handleS3VideoDelete(currentVideoUrl);
      form.setValue("videoUrl", "");
      form.setValue("duration", "");
      showSuccessToast("Video removed from S3.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete video.";
      showErrorToast(msg);
    }
  };

  const handleThumbnailFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleThumbnailFileChange(e);
    if (file) {
      setThumbnailFile(file);
      form.setValue("thumbnail", "");
    }
    e.target.value = "";
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    form.setValue("thumbnail", "");
  };

  const handleSubmit = async (data: LessonFormValues) => {
    if (isUploading) {
      showErrorToast("Please wait for video upload.");
      return;
    }
    if (data.videoUrl && !data.duration) {
      showErrorToast("Video duration missing.");
      return;
    }
    if (!data.videoUrl && data.duration) {
      showErrorToast("Clear duration if no video uploaded.");
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
    } else if (data.thumbnail?.startsWith("http")) {
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
      } else {
        showErrorToast(res.error?.message || "Failed to add lesson");
      }
    } catch {
      showErrorToast("An error occurred.");
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
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Upload */}
            <FormItem>
              <FormLabel>Video File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUploadChange}
                  disabled={isUploading || isSaving}
                />
              </FormControl>

              {isUploading && (
                <div className="text-sm flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Uploading...
                </div>
              )}

              {videoUrlValue && !isUploading && (
                <div className="flex justify-between mt-2 p-2 border rounded bg-green-50">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-green-600" />
                    <span className="truncate w-[200px]">{videoUrlValue}</span>
                  </div>
                  <Button type="button" size="sm" variant="ghost" onClick={handleRemoveVideo}>
                    Remove
                  </Button>
                </div>
              )}

              <FormMessage />
            </FormItem>

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!!videoUrlValue} disabled={isUploading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail */}
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        {...field}
                        disabled={!!thumbnailFile}
                        value={thumbnailFile ? "" : field.value}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailFileInput}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      >
                        <FileImage />
                      </Button>

                      {(thumbnailFile || field.value) && (
                        <Button type="button" variant="ghost" onClick={clearThumbnail}>
                          <XCircle />
                        </Button>
                      )}
                    </div>
                  </FormControl>

                  {thumbnailPreviewUrl && (
                    <div className="mt-2 relative w-32 h-20 overflow-hidden border rounded">
                      <Image src={thumbnailPreviewUrl} alt="preview" fill className="object-cover" />
                    </div>
                  )}

                  {field.value && field.value.startsWith("http") && !thumbnailPreviewUrl && (
                    <div className="mt-2 relative w-32 h-20 overflow-hidden border rounded">
                      <Image src={field.value} alt="url-thumbnail" fill className="object-cover" />
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isUploading || isSaving}>
                {isSaving ? <Loader2 className="animate-spin mr-2" /> : null}
                Save Lesson
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

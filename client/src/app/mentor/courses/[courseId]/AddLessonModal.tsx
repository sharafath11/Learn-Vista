"use client";

import { useEffect, useState, useCallback } from "react";
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


// ------------------ Schema ------------------
const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().positive("Order must be a positive number"),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
});

export type LessonFormValues = z.infer<typeof lessonFormSchema>;


// ------------------ Utils ------------------
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
    : `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const getLocalVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(url);
      resolve(duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video metadata."));
    };
  });


// ------------------ Component ------------------

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
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  const videoUrlValue = form.watch("videoUrl");


  // ------------- Reset on open -------------
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
      setThumbnailFile(null);
      setThumbnailPreviewUrl(null);
      setIsUploading(false);
    }
  }, [open, nextOrder]);


  // ------------- Video Upload -------------
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    form.setValue("duration", "");
    form.setValue("videoUrl", "");

    try {
      // STEP 1: Get duration LOCALLY (stable & AWS-proof)
      const durationSeconds = await getLocalVideoDuration(file);
      const formattedDuration = formatDuration(durationSeconds);

      // STEP 2: Request signed URL from backend
      const res = await MentorAPIMethods.getS3DirectUploadUrl(file.name, file.type);

      if (!res.ok) throw new Error(res.error?.message || "Failed to get signed upload URL.");

      const { signedUploadUrl, publicVideoUrl } = res.data;

      // STEP 3: Upload to S3
      const uploadRes = await fetch(signedUploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload video to S3.");

      // STEP 4: Save metadata to form
      form.setValue("duration", formattedDuration, { shouldValidate: true });
      form.setValue("videoUrl", publicVideoUrl, { shouldValidate: true });

      showSuccessToast("Video uploaded successfully!");
    } catch (err: any) {
      showErrorToast(err.message || "Video upload failed.");
      form.setValue("duration", "");
      form.setValue("videoUrl", "");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };


  // ------------- Remove Video -------------
  const handleRemoveVideo = async () => {
    const url = form.getValues("videoUrl");
    if (!url) return;

    const res = await MentorAPIMethods.deleteS3file(url);

    if (!res.ok) {
      showErrorToast("Failed to delete video from S3");
      return;
    }

    form.setValue("videoUrl", "");
    form.setValue("duration", "");
    showSuccessToast("Video removed.");
  };


  // ------------- Thumbnail -------------
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!allowed.includes(file.type)) {
      showErrorToast("Invalid image format.");
      return;
    }

    const url = URL.createObjectURL(file);
    setThumbnailFile(file);
    setThumbnailPreviewUrl(url);
    form.setValue("thumbnail", url);
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailPreviewUrl(null);
    form.setValue("thumbnail", "");
  };


  // ------------- Submit -------------
  const handleSubmit = async (data: LessonFormValues) => {
    if (isUploading) {
      showErrorToast("Please wait for video upload.");
      return;
    }

    if (!data.videoUrl) {
      showErrorToast("Video is required.");
      return;
    }

    setIsSaving(true);

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("order", String(data.order));
    formData.append("videoUrl", data.videoUrl);
    formData.append("duration", data.duration || "");

    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    const res = await MentorAPIMethods.addLesson(formData);

    if (res.ok) {
      showSuccessToast("Lesson added!");
      onLessonAdded();
      setOpen(false);
    } else {
      showErrorToast(res.error?.message || "Failed to add lesson");
    }

    setIsSaving(false);
  };


  // ------------------ UI ------------------
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

            {/* Video */}
            <FormItem>
              <FormLabel>Video File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={isUploading || isSaving}
                />
              </FormControl>

              {isUploading && (
                <div className="text-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading video...
                </div>
              )}

              {videoUrlValue && !isUploading && (
                <div className="flex items-center justify-between mt-2 p-2 border rounded bg-green-50">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-green-600" />
                    <span className="truncate w-[200px]">{videoUrlValue}</span>
                  </div>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={handleRemoveVideo}
                    className="text-red-500"
                    disabled={isSaving}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </FormItem>

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
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
                        placeholder="Thumbnail URL (optional)"
                        disabled={!!thumbnailFile}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id="thumbnail-upload"
                        className="hidden"
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
                          className="text-red-500"
                          onClick={clearThumbnail}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormControl>

                  {(thumbnailPreviewUrl || field.value) && (
                    <div className="mt-2 relative w-32 h-20 border rounded overflow-hidden">
                      <Image
                        src={thumbnailPreviewUrl || field.value ||""}
                        alt="Thumbnail Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <DialogFooter>
              <Button type="submit" disabled={isUploading || isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Lesson
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

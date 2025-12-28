"use client";

import { useEffect, useState } from "react";
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
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import Image from "next/image";
import { IMentorEditLessonModalProps } from "@/src/types/mentorProps";

// ------------------ Schema ------------------
const lessonFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().positive("Order must be a positive number"),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

// ------------------ Utils ------------------
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const pad = (num: number) => num.toString().padStart(2, "0");

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
export function EditLessonModal({
  open,
  setOpen,
  selectedLesson,
  onLessonUpdated,
}: IMentorEditLessonModalProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
      thumbnail: "",
      videoUrl: "",
      duration: "",
    },
  });

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedS3VideoUrl, setUploadedS3VideoUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const videoUrlValue = form.watch("videoUrl");

  // Sync Form with Selected Lesson
  useEffect(() => {
    if (selectedLesson && open) {
      form.reset({
        id: selectedLesson.id,
        title: selectedLesson.title,
        description: selectedLesson.description || "",
        order: selectedLesson.order,
        thumbnail: selectedLesson.thumbnail || "",
        videoUrl: selectedLesson.videoUrl || "",
        duration: selectedLesson.duration || "",
      });
      setUploadedS3VideoUrl(selectedLesson.videoUrl || null);
      setThumbnailPreviewUrl(selectedLesson.thumbnail || null);
    }
  }, [selectedLesson, open, form]);

  // Video Upload Logic
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);

    try {
      // 1. Get Duration Locally
      const durationSeconds = await getLocalVideoDuration(file);
      const formattedDuration = formatDuration(durationSeconds);

      // 2. Get Signed URL from Backend
      const res = await MentorAPIMethods.getS3DirectUploadUrl(file.name, file.type);
      if (!res.ok) throw new Error(res.error?.message || "Failed to get S3 URL.");

      const { signedUploadUrl, publicVideoUrl } = res.data;

      // 3. Upload to S3
      const uploadResponse = await fetch(signedUploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) throw new Error("S3 Upload Failed");

      // 4. Update Form State
      form.setValue("duration", formattedDuration, { shouldValidate: true });
      form.setValue("videoUrl", publicVideoUrl, { shouldValidate: true });
      setUploadedS3VideoUrl(publicVideoUrl);
      
      showSuccessToast("Video uploaded successfully!");
    } catch (error: any) {
      showErrorToast(error.message || "Upload failed");
    } finally {
      setIsUploadingVideo(false);
      event.target.value = ""; // Reset input
    }
  };

  const handleRemoveVideo = async () => {
    const currentVideoUrl = form.getValues("videoUrl");
    if (!currentVideoUrl) return;

    const res = await MentorAPIMethods.deleteS3file(currentVideoUrl);
    if (res.ok) {
      form.setValue("videoUrl", "");
      form.setValue("duration", "");
      setUploadedS3VideoUrl(null);
      showSuccessToast("Video removed.");
    } else {
      showErrorToast("Failed to delete video.");
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailFile(file);
      setThumbnailPreviewUrl(reader.result as string);
      form.setValue("thumbnail", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    form.setValue("thumbnail", "");
  };

  const handleSubmit = async (data: LessonFormValues) => {
    if (isUploadingVideo) {
      showErrorToast("Please wait for video upload to finish.");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("order", String(data.order));
    formData.append("videoUrl", data.videoUrl || "");
    formData.append("duration", data.duration || "");

    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    try {
      const res = await MentorAPIMethods.updateLesson(selectedLesson!.id, formData);
      if (res.ok) {
        showSuccessToast("Lesson updated!");
        onLessonUpdated();
        setOpen(false);
      } else {
        throw new Error();
      }
    } catch {
      showErrorToast("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>Update lesson details and media.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pr-4">
            
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

            <FormItem>
              <FormLabel>Video File</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={isUploadingVideo || isSaving}
                  />
                  {isUploadingVideo && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </div>
                  )}
                </div>
              </FormControl>
              {uploadedS3VideoUrl && !isUploadingVideo && (
                <div className="flex items-center justify-between mt-2 p-2 border rounded bg-green-50">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-green-600" />
                    <span className="text-xs truncate w-[200px]">{uploadedS3VideoUrl}</span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveVideo} className="text-red-500">
                    Remove
                  </Button>
                </div>
              )}
            </FormItem>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl><Input {...field} readOnly /></FormControl>
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
                      <Input {...field} placeholder="URL" className="flex-1" disabled={!!thumbnailFile} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="thumb-edit"
                        onChange={handleThumbnailChange}
                      />
                      <Button type="button" variant="outline" onClick={() => document.getElementById("thumb-edit")?.click()}>
                        <FileImage className="h-4 w-4" />
                      </Button>
                      {(thumbnailPreviewUrl || field.value) && (
                        <Button type="button" variant="ghost" onClick={clearThumbnail} className="text-red-500">
                          <XCircle className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  {(thumbnailPreviewUrl || field.value) && (
                    <div className="mt-2 relative w-32 h-20 rounded border overflow-hidden">
                      <Image src={thumbnailPreviewUrl || field.value || ""} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isUploadingVideo || isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
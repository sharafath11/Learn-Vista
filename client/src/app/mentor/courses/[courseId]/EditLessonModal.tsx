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
import { MentorAPIMethods } from "@/src/services/APImethods";
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";

interface ILessons {
  id: string;
  title: string;
  description?: string;
  order?: number;
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
}

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

interface EditLessonModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLesson: ILessons | null;
  onLessonUpdated: () => void;
  courseId: string; // Keep if still needed for API calls
}

// Helper function to format duration (from AddLessonModal)
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  }
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};


export function EditLessonModal({
  open,
  setOpen,
  selectedLesson,
  onLessonUpdated,
  courseId,
}: EditLessonModalProps) {
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

  const videoUrlValue = form.watch("videoUrl"); // Watch videoUrl for conditional rendering/disabling

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
      setThumbnailFile(null);
    } else if (!open) {
      // Reset state when modal closes
      form.reset();
      setUploadedS3VideoUrl(null);
      setThumbnailFile(null);
      setThumbnailPreviewUrl(null);
      setIsUploadingVideo(false); // Ensure upload state is reset
    }
  }, [selectedLesson, open, form]);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setUploadedS3VideoUrl(null);
    form.setValue("duration", ""); // Clear duration when new video is selected

    try {
      const res = await MentorAPIMethods.getS3DirectUploadUrl(file.name, file.type);
      if (!res.ok || !res.data?.signedUploadUrl || !res.data?.publicVideoUrl) {
        throw new Error(res.error?.message || "Failed to get S3 URLs from backend.");
      }

      const { signedUploadUrl, publicVideoUrl, signedViewUrl } = res.data; // Get signedViewUrl for duration check

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

      // --- Video Duration Calculation Logic (copied from AddLessonModal) ---
      const tempVideo = document.createElement("video");
      tempVideo.src = signedViewUrl;
      tempVideo.preload = "metadata";
      tempVideo.style.display = "none"; // Hide the video element

      const handleMetadataLoaded = () => {
        console.log("Video metadata loaded successfully. Duration:", tempVideo.duration);
        const durationInSeconds = tempVideo.duration;
        const formattedDuration = formatDuration(durationInSeconds);
        form.setValue("duration", formattedDuration, { shouldValidate: true });
        form.setValue("videoUrl", publicVideoUrl, { shouldValidate: true });
        setUploadedS3VideoUrl(publicVideoUrl);
        showSuccessToast("Video uploaded and duration fetched!");
        tempVideo.removeEventListener('loadedmetadata', handleMetadataLoaded);
        tempVideo.removeEventListener('error', handleVideoError);
        if (document.body.contains(tempVideo)) {
          document.body.removeChild(tempVideo);
        }
      };

      const handleVideoError = (e: Event) => {
        console.error("tempVideo error event:", e);
        console.error("tempVideo networkState:", tempVideo.networkState);
        console.error("tempVideo error object:", (tempVideo as HTMLVideoElement).error);
        showErrorToast("Could not retrieve video duration. Video might be corrupted or unsupported.");
        form.setValue("videoUrl", publicVideoUrl, { shouldValidate: true });
        setUploadedS3VideoUrl(publicVideoUrl);
        tempVideo.removeEventListener('loadedmetadata', handleMetadataLoaded);
        tempVideo.removeEventListener('error', handleVideoError);
        if (document.body.contains(tempVideo)) {
          document.body.removeChild(tempVideo);
        }
      };

      tempVideo.addEventListener('loadedmetadata', handleMetadataLoaded);
      tempVideo.addEventListener('error', handleVideoError);

      document.body.appendChild(tempVideo);
      // --- End Video Duration Calculation Logic ---

    } catch (error: any) {
      console.error("Video upload error:", error);
      showErrorToast(`Upload Failed: ${error.message || "Unexpected error."}`);
      form.setValue("videoUrl", "");
      form.setValue("duration", ""); // Clear duration on upload failure
      setUploadedS3VideoUrl(null);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleRemoveVideo = async () => {
    const currentVideoUrl = form.getValues("videoUrl");
    if (!currentVideoUrl) return;

    try {
      // Optional: If you want to delete from S3 only if it was a newly uploaded video
      // and not the original one associated with selectedLesson.
      // For simplicity, this example deletes any currently set videoUrl.
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
      form.setValue("duration", ""); // Also clear duration
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
    if (isUploadingVideo) {
      showErrorToast("Upload in Progress: Please wait before saving.");
      return;
    }

    if (!selectedLesson?.id) {
      showErrorToast("Lesson ID missing.");
      return;
    }

    // Add validation similar to AddLessonModal for video/duration consistency
    if (!data.videoUrl && (data.duration || data.thumbnail)) {
        showErrorToast("Upload a video or clear the duration/thumbnail if no video is intended.");
        return;
    }


    setIsSaving(true);

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("order", data.order.toString());
    formData.append("videoUrl", data.videoUrl || "");
    formData.append("duration", data.duration || "");

    if (thumbnailFile instanceof File) {
      formData.append("thumbnail", thumbnailFile);
    } else if (!thumbnailPreviewUrl && selectedLesson.thumbnail && !data.thumbnail) {
        // This condition correctly handles clearing the thumbnail if it was present
        formData.append("clearThumbnail", "true");
    } else if (data.thumbnail && data.thumbnail.startsWith("http")) {
        formData.append("thumbnailUrl", data.thumbnail);
    }

    try {
      const res = await MentorAPIMethods.updateLesson(selectedLesson.id, formData);

      if (!res.ok) throw new Error("Failed to update lesson");

      showSuccessToast("Lesson Updated!");
      onLessonUpdated();
      setOpen(false);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to update lesson.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>Edit the details of this lesson.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pr-4">
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
                    disabled={isUploadingVideo || isSaving}
                  />
                  {isUploadingVideo && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading video...
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Upload a video </FormDescription>
              {uploadedS3VideoUrl && !isUploadingVideo && (
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
                    disabled={isSaving}
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
                    <Input
                      placeholder="e.g., 01:25 or 00:10:30"
                      {...field}
                      readOnly={!!videoUrlValue} // Make read-only if videoUrl is present
                      disabled={isUploadingVideo || isSaving}
                    />
                  </FormControl>
                  <FormDescription>
                    {videoUrlValue ? "Automatically fetched from video." : "Estimated video duration (MM:SS or HH:MM:SS)."}
                  </FormDescription>
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
                        disabled={!!thumbnailFile || isUploadingVideo || isSaving}
                        value={thumbnailFile ? "" : (field.value || "")}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="thumbnail-edit-upload" // Changed ID to avoid conflict with AddModal
                        onChange={handleThumbnailChange}
                        disabled={isUploadingVideo || isSaving}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("thumbnail-edit-upload")?.click()}
                        disabled={isUploadingVideo || isSaving}
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
                          disabled={isUploadingVideo || isSaving}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a new image or clear the existing one.
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
              <Button type="submit" disabled={isUploadingVideo || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
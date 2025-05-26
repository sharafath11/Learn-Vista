"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FileImage, Loader2, PlayCircle } from "lucide-react"
import { ILessons } from "@/src/types/lessons"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import axios from "axios"

const lessonFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().positive("Order must be a positive number"),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
})

type LessonFormValues = z.infer<typeof lessonFormSchema>

interface EditLessonModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedLesson: ILessons | null
  onLessonUpdated: () => void
  courseId: string
}

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
  })

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedS3VideoUrl, setUploadedS3VideoUrl] = useState<string | null>(null)

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
      })
      setUploadedS3VideoUrl(selectedLesson.videoUrl || null)
    } else if (!open) {
      form.reset()
      setUploadedS3VideoUrl(null)
    }
  }, [selectedLesson, open, form])

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadedS3VideoUrl(null)

    try {
      const { data } = await axios.post("/api/mentor/lessons/s3-upload", {
        fileName: file.name,
        fileType: file.type,
      })

      const { uploadURL, videoUrl } = data

      await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total!) * 100
          setUploadProgress(progress)
        },
      })

      form.setValue("videoUrl", videoUrl)
      setUploadedS3VideoUrl(videoUrl)
      showSuccessToast("Video uploaded to S3!")
    } catch (error: any) {
      console.error("S3 Upload Failed:", error)
      showErrorToast("Video upload failed. Please try again.")
      form.setValue("videoUrl", "")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveVideo = async () => {
    form.setValue("videoUrl", "")
    setUploadedS3VideoUrl(null)
    showSuccessToast("Video removed from form.")
  }

  const handleSubmit = async (data: LessonFormValues) => {
    if (isUploading) {
      showErrorToast("Upload in Progress: Please wait before saving.")
      return
    }

    if (!selectedLesson?.id) {
      showErrorToast("Lesson ID missing.")
      return
    }

    const updatedLessonData: Partial<ILessons> = {
      title: data.title,
      description: data.description,
      order: data.order,
      thumbnail: data.thumbnail || "/placeholder.svg?height=80&width=120",
      videoUrl: data.videoUrl || "",
      duration: data.duration || "",
    }

    const res = await MentorAPIMethods.updateLesson(selectedLesson.id, updatedLessonData)
    if (res.ok) {
      showSuccessToast("Lesson Updated!")
      onLessonUpdated()
      setOpen(false)
    } else {
      showErrorToast("Failed to update lesson.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>Edit the details of this lesson.</DialogDescription>
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
                  <FormDescription>The order in which this lesson appears in the course</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Video File</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    id="video-upload-input"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading: {uploadProgress.toFixed(0)}%</span>
                      {uploadProgress < 100 && <span className="ml-2">Please wait...</span>}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Upload your video file to AWS S3</FormDescription>
              {uploadedS3VideoUrl && !isUploading && (
                <div className="flex items-center justify-between mt-2 p-2 border rounded-md bg-green-50/50">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Video Uploaded (URL: {uploadedS3VideoUrl.substring(0, 40)}...)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveVideo}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
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
                    <Input placeholder="e.g., 10 min, 01:25" {...field} />
                  </FormControl>
                  <FormDescription>Estimated duration of the lesson</FormDescription>
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
                      <Input placeholder="Enter thumbnail URL (optional)" {...field} />
                      <Button type="button" variant="outline" className="ml-2">
                        <FileImage className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Leave blank to use a default thumbnail</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

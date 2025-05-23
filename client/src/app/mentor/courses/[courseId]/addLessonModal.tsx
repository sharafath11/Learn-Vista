"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, // Import Dialog here
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
import { FileImage } from "lucide-react"
import { ILessons } from "@/src/types/lessons"

// Form schema for adding/editing a lesson
const lessonFormSchema = z.object({
  id: z.string().optional(), // For editing existing lessons
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().positive("Order must be a positive number"),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
})

type LessonFormValues = z.infer<typeof lessonFormSchema>

interface LessonFormModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedLesson: ILessons | null
  onSave: (data: LessonFormValues) => void
  nextOrder: number
}

export function LessonFormModal({ open, setOpen, selectedLesson, onSave, nextOrder }: LessonFormModalProps) {
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
  })

  useEffect(() => {
    if (selectedLesson) {
      form.reset({
        id: selectedLesson.id,
        title: selectedLesson.title,
        description: selectedLesson.description || "",
        order: selectedLesson.order || nextOrder,
        thumbnail: selectedLesson.thumbnail || "",
        videoUrl: (selectedLesson as any).videoUrl || "",
        duration: (selectedLesson as any).duration || "",
      })
    } else {
      form.reset({
        title: "",
        description: "",
        order: nextOrder,
        thumbnail: "",
        videoUrl: "",
        duration: "",
      })
    }
  }, [selectedLesson, nextOrder, form])

  const handleSubmit = (data: LessonFormValues) => {
    onSave(data)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{selectedLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
          <DialogDescription>
            {selectedLesson
              ? "Edit the details of this lesson. Click save when you're done."
              : "Create a new lesson for this course. Click save when you're done."}
          </DialogDescription>
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
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10 min" {...field} />
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
              <Button type="submit">{selectedLesson ? "Save Changes" : "Save Lesson"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
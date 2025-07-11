"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { showErrorToast, showSuccessToast, showInfoToast } from "@/src/utils/Toast" 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, FileImage, Pencil, PlusCircle } from "lucide-react"
import Link from "next/link"

// Form schema for adding a lesson
const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().positive("Order must be a positive number"),
  thumbnail: z.string().optional(),
})

type LessonFormValues = z.infer<typeof lessonFormSchema>

export default function CourseLessonsPage({ params }: { params: { courseId: string } }) {
  // const { toast } = useToast() // This line is removed as per your request
  const [open, setOpen] = useState(false)

  // In a real app, this would come from a database based on the courseId
  const course = {
    id: params.courseId,
    title:
      params.courseId === "3"
        ? "CSS Mastery"
        : params.courseId === "2"
          ? "Advanced JavaScript"
          : "Introduction to React",
    description: "Master CSS layouts, animations, and responsive design",
  }

  // Sample lessons data - in a real app, this would come from a database
  const [lessons, setLessons] = useState<
    Array<{
      id: string
      title: string
      description: string
      order: number
      thumbnail: string
    }>
  >(
    params.courseId === "3"
      ? []
      : [
          {
            id: "1",
            title: "Getting Started",
            description: "Introduction to the course and setup instructions",
            order: 1,
            thumbnail: "/placeholder.svg?height=80&width=120",
          },
          {
            id: "2",
            title: "Core Concepts",
            description: "Understanding the fundamental concepts",
            order: 2,
            thumbnail: "/placeholder.svg?height=80&width=120",
          },
        ],
  )

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      order: lessons.length + 1,
      thumbnail: "",
    },
  })

  function onSubmit(data: LessonFormValues) {
    // In a real app, this would be an API call to save the lesson
    const newLesson = {
      id: (lessons.length + 1).toString(),
      ...data,
      thumbnail: data.thumbnail || "/placeholder.svg?height=80&width=120",
    }

    setLessons([...lessons, newLesson])
    setOpen(false)
    form.reset()

    // Using showSuccessToast directly instead of toast()
    showSuccessToast(
      "Your lesson has been added successfully.",)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>

        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-32 h-20 overflow-hidden">
                    <img
                      src={lesson.thumbnail || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Link href={`/dashboard/courses/${course.id}/lessons/${lesson.id}/questions`}>
                          <Button variant="outline" size="sm">
                            Manage Questions
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Lesson</DialogTitle>
                  <DialogDescription>
                    Create a new lesson for this course. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Button type="submit">Save Lesson</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first lesson</p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Lesson</DialogTitle>
                  <DialogDescription>
                    Create a new lesson for this course. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Button type="submit">Save Lesson</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminContext } from "@/src/context/adminContext"

// Define the course schema for validation
const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  mentorId: z.string().min(1, { message: "Please select a mentor" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  language: z.string().min(1, { message: "Please select a language" }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.string().optional(),
})

type CourseFormValues = z.infer<typeof courseSchema>




const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean"]

interface CourseFormProps {
  courseId?: string
}

export function CourseForm({ courseId }: CourseFormProps) {
    const router = useRouter()
    const { mentors, cat } = useAdminContext()
    const categories=cat
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  // Initialize form with react-hook-form
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      mentorId: "",
      categoryId: "",
      price: 0,
      language: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
    },
  })

  // Fetch course data for editing
  useEffect(() => {
    if (courseId) {
      setIsLoading(true)
      // Mock API call to fetch course data
      setTimeout(() => {
        // Mock course data
        const courseData = {
          id: courseId,
          title: "Advanced React Development",
          description: "Learn advanced React patterns and techniques to build scalable applications.",
          mentorId: "1",
          categoryId: "1",
          price: 99.99,
          language: "English",
          tags: ["React", "JavaScript", "Web Development"],
          startDate: new Date("2025-06-01"),
          endDate: new Date("2025-08-01"),
          startTime: "18:00",
          thumbnailUrl: "/placeholder.svg?height=300&width=500",
        }

        // Set form values
        form.reset({
          title: courseData.title,
          description: courseData.description,
          mentorId: courseData.mentorId,
          categoryId: courseData.categoryId,
          price: courseData.price,
          language: courseData.language,
          startDate: courseData.startDate,
          endDate: courseData.endDate,
          startTime: courseData.startTime,
        })

        // Set tags
        setTags(courseData.tags)

        // Set thumbnail preview
        setThumbnailPreview(courseData.thumbnailUrl)

        setIsLoading(false)
      }, 500)
    }
  }, [courseId, form])

  // Handle form submission
  const onSubmit = (data: CourseFormValues) => {
    setIsLoading(true)

    // Prepare the complete form data including tags and thumbnail
    const formData = {
      ...data,
      tags,
      thumbnail,
    }

    console.log("Form submitted:", formData)

    // Mock API call to save course data
    setTimeout(() => {
      setIsLoading(false)
      router.push("/courses")
    }, 1000)
  }

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Handle thumbnail upload
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"]

      if (validTypes.includes(file.type)) {
        setThumbnail(file)
        setThumbnailPreview(URL.createObjectURL(file))
      } else {
        alert("Please upload a valid image file (JPEG, PNG, WEBP, JPG, GIF)")
      }
    }
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview(null)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Basic Info Section */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input id="title" {...form.register("title")} placeholder="Enter course title" />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Enter course description"
                    rows={5}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentor">
                      Mentor <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => form.setValue("mentorId", value)} value={form.watch("mentorId")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mentor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mentors.map((mentor) => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.username} ({mentor.expertise.join(", ")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.mentorId && (
                      <p className="text-sm text-red-500">{form.formState.errors.mentorId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => form.setValue("categoryId", value)}
                      value={form.watch("categoryId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.categoryId && (
                      <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Section */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="thumbnail">Course Thumbnail</Label>
                  <div className="flex flex-col items-center space-y-4">
                    {thumbnailPreview ? (
                      <div className="relative">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          className="w-full max-w-md h-auto rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeThumbnail}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-12 text-center">
                        <p className="text-sm text-gray-500">Drag and drop an image, or click to select</p>
                        <p className="text-xs text-gray-400 mt-1">Supports: JPEG, PNG, WEBP, JPG, GIF</p>
                      </div>
                    )}
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg,image/gif"
                      onChange={handleThumbnailChange}
                      className={thumbnailPreview ? "hidden" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Section */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input id="price" type="number" step="0.01" min="0" className="pl-7" {...form.register("price")} />
                  </div>
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select onValueChange={(value) => form.setValue("language", value)} value={form.watch("language")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type a tag and press Enter"
                  />
                  <p className="text-xs text-gray-500">Press Enter to add a tag</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Section */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("startDate") && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("startDate") ? format(form.watch("startDate"), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("startDate")}
                          onSelect={(date) => form.setValue("startDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("endDate") && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("endDate") ? format(form.watch("endDate"), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("endDate")}
                          onSelect={(date) => form.setValue("endDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input id="startTime" type="time" className="pl-9" {...form.register("startTime")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/courses")} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Course"}
          </Button>
        </div>
      </div>
    </form>
  )
}

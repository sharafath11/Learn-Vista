"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs"
import { courseSchema, type CourseFormValues } from "./schema"
import { BasicInfoSection } from "./basic-info-section"
import { MediaSection } from "./media-section"
import { DetailsSection } from "./details-section"
import { ScheduleSection } from "./schedule-section"
import { FormActions } from "./form-actions"
import { showInfoToast } from "@/src/utils/Toast"

interface CourseFormProps {
  courseId?: string
}

export function CourseForm({ courseId }: CourseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [, setThumbnail] = useState<File | null>(null)
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

  useEffect(() => {
    if (courseId) {
      setIsLoading(true)
      setTimeout(() => {
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

        setTags(courseData.tags)

        setThumbnailPreview(courseData.thumbnailUrl)

        setIsLoading(false)
      }, 500)
    }
  }, [courseId, form])

  const onSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/courses")
    }, 1000)
  }

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
        showInfoToast("Please upload a valid image file (JPEG, PNG, WEBP, JPG, GIF)")
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
            <BasicInfoSection form={form} />
          </TabsContent>

          {/* Media Section */}
          <TabsContent value="media">
            <MediaSection
              thumbnailPreview={thumbnailPreview}
              handleThumbnailChange={handleThumbnailChange}
              removeThumbnail={removeThumbnail}
            />
          </TabsContent>

          {/* Details Section */}
          <TabsContent value="details">
            <DetailsSection
              form={form}
              tags={tags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleTagKeyDown={handleTagKeyDown}
              removeTag={removeTag}
            />
          </TabsContent>

          {/* Schedule Section */}
          <TabsContent value="schedule">
            <ScheduleSection form={form} />
          </TabsContent>
        </Tabs>

        <FormActions isLoading={isLoading} onCancel={() => router.push("/courses")} />
      </div>
    </form>
  )
}


"use client"

import CourseAdditionalDetails from "@/src/components/admin/course/CourseAdditionalDetails"
import CourseBasicInfo from "@/src/components/admin/course/CourseBasicInfo"
import CourseSchedule from "@/src/components/admin/course/CourseSchedule"
import CourseThumbnail from "@/src/components/admin/course/CourseThumbnail"
import { showInfoToast } from "@/src/utils/Toast"
import { useState } from "react"


interface ICourseFormData {
  title: string
  description: string
  mentorId: string
  categoryId: string
  category?: string
  price: string
  language: string
  tags: string[]
  currentTag: string
  startDate: string
  endDate: string
  startTime: string
  thumbnail?: File | null
  thumbnailPreview: string | null
}

interface CourseFormProps {
  initialData?: Partial<ICourseFormData>
  mentors: Array<{ id: string; username: string; expertise: string[] }>
  categories: Array<{ id: string; title: string }>
  languages: string[]
  onSubmit: (data: ICourseFormData) => Promise<void>
}

const initialFormData: ICourseFormData = {
  title: "",
  description: "",
  mentorId: "",
  categoryId: "",
  category: "",
  price: "",
  language: "",
  tags: [],
  currentTag: "",
  startDate: "",
  endDate: "",
  startTime: "",
  thumbnail: null,
  thumbnailPreview: null,
}

export default function CourseForm({
  initialData = {},
  mentors,
  categories,
  languages,
  onSubmit,
}: CourseFormProps) {
  const [formData, setFormData] = useState<ICourseFormData>({
    ...initialFormData,
    ...initialData,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "mentorName") {
      setFormData((prev) => ({ ...prev, mentorId: value }))
      return
    }

    if (name === "category") {
      console.log("rfgre",categories,value)
      const selectedCategory = categories.find((c) => c.id === value)
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        category: selectedCategory?.title || "",
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    const newTag = formData.currentTag.trim()
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
        currentTag: "",
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (file) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
  
      if (!allowedImageTypes.includes(file.type)) {
        showInfoToast('Please select a valid image file (JPEG, PNG, WEBP, JPG, GIF)');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  

  const clearThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: null,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
     
    
    
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8">
      <CourseBasicInfo
        formData={formData}
        handleChange={handleChange}
        mentors={mentors}
        categories={categories}
      />

      <CourseThumbnail
        thumbnailPreview={formData.thumbnailPreview}
        handleThumbnailChange={handleThumbnailChange}
        clearThumbnail={clearThumbnail}
      />

      <CourseAdditionalDetails
        formData={formData}
        handleChange={handleChange}
        languages={languages}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
      />

      <CourseSchedule formData={formData} handleChange={handleChange} />

      <div className="pt-5">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Create Course
          </button>
        </div>
      </div>
    </form>
  )
}
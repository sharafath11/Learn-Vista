"use client"

import { AdditionalDetailsSection } from "@/src/components/admin/course/AdditionalDetailsSection"
import { BasicInformationSection } from "@/src/components/admin/course/BasicInformationSection"
import { CourseFormHeader } from "@/src/components/admin/course/CourseFormHeader"
import { FormActions } from "@/src/components/admin/course/FormActions"
import { ScheduleSection } from "@/src/components/admin/course/ScheduleSection"
import { ThumbnailSection } from "@/src/components/admin/course/ThumbnailSection"
import React, { useState } from "react"

export default function CreateCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mentorName: "",
    category: "",
    price: "",
    language: "",
    tags: [] as string[],
    currentTag: "",
    startDate: "",
    endDate: "",
    startTime: "",
    thumbnailPreview: null as string | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (formData.currentTag.trim() !== "" && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ""
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          thumbnailPreview: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <CourseFormHeader />
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            <BasicInformationSection 
              formData={formData} 
              handleChange={handleChange} 
            />
            
            <ThumbnailSection 
              thumbnailPreview={formData.thumbnailPreview} 
              handleThumbnailChange={handleThumbnailChange} 
              clearThumbnail={() => setFormData(prev => ({ ...prev, thumbnailPreview: null }))}
            />
            
            <AdditionalDetailsSection 
              formData={formData} 
              handleChange={handleChange} 
              handleAddTag={handleAddTag} 
              handleRemoveTag={handleRemoveTag} 
            />
            
            <ScheduleSection 
              formData={formData} 
              handleChange={handleChange} 
            />
            
            <FormActions />
          </div>
        </form>
      </div>
    </div>
  )
}
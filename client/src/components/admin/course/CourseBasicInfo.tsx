"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/shared/components/ui/card"
import { Input } from "@/src/components/shared/components/ui/input"
import { Textarea } from "@/src/components/shared/components/ui/textarea"
import { Label } from "@/src/components/shared/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/shared/components/ui/select"

interface CourseBasicInfoProps {
  formData: {
    title: string
    description: string
    mentorId: string
    categoryId: string
   
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (name: string, value: string) => void
  mentors: Array<{ id: string; username: string; expertise: string[] }>
  categories: Array<{ id: string; title: string }>
}


export default function CourseBasicInfo({
  formData,
  handleChange,
  handleSelectChange,
  mentors,
  categories,
}: CourseBasicInfoProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your course"
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Mentor</Label>
          <Select
            value={formData.mentorId}
            onValueChange={(value) => handleSelectChange("mentorId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a mentor" />
            </SelectTrigger>
            <SelectContent>
              {mentors.map((mentor) => (
                <SelectItem key={mentor.id} value={mentor.id}>
                  {mentor.username} - {mentor.expertise.join(", ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleSelectChange("categoryId", value)}
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
        </div>        
       

      </CardContent>
    </Card>
  )
}
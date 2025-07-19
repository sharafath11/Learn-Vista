"use client"

import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Input } from "@/src/components/shared/components/ui/input"
import { Label } from "@/src/components/shared/components/ui/label"
import { Textarea } from "@/src/components/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/shared/components/ui/select"
import { type CourseFormValues, mentors, categories } from "./schema"

interface BasicInfoSectionProps {
  form: UseFormReturn<CourseFormValues>
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
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
          {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
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
            <Select onValueChange={(value) => form.setValue("categoryId", value)} value={form.watch("categoryId")}>
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
  )
}

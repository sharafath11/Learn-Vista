"use client"

import type React from "react"
import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Input } from "@/src/components/shared/components/ui/input"
import { Label } from "@/src/components/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/shared/components/ui/select"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { X } from "lucide-react"
import { type CourseFormValues, languages } from "./schema"

interface DetailsSectionProps {
  form: UseFormReturn<CourseFormValues>
  tags: string[]
  tagInput: string
  setTagInput: (value: string) => void
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  removeTag: (tag: string) => void
}

export function DetailsSection({
  form,
  tags,
  tagInput,
  setTagInput,
  handleTagKeyDown,
  removeTag,
}: DetailsSectionProps) {
  return (
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
          {form.formState.errors.price && <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>}
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
  )
}

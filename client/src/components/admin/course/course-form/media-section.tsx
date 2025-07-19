"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Input } from "@/src/components/shared/components/ui/input"
import { Label } from "@/src/components/shared/components/ui/label"
import { Button } from "@/src/components/shared/components/ui/button"
import { X } from "lucide-react"

interface MediaSectionProps {
  thumbnailPreview: string | null
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeThumbnail: () => void
}

export function MediaSection({ thumbnailPreview, handleThumbnailChange, removeThumbnail }: MediaSectionProps) {
  return (
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
  )
}

// components/course/CourseThumbnail.tsx
import { IAdminCourseThumbnailProps } from "@/src/types/adminProps"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import React from "react"

export default function CourseThumbnail({
  thumbnailPreview,
  handleThumbnailChange,
  clearThumbnail,
}: IAdminCourseThumbnailProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Course Thumbnail</h2>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        {thumbnailPreview ? (
          <div className="relative w-full max-w-md">
            <Image
              src={thumbnailPreview || "/placeholder.svg"}
              alt="Thumbnail preview"
              width={400}
              height={225}
              className="rounded-lg object-cover w-full h-auto"
            />
            <button
              type="button"
              onClick={clearThumbnail}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
            >
              <X size={16} className="text-gray-700" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label
                htmlFor="thumbnail"
                className="cursor-pointer rounded-md bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Upload Thumbnail
                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleThumbnailChange}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
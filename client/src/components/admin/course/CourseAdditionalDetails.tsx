// components/course/CourseAdditionalDetails.tsx
import { X } from "lucide-react"
import React from "react"

interface CourseAdditionalDetailsProps {
  formData: {
    language: string
    tags: string[]
    currentTag: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  languages: string[]
  handleAddTag: () => void
  handleRemoveTag: (tagToRemove: string) => void
}

export default function CourseAdditionalDetails({
  formData,
  handleChange,
  languages,
  handleAddTag,
  handleRemoveTag,
}: CourseAdditionalDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Additional Details</h2>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Language
        </label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        >
          <option value="" disabled>
            Select a language
          </option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="currentTag" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="mt-1 flex rounded-lg shadow-sm">
          <input
            type="text"
            id="currentTag"
            name="currentTag"
            value={formData.currentTag}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-200 rounded-r-lg bg-sky-100 text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-50 text-sky-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-sky-400 hover:bg-sky-200 hover:text-sky-700"
                >
                  <X size={12} />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
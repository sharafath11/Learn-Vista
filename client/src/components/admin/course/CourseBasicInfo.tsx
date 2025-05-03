// components/course/CourseBasicInfo.tsx
import React from "react"

interface CourseBasicInfoProps {
  formData: {
    title: string
    description: string
    mentorId: string
    categoryId: string
    price: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  mentors: Array<{ id: string; username: string; expertise: string[] }>
  categories: Array<{ id: string; title: string }>
}

export default function CourseBasicInfo({
  formData,
  handleChange,
  mentors,
  categories,
}: CourseBasicInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Basic Information</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        />
      </div>

      <div>
        <label htmlFor="mentorName" className="block text-sm font-medium text-gray-700">
          Mentor Name
        </label>
        <select
          id="mentorName"
          name="mentorName"
          value={formData.mentorId}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        >
          <option value="">Select a mentor</option>
          {mentors.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>
              {mentor.username} - {mentor.expertise.join(", ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.categoryId}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        />
      </div>
    </div>
  )
}
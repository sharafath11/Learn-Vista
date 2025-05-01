"use client"

import { useState } from "react"
import { Plus, Edit, Trash, Eye, MoreHorizontal, Search } from "lucide-react"
import AddCategoryModal from "./categoriesModal"

// Sample category data
const initialCategories = [
  { id: 1, name: "Programming", description: "Learn to code", courses: 24, status: "Active" },
  { id: 2, name: "Design", description: "Design fundamentals", courses: 18, status: "Active" },
  { id: 3, name: "Business", description: "Business skills", courses: 12, status: "Active" },
  { id: 4, name: "Marketing", description: "Marketing strategies", courses: 9, status: "Inactive" },
  { id: 5, name: "Photography", description: "Capture great photos", courses: 15, status: "Active" },
  { id: 6, name: "Music", description: "Master your instrument", courses: 7, status: "Active" },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)

  const handleAddCategory = (newCategory: { name: string; description: string }) => {
    const newId = Math.max(...categories.map((c) => c.id)) + 1
    setCategories([
      ...categories,
      {
        id: newId,
        name: newCategory.name,
        description: newCategory.description,
        courses: 0,
        status: "Active",
      },
    ])
    setIsModalOpen(false)
  }

  const toggleDropdown = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id))
    setActiveDropdown(null)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const viewOptions = ["Grid", "List"]
  const [viewType, setViewType] = useState("Grid")

    function handleClose(): void {
        throw new Error("Function not implemented.")
    }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your course categories</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          <Plus size={18} className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
          {viewOptions.map((option) => (
            <button
              key={option}
              onClick={() => setViewType(option)}
              className={`px-3 py-1 text-sm rounded-md ${
                viewType === option ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {viewType === "Grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                  <div className="relative">
                    <button onClick={() => toggleDropdown(category.id)} className="p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal size={18} className="text-gray-500" />
                    </button>

                    {activeDropdown === category.id && (
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => console.log("View", category.id)}
                          >
                            <Eye size={16} className="mr-2" />
                            View
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => console.log("Edit", category.id)}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash size={16} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  <p>Description: {category.description}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">{category.courses} Courses</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      category.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.courses}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        category.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                        onClick={() => console.log("View", category.id)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                        onClick={() => console.log("Edit", category.id)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 text-red-600"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No categories found</p>
        </div>
      )}
<AddCategoryModal
  isOpen={isModalOpen}
  onClose={handleClose}
  onAddCategory={handleAddCategory}
/>

    </div>
  )
}

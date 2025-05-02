"use client"

import { useState } from "react"
import { Plus, MoreHorizontal } from "lucide-react"
import CategoriesModal from "./categoriesModal"
import { useAdminContext } from "@/src/context/adminContext"
import { AdminAPIMethods } from "@/src/services/APImethods"
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast"

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const { cat,setCat  } = useAdminContext()

  const handleDropdownToggle = (id: string) => {
    setActiveDropdown(prev => (prev === id ? null : id))
  }
  const handleToggleBLock = async (id: string, status: boolean) => {
    const res = await AdminAPIMethods.blockCategorie(id, !status);
    if (res.ok) {
      showSuccessToast(res.msg)
      setCat((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isBlock: !status } : c
        )
      );
    }else showInfoToast(res.msg)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">📚 Categories</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your course categories smartly and efficiently.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 shadow-md transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {isModalOpen && <CategoriesModal setIsModalOpen={setIsModalOpen} />}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cat.map((category) => (
          <div
            key={category._id}
            className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{category.description}</p>
              </div>

              {/* 3 dots button */}
              <div className="relative">
                <button
                  className="p-1.5 rounded-full hover:bg-gray-100 transition"
                  onClick={() => handleDropdownToggle(category._id)}
                >
                  <MoreHorizontal size={20} className="text-gray-500" />
                </button>

                {/* Dropdown menu */}
                {activeDropdown === category._id && (
                  <div className="absolute right-0 mt-2 w-40 z-20 bg-white border rounded-lg shadow-md py-1 animate-fade-in">
                    <button
                      onClick={() => {
                        handleToggleBLock(category._id,category.isBlock)
                        setActiveDropdown(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      {category.isBlock ? "Unblock" : "Block"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="mt-6 flex justify-between items-center text-sm">
              <span className="text-gray-600 italic">{category.description} Description</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  category.isBlock
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {category.isBlock ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

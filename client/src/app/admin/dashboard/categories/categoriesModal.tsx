"use client"

import { useAdminContext } from "@/src/context/adminContext"
import { AdminAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast } from "@/src/utils/Toast"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface CategoriesModalProps {
  setIsModalOpen: (isOpen: boolean) => void
}

export default function CategoriesModal({ setIsModalOpen }: CategoriesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
   const {setCat}=useAdminContext()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.classList.add("animate-fadeOut")
      setTimeout(() => setIsModalOpen(false), 200)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

 
      const res=await AdminAPIMethods.addCategory(name,description)
    if (res.ok) {
      setCat((prev)=>[...prev,res.data])
      showSuccessToast(`Category ${name} added succesfully`)
      handleClose()
    }
   
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={modalRef}
        className="animate-fadeIn bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 border border-gray-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              placeholder="Enter category description"
              rows={4}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

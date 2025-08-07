"use client"

import { useEffect, useState } from "react"

import { useAdminContext } from "@/src/context/adminContext"
import { AdminAPIMethods } from "@/src/services/methods/admin.api"
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/shared/components/ui/dialog"
import { Input } from "@/src/components/shared/components/ui/input"
import { Textarea } from "@/src/components/shared/components/ui/textarea"
import { Button } from "@/src/components/shared/components/ui/button"

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  categoryId?: string | null
}

export default function CategoryForm({ 
  isOpen, 
  onClose, 
  onSuccess,
  categoryId 
}: CategoryFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const { cat, setCat } = useAdminContext()


  const category = categoryId ? cat.find(c => c.id === categoryId) : null

  useEffect(() => {
    if (category) {
      setTitle(category.title)
      setDescription(category.description)
    } else {
      setTitle("")
      setDescription("")
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || title.length < 3) {
      showInfoToast("Title must be at least 3 characters long");
      return;
    }
  
    if (!description.trim() || description.length <= 10) {
      showInfoToast("Description must be more than 10 characters long");
      return;
    }
    if (categoryId && category) {
     
  
      const res = await AdminAPIMethods.editCategory(categoryId,  title, description)
      if (res.ok) {
        setCat(prev => prev.map(c => c.id === categoryId ? { ...c, title, description } : c))
        showSuccessToast(`Category ${title} updated`)
        onClose()
        onSuccess?.()
      }
    } else {
 
      const res = await AdminAPIMethods.addCategory( title, description )
      if (res.ok) {
        setCat(prev => [...prev, res.data])
        showSuccessToast(`Category ${title} added`)
        onClose()
        onSuccess?.()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categoryId ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {categoryId ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
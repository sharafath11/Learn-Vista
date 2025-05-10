"use client"

import { Button } from "@/components/ui/button"

interface FormActionsProps {
  isLoading: boolean
  onCancel: () => void
}

export function FormActions({ isLoading, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Course"}
      </Button>
    </div>
  )
}

"use client"

import { Button } from "@/src/components/shared/components/ui/button"
import { IFormActionsProps } from "@/src/types/adminProps"

export function FormActions({ isLoading, onCancel }: IFormActionsProps) {
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

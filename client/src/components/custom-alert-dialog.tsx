"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface CustomAlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  icon?: string 
  variant?: "info" | "warning" | "error" | "success"
}

export function CustomAlertDialog({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  variant = "info",
}: CustomAlertDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return {
          icon: icon || "⚠️",
          titleClass: "text-orange-600 dark:text-orange-400",
          descriptionClass: "text-orange-500 dark:text-orange-300",
        }
      case "error":
        return {
          icon: icon || "❌",
          titleClass: "text-red-600 dark:text-red-400",
          descriptionClass: "text-red-500 dark:text-red-300",
        }
      case "success":
        return {
          icon: icon || "✅",
          titleClass: "text-green-600 dark:text-green-400",
          descriptionClass: "text-green-500 dark:text-green-300",
        }
      case "info":
      default:
        return {
          icon: icon || "ℹ️",
          titleClass: "text-blue-600 dark:text-blue-400",
          descriptionClass: "text-blue-500 dark:text-blue-300",
        }
    }
  }

  const { icon: displayIcon, titleClass, descriptionClass } = getVariantStyles()

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center text-center">
          {displayIcon && <span className="text-5xl mb-4">{displayIcon}</span>}
          <AlertDialogTitle className={cn("text-2xl font-bold", titleClass)}>{title}</AlertDialogTitle>
          <AlertDialogDescription className={cn("text-base", descriptionClass)}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center sm:justify-center gap-4">
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

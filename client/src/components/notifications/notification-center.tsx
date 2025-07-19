"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationAPIMethods } from "@/src/services/APImethods"
import type { INotification } from "@/src/types/notificationsTypes"
import { UnreadNotifications } from "./unread-notifications"
import { AllNotifications } from "./all-notifications"
import { Button } from "@/src/components/shared/components/ui/button"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: INotification[]
  setNotifications: (notifications: INotification[]) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  isMobile?: boolean
  onRefresh?: () => void
  variant?: "light" | "dark"
}

export const NotificationCenter = ({
  isOpen,
  onClose,
  notifications,
  setNotifications,
  unreadCount,
  setUnreadCount,
  isMobile = false,
  onRefresh,
  variant = "dark",
}: NotificationCenterProps) => {
  useEffect(() => {
    if (isOpen && onRefresh) {
      onRefresh()
    }
  }, [isOpen, onRefresh])

  const markAsRead = async (id: string) => {
    const res = await NotificationAPIMethods.markAsRead(id)
    if (res.ok) {
      const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      setNotifications(updated)
      setUnreadCount(updated.filter((n) => !n.isRead).length)
    }
  }

  const markAllAsRead = async () => {
    const res = await NotificationAPIMethods.markAllAsRead()
    if (res.ok) {
      const updated = notifications.map((n) => ({ ...n, isRead: true }))
      setNotifications(updated)
      setUnreadCount(0)
    }
  }

  const deleteNotification = async (id: string) => {
    const target = notifications.find((n) => n.id === id)
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    if (target?.isRead === false && unreadCount > 0) {
      setUnreadCount(unreadCount - 1)
    }
  }

  const headerClasses =
    variant === "dark" ? "border-b border-zinc-700 bg-zinc-800/50" : "border-b border-gray-200 bg-gray-50"
  const textClasses = variant === "dark" ? "text-white" : "text-gray-900"
  const iconClasses = variant === "dark" ? "text-purple-400" : "text-emerald-600"
  const buttonTextClasses =
    variant === "dark"
      ? "text-purple-300 hover:text-purple-400 hover:bg-zinc-700"
      : "text-emerald-600 hover:text-emerald-700 hover:bg-gray-100"
  const closeButtonClasses =
    variant === "dark"
      ? "text-gray-400 hover:text-white hover:bg-zinc-700"
      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
  const sectionHeaderClasses = variant === "dark" ? "text-purple-300" : "text-emerald-600"
  const dividerClasses = variant === "dark" ? "divide-zinc-700" : "divide-gray-200"

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : -10,
        scale: isOpen ? 1 : 0.95,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "notification-center shadow-xl rounded-xl z-50 transition-all",
        variant === "dark"
          ? "bg-zinc-800/95 backdrop-blur-md border border-zinc-700"
          : "bg-white border border-gray-200",
        isMobile ? "mx-4 mt-2 max-h-[70vh] w-auto" : "absolute right-0 mt-2 w-[600px]",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className={cn("flex items-center justify-between p-4", headerClasses)}>
        <div className="flex items-center gap-2">
          <Bell size={18} className={iconClasses} />
          <h3 className={cn("font-semibold", textClasses)}>Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className={cn("text-xs", buttonTextClasses)}>
              Mark all as read
            </Button>
          )}
          <button onClick={onClose} className={cn("p-1 rounded transition-colors", closeButtonClasses)}>
            <X size={16} />
          </button>
        </div>
      </div>
      {/* Notification Columns */}
      <div
        className={cn(
          "flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x max-h-96 overflow-y-auto",
          dividerClasses,
        )}
      >
        <div className="w-full md:w-1/2 p-2">
          <h4 className={cn("text-xs font-semibold mb-2", sectionHeaderClasses)}>Unread</h4>
          <UnreadNotifications
            notifications={notifications}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            variant={variant}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h4 className={cn("text-xs font-semibold mb-2", sectionHeaderClasses)}>All</h4>
          <AllNotifications notifications={notifications} deleteNotification={deleteNotification} variant={variant} />
        </div>
      </div>
    </motion.div>
  )
}

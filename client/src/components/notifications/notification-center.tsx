"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, X } from "lucide-react"
import { cn } from "@/lib/utils" // Adjusted import path for cn
import { NotificationAPIMethods } from "@/src/services/APImethods"
import type { INotification } from "@/src/types/notificationsTypes"
import { UnreadNotifications } from "./unread-notifications"
import { AllNotifications } from "./all-notifications"
import { Button } from "@/components/ui/button" // Assuming shadcn button is available

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: INotification[]
  setNotifications: (notifications: INotification[]) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  isMobile?: boolean
  // Optional prop to trigger refresh from parent
  onRefresh?: () => void
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
}: NotificationCenterProps) => {
  useEffect(() => {
    console.log(onRefresh,isOpen)
    if (isOpen && onRefresh) {
      onRefresh() 
    }
  }, [isOpen])


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
    // In a real app, you'd call an API here to delete
    const target = notifications.find((n) => n.id === id)
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    if (target?.isRead === false && unreadCount > 0) {
      setUnreadCount(unreadCount - 1)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "bg-zinc-800/95 backdrop-blur-md shadow-xl border border-zinc-700 rounded-xl z-50",
        isMobile ? "mx-4 mt-2 max-h-[70vh] w-auto" : "absolute right-0 mt-2 w-[600px]",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800/50 p-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-purple-400" />
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-purple-300 hover:text-purple-400 hover:bg-zinc-700"
            >
              Mark all as read
            </Button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      {/* Two Column Notifications */}
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-700 max-h-96 overflow-y-auto">
        <div className="w-full md:w-1/2 p-2">
          <h4 className="text-xs text-purple-300 font-semibold mb-2">Unread</h4>
          <UnreadNotifications
            notifications={notifications}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h4 className="text-xs text-purple-300 font-semibold mb-2">All</h4>
          <AllNotifications notifications={notifications} deleteNotification={deleteNotification} />
        </div>
      </div>
    </motion.div>
  )
}

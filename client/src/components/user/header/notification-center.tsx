"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Check, Trash2, BookOpen, Video, Heart } from "lucide-react"
import { cn } from "@/src/utils/cn"
import type { INotification } from "@/src/types/notificationsTypes"
import { useUserContext } from "@/src/context/userAuthContext"
import { NotificationAPIMethods } from "@/src/services/APImethods"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  isMobile?: boolean
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "course":
      return BookOpen
    case "live":
      return Video
    case "donation":
      return Heart
    default:
      return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "course":
      return "text-blue-400 bg-blue-900/20"
    case "live":
      return "text-green-400 bg-green-900/20"
    case "donation":
      return "text-pink-400 bg-pink-900/20"
    default:
      return "text-purple-400 bg-purple-900/20"
  }
}

export const NotificationCenter = ({
  isOpen,
  onClose,
  unreadCount,
  setUnreadCount,
  isMobile = false,
}: NotificationCenterProps) => {
  const { userNotifications, setUserNotifications, refereshNotifcation } = useUserContext()
  const [notifications, setNotifications] = useState<INotification[]>([])

  console.log("notifications", notifications)

  useEffect(() => {
    refereshNotifcation()
  }, [isOpen])

  useEffect(() => {
    if (userNotifications) {
      const sorted = [...userNotifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      setNotifications(sorted)
    }
  }, [userNotifications])

  const markAsRead = async (id: string) => {
    await NotificationAPIMethods.markAsRead(id)
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.isRead).length)
  }

  const markAllAsRead = async () => {
    await NotificationAPIMethods.markAllAsRead()
    const updated = notifications.map((n) => ({ ...n, isRead: true }))
    setNotifications(updated)
    setUnreadCount(0)
  }

  const deleteNotification = async (id: string) => {
    // Add delete API call if available
    // await NotificationAPIMethods.deleteNotification(id)
    const notification = notifications.find((n) => n.id === id)
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)

    if (notification && !notification.isRead && unreadCount > 0) {
      setUnreadCount(unreadCount - 1)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "bg-zinc-800/95 backdrop-blur-md shadow-xl border border-zinc-700 rounded-xl overflow-hidden z-50",
          isMobile ? "mx-4 mt-2 max-h-[70vh] w-auto" : "absolute right-0 mt-2 w-80",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between border-b border-zinc-700 bg-zinc-800/50",
            isMobile ? "p-4" : "p-4",
          )}
        >
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-purple-400" />
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 rounded hover:bg-zinc-700/50 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className={cn("overflow-y-auto", isMobile ? "max-h-[50vh]" : "max-h-96")}>
          {notifications.length === 0 ? (
            <div className={cn("text-center text-gray-400", isMobile ? "p-8" : "p-8")}>
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-700">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const colorClass = getNotificationColor(notification.type)
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "p-4 hover:bg-zinc-700/30 transition-colors group relative",
                      !notification.isRead && "bg-zinc-700/20",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className={cn("p-2 rounded-lg flex-shrink-0", colorClass)}>
                        <Icon size={16} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={cn("text-sm font-medium", notification.isRead ? "text-gray-300" : "text-white")}
                          >
                            {notification.title}
                          </h4>

                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>

                        <p
                          className={cn(
                            "text-sm mt-1 line-clamp-2",
                            notification.isRead ? "text-gray-400" : "text-gray-300",
                          )}
                        >
                          {notification.message}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-green-400 hover:bg-green-900/20 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
       
      </motion.div>
    </AnimatePresence>
  )
}

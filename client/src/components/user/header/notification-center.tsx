"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  X,
  Check,
  Trash2,
  BookOpen,
  Video,
  Heart,
} from "lucide-react"
import { cn } from "@/src/utils/cn"
import { INotification } from "@/src/types/notificationsTypes"
import { useUserContext } from "@/src/context/userAuthContext"
import { NotificationAPIMethods } from "@/src/services/APImethods"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  unreadCount: number
  setUnreadCount: (count: number) => void
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
}: NotificationCenterProps) => {
  const { userNotifications, setUserNotifications } = useUserContext()
  const [notifications, setNotifications] = useState<INotification[]>([])
  console.log("notifcationsd",notifications)
  useEffect(() => {
  if (userNotifications) {
    const sorted = [...userNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setNotifications(sorted)
  }
}, [userNotifications])


  const markAsRead = async (id: string) => {
    await NotificationAPIMethods.markAsRead(id)
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    )
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.isRead).length)
  }

  const markAllAsRead = async () => {
    await NotificationAPIMethods.markAllAsRead()
    const updated = notifications.map((n) => ({ ...n, isRead: true }))
    setNotifications(updated)
    setUnreadCount(0)
  }

 

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-80 bg-zinc-800/95 backdrop-blur-md shadow-xl border border-zinc-700 rounded-xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-purple-400" />
              <h3 className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
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
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-700">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  const colorClass = getNotificationColor(notification.type)

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-zinc-700/30 transition-colors group",
                        !notification.isRead && "bg-zinc-700/20"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", colorClass)}>
                          <Icon size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={cn(
                                "text-sm font-medium",
                                notification.isRead
                                  ? "text-gray-300"
                                  : "text-white"
                              )}
                            >
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-green-400 hover:bg-green-900/20 rounded transition-colors"
                                  title="Mark as read"
                                >
                                  <Check size={12} />
                                </button>
                              )}
                              
                            </div>
                          </div>

                          <p
                            className={cn(
                              "text-sm mt-1",
                              notification.isRead
                                ? "text-gray-400"
                                : "text-gray-300"
                            )}
                          >
                            {notification.message}
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-zinc-700 bg-zinc-800/50">
              <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 py-1 rounded hover:bg-zinc-700/50 transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

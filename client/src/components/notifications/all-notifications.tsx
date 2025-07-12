"use client"

import { motion } from "framer-motion"
import { Trash2, Check, User, Info, AlertCircle, X, Bell } from "lucide-react"
import { cn } from "@/lib/utils" // Adjusted import path for cn
import type { INotification } from "@/src/types/notificationsTypes"

interface Props {
  notifications: INotification[]
  deleteNotification: (id: string) => void
}

const getNotificationIcon = (type: INotification["type"]) => {
  switch (type) {
    case "info":
      return <Info className="w-4 h-4" />
    case "warning":
      return <AlertCircle className="w-4 h-4" />
    case "success":
      return <Check className="w-4 h-4" />
    
    case "error":
      return <X className="w-4 h-4" /> // Using X for error type
    default:
      return <Bell className="w-4 h-4" /> // Fallback icon
  }
}

const getNotificationTypeColor = (type: INotification["type"]) => {
  switch (type) {
    case "success":
      return "text-green-400"
    case "warning":
      return "text-yellow-400"
    case "error":
      return "text-red-400"
    case "info":
      return "text-blue-400"
    default:
      return "text-gray-400"
  }
}

export const AllNotifications = ({ notifications, deleteNotification }: Props) => {
  if (notifications.length === 0) {
    return <div className="text-gray-400 text-sm p-4 text-center">No notifications</div>
  }

  return (
    <div className="flex flex-col divide-y divide-zinc-700">
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-3 group hover:bg-zinc-700/20 transition",
            notification.isRead ? "text-gray-300" : "text-white bg-zinc-700/10",
          )}
        >
          <div className="flex justify-between items-start gap-3">
            <div className={getNotificationTypeColor(notification.type)}>{getNotificationIcon(notification.type)}</div>
            <div className="flex-1">
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100">
              <button onClick={() => deleteNotification(notification.id)} className="p-1 text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

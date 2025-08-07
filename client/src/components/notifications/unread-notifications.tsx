"use client"
import { formatDistanceToNow } from "date-fns"
import { Trash2, Check } from "lucide-react" 
import type { INotification } from "@/src/types/notificationsTypes"
import { cn } from "@/lib/utils"

interface UnreadNotificationsProps {
  notifications: INotification[]
  markAsRead: (id: string) => void
  deleteNotification: (id: string) => void
  variant?: "light" | "dark"
}

export const UnreadNotifications = ({
  notifications,
  markAsRead,
  deleteNotification,
  variant = "dark",
}: UnreadNotificationsProps) => {
const unread = notifications
  .filter((n) => !n.isRead)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const itemBgClass = variant === "dark" ? "bg-zinc-700 hover:bg-zinc-600" : "bg-gray-100 hover:bg-gray-200"
  const itemTextClass = variant === "dark" ? "text-white" : "text-gray-900"
  const timeTextClass = variant === "dark" ? "text-gray-400" : "text-gray-500"
  const deleteButtonClass =
    variant === "dark"
      ? "text-gray-400 hover:text-red-400 hover:bg-zinc-600"
      : "text-gray-500 hover:text-red-600 hover:bg-gray-200"
  const markAsReadButtonClass =
    variant === "dark"
      ? "text-gray-400 hover:text-emerald-400 hover:bg-zinc-600"
      : "text-gray-500 hover:text-emerald-600 hover:bg-gray-200"

  return (
    <div className="space-y-2">
      {unread.length === 0 ? (
        <p className={cn("text-sm text-center py-4", timeTextClass)}>No unread notifications.</p>
      ) : (
        unread.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors", // Removed cursor-pointer from here
              itemBgClass,
            )}
          >
            <div className="flex-1 cursor-pointer" onClick={() => markAsRead(notification.id)}>
              {" "}
              {/* Added cursor-pointer here */}
              <p className={cn("text-sm font-medium", itemTextClass)}>{notification.message}</p>
              <p className={cn("text-xs", timeTextClass)}>
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {" "}
              {/* Group buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  markAsRead(notification.id)
                }}
                className={cn("p-1 rounded-md", markAsReadButtonClass)}
                title="Mark as read"
              >
                <Check size={16} />
              </button>
             
            </div>
          </div>
        ))
      )}
    </div>
  )
}

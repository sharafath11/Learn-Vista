"use client"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { IAllNotificationsProps } from "@/src/types/sharedProps"


export const AllNotifications = ({ notifications,  variant = "dark" }: IAllNotificationsProps) => {
  const all = notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const itemBgClass = variant === "dark" ? "bg-zinc-700 hover:bg-zinc-600" : "bg-gray-100 hover:bg-gray-200"
  const itemTextClass = variant === "dark" ? "text-white" : "text-gray-900"
  const timeTextClass = variant === "dark" ? "text-gray-400" : "text-gray-500"
  
  return (
    <div className="space-y-2">
      {all.length === 0 ? (
        <p className={cn("text-sm text-center py-4", timeTextClass)}>No notifications yet.</p>
      ) : (
        all.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors",
              itemBgClass,
              notification.isRead ? "opacity-70" : "",
            )}
          >
            <div>
              <p className={cn("text-sm font-medium", itemTextClass)}>{notification.message}</p>
              <p className={cn("text-xs", timeTextClass)}>
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
            
          </div>
        ))
      )}
    </div>
  )
}

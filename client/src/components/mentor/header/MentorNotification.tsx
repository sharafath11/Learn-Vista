"use client"

import type React from "react"
import { useState } from "react"
import { Bell, Check, X, Clock, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMentorContext } from "@/src/context/mentorContext"
import { NotificationAPIMethods } from "@/src/services/APImethods"
import { INotification } from "@/src/types/notificationsTypes"
import { showErrorToast } from "@/src/utils/Toast"

export default function MentorNotification() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    mentorNotification,
    setMentorNotifications,
    mentorUnreadNotification,
    setMentorUnreadNotification,
  } = useMentorContext()

  const unreadNotifications = [...mentorNotification]
    .filter((n) => !n.isRead)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getIcon = (type: INotification["type"]) => {
    switch (type) {
      case "info":
        return <Calendar className="w-4 h-4" />
      case "warning":
        return <Clock className="w-4 h-4" />
      case "success":
        return <Check className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const markAsRead = async (id: string) => {
    const res = await NotificationAPIMethods.markAsRead(id)
    if (res.ok) {
      setMentorNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setMentorUnreadNotification((prev) => prev - 1)
    } else {
      showErrorToast(res.msg)
    }
  }

  const markAllAsRead = async () => {
    const res = await NotificationAPIMethods.markAllAsRead()
    if (res.ok) {
      setMentorNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setMentorUnreadNotification(0)
    } else {
      showErrorToast(res.msg)
    }
  }

  const removeNotification = (id: string) => {
    setMentorNotifications((prev) => prev.filter((n) => n.id !== id))
    setMentorUnreadNotification((prev) => Math.max(0, prev - 1))
  }

  const getTypeColor = (type: INotification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          {mentorUnreadNotification > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-500 hover:bg-emerald-600"
            >
              {mentorUnreadNotification > 9 ? "9+" : mentorUnreadNotification}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-lg" align="end">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Unread Notifications</h3>
          {mentorUnreadNotification > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {unreadNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Bell className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No unread notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 transition-colors bg-emerald-50/30"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

"use client"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/shared/components/ui/popover"
import { Bell } from "lucide-react"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Button } from "@/src/components/shared/components/ui/button"
import { useAdminContext } from "@/src/context/adminContext"
import { NotificationCenter } from "../notifications/NotificationCenter"

export default function AdminNotification() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const {
    adminNotifications,
    setAdminNotifications,
    adminUnreadNotification,
    setAdminUnreadNotification,
    refreshAdminNotification,
  } = useAdminContext()

  return (
    <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          {adminUnreadNotification > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-500 hover:bg-emerald-600"
            >
              {adminUnreadNotification > 9 ? "9+" : adminUnreadNotification}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-lg" align="end">
        <NotificationCenter
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={adminNotifications}
          setNotifications={setAdminNotifications}
          unreadCount={adminUnreadNotification}
          setUnreadCount={setAdminUnreadNotification}
          onRefresh={refreshAdminNotification}
          variant="light"
        />
      </PopoverContent>
    </Popover>
  )
}

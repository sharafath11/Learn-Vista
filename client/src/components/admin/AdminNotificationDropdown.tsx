"use client"

import { useState } from "react"
import { FiBell } from "react-icons/fi" 
import { useAdminContext } from "@/src/context/adminContext"
import { NotificationCenter } from "../notifications/notification-center"


export default function AdminNotificationDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const {
    adminNotifications,
    setAdminNotifications,
    adminUnreadNotification,
    setAdminUnreadNotification,
    refreshAdminNotification,
  } = useAdminContext()

  const handleRefresh = () => {
    if (refreshAdminNotification) {
      refreshAdminNotification()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2 sm:p-3 rounded-xl hover:bg-gray-100 transition-all"
      >
        <FiBell className="w-5 h-5 text-gray-600" />
        {adminUnreadNotification > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-medium text-white animate-pulse">
            {adminUnreadNotification > 9 ? "9+" : adminUnreadNotification}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-96 overflow-hidden rounded-2xl border bg-white shadow-xl z-20">
            <NotificationCenter
              isOpen={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
              notifications={adminNotifications}
              setNotifications={setAdminNotifications}
              unreadCount={adminUnreadNotification}
              setUnreadCount={setAdminUnreadNotification}
              onRefresh={handleRefresh}
            />
          </div>
        </>
      )}
    </div>
  )
}

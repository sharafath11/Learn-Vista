"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/src/utils/cn"
import type { IUser } from "@/src/types/userTypes"
import { NotificationCenter } from "./notification-center"

interface NavItem {
  name: string
  path: string
  icon: React.ElementType
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  activeLink: string
  user: IUser | null
  handleLogout: () => void
  setActiveLink: (path: string) => void
  navItems: NavItem[]
  unreadCount: number
  setUnreadCount: (count: number) => void
}

export const MobileMenu = ({
  isOpen,
  onClose,
  activeLink,
  user,
  handleLogout,
  setActiveLink,
  navItems,
  unreadCount,
  setUnreadCount,
}: MobileMenuProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-md z-40 border-b border-zinc-700 shadow-lg"
        >
          <div className="px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Search */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2.5 w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-1 mb-4">
              {navItems.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => {
                    setActiveLink(path)
                    onClose()
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeLink === path ? "bg-purple-900/30 text-purple-400" : "text-gray-300 hover:bg-zinc-800",
                  )}
                >
                  <Icon size={18} />
                  {name}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <Image
                    src={user.profilePicture || "/images/ai.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-purple-400/50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{user.username || "User"}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
                  </div>

                  {/* Mobile Notification Button */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="p-2 text-gray-400 hover:text-purple-400 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Notification Center for Mobile */}
                {isNotificationOpen && (
                  <div className="relative">
                    <NotificationCenter
                      isOpen={isNotificationOpen}
                      onClose={() => setIsNotificationOpen(false)}
                      unreadCount={unreadCount}
                      setUnreadCount={setUnreadCount}
                    />
                  </div>
                )}

                {/* User Menu */}
                <div className="space-y-1">
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-zinc-800 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <Link
                    href="/user/settings"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-zinc-800 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>

                  <Link
                    href="/user/lv-code"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-zinc-800 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    LV CODE
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout()
                      onClose()
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              /* Auth Buttons */
              <div className="space-y-3 pt-4 border-t border-zinc-700">
                <Link
                  href="/user/login"
                  className="block w-full text-center py-2.5 text-gray-300 border border-zinc-700 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                  onClick={onClose}
                >
                  Log in
                </Link>
                <Link
                  href="/user/signup"
                  className="block w-full text-center py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-colors"
                  onClick={onClose}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useRef } from "react"
import { ChevronDown, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/src/utils/cn"
import type { IUser } from "@/src/types/userTypes"

interface UserDropdownProps {
  user: IUser | null
  isDropdownOpen: boolean
  setIsDropdownOpen: (value: boolean) => void
  handleLogout: () => void
}

export const UserDropdown = ({ user, isDropdownOpen, setIsDropdownOpen, handleLogout }: UserDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsDropdownOpen(!isDropdownOpen)
        }}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-800 transition-colors group"
      >
        <div className="relative">
          <Image
            src={user?.profilePicture || "/images/ai.png"}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full object-cover border-2 border-purple-400/50 group-hover:border-purple-400 transition-colors"
          />
        </div>
        <ChevronDown
          size={16}
          className={cn("text-gray-400 transition-transform duration-200", isDropdownOpen ? "rotate-180" : "")}
        />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-zinc-800/95 backdrop-blur-md shadow-xl border border-zinc-700 rounded-xl overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-zinc-700">
              <p className="text-sm font-medium text-white truncate">{user?.username || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/user/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-zinc-700/50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User size={16} />
                <span className="text-sm">Profile</span>
              </Link>

              <Link
                href="/user/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-zinc-700/50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings size={16} />
                <span className="text-sm">Settings</span>
              </Link>

              <Link
                href="/user/lv-code"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-zinc-700/50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span className="text-sm">LV CODE</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-zinc-700">
              <button
                onClick={() => {
                  handleLogout()
                  setIsDropdownOpen(false)
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

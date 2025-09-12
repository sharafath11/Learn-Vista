"use client"

import { useRef } from "react"
import { ChevronDown, User, LogOut, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { cn } from "@/src/utils/cn"
import { IUserDropdownProps } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"  

export const UserDropdown = ({ user, isDropdownOpen, setIsDropdownOpen, handleLogout }: IUserDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleProfileClick = () => {
    router.push("/user/profile")
    setIsDropdownOpen(false)
  }

  const handleLetsFunClick = () => {
    router.push("/user/lets-fun-psc")
    setIsDropdownOpen(false)
  }

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
            width={48}
            height={48}
            className="rounded-full border-2 border-purple-400/50 shadow-lg"
            unoptimized
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
            <button
              onClick={handleProfileClick}
              className="w-full px-4 py-3 border-b border-zinc-700 hover:bg-zinc-700/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={user?.profilePicture || "/images/ai.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-purple-400/50"
                  unoptimized
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate hover:text-purple-400 transition-colors">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
                </div>
              </div>
            </button>

            {/* Menu Items */}
            <div className="py-1">
              <WithTooltip content="View your profile">
                <Link
                  href="/user/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-zinc-700/50 hover:text-purple-400 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={16} />
                  <span className="text-sm">Profile</span>
                </Link>
              </WithTooltip>

              <WithTooltip content="Play and practice with PSC challenges 🎯">
                <button
                  onClick={handleLetsFunClick}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-200 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 hover:text-purple-400 transition-all duration-200"
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                    <Trophy size={10} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">Lets Fun PSC</span>
                </button>
              </WithTooltip>
            </div>

            {/* Logout */}
            <div className="border-t border-zinc-700">
              <WithTooltip content="Sign out of your account">
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
              </WithTooltip>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

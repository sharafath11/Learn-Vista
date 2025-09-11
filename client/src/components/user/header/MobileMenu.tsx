"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {  User,  LogOut, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/src/utils/cn"
import type { IUser } from "@/src/types/userTypes"

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
}

export const MobileMenu = ({
  isOpen,
  onClose,
  activeLink,
  user,
  handleLogout,
  setActiveLink,
  navItems,
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-md z-30 border-b border-zinc-700 shadow-lg"
        >
          <div className="px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
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
                {/* User Info - Clean design without notification */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30 rounded-xl border border-zinc-700/50">
                  <div className="relative">
                    <Image
                      src={user.profilePicture || "/images/ai.png"}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-purple-400/50 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate text-base">{user.username || "User"}</p>
                    <p className="text-sm text-gray-400 truncate">{user.email || ""}</p>
                  </div>
                </div>

                {/* User Menu */}
                <div className="space-y-1">
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-purple-400 rounded-lg transition-all duration-200 group"
                    onClick={onClose}
                  >
                    <User size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  
                  <Link
                    href="/user/lets-fun-psc"
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-purple-400 rounded-lg transition-all duration-200 group"
                    onClick={onClose}
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                  <Trophy size={10} className="text-white" />
                </div>
                <span className="text-sm font-medium">Lets Fun PSC</span>
                  </Link>

                  {/* Logout Button */}
                  <div className="pt-2 mt-2 border-t border-zinc-700">
                    <button
                      onClick={() => {
                        handleLogout()
                        onClose()
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-all duration-200 group"
                    >
                      <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Auth Buttons */
              <div className="space-y-3 pt-4 border-t border-zinc-700">
                <Link
                  href="/user/login"
                  className="block w-full text-center py-3 text-gray-300 border border-zinc-700 rounded-lg font-medium hover:bg-zinc-800 hover:border-purple-500 hover:text-purple-400 transition-all duration-200"
                  onClick={onClose}
                >
                  Log in
                </Link>
                <Link
                  href="/user/signup"
                  className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
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

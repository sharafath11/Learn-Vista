"use client"

import React, { useCallback, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useMentorContext } from "@/src/context/mentorContext"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { showInfoToast } from "@/src/utils/Toast"
import { motion } from "framer-motion"
import Image from "next/image"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Star,
  User,
  LogOut,
  BookOpen,
  Menu,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", path: "/mentor/home", icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: "Upcoming", path: "/mentor/upcoming", icon: <Calendar className="w-4 h-4" /> },
  { name: "Courses", path: "/mentor/courses", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Sessions", path: "/sessions", icon: <MessageSquare className="w-4 h-4" /> },
  { name: "Reviews", path: "/reviews", icon: <Star className="w-4 h-4" /> },
]

export default function Header() {
  const { mentor, setMentor } = useMentorContext()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = useCallback(async () => {
    try {
      const res = await MentorAPIMethods.logout()
      if (res.ok) {
        showInfoToast(res.msg)
        setMentor(null)
        router.push("/mentor/login")
      }
    } catch {
      showInfoToast("Logout failed. Please try again.")
    }
  }, [setMentor, router])

  return (
    <header className="bg-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Mentor Portal
          <Image src="/images/logo.png" alt="Logo" width={30} height={30} priority />
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === path
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              {icon}
              {name}
            </Link>
          ))}

          {/* Avatar Dropdown */}
          {mentor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="ml-3 cursor-pointer border border-gray-700 hover:border-emerald-500">
                  <AvatarImage src={mentor.profilePicture || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>{mentor.username?.[0] ?? "M"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-gray-800 text-white border-none">
                <DropdownMenuLabel className="text-white">
                  <p className="text-sm font-semibold truncate">{mentor.username}</p>
                  <p className="text-xs text-gray-400 truncate">{mentor.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild>
                  <Link href="/mentor/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-rose-400 hover:text-white hover:bg-rose-600/80"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 text-white w-64 border-l border-gray-800">
              <div className="space-y-4 mt-6">
                {mentor && (
                  <div className="flex items-center gap-3 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mentor.profilePicture || "/placeholder.svg?height=40&width=40"} />
                      <AvatarFallback>{mentor.username?.[0] ?? "M"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{mentor.username}</p>
                      <p className="text-xs text-gray-400">{mentor.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {navItems.map(({ name, path, icon }) => (
                    <Link
                      key={path}
                      href={path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                        pathname === path
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      {icon}
                      {name}
                    </Link>
                  ))}
                  {mentor && (
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex justify-start gap-2 text-rose-400 hover:text-white hover:bg-rose-600/80 w-full px-4 py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

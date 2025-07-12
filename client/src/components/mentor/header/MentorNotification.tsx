"use client"

import { useCallback } from "react"

import { useState, type JSX } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useMentorContext } from "@/src/context/mentorContext"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { showInfoToast } from "@/src/utils/Toast"
import { motion } from "framer-motion"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Star, User, LogOut, BookOpen, Menu, Bell } from "lucide-react" // Added Bell icon
import { Badge } from "@/components/ui/badge" // Added Badge import
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Added Popover imports
import { NotificationCenter } from "../../notifications/notification-center"

interface NavItem {
  name: string
  path: string
  icon: JSX.Element
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/mentor/home", icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: "Upcoming", path: "/mentor/upcoming", icon: <Calendar className="w-4 h-4" /> },
  { name: "Courses", path: "/mentor/courses", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Reviews", path: "/mentor/reviews", icon: <Star className="w-4 h-4" /> },
]

export default function MentorNotification() {
  const {
    mentor,
    setMentor,
    mentorNotification, // Assuming this is available from context
    setMentorNotifications, // Assuming this is available from context
    mentorUnreadNotification,
    setMentorUnreadNotification,
    refreshMentorNotification, // Assuming this is available from context
  } = useMentorContext()
  const router = useRouter()
  const pathname = usePathname()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false) // State for notification popover

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
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <motion.div
          className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Mentor Portal
          <Image src="/images/logo.png" alt="Logo" width={30} height={30} priority />
        </motion.div>
        <div className="hidden md:flex items-center gap-2">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === path
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {icon}
              {name}
            </Link>
          ))}
          {/* Notification Component */}
          {mentor && (
            <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
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
                <NotificationCenter
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={mentorNotification}
                  setNotifications={setMentorNotifications}
                  unreadCount={mentorUnreadNotification}
                  setUnreadCount={setMentorUnreadNotification}
                  onRefresh={refreshMentorNotification}
                />
              </PopoverContent>
            </Popover>
          )}
          {mentor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="ml-3 cursor-pointer border border-gray-300 hover:border-emerald-500">
                  <AvatarImage src={mentor.profilePicture || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>{mentor.username?.[0] ?? "M"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white text-gray-900 border border-gray-200 shadow-lg">
                <DropdownMenuLabel className="text-gray-900">
                  <p className="text-sm font-semibold truncate">{mentor.username}</p>
                  <p className="text-xs text-gray-500 truncate">{mentor.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem asChild>
                  <Link href="/mentor/profile" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-rose-600 hover:text-white hover:bg-rose-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {/* Mobile Notification Component */}
            {mentor && (
              <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
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
                  <NotificationCenter
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={mentorNotification}
                    setNotifications={setMentorNotifications}
                    unreadCount={mentorUnreadNotification}
                    setUnreadCount={setMentorUnreadNotification}
                    onRefresh={refreshMentorNotification}
                    isMobile={true} // Indicate mobile view
                  />
                </PopoverContent>
              </Popover>
            )}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white text-gray-900 w-64 border-l border-gray-200">
                <div className="space-y-4 mt-6">
                  {mentor && (
                    <div className="flex items-center gap-3 px-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mentor.profilePicture || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>{mentor.username?.[0] ?? "M"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{mentor.username}</p>
                        <p className="text-xs text-gray-500">{mentor.email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    {navItems.map(({ name, path, icon }) => (
                      <Link
                        key={path}
                        href={path}
                        onClick={() => setIsSheetOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition ${
                          pathname === path
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {icon}
                        {name}
                      </Link>
                    ))}
                    {mentor && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout()
                          setIsSheetOpen(false)
                        }}
                        className="flex justify-start gap-2 text-rose-600 hover:text-white hover:bg-rose-500 w-full px-4 py-2"
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
      </div>
    </header>
  )
}

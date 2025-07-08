
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Search, Menu, X, Home, BookOpen, Video, Heart, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useUserContext } from "@/src/context/userAuthContext"
import { UserAPIMethods } from "@/src/services/APImethods"
import { cn } from "@/src/utils/cn"
import { showErrorToast } from "@/src/utils/Toast"
import { NotificationCenter } from "./notification-center"
import { UserDropdown } from "./user-dropdown"
import { MobileMenu } from "./mobile-menu"


interface NavItem {
  name: string
  path: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/user/courses", icon: BookOpen },
  { name: "Live Classes", path: "/user/live-classes", icon: Video },
  { name: "Donation", path: "/user/donation", icon: Heart },
]

const Header = () => {
  const { user, setUser } = useUserContext()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("/")
  const{unreadCount,setUnreadCount}=useUserContext()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false })
      const res = await UserAPIMethods.logout()
      if (res.ok) {
        setUser(null)
        router.push("/user/login")
      }
    } catch (error: any) {
      showErrorToast(error.message)
    }
  }, [router, setUser])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false)
      setIsNotificationOpen(false)
    }

    if (isDropdownOpen || isNotificationOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => document.removeEventListener("click", handleClickOutside)
  }, [isDropdownOpen, isNotificationOpen])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-zinc-900/95 backdrop-blur-md shadow-lg border-b border-zinc-800" : "bg-zinc-900",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group" onClick={() => setActiveLink("/")}>
              <div className="relative w-8 h-8 overflow-hidden rounded-lg">
                <Image
                  src="/images/logo.png"
                  alt="Learn Vista"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Learn Vista
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setActiveLink(path)}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    activeLink === path
                      ? "text-purple-400 bg-purple-900/20"
                      : "text-gray-300 hover:text-purple-400 hover:bg-zinc-800",
                  )}
                >
                  <Icon size={16} />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 w-64 bg-zinc-800 border border-zinc-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-gray-400"
                />
              </div>

              {user ? (
                <div className="flex items-center space-x-2">
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsNotificationOpen(!isNotificationOpen)
                        setIsDropdownOpen(false)
                      }}
                      className="relative p-2 text-gray-400 hover:text-purple-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    <NotificationCenter
                      isOpen={isNotificationOpen}
                      onClose={() => setIsNotificationOpen(false)}
                      unreadCount={unreadCount}
                      setUnreadCount={setUnreadCount}
                    />
                  </div>

                  {/* User Dropdown */}
                  <UserDropdown
                    user={user}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    handleLogout={handleLogout}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/user/login"
                    className="text-gray-300 hover:text-purple-400 font-medium px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/user/signup"
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-purple-400 hover:bg-zinc-800 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeLink={activeLink}
        user={user}
        handleLogout={handleLogout}
        setActiveLink={setActiveLink}
        navItems={NAV_ITEMS}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
      />

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

export default Header

"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Menu, X, Home, BookOpen, Video, Heart, Bell } from "lucide-react" // Added LogOut icon
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useUserContext } from "@/src/context/userAuthContext" // Assuming this path is correct
import { UserAPIMethods } from "@/src/services/APImethods" // Assuming this path is correct
import { cn } from "@/src/utils/cn" // Assuming this path is correct
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast" // Assuming this path is correct
import { UserDropdown } from "./user-dropdown" // Assuming this path is correct
import { MobileMenu } from "./mobile-menu" // Assuming this path is correct
import { NotificationCenter } from "../../notifications/notification-center"
import { CustomAlertDialog } from "../../custom-alert-dialog"

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

export const Header = () => {
  const { user, setUser } = useUserContext()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isMobileNotificationOpen, setIsMobileNotificationOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("/")
  const { unreadCount, setUnreadCount, userNotifications, setUserNotifications, refereshNotifcation } = useUserContext()
  const router = useRouter()

  // New state for logout confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Function to handle the actual logout process
  const confirmLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false })
      const res = await UserAPIMethods.logout()
      if (res.ok) {
        setUser(null)
        showSuccessToast("Logged out successfully!") // Added success toast for logout
        router.push("/user/login")
      } else {
        showErrorToast(res.msg || "Logout failed. Please try again.")
      }
    } catch (error: any) {
      showErrorToast(error.message || "An unexpected error occurred during logout.")
    } finally {
      setShowLogoutConfirm(false) // Close the dialog regardless of success/failure
    }
  }, [router, setUser])

  // Modified handleLogout to just open the confirmation dialog
  const handleLogout = useCallback(() => {
    setShowLogoutConfirm(true)
    setIsDropdownOpen(false) // Close dropdown when dialog opens
    setIsMobileMenuOpen(false) // Close mobile menu when dialog opens
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the dropdown and notification popovers
      const target = event.target as HTMLElement

      // Check if the click is outside the dropdown trigger and content
      const dropdownTrigger = document.getElementById("user-dropdown-trigger") // Add ID to DropdownMenuTrigger
      const dropdownContent = document.querySelector('[data-radix-popper-content][data-side="bottom"]') // Selector for DropdownMenuContent

      if (
        dropdownTrigger &&
        !dropdownTrigger.contains(target) &&
        dropdownContent &&
        !dropdownContent.contains(target)
      ) {
        setIsDropdownOpen(false)
      }

      // Check if the click is outside the notification trigger and content
      const notificationTrigger = document.getElementById("notification-trigger") // Add ID to Bell button
      const notificationContent = document.querySelector('[data-radix-popper-content][data-side="end"]') // Selector for PopoverContent

      if (
        notificationTrigger &&
        !notificationTrigger.contains(target) &&
        notificationContent &&
        !notificationContent.contains(target)
      ) {
        setIsNotificationOpen(false)
        setIsMobileNotificationOpen(false)
      }
    }

    if (isDropdownOpen || isNotificationOpen || isMobileNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen, isNotificationOpen, isMobileNotificationOpen])

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
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image
                  src="/images/logo.png" 
                  alt="Learn Vista"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                Learn Vista
              </span>
            </Link>
            <nav className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setActiveLink(path)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    activeLink === path
                      ? "bg-purple-900/20 text-purple-400"
                      : "text-gray-300 hover:bg-zinc-800 hover:text-purple-400",
                  )}
                >
                  <Icon size={16} />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      id="notification-trigger" 
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsNotificationOpen(!isNotificationOpen)
                        setIsDropdownOpen(false)
                        refereshNotifcation()
                      }}
                      className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-purple-400"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    {isNotificationOpen && (
                      <NotificationCenter
                        isOpen={isNotificationOpen}
                        onClose={() => setIsNotificationOpen(false)}
                        unreadCount={unreadCount}
                        setUnreadCount={setUnreadCount}
                        setNotifications={setUserNotifications}
                        notifications={userNotifications}
                        onRefresh={refereshNotifcation}
                        variant="dark"
                      />
                    )}
                  </div>
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
                    className="rounded-lg px-4 py-2 font-medium text-gray-300 transition-colors hover:bg-zinc-800 hover:text-purple-400"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/user/signup"
                    className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:from-purple-700 hover:to-purple-600"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 md:hidden">
              {user && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMobileNotificationOpen(!isMobileNotificationOpen)
                      setIsMobileMenuOpen(false)
                    }}
                    className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-purple-400"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-zinc-800 hover:text-purple-400"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {user && isMobileNotificationOpen && (
          <div className="absolute left-0 right-0 top-full z-40 md:hidden">
            <NotificationCenter
              isOpen={isMobileNotificationOpen}
              onClose={() => setIsMobileNotificationOpen(false)}
              unreadCount={unreadCount}
              setUnreadCount={setUnreadCount}
              isMobile={true}
              notifications={userNotifications}
              setNotifications={setUserNotifications}
              onRefresh={refereshNotifcation}
              variant="dark"
            />
          </div>
        )}
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeLink={activeLink}
        user={user}
        handleLogout={handleLogout} 
        setActiveLink={setActiveLink}
        navItems={NAV_ITEMS}
      />
      <CustomAlertDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)} 
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to sign in again to access your account."
        confirmText="Log Out"
        cancelText="Stay Logged In"
        onConfirm={confirmLogout} 
        onCancel={() => setShowLogoutConfirm(false)} 
        icon="👋"
        variant="info" 
      />
      <div className="h-16" />
    </>
  )
}

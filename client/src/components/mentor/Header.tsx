"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useCallback, useState, memo, useEffect, useRef } from "react"
import { useMentorContext } from "@/src/context/mentorContext"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { showInfoToast } from "@/src/utils/Toast"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Star, 
  User, 
  LogOut,
  BookOpen,
  ChevronDown,
  Menu,
  X
} from "lucide-react"

interface NavItemType {
  name: string
  path: string
  icon?: React.ReactNode
}

interface NavItemProps {
  item: NavItemType
  currentPath: string
  onClick?: () => void
  mobile?: boolean
}

const NavItem = memo(({ item, currentPath, onClick, mobile = false }: NavItemProps) => (
  <Link
    href={item.path}
    className={`
      ${mobile ? "flex w-full items-center py-3 px-4" : "flex items-center px-4 py-2"} 
      rounded-lg font-medium transition-all duration-200 ease-in-out
      ${
        currentPath === item.path
          ? "bg-emerald-500/10 text-emerald-500 font-semibold"
          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
      }
    `}
    onClick={onClick}
    aria-current={currentPath === item.path ? "page" : undefined}
  >
    {item.icon && <span className="mr-2">{item.icon}</span>}
    <span className={mobile ? "text-base" : "text-sm"}>{item.name}</span>
  </Link>
))

NavItem.displayName = "NavItem"

interface LogoutButtonProps {
  mobile?: boolean
  onClick: () => void
}

const LogoutButton = memo(({ mobile = false, onClick }: LogoutButtonProps) => (
  <button
    onClick={onClick}
    className={`
      ${mobile ? "flex w-full items-center py-3 px-4" : "flex items-center px-4 py-2"} 
      rounded-lg font-medium transition-all duration-200 ease-in-out
      text-rose-400 hover:text-white hover:bg-rose-600/80
    `}
    aria-label="Logout"
  >
    <LogOut className="h-4 w-4 mr-2" />
    <span className={mobile ? "text-base" : "text-sm"}>Logout</span>
  </button>
))

LogoutButton.displayName = "LogoutButton"

const Header = () => {
  const router = useRouter()
  const currentPath = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { mentor, setMentor } = useMentorContext()
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const navItems: NavItemType[] = [
    {
      name: "Dashboard",
      path: "/mentor/home",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      name: "Upcoming",
      path: "/mentor/upcoming",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      name: "Courses",
      path: "/mentor/courses",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      name: "Sessions",
      path: "/sessions",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      name: "Reviews",
      path: "/reviews",
      icon: <Star className="h-4 w-4" />,
    },
    {
      name: "Profile",
      path: "/mentor/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const handleLogout = useCallback(async () => {
    try {
      const res = await MentorAPIMethods.logout()
      if (res.ok) {
        showInfoToast(res.msg)
        router.push("/mentor/login")
        setMentor(null)
      }
    } catch (error) {
      console.error("Logout failed:", error)
      showInfoToast("Logout failed. Please try again.")
    }
  }, [router, setMentor])

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const toggleProfileDropdown = useCallback(() => {
    setProfileDropdownOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentPath])

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <motion.h1
              className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Mentor Portal
              <Image
                src="/images/logo.png"
                alt="Learn Vista"
                width={30}
                height={30}
                priority
              />
            </motion.h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems
              .filter((item) => item.name !== "Profile")
              .map((item) => (
                <NavItem key={item.path} item={item} currentPath={currentPath ?? ""} />
              ))}

            {mentor && (
              <div className="relative ml-2" ref={profileDropdownRef}>
                <button
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  onClick={toggleProfileDropdown}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Profile menu"
                >
                  <img
                    src={mentor.profilePicture || "/placeholder.svg?height=40&width=40"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white truncate">{mentor.username}</p>
                        <p className="text-xs text-gray-400 truncate">{mentor.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/mentor/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-rose-400 hover:bg-rose-600/20 hover:text-rose-300 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-1"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-3 space-y-1">
                {mentor && (
                  <div className="px-4 py-2 flex items-center space-x-3">
                    <img
                      src={mentor.profilePicture || "/placeholder.svg?height=40&width=40"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{mentor.username}</p>
                      <p className="text-xs text-gray-400">{mentor.email}</p>
                    </div>
                  </div>
                )}

                {navItems.map((item) => (
                  <NavItem key={item.path} item={item} currentPath={currentPath ?? ""} mobile onClick={closeMenu} />
                ))}

                {mentor && (
                  <LogoutButton
                    mobile
                    onClick={() => {
                      closeMenu()
                      handleLogout()
                    }}
                  />
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default memo(Header)
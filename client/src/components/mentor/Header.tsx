"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useCallback, useState, memo, useEffect, useRef, createContext, useContext } from "react"

// Create a simplified mentor context to avoid import errors
interface Mentor {
  name: string
  email: string
  profilePicture?: string
}

interface MentorContextType {
  mentor: Mentor | null
  setMentor: (mentor: Mentor | null) => void
}

// Create a default context
const MentorContext = createContext<MentorContextType>({
  mentor: null,
  setMentor: () => {},
})

// Custom hook to use the mentor context
const useMentorContext = () => useContext(MentorContext)

// Mock API method for logout
const MentorAPIMethods = {
  logout: async () => {
    // Simulate API call
    return { ok: true, msg: "Logged out successfully" }
  },
}

// Mock toast function
const showInfoToast = (message: string) => {
  console.log(message)
  // You can replace this with your actual toast implementation
}

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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
    <span className={mobile ? "text-base" : "text-sm"}>Logout</span>
  </button>
))

LogoutButton.displayName = "LogoutButton"

// Sample mentor data for demonstration
const DEMO_MENTOR: Mentor = {
  name: "John Doe",
  email: "john.doe@example.com",
  profilePicture: "/placeholder.svg?height=40&width=40",
}

const Header = () => {
  const router = useRouter()
  const currentPath = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Use a local state for mentor if context is not available
  const [localMentor, setLocalMentor] = useState<Mentor | null>(DEMO_MENTOR)

  // Try to use the context, but fall back to local state
  const mentorContextValue = useMentorContext()
  const mentor = mentorContextValue.mentor || localMentor
  const setMentor = mentorContextValue.setMentor || setLocalMentor

  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const navItems: NavItemType[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      name: "Schedule",
      path: "/schedule",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      name: "Sessions",
      path: "/sessions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      name: "Reviews",
      path: "/reviews",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
    },
    {
      name: "Profile",
      path: "/mentor/profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ]

  const handleLogout = useCallback(async () => {
    try {
      // Try to use the API method if available, otherwise just simulate logout
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

  // Close dropdown when clicking outside
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentPath])

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <motion.h1
              className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Mentor Portal
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
                        <p className="text-sm font-medium text-white truncate">{mentor.name}</p>
                        <p className="text-xs text-gray-400 truncate">{mentor.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/mentor/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-rose-400 hover:bg-rose-600/20 hover:text-rose-300 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
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
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
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
              {mentor ? (
  <div className="relative" ref={profileDropdownRef}>
    <button
      onClick={() => setProfileDropdownOpen((prev) => !prev)}
      className="flex items-center space-x-2 focus:outline-none"
    >
      <img
        src={mentor.profilePicture || "/placeholder.svg"}
        alt="Profile"
        className="w-8 h-8 rounded-full"
      />
      <span className="text-sm text-white">{mentor.name}</span>
    </button>

    <AnimatePresence>
      {profileDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
        >
          <LogoutButton
            onClick={async () => {
              await MentorAPIMethods.logout()
              showInfoToast("Logged out")
              setMentor(null)
              router.push("/login")
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
) : (
  <Link
    href="/login"
    className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
  >
    Login
  </Link>
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

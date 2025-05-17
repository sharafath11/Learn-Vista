"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Search, Menu, X, ChevronDown, Home, BookOpen, Video, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useUserContext } from "@/src/context/userAuthContext"
import { UserAPIMethods } from "@/src/services/APImethods"
import { cn } from "@/src/utils/cn"
import { showErrorToast } from "@/src/utils/Toast"

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/user/courses", icon: BookOpen },
  { name: "Live Classes", path: "/user/live-classes", icon: Video },
  { name: "Community", path: "/community", icon: Users },
] as const

const UserDropdown = ({
  user,
  isDropdownOpen,
  setIsDropdownOpen,
  handleLogout
}: {
  user: any,
  isDropdownOpen: boolean,
  setIsDropdownOpen: (value: boolean) => void,
  handleLogout: () => void
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 focus:outline-none group"
        aria-label="User menu"
      >
        <div className="relative overflow-hidden rounded-full">
          <Image
            src={user?.profilePicture || "/images/ai.png"}
            alt="User profile"
            width={40}
            height={40}
            className="rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-500 transition-all duration-300 transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        </div>
        <ChevronDown
          size={16}
          className={cn("text-gray-500 transition-transform duration-300", isDropdownOpen ? "rotate-180" : "")}
        />
      </button>

      <AnimatePresence mode="sync">
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md shadow-lg py-2 border border-gray-100 rounded-xl z-50 overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.username || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
            </div>

            <Link
              href="/user/profile"
              className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-purple-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <span className="text-sm">Profile</span>
            </Link>

            <Link
              href="/user/LV CODE"
              className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-purple-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <span className="text-sm">LV CODE</span>
            </Link>

            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="flex w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MobileMenu = ({
  isOpen,
  onClose,
  activeLink,
  user,
  handleLogout,
  setActiveLink
}: {
  isOpen: boolean,
  onClose: () => void,
  activeLink: string,
  user: any,
  handleLogout: () => void,
  setActiveLink: (path: string) => void
}) => {
  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 border-b border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <nav className="flex flex-col space-y-1 mb-4">
              {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => {
                    setActiveLink(path)
                    onClose()
                  }}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeLink === path ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon size={18} className="mr-3" />
                  {name}
                </Link>
              ))}
            </nav>

            {!user && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                <Link
                  href="/user/login"
                  className="w-full text-center py-2.5 text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  Log in
                </Link>
                <Link
                  href="/user/signup"
                  className="w-full text-center py-2.5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-lg font-medium hover:from-purple-800 hover:to-purple-600 transition-colors"
                  onClick={onClose}
                >
                  Sign up
                </Link>
              </div>
            )}

            {user && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center p-3 mb-2">
                  <Image
                    src={user.profilePicture || "/images/ai.png"}
                    alt="User profile"
                    width={40}
                    height={40}
                    className="rounded-full mr-3 border-2 border-purple-200"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user.username || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
                  </div>
                </div>

                <Link
                  href="/user/profile"
                  className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  Profile
                </Link>

                <Link
                  href="/user/dashboard"
                  className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    handleLogout()
                    onClose()
                  }}
                  className="w-full text-left px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Header = () => {
  const { user, setUser } = useUserContext()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("/")
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  return (
    <>
      {/* Desktop Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-white py-3",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center group" onClick={() => setActiveLink("/")}>
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <Image
                  src="/images/logo.png"
                  alt="Learn Vista"
                  fill
                  className="object-contain transform group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                Learn Vista
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setActiveLink(path)}
                  className={cn(
                    "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                    activeLink === path ? "text-purple-700" : "text-gray-600 hover:text-purple-600 hover:bg-purple-50",
                  )}
                >
                  <Icon size={16} />
                  <span>{name}</span>
                  {activeLink === path && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-700 to-purple-500 rounded-full"
                      initial={false}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Search and User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 w-56 lg:w-64 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 group-hover:bg-gray-100"
                />
              </div>

              {/* User Profile or Login */}
              {user ? (
                <UserDropdown 
                  user={user} 
                  isDropdownOpen={isDropdownOpen} 
                  setIsDropdownOpen={setIsDropdownOpen} 
                  handleLogout={handleLogout} 
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/user/login"
                    className="text-gray-700 hover:text-purple-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/user/signup"
                    className="bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
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
      />

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-16 md:h-16" />
    </>
  )
}

export default Header
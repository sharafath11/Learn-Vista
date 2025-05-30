"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Menu, X, ChevronDown, Home, BookOpen, Video, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useUserContext } from "@/src/context/userAuthContext";
import { UserAPIMethods } from "@/src/services/APImethods";
import { cn } from "@/src/utils/cn";
import { showErrorToast } from "@/src/utils/Toast";
import { IUser } from "@/src/types/userTypes";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/user/courses", icon: BookOpen },
  { name: "Live Classes", path: "/user/live-classes", icon: Video },
  { name: "Community", path: "/community", icon: Users },
];

interface UserDropdownProps {
  user: IUser | null;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  handleLogout: () => void;
}

const UserDropdown = ({ user, isDropdownOpen, setIsDropdownOpen, handleLogout }: UserDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, setIsDropdownOpen]);

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
            className="rounded-full object-cover border-2 border-purple-400 group-hover:border-purple-600 transition-all duration-300 transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        </div>
        <ChevronDown
          size={16}
          className={cn("text-gray-400 transition-transform duration-300", isDropdownOpen ? "rotate-180" : "")}
        />
      </button>

      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-md shadow-lg py-2 border border-gray-700 rounded-xl z-50 overflow-hidden"
        >
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-medium text-white">{user?.username || "User"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
          </div>

          <Link
            href="/user/profile"
            className="flex items-center px-4 py-2.5 text-gray-200 hover:bg-purple-900/30 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <span className="text-sm">Profile</span>
          </Link>

          <Link
            href="/user/lv-code"
            className="flex items-center px-4 py-2.5 text-gray-200 hover:bg-purple-900/30 transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <span className="text-sm">LV CODE</span>
          </Link>

          <div className="border-t border-gray-700 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="flex w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-900/30 transition-colors"
            >
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeLink: string;
  user: IUser | null;
  handleLogout: () => void;
  setActiveLink: (path: string) => void;
}

const MobileMenu = ({ isOpen, onClose, activeLink, user, handleLogout, setActiveLink }: MobileMenuProps) => {
  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden fixed top-16 left-0 right-0 bg-gray-900 z-40 border-b border-gray-700 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-600 text-white"
            />
          </div>

          <nav className="flex flex-col space-y-1 mb-4">
            {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
              <Link
                key={name}
                href={path}
                onClick={() => {
                  setActiveLink(path);
                  onClose();
                }}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  activeLink === path ? "bg-purple-900/50 text-purple-400" : "text-gray-300 hover:bg-gray-800",
                )}
              >
                <Icon size={18} className="mr-3" />
                {name}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
              <Link
                href="/user/login"
                className="w-full text-center py-2.5 text-gray-300 border border-gray-700 rounded-lg font-medium hover:bg-gray-800 transition-colors"
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
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center p-3 mb-2">
                <Image
                  src={user.profilePicture || "/images/ai.png"}
                  alt="User profile"
                  width={40}
                  height={40}
                  className="rounded-full mr-3 border-2 border-purple-400"
                />
                <div>
                  <p className="font-medium text-white">{user.username || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
                </div>
              </div>

              <Link
                href="/user/profile"
                className="flex items-center px-3 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                Profile
              </Link>

              <Link
                href="/user/dashboard"
                className="flex items-center px-3 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                className="w-full text-left px-3 py-2.5 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors mt-1"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </motion.div>
    )
  );
};

const Header = () => {
  const { user, setUser } = useUserContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      const res = await UserAPIMethods.logout();
      if (res.ok) {
        setUser(null);
        router.push("/user/login");
      }
    } catch (error: any) {
      showErrorToast(error.message);
    }
  }, [router, setUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-zinc-900/90 backdrop-blur-md shadow-lg py-2" : "bg-zinc-900 py-3",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
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
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                Learn Vista
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setActiveLink(path)}
                  className={cn(
                    "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                    activeLink === path ? "text-purple-400" : "text-gray-300 hover:text-purple-400 hover:bg-zinc-800",
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

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 w-56 lg:w-64 bg-zinc-800 border border-zinc-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-600 transition-all duration-200 group-hover:bg-zinc-700 text-white"
                />
              </div>

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
                    className="text-gray-300 hover:text-purple-400 font-medium px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
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
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeLink={activeLink}
        user={user}
        handleLogout={handleLogout}
        setActiveLink={setActiveLink}
      />
      <div className="h-16 md:h-16" />
    </>
  );
};

export default Header;

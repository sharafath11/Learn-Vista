"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useUserContext } from "@/src/context/userAuthContext";
import { useRouter } from "next/navigation";
import { postRequest } from "@/src/services/api";
import { showErrorToast } from "@/src/utils/Toast";
import MobileHeader from "./MobileView/MobileHeader";
import { signOut } from "next-auth/react";

const Header = () => {
  const { user, setUser } = useUserContext();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Live Classes", path: "/live-classes" },
    { name: "Community", path: "/community" }
  ];



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async() => {
    try {
      await signOut({ redirect: false });
    const res = await postRequest("/logout", {});
    if (res.ok) {
      router.push("/user/login");
      window.location.reload()
    }
  } catch (error:any) {
    showErrorToast(error.message)
  }
  };

  return (
    <>
      <div className="md:hidden">
        <MobileHeader user={user}  handleLogout={handleLogout} />
      </div>

      <header className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm py-3 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Learn Vista" 
              width={50} 
              height={50} 
              priority
            />
            <span className="ml-2 text-xl font-bold text-purple-900">Learn Vista</span>
          </Link>

          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                className="text-gray-700 hover:text-purple-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600">
                <Search size={18} />
              </button>
            </div>

            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center focus:outline-none"
                    aria-label="User menu"
                  >
                    <Image
                      src={user?.profilePicture || "/images/ai.png"}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-purple-200 hover:border-purple-400 transition-colors"
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg py-1 border rounded-lg z-50">
                      <Link
                        href="/user/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href="/user/login" 
                  className="text-purple-600 hover:text-purple-800 font-medium px-4 py-2 rounded-md hover:bg-purple-50 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search} from "lucide-react";
import MobileHeader from "./MobileView/MobileHeader";
import Link from "next/link";
import Image from "next/image";


const Header = () => {
  const [token, setToken] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navItems = ["Home", "Courses", "Live Classes", "Community"];
  const dropdownItems = [
    { label: "Dashboard", href: "#" },
    { label: "Settings", href: "#" },
    { label: "Logout", href: "#" },
  ];
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      console.log("token", localStorage.getItem("token"));
    }
  }, []);


  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm py-3 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
          <div className="flex items-center">
         <Image src="/images/logo.png" alt="Learn Vista" width={50} height={50}/>
           <span className="ml-2 text-xl font-bold text-purple-900">Learn Vista</span>
          </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <a key={item} href="#" className="text-gray-700 hover:text-purple-600">
                {item}
              </a>
            ))}
          </nav>

          {/* Search & User Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 py-1.5 border border-gray-300 rounded-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
                <img src="/images/ai.png" alt="User" className="w-8 h-8 rounded-full border-2 border-purple-200" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg py-1 border rounded-lg">
                  {dropdownItems.map((item) => (
                    <a key={item.label} href={item.href} className="block px-4 py-2 text-gray-700 hover:bg-purple-50">
                      {item.label}
                    </a>
                  ))}
                </div>
              )} */}
              <Link href="/user/login">Login</Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

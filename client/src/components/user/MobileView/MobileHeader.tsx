"use client";

import React, { useState } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { IUser } from "@/src/types/authTypes";
import Link from "next/link";
import Image from "next/image";

interface MobileHeaderProps {
  user: IUser | null;
  handleLogout: () => void;
}

const NAV_ITEMS = ["Home", "Courses", "Live Classes", "Community"];

const MobileHeader = ({ user, handleLogout }: MobileHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "auto";
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleProfileClick = () => setIsDropdownOpen((prev) => !prev);

  const handleLogoutClick = () => {
    handleLogout();
    setIsDropdownOpen(false);
    toggleMobileMenu();
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-3 flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
        <span className="ml-2 text-lg font-bold text-purple-900">Learn Vista</span>
      </Link>

      <button onClick={toggleMobileMenu} className="text-gray-600">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold text-purple-900">Menu</span>
          <button onClick={toggleMobileMenu} className="text-gray-600">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              className="block text-gray-700 font-medium hover:bg-purple-50 p-2 rounded-lg"
              onClick={toggleMobileMenu}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg"
            />
            <button className="absolute right-3 top-2 text-gray-400">
              <Search size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 border-t">
          {user ? (
            <div className="flex items-center space-x-4">
              <button onClick={handleProfileClick} className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture
                        
                      }
                      alt="User"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User size={20} className="text-gray-500" />
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/user/profile"
                    className="text-gray-700 hover:text-purple-600"
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="text-left text-gray-700 hover:text-purple-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/user/login"
              className="block text-gray-700 hover:text-purple-600 p-2"
              onClick={toggleMobileMenu}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;

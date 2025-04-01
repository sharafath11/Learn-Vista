"use client";

import React, { useState } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { IUser } from "@/src/types/authTypes";
import Link from "next/link";

interface MobileHeaderProps {
  user: IUser | null;
  handleLogout: () => void;
}

const MobileHeader = ({ user, handleLogout }: MobileHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "auto" : "hidden";
  };

  const navItems = ["Home", "Courses", "Live Classes", "Community"];

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-3 flex justify-between items-center">
      <Link href="/">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="ml-2 text-lg font-bold text-purple-900">Learn Vista</span>
        </div>
      </Link>
      <button onClick={toggleMobileMenu} className="text-gray-600">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`fixed inset-0 bg-white z-40 transition-transform ${
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
          {navItems.map((item) => (
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
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.image ? (
                    <img src={user.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-gray-500" />
                  )}
                </div>
              </button>
              <div className="flex flex-col">
                {isDropdownOpen && (
                  <div className="space-y-2">
                    <Link 
                      href="/profile" 
                      className="block text-gray-700 hover:text-purple-600"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        toggleMobileMenu();
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                        toggleMobileMenu();
                      }}
                      className="block text-left text-gray-700 hover:text-purple-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
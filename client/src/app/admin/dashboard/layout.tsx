"use client";
import { useState } from "react";
import SideBar from "@/src/components/admin/SideBar";
import { FiBell, FiSearch, FiChevronDown, FiMenu } from "react-icons/fi";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200 relative">
              <FiBell />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                <span className="hidden md:inline">Admin</span>
                <FiChevronDown
                  className={`transition-transform ${
                    profileDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white border border-gray-200">
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Settings
                  </Link>
                  <button className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}

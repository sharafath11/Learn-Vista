"use client"
import { useState } from "react"
import type React from "react"

import SideBar from "@/src/components/admin/SideBar"
import { FiBell, FiChevronDown, FiMenu, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi"
import Link from "next/link"
import { postRequest } from "@/src/services/api"
import { useRouter } from "next/navigation"
import { NotificationListener } from "@/src/components/NotificationListener"
import AdminNotificationDropdown from "@/src/components/admin/AdminNotificationDropdown"

function NotificationWrapper() {
  return <NotificationListener userId={"admin11Sharafath"} role="admin" />
}
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Dashboard")
  const route = useRouter()
  async function handleLogout() {
    await postRequest("/admin/logout", {})
    route.push("/admin")
  }
  return (
    <>
      <NotificationWrapper />
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
        <SideBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <header className="flex items-center justify-between p-4 lg:px-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>

            {/* Logo/Title for larger screens */}
            <div className="hidden lg:flex items-center">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Enhanced Notification Dropdown */}
             <AdminNotificationDropdown />

              {/* Enhanced Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-100 p-2 sm:p-3 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                    A
                  </div>
                  <span className="hidden sm:inline font-medium text-gray-700 group-hover:text-gray-900">Admin</span>
                  <FiChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      profileDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white border border-gray-200/60 z-20 overflow-hidden">
                      <div className="p-2">
                        <Link
                          href="#"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Settings
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}

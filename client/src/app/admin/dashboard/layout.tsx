"use client"
import { useState } from "react"
import type React from "react"
import SideBar from "@/src/components/admin/SideBar"
import {FiChevronDown, FiMenu, FiLogOut } from "react-icons/fi"
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
      <div className="flex h-screen bg-gray-50 text-gray-800">
        <SideBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header with new theme */}
          <header className="flex items-center justify-between p-4 lg:px-6 border-b border-[#053c5c]/20 bg-gradient-to-r from-[#053c5c] to-[#053c5c] text-white shadow-md">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>

            {/* Logo/Title for larger screens */}
            <div className="hidden lg:flex items-center">
              <h1 className="text-xl font-bold  text-white bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Notification Dropdown */}
              <AdminNotificationDropdown />

              {/* Enhanced Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-white/10 p-2 rounded-lg transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <span className="hidden sm:inline font-medium text-white">Admin</span>
                  <FiChevronDown
                    className={`w-4 h-4 text-white transition-transform duration-200 ${
                      profileDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white border border-[#7a0244]/20 z-20 overflow-hidden">
                      <div className="p-2">
                        <hr className="my-2 border-[#7a0244]/10" />
                        <button
                          className="w-full flex items-center px-3 py-2 text-sm text-[#053c5c] hover:bg-[#7a0244]/10 rounded-md transition-colors"
                          onClick={handleLogout}
                        >
                          <FiLogOut className="mr-2" />
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
          <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gradient-to-b from-white to-gray-50/50">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
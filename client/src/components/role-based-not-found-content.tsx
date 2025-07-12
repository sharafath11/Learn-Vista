"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Frown, Shield, BookOpen, Users } from "lucide-react"
import Image from "next/image"

interface RoleBasedNotFoundContentProps {
  randomImageUrl: string
}

export default function RoleBasedNotFoundContent({ randomImageUrl }: RoleBasedNotFoundContentProps) {
  const [userRole, setUserRole] = useState<"admin" | "mentor" | "user" | "guest">("guest")
  const [isLoadingRole, setIsLoadingRole] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role && ["admin", "mentor", "user"].includes(role)) {
      setUserRole(role as "admin" | "mentor" | "user")
    }
    setIsLoadingRole(false)
  }, [])

  let title = "Page Not Found"
  let description = "Oops! The page you're looking for doesn't exist or has been moved."
  let icon = <Frown className="h-24 w-24 text-purple-400 mx-auto mb-6 animate-bounce-slow" />
  let homepageLink = "/"
  let buttonText = "Go to Homepage"

  if (!isLoadingRole) {
    switch (userRole) {
      case "admin":
        title = "Admin Page Not Found"
        description = "It seems you've ventured into an unknown administrative territory. Let's get you back to the control panel."
        icon = <Shield className="h-24 w-24 text-red-400 mx-auto mb-6 animate-bounce-slow" />
        homepageLink = "/admin/dashboard"
        buttonText = "Go to Admin Dashboard"
        break
      case "mentor":
        title = "Mentor Page Not Found"
        description = "This course material seems to be missing. Let's guide you back to your dashboard."
        icon = <BookOpen className="h-24 w-24 text-green-400 mx-auto mb-6 animate-bounce-slow" />
        homepageLink = "/mentor/home"
        buttonText = "Go to Home "
        break
      case "user":
        title = "Student Page Not Found"
        description = "The lesson you're looking for isn't here. Let's find your way back to your learning path."
        icon = <Users className="h-24 w-24 text-blue-400 mx-auto mb-6 animate-bounce-slow" />
        homepageLink = "/"
        buttonText = "Go to Home "
        break
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl max-w-md w-full relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src={randomImageUrl || "/placeholder.svg"}
          alt="Background image"
          fill
          className="rounded-2xl object-cover"
        />
      </div>
      <div className="relative z-10">
        {isLoadingRole ? (
          <div className="text-center py-12">
            <Frown className="h-24 w-24 text-purple-400 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
            <p className="text-lg text-slate-300">Determining your role.</p>
          </div>
        ) : (
          <>
            {icon}
            <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h2>
            <p className="text-lg text-slate-300 mb-8">{description}</p>
            <Link
              href={homepageLink}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              {buttonText}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

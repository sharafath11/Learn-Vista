"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { postRequest } from "@/src/services/api"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast } from "@/src/utils/Toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Entrance animation
  useEffect(() => {
    setAnimateIn(true)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const validateEmail = useCallback((email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrors({})
      if (!email.trim()) {
        setErrors({ email: "Email is required" })
        return
      }

      if (!validateEmail(email)) {
        setErrors({ email: "Please enter a valid email address" })
        return
      }
      setIsSubmitting(true)
      try {
        const res = await UserAPIMethods.forgotPassword(email);
        if (res.ok) {
          setIsSuccess(true);
          showSuccessToast(res.msg)
        }
        
      } catch (error) {
        setErrors({ email: "Something went wrong. Please try again." })
      } finally {
        setIsSubmitting(false)
      }
    },
    [email, validateEmail],
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <div
        className={`w-full max-w-md transform transition-all duration-700 ease-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div
              className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 mt-8 transform transition-all duration-500 ease-out"
              style={{ opacity: 1, transform: "scale(1)" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 mb-4">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Password reset email sent</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>We've sent a password reset link to:</p>
                  <p className="font-medium text-gray-900 mt-1">{email}</p>
                  <p className="mt-2">Please check your inbox and follow the instructions.</p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-violet-700 bg-violet-100 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Form */
            <form
              ref={formRef}
              className="mt-8 space-y-6"
              onSubmit={handleSubmit}
              style={{ opacity: 1, transform: "scale(1)" }}
            >
              <div className="space-y-2">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    ref={inputRef}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 placeholder-gray-400 focus:ring-violet-500 focus:border-violet-500"
                    } rounded-lg shadow-sm transition-all duration-200 ease-in-out focus:outline-none sm:text-sm`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 animate-[fadeIn_0.3s_ease-in-out]" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ) : (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-violet-300 group-hover:text-violet-200" aria-hidden="true" />
                    </span>
                  )}
                  {isSubmitting ? "Sending..." : "Reset password"}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors duration-200"
                >
                  <ArrowLeft className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-[-2px]" />
                  <span className="group">Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

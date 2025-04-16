"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { signIn, useSession } from "next-auth/react"

import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import { registrationValidation } from "@/src/utils/user/validation"
import type { ILogin, IUserRegistration } from "@/src/types/authTypes"
import { FormOTP } from "./FormOTP"
import { UserAPIMethods } from "@/src/services/APImethods"

export default function SignupForm() {
  const router = useRouter()
  const { data: session } = useSession()

  const [userData, setUserData] = useState<IUserRegistration>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isVerified: false,
    role: "user",
    otp: "",
  })
  const [loginData,setLoginData]=useState<ILogin>()

  const [otpVerified, setOtpVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [autoSubmit, setAutoSubmit] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.id]: e.target.value })
  }

  const handleOtpChange = (e: { target: { id: string; value: string } }) => {
    setUserData({ ...userData, [e.target.id]: e.target.value })
  }

  const handleOtpVerified = () => {
    setUserData({ ...userData, isVerified: true })
    setOtpVerified(true)
  }

  useEffect(() => {
    if (session?.user?.email && session?.user?.id && !userData.isVerified) {
      setLoginData({ email: session.user.email , googleId: session.user.id ,password:"" })
      setAutoSubmit(true)
    }
  }, [session])

  useEffect(() => {
    const autoLogin = async () => {
      if (autoSubmit) {
        const res = await UserAPIMethods.loginUser(loginData as ILogin)
        if (res.ok) {
          showSuccessToast(res.msg)
          router.push("/")
        }
      }
    }
    autoLogin()
  }, [autoSubmit, router, userData])

  const googleSignup = async () => {
    try {
      const res = await signIn("google", { callbackUrl: "/user" })
      if (res) {
        showSuccessToast("Login Success")
        router.push("/")
      }
    } catch (error) {
      console.error("Google signup error:", error)
      showErrorToast("Signup failed, please try again.")
    }
  }

  const handleSendOtp = async () => {
    if (userData?.email) {
      const res = await UserAPIMethods.sendOtp(userData.email)
      if (res && res.ok) {
        setOtpSent(true)
        showSuccessToast("OTP sent to your email")
      } else if (res && typeof res === "string" && res.includes("OTP already send it")) {
        setOtpSent(true)
      } else {
        showErrorToast("Failed to send OTP")
      }
    } else {
      showErrorToast("Email not found")
    }
  }

  const handleResendOtp = async () => {
    handleSendOtp()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!registrationValidation(userData)) return
    if (!otpVerified) {
      showSuccessToast("Please verify your OTP first")
      return
    }

    const res = await UserAPIMethods.signUp(userData)
    if (res?.ok) {
      showSuccessToast("Signup successful")
      router.push("/user/login")
    }
  }

  return (
    <div className="flex w-full max-w-6xl overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-4 lg:p-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-3 flex items-center">
            <Image src="/images/logo.png" alt="Learn Vista" width={80} height={12} />
            <span className="ml-2 text-lg font-bold text-purple-900">Learn Vista</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-gray-500 text-sm">Please enter your details</p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <FormInput label="Full Name" type="text" id="username" onChange={handleChange} />
            <FormInput label="Email Address" type="email" id="email" onChange={handleChange} />
            <FormInput label="Password" type="password" id="password" onChange={handleChange} />
            <FormInput label="Confirm Password" type="password" id="confirmPassword" onChange={handleChange} />

            {!otpSent ? (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full rounded-lg bg-purple-600 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <FormOTP
                label="Verification Code"
                onChange={handleOtpChange}
                onVerified={handleOtpVerified}
                onResend={handleResendOtp}
                email={userData.email}
              />
            )}

            <button
              type="submit"
              disabled={!otpVerified && otpSent}
              className="w-full rounded-lg bg-purple-600 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              Sign up
            </button>
          </form>

          <div className="relative mt-4 flex items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 flex-shrink bg-white text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <button
            onClick={googleSignup}
            type="button"
            className="mt-4 flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-1.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign up with Google
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/user/login" className="font-medium text-purple-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-purple-100 justify-center items-center">
        <Image src="/images/signup.png" alt="Signup Illustration" width={500} height={300} />
      </div>
    </div>
  )
}

function FormInput({
  label,
  type,
  id,
  onChange,
}: {
  label: string
  type: string
  id: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        required
      />
    </div>
  )
}

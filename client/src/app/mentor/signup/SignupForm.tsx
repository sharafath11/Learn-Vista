"use client"
import { postRequest } from "@/src/services/api"
import type React from "react"

import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import { registrationValidation } from "@/src/utils/validation"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FormOTP } from "./FormOTP"
import { MentorSignupData } from "@/src/types/mentorTypes"

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
    <div className="mb-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={type}
          id={id}
          name={id}
          onChange={onChange}
          className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
          required
        />
      </div>
    </div>
  )
}

export default function MentorSignupForm() {
  const [mentorData, setMentorData] = useState<MentorSignupData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    expertise: [],
    experience: 0,
    bio: "",
    isVerified: false,
    otp: "",
    phoneNumber:0,

  })
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement
    setMentorData({ 
      ...mentorData, 
      [name]: files ? files[0] : value 
    })
  }

  const handleOtpChange = (e: { target: { id: string; value: string } }) => {
    setMentorData({ ...mentorData, [e.target.id]: e.target.value })
  }

  const handleOtpVerified = () => {
    setMentorData({ ...mentorData, isVerified: true })
    setOtpVerified(true)
  }

  const handleSendOtp = async () => {
    if (mentorData?.email) {
      const res = await postRequest("/mentor/otp", { email: mentorData.email })
      if (res && res.ok) {
        setOtpSent(true)
        showSuccessToast("OTP sent to your email")
      }
    } else {
      showErrorToast("Email not found")
    }
  }

  const handleResendOtp = async () => {
    showSuccessToast("OTP resent to your email")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // if (!registrationValidation(mentorData)) return
    if (!otpVerified) {
      showSuccessToast("Please verify your OTP first")
      return
    }
    
    const res = await postRequest("/mentor/signup", mentorData);
    console.log(res)
    if (res?.ok) {
      showSuccessToast("Mentor registration successful")
      router.push("/mentor/login")
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

          <h1 className="text-xl font-bold text-gray-900">Join as a Mentor</h1>
          <p className="mt-1 text-gray-500 text-sm">Share your knowledge and guide learners</p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <FormInput label="Full Name" type="text" id="name" onChange={handleChange} />
            <FormInput label="Email Address" type="email" id="email" onChange={handleChange} />
            <FormInput label="Password" type="password" id="password" onChange={handleChange} />
            <FormInput label="Confirm Password" type="password" id="confirmPassword" onChange={handleChange} />

            <div className="mb-2">
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                Expertise
              </label>
              <select
                id="expertise"
                name="expertise"
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors mt-1"
                required
              >
                <option value="">Select your expertise</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="design">UI/UX Design</option>
                <option value="data">Data Science</option>
                <option value="product">Product Management</option>
              </select>
            </div>
            <FormInput 
              label="Years of Experience" 
              type="number" 
              id="experience" 
              onChange={handleChange} 
            />

            <div className="mb-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                onChange={handleChange}
                rows={3}
                className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors mt-1"
                placeholder="Tell us about your professional background..."
                required
              />
            </div>

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
                email={mentorData.email}
              />
            )}

            <button
              type="submit"
              disabled={!otpVerified && otpSent}
              className="w-full rounded-lg bg-purple-600 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              Register as Mentor
            </button>
          </form>

          <div className="relative mt-4 flex items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 flex-shrink bg-white text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-1.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign up with Google
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/mentor/login" className="font-medium text-purple-600 hover:underline">
              Mentor Login
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-purple-100 justify-center items-center">
        <Image 
          src="/images/mentor-signup.png" 
          alt="Mentor Signup Illustration" 
          width={500} 
          height={300} 
        />
      </div>
    </div>
  )
}
"use client"
import { postRequest } from "@/src/services/api"
import type React from "react"
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast"
import { registrationValidation } from "@/src/utils/user/validation"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FormOTP } from "./FormOTP"
import { MentorSignupData, SocialLink } from "@/src/types/mentorTypes"
import { validateMentorSignup } from "@/src/utils/mentor/mentorValidation"

function FormInput({
  label,
  type,
  id,
  onChange,
  value,
  placeholder,
  required = false
}: {
  label: string
  type: string
  id: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  placeholder?: string
  required?: boolean
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
          value={value}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
          required={required}
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
    phoneNumber: "",
    socialLinks: []
  })
  const [expertiseInput, setExpertiseInput] = useState("")
  const [socialLinkInput, setSocialLinkInput] = useState<Omit<SocialLink, 'url'> & { url: string }>({
    platform: "github",
    url: ""
  })
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMentorData({ 
      ...mentorData, 
      [name]: value 
    })
  }

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSocialLinkInput({
      ...socialLinkInput,
      [name]: name === 'platform' ? value as SocialLink['platform'] : value
    })
  }

  const handleAddSocialLink = () => {
    if (socialLinkInput.url.trim()) {
      const newLink: SocialLink = {
        platform: socialLinkInput.platform,
        url: socialLinkInput.url
      }
      setMentorData({
        ...mentorData,
        socialLinks: [...mentorData.socialLinks||[], newLink]
      })
      setSocialLinkInput({
        platform: "github",
        url: ""
      })
    }
  }

  const handleRemoveSocialLink = (index: number) => {
    const updatedLinks = [...mentorData.socialLinks||[]]
    updatedLinks.splice(index, 1)
    setMentorData({
      ...mentorData,
      socialLinks: updatedLinks
    })
  }

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpertiseInput(e.target.value)
  }

  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      const newExpertise = expertiseInput.split(',').map(item => item.trim()).filter(item => item)
      setMentorData({
        ...mentorData,
        expertise: [...mentorData.expertise||[], ...newExpertise]
      })
      setExpertiseInput("")
    }
  }

  const handleRemoveExpertise = (index: number) => {
    const updatedExpertise = [...mentorData.expertise||[]]
    updatedExpertise.splice(index, 1)
    setMentorData({
      ...mentorData,
      expertise: updatedExpertise
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
      setOtpSent(true)
      const res = await postRequest("/mentor/otp", { email: mentorData.email })
      if (res && res.ok) {
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
    
    const error = validateMentorSignup(mentorData);
    if (error) {
      showInfoToast(error);
      return;
    }
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
            <FormInput 
              label="Full Name" 
              type="text" 
              id="username" 
              onChange={handleChange} 
              value={mentorData.username}
              required
            />
            <FormInput 
              label="Email Address" 
              type="email" 
              id="email" 
              onChange={handleChange} 
              value={mentorData.email}
              required
            />
            <FormInput 
              label="Password" 
              type="password" 
              id="password" 
              onChange={handleChange} 
              value={mentorData.password}
              required
            />
            <FormInput 
              label="Confirm Password" 
              type="password" 
              id="confirmPassword" 
              onChange={handleChange} 
              value={mentorData.confirmPassword}
              required
            />
            <FormInput 
              label="Phone Number" 
              type="tel" 
              id="phoneNumber" 
              onChange={handleChange} 
              value={mentorData.phoneNumber}
              placeholder="+1234567890"
              required
            />

            <div className="mb-2">
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                Expertise (Add comma-separated skills)
              </label>
              <div className="flex mt-1">
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={expertiseInput}
                  onChange={handleExpertiseChange}
                  className="block w-full rounded-l-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                  placeholder="e.g. React, Node.js, UI/UX"
                />
                <button
                  type="button"
                  onClick={handleAddExpertise}
                  className="rounded-r-lg bg-purple-600 px-3 text-white hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {mentorData.expertise&&mentorData?.expertise.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentorData?.expertise.map((skill, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(index)}
                        className="ml-1 text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormInput 
              label="Years of Experience" 
              type="number" 
              id="experience" 
              onChange={handleChange} 
              value={mentorData.expertise && mentorData.experience ? mentorData.experience.toString() : ""}
              required
            />

            <div className="mb-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                onChange={handleChange}
                value={mentorData?.bio||""}
                rows={3}
                className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors mt-1"
                placeholder="Tell us about your professional background..."
                required
              />
            </div>

            {/* Social Links Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Social Links (Optional)</h3>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="socialPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    id="socialPlatform"
                    name="platform"
                    value={socialLinkInput.platform}
                    onChange={handleSocialLinkChange}
                    className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                  >
                    <option value="github">GitHub</option>
                    <option value="twitter">Twitter</option>
                    <option value="website">Website</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="socialUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    id="socialUrl"
                    name="url"
                    value={socialLinkInput.url}
                    onChange={handleSocialLinkChange}
                    className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="h-[42px] rounded-lg bg-purple-600 px-3 text-white hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {mentorData.socialLinks&&mentorData.socialLinks.length > 0 && (
                <div className="mt-2 space-y-2">
                  {mentorData.socialLinks&&mentorData?.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div>
                        <span className="text-sm font-medium capitalize">{link.platform}:</span>
                        <span className="text-sm text-gray-600 ml-2">{link.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
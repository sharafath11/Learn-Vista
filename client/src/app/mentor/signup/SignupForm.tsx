"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postRequest } from "@/src/services/api";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { validateMentorSignup } from "@/src/utils/mentor/mentorValidation";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FormOTP } from "./FormOTP";
import { FormInput } from "@/src/components/mentor/signup/FormInput";
import { MentorAPIMenthods } from "@/src/services/APImethods";

export default function MentorSignupForm() {
  const [mentorData, setMentorData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    experience: 0,
    bio: "",
    isVerified: false,
    otp: "",
    phoneNumber: ""
  });
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMentorData({ 
      ...mentorData, 
      [name]: value 
    });
  };

  const handleOtpChange = (e: { target: { id: string; value: string } }) => {
    setMentorData({ ...mentorData, [e.target.id]: e.target.value });
  };

  const handleOtpVerified = () => {
    setMentorData({ ...mentorData, isVerified: true });
    setOtpVerified(true);
  };

  const handleSendOtp = async () => {
    if (mentorData?.email) {
      setOtpSent(true)
      const res = await MentorAPIMenthods.otpSend( mentorData.email )
      if (res && res.ok) {
        setOtpSent(true);
        showSuccessToast("OTP sent to your email");

      }
    } else {
      showErrorToast("Email not found");
    }
  };

  const handleResendOtp = async () => {
    showSuccessToast("OTP resent to your email");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const error = validateMentorSignup(mentorData);
    if (error) {
      showInfoToast(error);
      return;
    }
    if (!otpVerified) {
      showSuccessToast("Please verify your OTP first");
      return;
    }
    
    
    const res = await MentorAPIMenthods.signup(mentorData)
    if (res?.ok) {
      showSuccessToast("Mentor registration successful");
      router.push("/mentor/login");
    }
  };

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

            <FormInput 
              label="Years of Experience" 
              type="number" 
              id="experience" 
              onChange={handleChange} 
              value={mentorData.experience.toString()}
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
                value={mentorData.bio}
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
          src="/images/signup.png" 
          alt="Mentor Signup Illustration" 
          width={500} 
          height={300} 
        />
      </div>
    </div>
  );
}
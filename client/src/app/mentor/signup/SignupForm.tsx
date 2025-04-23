"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import { postRequest } from "@/src/services/api";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { validateMentorSignup } from "@/src/utils/mentor/mentorValidation";
import { FormOTP } from "./FormOTP";
import { FormInput } from "@/src/components/mentor/signup/FormInput";
import { MentorAPIMethods } from "@/src/services/APImethods";

export default function MentorSignupForm() {
  const [mentorData, setMentorData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    experience: 0,
    bio: "",
    isVerified: false,
    otp: "",
    phoneNumber: "",
  });

  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMentorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpVerified = () => {
    setMentorData((prev) => ({ ...prev, isVerified: true }));
    setOtpVerified(true);
  };

  const handleSendOtp = async () => {
    if (!mentorData.email) return showErrorToast("Email is required");
    setOtpSent(true);
    const res = await MentorAPIMethods.otpSend(mentorData.email);
    res?.ok ? showSuccessToast("OTP sent") : showErrorToast("Failed to send OTP");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateMentorSignup(mentorData);
    if (error) return showInfoToast(error);
    if (!otpVerified) return showErrorToast("Please verify OTP first");

    const res = await MentorAPIMethods.signup(mentorData);
    if (res?.ok) {
      showSuccessToast("Signup successful");
      router.push("/mentor/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg flex flex-col lg:flex-row">
        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10">
          <div className="mb-6 flex items-center">
            <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
            <span className="ml-3 text-xl font-bold text-purple-700">Learn Vista</span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">Mentor Signup</h2>
          <p className="mb-6 text-sm text-gray-500">Inspire, guide, and shape the future of learners</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Email" type="email" id="email" value={mentorData.email} onChange={handleChange} required />
            <FormInput label="Password" type="password" id="password" value={mentorData.password} onChange={handleChange} required />
            <FormInput label="Confirm Password" type="password" id="confirmPassword" value={mentorData.confirmPassword} onChange={handleChange} required />
            <FormInput label="Phone Number" type="tel" id="phoneNumber" value={mentorData.phoneNumber} onChange={handleChange} required placeholder="+1234567890" />
            <FormInput label="Experience (Years)" type="number" id="experience" value={mentorData.experience.toString()} onChange={handleChange} required />

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Professional Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={mentorData.bio}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                placeholder="Tell us about your professional background..."
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full rounded-lg bg-purple-600 py-2 text-white font-medium hover:bg-purple-700 transition"
              >
                Send OTP
              </button>
            ) : (
              <FormOTP
                label="Verification Code"
                onChange={(e) => setMentorData({ ...mentorData, otp: e.target.value })}
                onVerified={handleOtpVerified}
                onResend={handleSendOtp}
                email={mentorData.email}
              />
            )}

            <button
              type="submit"
              disabled={!otpVerified && otpSent}
              className="w-full rounded-lg bg-purple-600 py-2 text-white font-semibold hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition"
            >
              Register as Mentor
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-sm text-gray-400">
            <div className="flex-1 border-t" />
            <span>or</span>
            <div className="flex-1 border-t" />
          </div>

          <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign up with Google
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already a mentor?{" "}
            <Link href="/mentor/login" className="text-purple-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-purple-50">
          <Image src="/images/signup.png" alt="Signup Illustration" width={480} height={360} className="object-contain" />
        </div>
      </div>
    </div>
  );
}

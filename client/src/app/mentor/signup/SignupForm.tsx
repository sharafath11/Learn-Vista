"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for password toggle

import { FormOTP } from "./FormOTP";
import { FormInput } from "@/src/components/mentor/signup/FormInput";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { validateMentorSignup } from "@/src/validations/mentorValidation";

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
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // For experience, ensure it's a number
    if (name === 'experience') {
        setMentorData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
        setMentorData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOtpVerified = () => {
    setMentorData((prev) => ({ ...prev, isVerified: true }));
    setOtpVerified(true);
  };

  const handleSendOtp = async () => {
   const error = validateMentorSignup(mentorData);
  // Only check for fields required BEFORE sending OTP if you don't want to validate everything
  // before sending OTP. Keeping original logic here:
  if (error) return showInfoToast(error);
  
  if (!mentorData.email) {
    showErrorToast("Email is required");
    return;
  }

  // Check if OTP is already verified or sent to prevent resending unnecessarily
  if (otpSent && !otpVerified) {
      showInfoToast("OTP already sent. Please verify or wait before resending.");
      return;
  }

  const res = await MentorAPIMethods.otpSend(mentorData.email);

  if (res?.ok) {
    showSuccessToast("OTP sent successfully to " + mentorData.email);
    setOtpSent(true); // Set state AFTER successful send
  } else {
    showErrorToast("Failed to send OTP. Please check the email and try again.");
    setOtpSent(false);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateMentorSignup(mentorData);
    if (error) return showInfoToast(error);
    if (!otpVerified) return showErrorToast("Please verify OTP first");

    const res = await MentorAPIMethods.signup(mentorData);
    if (res?.ok) {
      showSuccessToast("Signup successful. Redirecting to login...");
      router.push("/mentor/login");
    } else {
        showErrorToast("Signup failed. Please try again.");
    }
  };

  // Helper component for the Password input field with toggle
  const PasswordInputWithToggle = ({
    label,
    id,
    value,
    onChange,
    showToggle,
    setShowToggle,
  }: {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showToggle: boolean;
    setShowToggle: React.Dispatch<React.SetStateAction<boolean>>;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <input
          type={showToggle ? "text" : "password"}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required
          className="w-full rounded-lg border border-gray-300 p-2 pr-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />
        <button
          type="button"
          onClick={() => setShowToggle(prev => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          aria-label={showToggle ? "Hide password" : "Show password"}
        >
          {showToggle ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
    </div>
  );


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg flex flex-col lg:flex-row">
        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10">
          <div className="mb-6 flex items-center">
  <Image
    src="/images/logo.png"
    alt="Logo"
    width={50}
    height={50}
    className="object-contain"
  />
  <span className="ml-3 text-xl font-bold text-purple-700">Learn Vista</span>
</div>


          <h2 className="text-2xl font-semibold text-gray-800">Mentor Signup</h2>
          <p className="mb-6 text-sm text-gray-500">Inspire, guide, and shape the future of learners</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field: Disabled after OTP is sent */}
            <FormInput
              label="Email"
              type="email"
              id="email"
              name="email"
              value={mentorData.email}
              onChange={handleChange}
              required
              disabled={otpSent}
            />
            
            {/* Password Field with Eye Toggle */}
            <PasswordInputWithToggle
              label="Password"
              id="password"
              value={mentorData.password}
              onChange={handleChange}
              showToggle={showPassword}
              setShowToggle={setShowPassword}
            />

            {/* Confirm Password Field with Eye Toggle */}
            <PasswordInputWithToggle
              label="Confirm Password"
              id="confirmPassword"
              value={mentorData.confirmPassword}
              onChange={handleChange}
              showToggle={showConfirmPassword}
              setShowToggle={setShowConfirmPassword}
            />

            <FormInput label="Phone Number" type="tel" id="phoneNumber" name="phoneNumber" value={mentorData.phoneNumber} onChange={handleChange} required placeholder="+1234567890" />
            <FormInput label="Experience (Years)" type="number" id="experience" name="experience" value={mentorData.experience.toString()} onChange={handleChange} required />

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
                // Optional: Pass the disabled status of email for display in FormOTP if needed
                emailDisabled={otpSent} 
              />
            )}

            <button
              type="submit"
              disabled={!otpVerified || !otpSent} // Disabled if OTP is not verified OR if OTP wasn't sent yet
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

          <p className="mt-4 text-center text-sm text-gray-500">
            Already a mentor?{" "}
            <Link href="/mentor/login" className="text-purple-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-purple-50">
  <Image
    src="/images/signup.png"
    alt="Signup Illustration"
    width={480}
    height={360}
    className="object-contain"
  />
</div>

      </div>
    </div>
  );
}
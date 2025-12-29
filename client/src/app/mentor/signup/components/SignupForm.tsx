"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { validateMentorSignup } from "@/src/validations/mentorValidation";
import { FormInput } from "@/src/components/mentor/signup/FormInput";
import { FormOTP } from "./FormOTP";
import { PasswordInputWithToggle } from "./PasswordInputWithToggle";

export default function MentorSignupForm() {
  const router = useRouter();

  const [mentorData, setMentorData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    experience: 0,
    bio: "",
    otp: "",
    isVerified: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMentorData((p) => ({
      ...p,
      [name]: name === "experience" ? Number(value) || 0 : value,
    }));
  };

  const handleSendOtp = async () => {
    if (!mentorData.email) {
      showErrorToast("Email is required");
      return;
    }
    const error = validateMentorSignup(mentorData);
    if (error) return showErrorToast(error);
    const res = await MentorAPIMethods.otpSend(mentorData.email);
    if (res?.ok) {
      setOtpSent(true);
      showSuccessToast("OTP sent");
    } else {
      showErrorToast("Failed to send OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateMentorSignup(mentorData);
    if (error) return showErrorToast(error);
    if (!otpVerified) return showErrorToast("Verify OTP first");
    const res = await MentorAPIMethods.signup(mentorData);
    if (res?.ok) {
      showSuccessToast("Signup successful");
      router.push("/mentor/login");
    } else {
      showErrorToast("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow flex">
        <div className="w-full lg:w-1/2 p-8">
          <div className="flex items-center mb-6">
            <Image src="/images/logo.png" alt="logo" width={40} height={40} />
            <span className="ml-3 font-bold text-purple-700">Learn Vista</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email"
              id="email"
              name="email"
              type="email"
              value={mentorData.email}
              onChange={handleChange}
              readOnly={otpSent}
              required
            />

            <PasswordInputWithToggle
              label="Password"
              id="password"
              value={mentorData.password}
              onChange={handleChange}
              show={showPassword}
              setShow={setShowPassword}
            />

            <PasswordInputWithToggle
              label="Confirm Password"
              id="confirmPassword"
              value={mentorData.confirmPassword}
              onChange={handleChange}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
            />

            <FormInput
              label="Phone Number"
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={mentorData.phoneNumber}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Experience"
              id="experience"
              name="experience"
              type="number"
              value={mentorData.experience.toString()}
              onChange={handleChange}
              required
            />

            <textarea
              name="bio"
              value={mentorData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded p-2"
              placeholder="Professional bio"
            />

            <div className={!otpSent ? "block" : "hidden"}>
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-purple-600 text-white py-2 rounded"
              >
                Send OTP
              </button>
            </div>

            <div className={otpSent ? "block" : "hidden"}>
              <FormOTP
                label="Verification Code"
                email={mentorData.email}
                onChange={(e) =>
                  setMentorData((p) => ({ ...p, otp: e.target.value }))
                }
                onVerified={() => setOtpVerified(true)}
                onResend={handleSendOtp}
                emailDisabled
              />
            </div>

            <button
              type="submit"
              disabled={!otpVerified}
              className="w-full bg-purple-600 text-white py-2 rounded disabled:bg-purple-300"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already a mentor?{" "}
            <Link href="/mentor/login" className="text-purple-600">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden lg:flex w-1/2 bg-purple-50 items-center justify-center">
          <Image src="/images/signup.png" alt="signup" width={400} height={300} />
        </div>
      </div>
    </div>
  );
}

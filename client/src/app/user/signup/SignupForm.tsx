// SignupForm.tsx

"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";

import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import type { ILogin, IUserRegistration } from "@/src/types/authTypes";
import { FormOTP } from "./FormOTP";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { validateSignup } from "@/src/validations/validation";

interface FormInputProps {
  label: string;
  type: string;
  id: keyof IUserRegistration;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const FormInput = ({
  label,
  type,
  id,
  onChange,
  placeholder,
  disabled = false,
}: FormInputProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all disabled:bg-gray-100"
      required
    />
  </div>
);

export default function SignupForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [userData, setUserData] = useState<IUserRegistration>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isVerified: false,
    role: "user",
    otp: "",
  });

  const [loginData, setLoginData] = useState<ILogin>();
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  const handleOtpChange = (e: { target: { id: string; value: string } }) => {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleOtpVerified = () => {
    setUserData((prev) => ({ ...prev, isVerified: true }));
    setOtpVerified(true);
  };

  const handleOtpResend = () => {
    setUserData((prev) => ({ ...prev, isVerified: false }));
    setOtpVerified(false);
    handleSendOtp();
  };

  const handleSendOtp = async () => {
    if (!userData.email) {
      showErrorToast("Please enter your email address");
      return;
    }

    try {
      const res = await UserAPIMethods.sendOtp(userData.email);
      if (res?.ok || (typeof res === "string" && res.includes("OTP already send it"))) {
        setOtpSent(true);
        showSuccessToast("OTP sent to your email");
      }
    } catch (error) {
      showErrorToast("Failed to send OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateSignup(userData);
    if (!validation.isValid) {
      showErrorToast(validation.message);
      return;
    }

    if (!otpVerified) {
      showSuccessToast("Please verify your OTP first");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await UserAPIMethods.signUp(userData);
      if (res?.ok) {
        showSuccessToast("Signup successful");
        router.push("/user/login");
      }
    } catch (error) {
      showErrorToast("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleSignup = async () => {
    try {
      const res = await signIn("google", { callbackUrl: "/user" });
      if (res) {
        showSuccessToast("Login Success");
        router.push("/");
      }
    } catch (error) {
      showErrorToast("Signup failed, please try again.");
    }
  };

  useEffect(() => {
    if (session?.user?.email && session?.user?.id && !userData.isVerified) {
      setLoginData({
        email: session.user.email,
        googleId: session.user.id,
        password: "",
      });
      setAutoSubmit(true);
    }
  }, [session, userData.isVerified]);

  useEffect(() => {
    const autoLogin = async () => {
      if (autoSubmit && loginData) {
        try {
          const res = await UserAPIMethods.loginUser(loginData);
          if (res.ok) {
            showSuccessToast(res.msg);
            router.push("/");
          }
        } catch (error) {
        }
      }
    };

    autoLogin();
  }, [autoSubmit, router, loginData]);

  return (
    <div className="flex w-full max-w-6xl overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-5 lg:p-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex items-center">
            <Image src="/images/logo.png" alt="Learn Vista" width={80} height={12} className="h-auto" />
            <span className="ml-2 text-lg font-bold text-purple-900">Learn Vista</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-gray-500 text-sm">Please enter your details</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FormInput label="Full Name" type="text" id="username" onChange={handleChange} placeholder="John Doe" />
            <FormInput
              label="Email Address"
              type="email"
              id="email"
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={otpVerified}
            />
            <FormInput
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
              placeholder="••••••••"
            />
            <FormInput
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              onChange={handleChange}
              placeholder="••••••••"
            />

            {!otpSent ? (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full rounded-lg bg-purple-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <FormOTP
                label="Verification Code"
                onChange={handleOtpChange}
                onVerified={handleOtpVerified}
                onResend={handleOtpResend}
                email={userData.email}
              />
            )}

            <button
              type="submit"
              disabled={(!otpVerified && otpSent) || isSubmitting}
              className="w-full rounded-lg bg-purple-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <div className="relative mt-6 flex items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 flex-shrink bg-white text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <button
            onClick={googleSignup}
            type="button"
            className="mt-5 flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/user/login"
              className="font-medium text-purple-600 hover:text-purple-800 hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-50 to-purple-100 justify-center items-center p-8">
        <div className="max-w-md">
          <Image
            src="/images/signup.png"
            alt="Signup Illustration"
            width={500}
            height={300}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

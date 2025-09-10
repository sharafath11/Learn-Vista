
"use client";

import { useState, useEffect, useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { ILogin } from "@/src/types/authTypes";
import { useUserContext } from "@/src/context/userAuthContext";
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const [data, setData] = useState<ILogin>({
    email: "",
    password: "",
    googleId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, user, fetchUserData, refereshNotifcation } = useUserContext();
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (user) {
      router.push("/user");
    }
  }, [user, router]);
   const handleSubmit = useCallback(
    async (overrideData?: ILogin, e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();
      setIsLoading(true);

      const res = await UserAPIMethods.loginUser(overrideData || data);

      if (res?.ok) {
        setUser(res.data);
        showSuccessToast(res.msg);
        await fetchUserData();
        refereshNotifcation();
        window.location.href = "/user";
      } else {
        showErrorToast(res?.msg || "Login failed");
      }
      setIsLoading(false);
    },
    [data, fetchUserData, refereshNotifcation, setUser]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/user");
    }
  }, [user, router]);

  useEffect(() => {
    if (session?.user?.email && session?.user?.id && !data.googleId) {
      const googleData: ILogin = {
        email: session.user.email || "",
        password: "",
        googleId: session.user.id,
      };
      setData(googleData);
      handleSubmit(googleData); 
    }
  }, [session, data.googleId, handleSubmit]);

  const handleGoogleAuth = async () => {
    await signIn("google");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  if (!isMounted) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 rounded-xl shadow-lg bg-white">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center">
        <Image src="/images/logo.png" alt="Learn Vista Logo" width={40} height={40} />
        <span className="ml-2 text-2xl font-bold text-purple-700">Learn Vista</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800">Welcome back 👋</h1>
      <p className="mt-2 text-sm text-gray-500">Enter your credentials to continue</p>

      {/* Form */}
      <form className="mt-6 space-y-5" onSubmit={(e) => handleSubmit(undefined, e)}>
        <FormInput
          label="Email"
          type="email"
          id="email"
          onChange={handleChange}
          value={data.email}
        />
        <FormInput
          label="Password"
          type="password"
          id="password"
          onChange={handleChange}
          value={data.password}
          showPassword={showPassword}
          togglePassword={() => setShowPassword((prev) => !prev)}
        />

        <div className="flex justify-between text-sm text-gray-500">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <Link href="/user/forgot-password" className="text-purple-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className={`w-full bg-purple-600 py-3 text-white rounded-lg font-medium shadow-md hover:bg-purple-700 transition duration-200 ${
            isLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-gray-500">or continue with</span>
        </div>
      </div>

      {/* Google Auth */}
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
      >
        <FcGoogle className="text-lg" /> Sign in with Google
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/user/signup" className="text-purple-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

// Input component
function FormInput({
  label,
  type,
  id,
  onChange,
  value,
  showPassword,
  togglePassword,
}: {
  label: string;
  type: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  showPassword?: boolean;
  togglePassword?: () => void;
}) {
  const isPasswordField = id === "password";

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={isPasswordField && showPassword ? "text" : type}
        id={id}
        onChange={onChange}
        value={value}
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
      />
      {isPasswordField && togglePassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-600"
        >
          {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}

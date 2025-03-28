"use client";
import { postRequest } from "@/src/services/api";
import { IUserRegistration } from "@/src/types/authTypes";
import { showSuccessToast } from "@/src/utils/Toast";
import { registrationValidation } from "@/src/utils/validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignupForm() {
  const [userData, setUserData] = useState<IUserRegistration>({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: "",
    role: "user"
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!registrationValidation(userData)) return;
    
    const res = await postRequest("/signup", userData);
    if (res?.ok) {
      showSuccessToast("Signup succes full");
      router.push("/login")
    };
  };

  return (
    <div className="flex w-full max-w-6xl overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
      <div className="flex w-full lg:w-1/2 flex-col justify-center p-4 lg:p-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-3 flex items-center">
            <img src="images/logo.png" alt="Learn Vista Logo" className="w-8" />
            <span className="ml-2 text-lg font-bold text-purple-900">Learn Vista</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-gray-500 text-sm">Please enter your details</p>

          <form onSubmit={handleSubmit}>
            <FormInput label="Full Name" type="text" id="name" onChange={handleChange} />
            <FormInput label="Email Address" type="email" id="email" onChange={handleChange} />
            <FormInput label="Password" type="password" id="password" onChange={handleChange} />
            <FormInput label="Confirm Password" type="password" id="confirmPassword" onChange={handleChange} />
            <button
              type="submit"
              className="w-full rounded-lg bg-purple-600 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Sign up
            </button>
          </form>

          <div className="relative mt-2 flex items-center">
            <div className="w-full border-t border-gray-200" />
            <span className="bg-white px-3 text-xs text-gray-500">OR</span>
          </div>

          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-1.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign up with Google
          </button>

          <p className="mt-2 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-purple-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-purple-100 justify-center items-center">
        <img src="images/signup.png" alt="Signup Illustration" className="w-full h-auto" />
      </div>
    </div>
  );
}

function FormInput({ label, type, id, onChange }: { 
  label: string; 
  type: string; 
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
          onChange={onChange}
          className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
        />
      </div>
    </div>
  );
}
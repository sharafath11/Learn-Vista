"use client";
import { postRequest } from "@/src/services/api";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { ILogin } from "@/src/types/authTypes";
import { useUserContext } from "@/src/context/userAuthContext";
import { showSuccessToast } from "@/src/utils/Toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
  const [data, setData] = useState<ILogin>({ email: "", password: "", googleId: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const { setUser } = useUserContext();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email && session?.user?.id) {
      setData((prev) => ({
        ...prev,
        email: session?.user?.email ?? "",
        googleId:session?.user?.id ?? "",
      }));
      
      setAutoSubmit(true);
    }
  }, [session]);


  async function handleGoogleAuth() {
    const res = await signIn("google");
    console.log("googleeee",res)
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await postRequest("/login", data);
      if (res.ok) {
        setUser(res.user);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("token", res.token);
        }
        showSuccessToast(res.msg);
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
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
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center">
        <img src="/images/logo.png" alt="Learn Vista Logo" className="w-10" />
        <span className="ml-2 text-xl font-bold text-purple-900">Learn Vista</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
      <p className="mt-2 text-gray-500">Please enter your details</p>

      <form className="mt-6" onSubmit={handleSubmit}>
        <FormInput
          label="Email address"
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
        />

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember for 30 days
          </label>
          <a href="#" className="text-purple-600 hover:underline">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-purple-600 py-2.5 text-sm font-medium text-white rounded-lg shadow-md hover:bg-purple-700 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="relative my-6 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
        <span className="bg-white px-4 text-xs text-gray-500">OR</span>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={handleGoogleAuth}
      >
        <FcGoogle className="mr-2 h-4 w-4" /> Sign in with Google
      </button>

      <p className="mt-6 text-center text-xs text-gray-500">
        Don't have an account? <a href="/user/signup" className="text-purple-600 font-medium hover:underline">Sign up</a>
      </p>
    </div>
  );
}

function FormInput({
  label,
  type,
  id,
  onChange,
  value
}: {
  label: string;
  type: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        onChange={onChange}
        value={value}
        required
        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
      />
    </div>
  );
}

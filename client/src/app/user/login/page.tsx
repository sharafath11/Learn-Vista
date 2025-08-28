"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import LoginForm from "./LoginForm";
import { UserRole } from "@/src/types/authTypes";
import Image from "next/image";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("user");
  const router = useRouter(); 


  const handleRoleSelection = (selectedRole: UserRole) => {
    setRole(selectedRole);
    router.push(`/${selectedRole}/login`); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      <div className="py-6 px-4">
        {/* Role Selection */}
        <div className="flex justify-center space-x-4">
          <button
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
              role === "user"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleRoleSelection("user")}
          >
            Login as User
          </button>
          <button
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
              role === "mentor"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleRoleSelection("mentor")}
          >
            Login as Mentor
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white border border-gray-100">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="p-6 lg:p-12">
              {/* Pass the selected role to the LoginForm */}
              <LoginForm  />
            </div>
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100 relative w-full h-[500px]">
  <Image
    src="/images/login.png"
    alt="Login Illustration"
    className="object-contain"
    fill
  />
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

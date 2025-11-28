"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import { IMentorSingupFormInputProps } from "@/src/types/mentorTypes";

export const FormInput = ({
  label,
  type,
  id,
  name, 
  onChange,
  value,
  placeholder,
  required = false,
  disabled = false,
}: IMentorSingupFormInputProps) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={inputType} 
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors pr-10" 
          required={required}
          disabled={disabled} 
        />        
        {isPassword && (
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};
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
  readOnly = false,
}: IMentorSingupFormInputProps) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

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
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={`block w-full rounded-lg border p-2 text-sm pr-10 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${readOnly ? "bg-gray-50" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            disabled={disabled || readOnly}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

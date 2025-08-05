"use client"

import { UserAPIMethods } from "@/src/services/methods/user.api"
import { useState, useEffect, useRef } from "react"
import type React from "react"

interface FormOTPProps {
  label: string
  onChange: (e: { target: { id: string; value: string } }) => void
  onVerified: () => void
  onResend?: () => void
  email: string,
}

export const FormOTP = ({ label, onChange, onVerified, onResend,email }: FormOTPProps) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isVerified])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      onChange({ target: { id: "otp", value: newOtp.join("") } })

      if (index < 5) {
        setActiveInput(index + 1)
        inputsRef.current[index + 1]?.focus()
      }
    } else if (value === "") {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
      onChange({ target: { id: "otp", value: newOtp.join("") } })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1)
      inputsRef.current[index - 1]?.focus()
    }
  }
  const handleVerify = async () => {
    if (otp.join("").length !== 6) return;
    
    const sendOtp = otp.join("");

    setIsVerifying(true);

    try {
        const res = await UserAPIMethods.otpVerify(email,sendOtp)

        if (res.ok) {
            setIsVerified(true);
            onVerified(); 
        }
    } finally {
        setIsVerifying(false);
    }
};


  const handleResend = () => {
    setOtp(Array(6).fill(""))
    setActiveInput(0)
    setTimeLeft(30)
    setIsVerified(false)
    inputsRef.current[0]?.focus()
    onResend?.()
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-end gap-3">
        <div className="flex-grow">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}                
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setActiveInput(index)}
                disabled={isVerified || isVerifying}
                className={`w-10 h-10 text-center text-lg rounded-md border-2 transition-all ${
                  activeInput === index
                    ? "border-purple-500 ring-2 ring-purple-200"
                    : "border-gray-300 hover:border-purple-300"
                } ${isVerified ? "bg-green-50 border-green-500" : ""}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={otp.join("").length !== 6 || isVerifying || isVerified}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isVerified
              ? "bg-green-500 text-white"
              : "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300"
          }`}
        >
          {isVerifying ? (
            <span className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </span>
          ) : isVerified ? (
            "Verified ✓"
          ) : (
            "Verify"
          )}
        </button>
      </div>

      <div className="flex justify-between items-center">
        {onResend && (
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || isVerified}
            className={`text-xs ${timeLeft > 0 ? "text-gray-400" : "text-purple-600 hover:text-purple-700"}`}
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
          </button>
        )}

        {isVerified && <span className="text-xs text-green-600">✓ Verification successful</span>}
      </div>
    </div>
  )
}


"use client";
import { postRequest } from "@/src/services/api";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { MentorSignupOtpProps } from "@/src/types/mentorTypes";
// Assuming MentorSignupOtpProps is imported from here or defined locally
// import { MentorSignupOtpProps } from "@/src/types/mentorTypes"; 
import { useEffect, useRef, useState } from "react";

// ⚠️ MODIFICATION 1: Update the interface to include emailDisabled
// Since I don't have access to the types file, I'll redefine the props inline for the fix.


export const FormOTP = ({ label, onChange, onVerified, onResend, email, emailDisabled }: MentorSignupOtpProps) => { // 👈 ADDED emailDisabled here
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
// ... existing state and logic ...

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);
// ... existing handleInputChange and handleKeyDown ...

  // Handle OTP input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    if (/^[0-9]$/.test(val)) {
      const updatedOtp = [...otp];
      updatedOtp[idx] = val;
      setOtp(updatedOtp);
      onChange({ target: { id: "otp", value: updatedOtp.join("") } });

      if (idx < 5) {
        setActiveIndex(idx + 1);
        inputRefs.current[idx + 1]?.focus();
      }
    } else if (val === "") {
      const updatedOtp = [...otp];
      updatedOtp[idx] = "";
      setOtp(updatedOtp);
      onChange({ target: { id: "otp", value: updatedOtp.join("") } });
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      setActiveIndex(idx - 1);
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;

    setIsVerifying(true);
    try {
      const res = await MentorAPIMethods.verifyOtp(email,fullOtp)
      if (res.ok) {
        setIsVerified(true);
        onVerified();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setTimeLeft(30);
    setIsVerified(false);
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
    onResend?.();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} 
        {/* ⚠️ OPTIONAL: Added email display for UX */}
        {emailDisabled && (
            <span className="ml-2 text-xs text-gray-500 font-normal">
                (Sent to: {email})
            </span>
        )}
      </label>
      {/* ... rest of the component ... */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onFocus={() => setActiveIndex(idx)}
              disabled={isVerified || isVerifying}
              className={`w-10 h-10 text-center text-lg rounded-md border-2 outline-none transition-all bg-white ${
                activeIndex === idx
                  ? "border-purple-500 ring-2 ring-purple-300"
                  : "border-gray-300 hover:border-purple-400"
              } ${isVerified ? "bg-green-100 border-green-500" : ""}`}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.join("").length !== 6 || isVerifying || isVerified}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors shadow ${
            isVerified
              ? "bg-green-500 text-white"
              : "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300"
          }`}
        >
          {isVerifying ? (
            <span className="inline-flex items-center">
              <svg
                className="animate-spin mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z"
                />
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
        <button
          onClick={handleResend}
          disabled={timeLeft > 0 || isVerified}
          className={`text-sm font-medium transition ${
            timeLeft > 0 ? "text-gray-400 cursor-not-allowed" : "text-purple-600 hover:text-purple-800"
          }`}
        >
          {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
        </button>

        {isVerified && <span className="text-sm text-green-600">✓ Verification successful</span>}
      </div>
    </div>
  );
};
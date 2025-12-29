"use client";

import { useEffect, useRef, useState } from "react";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { MentorSignupOtpProps } from "@/src/types/mentorTypes";

export const FormOTP = ({
  label,
  email,
  onChange,
  onVerified,
  onResend,
  emailDisabled,
}: MentorSignupOtpProps) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    if (/^[0-9]$/.test(val)) {
      const updated = [...otp];
      updated[idx] = val;
      setOtp(updated);
      onChange({ target: { id: "otp", value: updated.join("") } });
      if (idx < 5) {
        setActiveIndex(idx + 1);
        inputRefs.current[idx + 1]?.focus();
      }
    }
    if (val === "") {
      const updated = [...otp];
      updated[idx] = "";
      setOtp(updated);
      onChange({ target: { id: "otp", value: updated.join("") } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      setActiveIndex(idx - 1);
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setIsVerifying(true);
    try {
      const res = await MentorAPIMethods.verifyOtp(email, code);
      if (res.ok) {
        setIsVerified(true);
        onVerified();
      }
    } finally {
      setIsVerifying(false);
    }
  };

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
        {emailDisabled && (
          <span className="ml-2 text-xs text-gray-500">(Sent to: {email})</span>
        )}
      </label>

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
      className={`w-10 h-10 text-center text-lg rounded-md border-2 outline-none ${
        activeIndex === idx
          ? "border-purple-500 ring-2 ring-purple-300"
          : "border-gray-300"
      } ${isVerified ? "bg-green-100 border-green-500" : ""}`}
    />
  ))}
</div>


        <button
          onClick={handleVerify}
          disabled={otp.join("").length !== 6 || isVerifying || isVerified}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isVerified
              ? "bg-green-500 text-white"
              : "bg-purple-600 text-white disabled:bg-purple-300"
          }`}
        >
          {isVerifying ? "Verifying..." : isVerified ? "Verified ✓" : "Verify"}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleResend}
          disabled={timeLeft > 0 || isVerified}
          className={`text-sm ${
            timeLeft > 0 ? "text-gray-400" : "text-purple-600"
          }`}
        >
          {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

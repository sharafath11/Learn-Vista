"use client"
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserAPIMethods } from "@/src/services/APImethods";
import { showSuccessToast, showErrorToast, showInfoToast } from "@/src/utils/Toast";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/src/utils/restPasswordValidatior";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }
    if (!validatePassword(password)) {
      return showInfoToast("Password must be at least 8 characters with a number and special character");
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await UserAPIMethods.resetPassword(params.rts as string, password);
      
      if (res.ok) {
        showSuccessToast(res.msg);
        setTimeout(() => router.push("/user/login"), 2000);
      } else {
        setMessage("❌ " + (res.error || "Something went wrong."));
        showErrorToast(res.error || "Failed to reset password");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Server error.";
      setMessage("❌ " + errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
      <h2 style={{ marginBottom: 20 }}>Reset Your Password</h2>
      
      <div style={{ position: "relative", margin: "10px 0" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px 35px 10px 10px" }}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff size={18} color="#666" />
          ) : (
            <Eye size={18} color="#666" />
          )}
        </button>
      </div>
      
      <div style={{ position: "relative", marginBottom: 10 }}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%", padding: "10px 35px 10px 10px" }}
        />
        <button
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
        >
          {showConfirmPassword ? (
            <EyeOff size={18} color="#666" />
          ) : (
            <Eye size={18} color="#666" />
          )}
        </button>
      </div>

      <button
        onClick={handleReset}
        disabled={loading}
        style={{
          padding: 10,
          width: "100%",
          background: loading ? "#93c5fd" : "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s"
        }}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
      
      {message && (
        <p style={{ 
          marginTop: 15, 
          color: message.startsWith("❌") ? "#ef4444" : "#22c55e"
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
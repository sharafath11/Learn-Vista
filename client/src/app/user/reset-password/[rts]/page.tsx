"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useParams } from "next/navigation";
import { UserAPIMethods } from "@/src/services/APImethods";
import { showSuccessToast } from "@/src/utils/Toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params=useParams()
   console.log(params)

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await UserAPIMethods.resetPassword(params.rts as string,password)
      if (res.ok) {
        showSuccessToast(res.msg)
        setTimeout(() => router.push("/user/login"), 2000);
      } else {
        setMessage("❌ Something went wrong.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "10px 0", width: "100%", padding: 10 }}
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ marginBottom: 10, width: "100%", padding: 10 }}
      />
      <button
        onClick={handleReset}
        disabled={loading}
        style={{
          padding: 10,
          width: "100%",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 4,
        }}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}

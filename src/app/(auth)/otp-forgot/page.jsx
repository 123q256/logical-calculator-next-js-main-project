"use client";

import { useState } from "react";
import OtpInput from "react-otp-input";
import { useVerifyOtpResetPasswordMutation } from "../../../redux/services/auth/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OtpForgotPassword = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verifyOtp, { isLoading, error: apiError }] =
    useVerifyOtpResetPasswordMutation();

  const router = useRouter();

  // ✅ Next.js client storage (safe for sessionStorage)
  const otp_id =
    typeof window !== "undefined" ? sessionStorage.getItem("otp_id") : null;
  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("email") : null;

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!otp_id) {
      setError("OTP session expired. Please request a new OTP.");
      return;
    }

    setError("");
    try {
      await verifyOtp({ otp, otp_id, email }).unwrap();

      toast.success("Account Verified Successfully");

      // ✅ Next.js navigation
      router.push("/change-password");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-4">Verify OTP</h1>
      <p className="mb-2 text-gray-600">OTP sent to: {email}</p>

      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        isInputNum
        shouldAutoFocus
        inputStyle={{
          width: "3rem",
          height: "3rem",
          margin: "0 0.5rem",
          fontSize: "1.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
        }}
        renderInput={(props) => <input {...props} />}
      />

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <button
        onClick={handleVerifyOtp}
        disabled={isLoading}
        className={`mt-6 px-6 py-2 rounded-md transition ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Verifying..." : "Verify & Login"}
      </button>
    </div>
  );
};

export default OtpForgotPassword;

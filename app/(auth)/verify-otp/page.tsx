"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, ChevronLeft, RefreshCw } from "lucide-react";
import { useVerifyOTPMutation, useForgotPasswordMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { Logo } from "@/components/icon/logo";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useForgotPasswordMutation();

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle focus on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return; // Allow numbers only

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      // Focus previous input if current is empty
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length !== 6 || isNaN(Number(pastedData))) {
      toast.error("Please paste a valid 6-digit code.");
      return;
    }

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    
    // Focus the last input
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is missing. Please restart the process.");
      return;
    }

    try {
      await resendOTP({ email }).unwrap();
      toast.success("A new OTP code has been sent!");
      setTimer(60);
      setCanResend(false);
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      // Call verify OTP mutation
      const response = await verifyOTP({ email, otp: otpCode }).unwrap();
      
      toast.success("OTP verified successfully!");

      // Extract reset_token from response
      const resetToken =
        response?.reset_token ||
        response?.data?.reset_token ||
        response?.data?.token?.access ||
        response?.data?.access ||
        response?.data?.accessToken ||
        response?.data?.token ||
        response?.access ||
        response?.token ||
        "";

      // Redirect to Reset Password page, passing reset_token and email
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpCode)}&reset_token=${encodeURIComponent(resetToken)}`);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const errorMessage =
        err?.data?.error?.message ||
        err?.data?.error?.details?.detail ||
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data?.error === "string" ? err?.data?.error : null) ||
        err?.message ||
        "Invalid verification code. Please check and try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-gray-100 flex items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Centered Simple Container */}
      <div className="w-full max-w-md rounded-2xl border border-[#1e2229] bg-[#0c0e12] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href={`/forgot-password?email=${encodeURIComponent(email)}`}
            className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-white transition-colors gap-1 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </Link>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Logo />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Verify Identity</h1>
          <p className="text-xs text-gray-400 mt-1.5 max-w-[280px]">
            We have sent a verification code to <span className="text-gray-200 font-medium">{email || "your email"}</span>.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Digit Inputs */}
          <div>
            <label className="block text-xs font-medium text-gray-300 text-center mb-3">
              Enter 6-Digit Code
            </label>
            <div className="flex justify-between gap-2 max-w-xs mx-auto" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 text-center text-lg font-bold bg-[#12151a] text-white rounded-lg border border-[#222733] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              ))}
            </div>
          </div>

          {/* Resend Timer section */}
          <div className="text-center text-xs">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1.5 mx-auto cursor-pointer disabled:opacity-50"
              >
                {isResending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Resend Code</span>
              </button>
            ) : (
              <p className="text-gray-500">
                Resend code in <span className="text-gray-300 font-medium">{timer}s</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify OTP</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#08090a] text-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#1e2229] bg-[#0c0e12] p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
            <p className="text-sm text-gray-400">Loading verification screen...</p>
          </div>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}

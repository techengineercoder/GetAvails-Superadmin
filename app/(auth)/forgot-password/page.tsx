"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import { useForgotPasswordMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { Logo } from "@/components/icon/logo";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success("OTP has been sent to your email!");
      
      // Redirect to Verify OTP page, passing email in query params
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      const errorMessage =
        err?.data?.error?.message ||
        err?.data?.error?.details?.detail ||
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data?.error === "string" ? err?.data?.error : null) ||
        err?.message ||
        "Failed to send reset code. Please try again.";
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
            href="/login"
            className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-white transition-colors gap-1 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </Link>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Logo />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-xs text-gray-400 mt-1">
            Enter your email to receive a validation code to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#12151a] text-white rounded-lg border border-[#222733] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500"
                placeholder="admin@getavails.com"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send Code</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090a] text-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#1e2229] bg-[#0c0e12] p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
            <p className="text-sm text-gray-400">Loading reset screen...</p>
          </div>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}

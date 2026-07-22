"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Layers, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/redux/feature/authApi";
import { setUser } from "@/redux/feature/authSlice";
import { toast } from "sonner";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  // Redirect if already authenticated via redux, localStorage, or cookies
  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const cookieToken = getCookie("token") || getCookie("accessToken");

    if (isAuthenticated || localToken || cookieToken) {
      router.replace("/verification-center");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();

      // Extract user and token from various API response structures
      const user = response?.data?.user || response?.user || {
        id: response?.data?.id || 1,
        email: email,
        name: response?.data?.name || email.split("@")[0],
        role: response?.data?.role || "SUPER_ADMIN",
        image: null,
        phone: "",
        email_verified_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        is_staff: true,
        created_at: new Date().toISOString(),
      };

      const access =
        response?.data?.token?.access ||
        response?.data?.access ||
        response?.data?.accessToken ||
        response?.access ||
        response?.token ||
        "mock_access_token_" + Date.now();

      const refresh =
        response?.data?.token?.refresh ||
        response?.data?.refresh ||
        response?.data?.refreshToken ||
        response?.refresh ||
        "mock_refresh_token_" + Date.now();

      // Save to redux state, localStorage, and cookies
      dispatch(setUser({ user, access, refresh }));

      toast.success("Login successful! Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/verification-center");
      }, 500);
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage =
        err?.data?.error?.message ||
        err?.data?.error?.details?.detail ||
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data?.error === "string" ? err?.data?.error : null) ||
        err?.message ||
        "Login failed. Please check your credentials and try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-gray-100 flex items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Centered Simple Container */}
      <div className="w-full max-w-md rounded-2xl border border-[#1e2229] bg-[#0c0e12] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Super Admin Portal</h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in with your email and password to access the dashboard.
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

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Password
              </label>
              <a href="#" className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#12151a] text-white rounded-lg border border-[#222733] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-6 mt-6 border-t border-[#1a1d24] flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            System Active
          </span>
          <span>GetAvails Admin Portal</span>
        </div>
      </div>
    </div>
  );
}

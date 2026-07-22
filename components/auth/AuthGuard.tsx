"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Layers, Loader2 } from "lucide-react";

// Helper function to read cookie value by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const reduxIsAuth = useSelector((state: any) => state.auth?.isAuthenticated);
  const reduxToken = useSelector((state: any) => state.auth?.token);

  const [isChecking, setIsChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check localStorage, cookies, and redux store for access token
    const localToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const cookieToken = getCookie("token") || getCookie("accessToken");

    const hasToken = !!(localToken || cookieToken || reduxToken || reduxIsAuth);

    if (!hasToken) {
      setAuthorized(false);
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
    setIsChecking(false);
  }, [router, reduxIsAuth, reduxToken]);

  if (isChecking || !authorized) {
    return (
      <div className="min-h-screen bg-[#08090a] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-pulse">
          <Layers className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

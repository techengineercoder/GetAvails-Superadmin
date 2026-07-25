"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/feature/authSlice";
import { toast } from "sonner";
import { Search, Bell, Menu, ChevronDown, LogOut } from "lucide-react";
import SignOutModal from "./SignOutModal";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth?.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    dispatch(logout());
    toast.success("Signed out successfully");
    router.replace("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-[#050608]/90 backdrop-blur-md border-b border-[#12151c]">
        {/* Left section: Hamburger button for mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-lg lg:hidden transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right section: Search, Notifications, Profile */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Search input */}
          <div className="relative hidden sm:block w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#0f131a] text-gray-200 placeholder-gray-500 rounded-xl border border-[#1b202a] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          {/* Notifications Icon Button */}
          {/* <button
            className="relative p-2 text-gray-400 hover:text-gray-200 hover:bg-[#0f131a] rounded-xl border border-[#1b202a] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button> */}

          {/* Profile Card / Pill with Dropdown */}
          <div className="relative pl-2">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#0f131a] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#0077b6] font-bold text-xs text-white shadow-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "SA"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-200 flex items-center gap-1">
                  {user?.name || "Super Admin"}
                </span>
                <span className="text-[10px] text-gray-500">{user?.role || "Unrestricted Access"}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#0c0e12] border border-[#1e2229] rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#1b202a]">
                    <p className="text-xs font-semibold text-white truncate">{user?.name || "Super Admin"}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email || "admin@getavails.com"}</p>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowSignOutModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-950/20 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}

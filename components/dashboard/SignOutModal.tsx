"use client";

import React from "react";
import { LogOut, AlertTriangle, X } from "lucide-react";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutModal({
  isOpen,
  onClose,
  onConfirm,
}: SignOutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-[#0c0e12] border border-[#1e2229] rounded-2xl p-6 shadow-2xl z-10 space-y-6 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Graphic */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Sign Out of Super Admin?
          </h3>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            Are you sure you want to end your current session? You will need to log back in to access the dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-gray-300 hover:text-white bg-[#151922] hover:bg-[#1c222e] rounded-xl border border-[#222735] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

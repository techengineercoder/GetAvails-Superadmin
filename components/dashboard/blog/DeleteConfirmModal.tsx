"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetName: string;
  type: "blog" | "category";
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  targetName,
  type,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#0c0e12] border border-[#1e2229] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-red-950/40 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Confirm Deletion</h3>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Are you sure you want to delete the {type}{" "}
              <strong className="text-gray-200 font-bold">"{targetName}"</strong>? This action is
              permanent and cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#08090a] border-t border-[#1a1d24]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-gray-400 hover:text-white font-semibold text-xs rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500 hover:bg-red-650 text-white font-bold text-xs rounded-lg cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

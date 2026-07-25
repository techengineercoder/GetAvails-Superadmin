"use client";

import React from "react";
import { FolderPlus, Loader2, X } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  mode: "create" | "edit";
  categoryName: string;
  setCategoryName: (name: string) => void;
  isLoading: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  categoryName,
  setCategoryName,
  isLoading,
}: CategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md bg-[#0c0e12] border border-[#1e2229] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-[#1a1d24] bg-[#08090a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950 border border-cyan-500/30 text-cyan-200 rounded-lg shrink-0">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {mode === "create" ? "Add Category" : "Edit Category"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#181c24] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="categoryName" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Technology, Guides, Marketing"
              className="w-full px-3.5 py-2 bg-[#0d0f12] text-gray-200 placeholder-gray-500 rounded-xl border border-[#1e2229] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1a1d24]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-transparent text-gray-400 hover:text-white font-semibold text-xs rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-950/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900/40 font-bold text-xs rounded-lg cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mode === "create" ? "Add Category" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

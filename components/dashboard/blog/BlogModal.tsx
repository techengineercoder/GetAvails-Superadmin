"use client";

import React from "react";
import { BookOpen, Loader2, Upload, Trash2, X } from "lucide-react";
import WysiwygEditor from "./WysiwygEditor";
import { toast } from "sonner";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  mode: "create" | "edit";
  categoriesList: any[];
  blogTitle: string;
  setBlogTitle: (t: string) => void;
  blogContent: string;
  setBlogContent: (c: string) => void;
  blogCategory: number | "";
  setBlogCategory: (c: number | "") => void;
  blogIsPublished: boolean;
  setBlogIsPublished: (p: boolean) => void;
  imageFile: File | null;
  setImageFile: (f: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (p: string | null) => void;
  isLoading: boolean;
}

export default function BlogModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  categoriesList,
  blogTitle,
  setBlogTitle,
  blogContent,
  setBlogContent,
  blogCategory,
  setBlogCategory,
  blogIsPublished,
  setBlogIsPublished,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
  isLoading,
}: BlogModalProps) {
  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="my-8 w-full max-w-2xl bg-[#0c0e12] border border-[#1e2229] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-[#1a1d24] bg-[#08090a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950 border border-cyan-500/30 text-cyan-200 rounded-lg shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {mode === "create" ? "Compose Blog Post" : "Edit Blog Post"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#181c24] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Form Fields Card Wrapper */}
          <div className="p-4 bg-[#0a0c10] border border-[#1e2229] rounded-xl space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="blogTitle" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Post Title
              </label>
              <input
                id="blogTitle"
                type="text"
                required
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className="w-full px-3.5 py-2 bg-[#0d0f12] text-gray-200 placeholder-gray-500 rounded-xl border border-[#1e2229] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-xs"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="blogCategory" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </label>
                <select
                  id="blogCategory"
                  required
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3.5 py-2 bg-[#0d0f12] text-gray-250 rounded-xl border border-[#1e2229] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-xs cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categoriesList.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Publishing Status</span>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={blogIsPublished}
                    onChange={(e) => setBlogIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                  <span className="ml-3 text-xs font-semibold text-gray-300">
                    {blogIsPublished ? "Publish immediately" : "Save as Draft"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cover Image</label>
            
            <div className="relative flex flex-col items-center justify-center p-6 border border-dashed border-[#1e2229] hover:border-cyan-500/40 rounded-xl bg-[#0d0f12] transition-colors">
              {imagePreview ? (
                <div className="w-full flex flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="h-32 w-full object-cover rounded-xl border border-[#1e2229]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove selected cover
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Upload className="w-7 h-7 text-gray-550 mb-2" />
                  <span className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer">
                    Select cover file to upload
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Supports PNG, JPG, WEBP (Max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* WYSIWYG Document Editor */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Content / Article Body
            </label>
            <WysiwygEditor
              content={blogContent}
              onChange={setBlogContent}
              placeholder="Compose your article here. Select text and use the toolbar to format instantly..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#1a1d24]">
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
              {mode === "create" ? "Create Post" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

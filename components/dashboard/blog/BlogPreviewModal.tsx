"use client";

import React from "react";
import { Eye, X, User, Calendar } from "lucide-react";

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: any;
}

export default function BlogPreviewModal({ isOpen, onClose, blog }: BlogPreviewModalProps) {
  if (!isOpen || !blog) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c0e12] border border-[#1e2229] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#1a1d24] bg-[#08090a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950 border border-cyan-500/30 text-cyan-200 rounded-lg shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">Preview Blog Post</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#181c24] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh] custom-scrollbar">
          {blog.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full aspect-video object-cover rounded-xl border border-[#1e2229]"
            />
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                {blog.category_detail?.name || "Uncategorized"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                  blog.is_published
                    ? "bg-emerald-950/45 border-emerald-550/20 text-emerald-400"
                    : "bg-amber-950/45 border-amber-550/20 text-amber-400"
                }`}
              >
                {blog.is_published ? "Published" : "Draft"}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white leading-tight">
              {blog.title}
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> By {blog.author || "Admin"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-500" /> {formatDate(blog.created_at)}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1a1d24]">
            <div
              className="text-gray-300 leading-relaxed text-xs sm:text-sm prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-[#1a1d24] bg-[#08090a]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-[#12151a] hover:bg-[#1a1e26] border border-[#222733] text-gray-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

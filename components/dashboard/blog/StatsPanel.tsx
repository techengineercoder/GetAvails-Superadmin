"use client";

import React from "react";
import { FileText, Globe, Lock, Layers } from "lucide-react";

interface StatsPanelProps {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalCategories: number;
  isLoading: boolean;
}

export default function StatsPanel({
  totalBlogs,
  publishedBlogs,
  draftBlogs,
  totalCategories,
  isLoading,
}: StatsPanelProps) {
  const stats = [
    { label: "Total Articles", value: totalBlogs, icon: FileText, color: "text-cyan-400" },
    { label: "Published Posts", value: publishedBlogs, icon: Globe, color: "text-emerald-400" },
    { label: "Drafts", value: draftBlogs, icon: Lock, color: "text-amber-400" },
    { label: "Categories", value: totalCategories, icon: Layers, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-[#1e2229] bg-[#0c0e12] flex items-center justify-between shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
              {stat.label}
            </span>
            <span className="text-xl font-bold text-white block">
              {isLoading ? "..." : stat.value}
            </span>
          </div>
          <div className={`p-2 rounded-lg bg-[#0d0f12] border border-[#1e2229] ${stat.color}`}>
            <stat.icon className="w-4.5 h-4.5" />
          </div>
        </div>
      ))}
    </div>
  );
}

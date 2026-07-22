"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#050608] text-gray-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content Workspace */}
        <div className={`${isCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"} flex flex-col min-h-screen transition-all duration-300`}>
          {/* Top Header */}
          <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

          {/* Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

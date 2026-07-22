"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/feature/authSlice";
import { toast } from "sonner";
import SignOutModal from "./SignOutModal";
import {
  LayoutGrid,
  ShieldCheck,
  Users,
  Building2,
  Tag,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  BarChart3,
  Headphones,
  Layers,
  Bell,
  ClipboardList,
  Settings,
  UserCheck,
  Activity,
  Lock,
  LogOut,
  X,
  GitFork,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "../icon/logo";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const navigationItems = [
  // { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  {
    name: "Verification Center",
    href: "/verification-center",
    icon: ShieldCheck,
    // badge: "847",
    badgeColor: "bg-[#ff9f1c] text-[#08090a]",
  },
  // { name: "Users", href: "/users", icon: Users },
  // { name: "Organizations", href: "/organizations", icon: Building2 },
  // { name: "Offers", href: "/offers", icon: Tag },
  // { name: "Bookings", href: "/bookings", icon: Calendar },
  // { name: "Contracts", href: "/contracts", icon: FileText },
  // {
  //   name: "Messages",
  //   href: "/messages",
  //   icon: MessageSquare,
  //   badge: "12",
  //   badgeColor: "bg-[#00b4d8] text-[#08090a]",
  // },
  // { name: "Payments & Settlements", href: "/payments", icon: CreditCard },
  // { name: "Analytics", href: "/analytics", icon: BarChart3 },
  // { name: "Reports", href: "/reports", icon: FileText },
  // {
  //   name: "Support Center",
  //   href: "/support",
  //   icon: Headphones,
  //   badge: "34",
  //   badgeColor: "bg-[#00b4d8] text-[#08090a]",
  // },
  // { name: "Content Management", href: "/content", icon: Layers },
  // { name: "Notifications", href: "/notifications", icon: Bell },
  // { name: "Audit Logs", href: "/audit", icon: ClipboardList },
  // { name: "Platform Settings", href: "/settings", icon: Settings },
  // { name: "Admin Management", href: "/admins", icon: UserCheck },
  // { name: "System Health", href: "/system-health", icon: Activity },
  // { name: "Security", href: "/security", icon: Lock },
];

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    dispatch(logout());
    toast.success("Signed out successfully");
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#050608] border-r border-[#12151c] text-gray-300 transition-all duration-300 ease-in-out lg:translate-x-0 ${isCollapsed ? "w-[72px]" : "w-[260px]"
          } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Toggle Button for Desktop (Floating on the right border) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-5 z-50 items-center justify-center w-6 h-6 bg-[#0c0e12] border border-[#1e2229] rounded-full text-gray-400 hover:text-white hover:border-[#00A5E5] shadow-md transition-all cursor-pointer hover:scale-105"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Brand Header */}
        <div
          className={`flex items-center h-16 border-b border-[#12151c] px-4 transition-all duration-300 ${isCollapsed ? "justify-center" : "justify-between"
            }`}
        >
          <Link
            href="/verification-center"
            className={`flex items-center group ${isCollapsed ? "gap-0" : "gap-3"}`}
          >
            <Logo />
            <div
              className={`flex flex-col transition-all duration-300 origin-left ${isCollapsed
                ? "max-w-0 opacity-0 pointer-events-none -translate-x-2"
                : "max-w-[150px] opacity-100 translate-x-0"
                }`}
            >
              <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap">
                GetAvails
              </span>
              <span className="text-[9px] font-bold tracking-wider text-[#00b4d8] uppercase whitespace-nowrap">
                SUPER ADMIN
              </span>
            </div>
          </Link>

          {/* Close button for mobile screen drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/verification-center" &&
                (pathname === "/" || pathname === "/verification-center"));

            return (
              <div key={item.name} className="relative group/tooltip">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center transition-all duration-300 group border-t-0 border-r-0 border-b-0 h-[38px] px-3.5 rounded-[10px] relative overflow-hidden ${isActive
                    ? "bg-gradient-to-r from-[#00A5E5]/20 to-[#00A5E5]/[0.08] text-[#00A5E5] border-l-2 border-l-[#00A5E5] font-semibold"
                    : "text-[#8b949e] border-l-2 border-l-transparent hover:text-gray-100 hover:bg-[#0f131a]/40"
                    }`}
                >
                  {/* Icon Container (smoothly centered on collapse) */}
                  <div
                    className={`flex items-center justify-center shrink-0 transition-all duration-300 ${isCollapsed ? "w-full" : "w-5"
                      }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${isActive
                        ? "text-[#00A5E5]"
                        : "text-[#8b949e] group-hover:text-gray-100"
                        }`}
                    />
                  </div>

                  {/* Route Label Text (smooth fade and shrink) */}
                  <span
                    className={`transition-all duration-300 origin-left whitespace-nowrap overflow-hidden flex-1 ${isCollapsed
                      ? "max-w-0 opacity-0 pointer-events-none ml-0"
                      : "max-w-[150px] opacity-100 ml-2.5 text-[13px] font-medium"
                      }`}
                  >
                    {item.name}
                  </span>

                  {/* Route Badge Bubble (smooth scale and shrink) */}
                  {/* {item.badge && (
                    <span
                      className={`transition-all duration-300 shrink-0 ${isCollapsed
                        ? "scale-0 opacity-0 w-0 h-0 p-0 pointer-events-none ml-0"
                        : "scale-100 opacity-100 px-2 py-0.5 ml-2"
                        } text-[10px] font-extrabold rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )} */}
                </Link>

                {/* Collapsed Sidebar Hover Tooltip */}
                {/* {isCollapsed && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 bg-[#0c0e12] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-[#1e2229] whitespace-nowrap shadow-xl z-50 pointer-events-none flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )} */}
              </div>
            );
          })}
        </nav>

        {/* Footer Sign Out Button */}
        <div
          className={`p-4 border-t border-[#12151c] ${isCollapsed ? "flex justify-center" : ""
            }`}
        >
          <div className="relative group/tooltip w-full flex justify-center">
            <button
              onClick={() => setShowSignOutModal(true)}
              className="flex items-center transition-all duration-300 cursor-pointer text-[#ef4444] hover:bg-red-950/30 rounded-xl h-10 w-full px-3.5"
            >
              {/* LogOut Icon Container (smoothly centered on collapse) */}
              <div
                className={`flex items-center justify-center shrink-0 transition-all duration-300 ${isCollapsed ? "w-full" : "w-5"
                  }`}
              >
                <LogOut className="w-4 h-4 text-[#ef4444]" />
              </div>

              {/* LogOut text (smooth fade and shrink) */}
              <span
                className={`transition-all duration-300 origin-left whitespace-nowrap overflow-hidden flex-1 text-left ${isCollapsed
                  ? "max-w-0 opacity-0 pointer-events-none ml-0"
                  : "max-w-[150px] opacity-100 ml-2.5 text-[13px] font-semibold"
                  }`}
              >
                Sign Out
              </span>
            </button>

            {/* Hover Tooltip for Collapsed Sign Out */}
            {isCollapsed && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 bg-[#0c0e12] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-[#1e2229] whitespace-nowrap shadow-xl z-50 pointer-events-none">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Confirmation Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}

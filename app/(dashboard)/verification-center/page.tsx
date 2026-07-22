"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  ShieldAlert,
  Users,
  Award,
  Clock,
  Check,
  X,
  UserCheck,
} from "lucide-react";
import {
  useGetInvitationReviewQuery,
  useInvitationReviewDetailsQuery,
  useInvitationReviewStatusUpdateMutation,
} from "@/redux/feature/dashboardApi/invitationReviewSlice";
import { toast } from "sonner";

export default function VerificationCenterPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 12; // 12 items fit perfectly in a 3 or 4 column grid
  const offset = (page - 1) * limit;

  // Debounce search query changes to prevent API spamming
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search change
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle tab status filter changes
  const handleTabChange = (tab: "all" | "pending" | "approved" | "rejected") => {
    setActiveTab(tab);
    setPage(1); // Reset page on tab change
  };

  // Get all reviews with a high limit to compute total stats badge counts
  const { data: allReviewsData } = useGetInvitationReviewQuery({ limit: 100 });

  // Get current paginated, searched, and status-filtered reviews from API
  const queryParams = {
    limit,
    offset,
    ...(debouncedSearch.trim() !== "" ? { search: debouncedSearch } : {}),
    ...(activeTab !== "all" ? { status: activeTab } : {}),
  };
  const { data: invitationReview, isLoading: isListLoading, refetch } = useGetInvitationReviewQuery(queryParams);

  // Get details for the selected review
  const { data: detailsData, isLoading: isDetailsLoading } = useInvitationReviewDetailsQuery(
    selectedId ? String(selectedId) : "",
    { skip: !selectedId }
  );

  // Status update mutation
  const [updateStatus, { isLoading: isUpdating }] = useInvitationReviewStatusUpdateMutation();

  const results = invitationReview?.results || [];

  // Find the selected review from the list to show instant details
  const selectedListItem = results.find((item: any) => item.id === selectedId);

  // Merge list item and detail data
  const activeDetails = {
    ...selectedListItem,
    ...detailsData,
  };

  // Helper to normalize status for UI filtering and styling
  const normalizeStatus = (statusStr: string): "pending" | "approved" | "rejected" => {
    const s = (statusStr || "").toLowerCase().trim();
    if (s.startsWith("approv")) return "approved";
    if (s.startsWith("reject")) return "rejected";
    return "pending"; // Default fall-through (handles "pending", "pendig", etc.)
  };

  // Helper to resolve dynamic tab counts
  const getTabCount = (tab: "all" | "pending" | "approved" | "rejected") => {
    if (activeTab === tab) return invitationReview?.count || 0;
    const list = allReviewsData?.results || results;
    if (tab === "all") return allReviewsData?.count || list.length;

    return list.filter((item: any) => {
      const status = normalizeStatus(item.status);
      return status === tab;
    }).length;
  };

  const pendingCount = getTabCount("pending");
  const totalCount = invitationReview?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Action decision handler
  const handleDecision = async (approve: boolean) => {
    if (!selectedId) return;

    try {
      await updateStatus({
        id: String(selectedId),
        data: {
          approve,
          note: note.trim(),
        },
      }).unwrap();

      toast.success(
        approve
          ? `Successfully approved ${activeDetails.user?.name || "invitation"}`
          : `Rejected ${activeDetails.user?.name || "invitation"}`
      );
      setNote("");
      setSelectedId(null); // Close modal
      refetch();
    } catch (error: any) {
      console.error("Verification decision update failed:", error);
      const errMsg =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to update verification status. Please try again.";
      toast.error(errMsg);
    }
  };

  // Render card skeleton loading
  const renderCardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="p-5 bg-[#0c0e12]/60 rounded-2xl border border-[#1e2229]/60 animate-pulse space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-800" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-28 bg-gray-800 rounded" />
              <div className="h-3 w-36 bg-gray-800 rounded" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-gray-800 rounded" />
            <div className="h-3 w-2/3 bg-gray-800 rounded" />
          </div>
          <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
            <div className="h-4 w-16 bg-gray-800 rounded-full" />
            <div className="h-6 w-24 bg-gray-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-cyan-400" />
            Verification Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review and action membership requests, verify roles, and manage permissions.
          </p>
        </div>

        {/* {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-semibold self-start sm:self-auto shadow-[0_0_15px_rgba(245,158,11,0.08)] animate-pulse">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>{pendingCount} pending review</span>
          </div>
        )} */}
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#1a1d24] pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => {
            const label = tab.charAt(0).toUpperCase() + tab.slice(1);
            const isActive = activeTab === tab;
            const count = getTabCount(tab);

            let activeStyles = "bg-[#111317] text-white border-[#2c323f]";
            let badgeStyles = "bg-gray-800 text-gray-400";

            if (isActive) {
              if (tab === "pending") {
                activeStyles = "bg-amber-950/50 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]";
                badgeStyles = "bg-amber-500/20 text-amber-300";
              } else if (tab === "approved") {
                activeStyles = "bg-emerald-950/50 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]";
                badgeStyles = "bg-emerald-500/20 text-emerald-300";
              } else if (tab === "rejected") {
                activeStyles = "bg-red-950/50 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]";
                badgeStyles = "bg-red-500/20 text-red-300";
              } else {
                activeStyles = "bg-cyan-950/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]";
                badgeStyles = "bg-cyan-500/20 text-cyan-300";
              }
            }

            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all shrink-0 cursor-pointer ${isActive
                  ? activeStyles
                  : "bg-[#0d0f12] text-gray-400 border-[#1e2229] hover:bg-[#12151a] hover:text-gray-200"
                  }`}
              >
                <span>{label}</span>
                {/* <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${badgeStyles}`}>
                  {count}
                </span> */}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search name, email, team, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#0d0f12] text-gray-200 placeholder-gray-500 rounded-xl border border-[#1e2229] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Main Grid View */}
      {isListLoading ? (
        renderCardSkeleton()
      ) : results.length === 0 ? (
        <div className="p-16 text-center bg-[#0d0f12]/60 rounded-2xl border border-[#1e2229] space-y-3 max-w-xl mx-auto my-12">
          <ShieldAlert className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-300">No review requests found</h3>
          <p className="text-xs text-gray-500">
            No items match your selected status tab or search parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item: any) => {
              const status = normalizeStatus(item.status);
              const isArtist = item.team_domain === "artist";

              let statusBadgeColor = "bg-amber-950/60 text-amber-400 border-amber-500/40";
              if (status === "approved") {
                statusBadgeColor = "bg-emerald-950/60 text-emerald-400 border-emerald-500/40";
              } else if (status === "rejected") {
                statusBadgeColor = "bg-red-950/60 text-red-400 border-red-500/40";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className="group flex flex-col justify-between p-5 bg-[#0c0e12] border border-[#1e2229] hover:border-cyan-500/40 rounded-2xl shadow-md transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(6,182,212,0.06)] cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar + User Info */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-inner ${isArtist
                          ? "bg-purple-900/40 border border-purple-500/20 text-purple-200"
                          : "bg-teal-900/40 border border-teal-500/20 text-teal-200"
                          }`}
                      >
                        {item.user?.name
                          ? item.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                          : "?"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                          {item.user?.name || "Unknown User"}
                        </h3>
                        <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-600 shrink-0" />
                          <span>{item.user?.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* Body: Team and Role */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="text-gray-500">Team:</span>
                        <span className="font-semibold text-gray-200 truncate max-w-[150px]">
                          {item.team_name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="text-gray-500">Role:</span>
                        <span className="font-semibold text-gray-200">{item.role_label}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="text-gray-500">Domain:</span>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold rounded border uppercase tracking-wider ${isArtist
                            ? "bg-purple-950/40 border-purple-500/20 text-purple-300"
                            : "bg-teal-950/40 border-teal-500/20 text-teal-300"
                            }`}
                        >
                          {item.team_domain}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Date and Action */}
                  <div className="pt-4 mt-4 border-t border-[#1a1d24] flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-600" />
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wide ${statusBadgeColor}`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3.5 bg-[#0c0e12] border border-[#1e2229] rounded-xl max-w-md mx-auto shadow-md">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3.5 py-2 bg-[#12151a] hover:bg-[#1a1e26] border border-[#222733] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-gray-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                Previous
              </button>
              <span className="text-xs text-gray-400 font-medium">
                Page <span className="text-white font-bold">{page}</span> of{" "}
                <span className="text-white font-bold">{totalPages}</span>
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-2 bg-[#12151a] hover:bg-[#1a1e26] border border-[#222733] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-gray-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details Dialog Modal */}
      {selectedId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => {
            setSelectedId(null);
            setNote("");
          }}
        >
          <div
            className="w-full max-w-2xl bg-[#0c0e12] border border-[#1e2229] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1a1d24] bg-[#08090a]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-md ${activeDetails.team_domain === "artist"
                    ? "bg-purple-900 border border-purple-500/30 text-purple-200"
                    : "bg-teal-900 border border-teal-500/30 text-teal-200"
                    }`}
                >
                  {activeDetails.user?.name
                    ? activeDetails.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "?"}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    {activeDetails.user?.name || "Unknown User"}
                  </h2>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    <span>{activeDetails.user?.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${normalizeStatus(activeDetails.status) === "approved"
                    ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/40"
                    : normalizeStatus(activeDetails.status) === "rejected"
                      ? "bg-red-950/50 text-red-400 border-red-500/40"
                      : "bg-amber-950/50 text-amber-400 border-amber-500/40"
                    }`}
                >
                  {normalizeStatus(activeDetails.status)}
                </span>
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setNote("");
                  }}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#181c24] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh] custom-scrollbar">
              {/* Detailed Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#12151a] border border-[#1e2229] flex items-center gap-3">
                  <div className="p-2 bg-[#1a1e26] text-cyan-400 border border-[#222733] rounded-lg shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">TEAM NAME</p>
                    <p className="text-xs font-semibold text-gray-200 truncate mt-0.5">
                      {activeDetails.team_name}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#12151a] border border-[#1e2229] flex items-center gap-3">
                  <div className="p-2 bg-[#1a1e26] text-cyan-400 border border-[#222733] rounded-lg shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">REQUESTED ROLE</p>
                    <p className="text-xs font-semibold text-gray-200 truncate mt-0.5">
                      {activeDetails.role_label}
                    </p>
                  </div>
                </div>

                {/* <div className="p-3.5 rounded-xl bg-[#12151a] border border-[#1e2229] flex items-center gap-3">
                  <div className="p-2 bg-[#1a1e26] text-cyan-400 border border-[#222733] rounded-lg shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">REQUEST RANK</p>
                    <p className="text-xs font-semibold text-gray-200 truncate mt-0.5">
                      Rank {activeDetails.rank !== undefined ? activeDetails.rank : "N/A"}
                    </p>
                  </div>
                </div> */}

                <div className="p-3.5 rounded-xl bg-[#12151a] border border-[#1e2229] flex items-center gap-3">
                  <div className="p-2 bg-[#1a1e26] text-cyan-400 border border-[#222733] rounded-lg shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">SUBMITTED ON</p>
                    <p className="text-xs font-semibold text-gray-200 truncate mt-0.5">
                      {activeDetails.created_at
                        ? new Date(activeDetails.created_at).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Extended detail query loader */}
              {isDetailsLoading && (
                <div className="p-4 bg-[#12151a] border border-[#1e2229] rounded-xl flex items-center justify-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-xs text-gray-400">Loading extended details...</span>
                </div>
              )}

              {/* Action Note review details */}
              {activeDetails.review_note && (
                <div className="p-4 rounded-xl bg-gray-950/40 border border-[#1e2229] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Existing Review Note</span>
                  </div>
                  <p className="text-xs text-gray-300 italic bg-[#0c0e12] p-3 rounded-lg border border-[#1e2229]/60">
                    "{activeDetails.review_note}"
                  </p>
                  {activeDetails.approved_at && (
                    <p className="text-[10px] text-gray-500 text-right">
                      Actioned at {new Date(activeDetails.approved_at).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Note Entry Area */}
              {normalizeStatus(activeDetails.status) === "pending" && (
                <div className="space-y-2 pt-2 border-t border-[#1a1d24]">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Review Decision Notes (Optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Provide details or reasoning for the approval/rejection decision..."
                    className="w-full min-h-[90px] text-xs bg-[#12151a] text-white rounded-lg border border-[#222733] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all p-3 placeholder-gray-500 resize-y"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-5 border-t border-[#1a1d24] bg-[#08090a] flex items-center justify-end gap-3">
              {normalizeStatus(activeDetails.status) === "pending" ? (
                <>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleDecision(false)}
                    className="py-2.5 px-4 bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/40 hover:border-red-500/70 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    <span>Reject Submission</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleDecision(true)}
                    className="py-2.5 px-4 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-500/40 hover:border-emerald-500/70 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Approve Membership</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null);
                    setNote("");
                  }}
                  className="py-2.5 px-5 bg-[#12151a] hover:bg-[#1a1e26] border border-[#222733] rounded-xl text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
                >
                  Close details
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

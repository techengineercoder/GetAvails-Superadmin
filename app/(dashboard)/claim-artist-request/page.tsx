"use client";

import React, { useState, useMemo } from "react";
import {
    UserPlus,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Building2,
    Mail,
    Phone,
    Music,
    Globe,
    UserCheck,
    ShieldCheck,
    Star,
    Calendar,
    AlertCircle,
    Eye,
    Check,
    X,
    Filter,
    RefreshCw,
    MessageSquare,
    Sparkles,
    Info,
} from "lucide-react";
import { toast } from "sonner";

export interface ClaimArtistRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    genre: string;
    image: string;
    initials: string;
    avatarBg: string;
    isFavorite: boolean;
    isAvails: boolean;
    claimStatus: string;
    yourName: string;
    companyAgency: string;
    businessEmail: string;
    role: string;
    representation: string;
    status: "pending" | "approved" | "rejected";
    submittedAt: string;
    rejectionReason?: string;
    notes?: string;
}

const INITIAL_REQUESTS: ClaimArtistRequest[] = [
    {
        id: "mock-1",
        name: "Billie Eillesh",
        email: "billie@eillesh.com",
        phone: "+1 310 992 4855",
        genre: "Classic Rock",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        initials: "BE",
        avatarBg: "bg-blue-600",
        isFavorite: false,
        isAvails: false,
        claimStatus: "Verified Representative",
        yourName: "Alex Vance",
        companyAgency: "Paradigm Talent Agency",
        businessEmail: "alex@paradigm.com",
        role: "Agent",
        representation: "Worldwide",
        status: "pending",
        submittedAt: "2026-08-10T11:20:00Z",
    },
    {
        id: "mock-2",
        name: "Dua Lipa",
        email: "dua@dualipa.com",
        phone: "+44 20 7946 0912",
        genre: "Pop / Dance",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
        initials: "DL",
        avatarBg: "bg-purple-600",
        isFavorite: true,
        isAvails: true,
        claimStatus: "Verified Representative",
        yourName: "Sarah Jenkins",
        companyAgency: "WME Entertainment",
        businessEmail: "s.jenkins@wmeagency.com",
        role: "Senior Manager",
        representation: "Europe & Asia",
        status: "approved",
        submittedAt: "2026-08-08T14:15:00Z",
    },
    {
        id: "mock-3",
        name: "Kendrick Lamar",
        email: "kendrick@pglang.com",
        phone: "+1 310 555 0199",
        genre: "Hip-Hop / Rap",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        initials: "KL",
        avatarBg: "bg-emerald-600",
        isFavorite: true,
        isAvails: false,
        claimStatus: "Pending Audit",
        yourName: "Dave Free",
        companyAgency: "pgLang LLC",
        businessEmail: "dave@pglang.com",
        role: "Executive Producer",
        representation: "Worldwide",
        status: "pending",
        submittedAt: "2026-08-09T09:45:00Z",
    },
    {
        id: "mock-4",
        name: "Arctic Monkeys",
        email: "contact@arcticmonkeys.com",
        phone: "+44 114 496 0123",
        genre: "Indie Rock",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
        initials: "AM",
        avatarBg: "bg-amber-600",
        isFavorite: false,
        isAvails: true,
        claimStatus: "Unverified Claim",
        yourName: "Michael Thorne",
        companyAgency: "Independent Music Mgmt",
        businessEmail: "m.thorne@imm-music.co.uk",
        role: "Booking Agent",
        representation: "UK & Europe",
        status: "rejected",
        submittedAt: "2026-08-06T16:30:00Z",
        rejectionReason: "Missing official authorization documentation from artist management.",
    },
];

export default function ClaimArtistRequestPage() {
    const [requests, setRequests] = useState<ClaimArtistRequest[]>(INITIAL_REQUESTS);
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<string>("all");

    // Modal States
    const [selectedRequest, setSelectedRequest] = useState<ClaimArtistRequest | null>(null);
    const [modalType, setModalType] = useState<"detail" | "approve" | "reject" | null>(null);
    const [rejectReasonInput, setRejectReasonInput] = useState("");
    const [approvalNoteInput, setApprovalNoteInput] = useState("");

    // Filtered requests
    const filteredRequests = useMemo(() => {
        return requests.filter((req) => {
            // Tab filter
            if (activeTab !== "all" && req.status !== activeTab) return false;

            // Genre filter
            if (selectedGenre !== "all" && req.genre.toLowerCase() !== selectedGenre.toLowerCase()) {
                return false;
            }

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = req.name.toLowerCase().includes(q);
                const matchesEmail = req.email.toLowerCase().includes(q);
                const matchesRep = req.yourName.toLowerCase().includes(q);
                const matchesAgency = req.companyAgency.toLowerCase().includes(q);
                const matchesGenre = req.genre.toLowerCase().includes(q);
                const matchesRole = req.role.toLowerCase().includes(q);

                return matchesName || matchesEmail || matchesRep || matchesAgency || matchesGenre || matchesRole;
            }

            return true;
        });
    }, [requests, activeTab, searchQuery, selectedGenre]);

    // Counts
    const counts = useMemo(() => {
        return {
            all: requests.length,
            pending: requests.filter((r) => r.status === "pending").length,
            approved: requests.filter((r) => r.status === "approved").length,
            rejected: requests.filter((r) => r.status === "rejected").length,
        };
    }, [requests]);

    // Genres list for filter dropdown
    const genresList = useMemo(() => {
        const set = new Set<string>();
        requests.forEach((r) => set.add(r.genre));
        return Array.from(set);
    }, [requests]);

    // Toggle favorite
    const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setRequests((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const nextFav = !item.isFavorite;
                    toast.success(nextFav ? `Added ${item.name} to favorites` : `Removed ${item.name} from favorites`);
                    return { ...item, isFavorite: nextFav };
                }
                return item;
            })
        );
    };

    // Open Approval Modal
    const openApproveModal = (req: ClaimArtistRequest, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedRequest(req);
        setApprovalNoteInput("");
        setModalType("approve");
    };

    // Confirm Approval Action
    const confirmApproval = () => {
        if (!selectedRequest) return;

        setRequests((prev) =>
            prev.map((item) =>
                item.id === selectedRequest.id
                    ? {
                        ...item,
                        status: "approved",
                        notes: approvalNoteInput.trim() || undefined,
                    }
                    : item
            )
        );

        toast.success(`Approved claim request for ${selectedRequest.name}!`);
        setModalType(null);
        setSelectedRequest(null);
    };

    // Open Reject Modal
    const openRejectModal = (req: ClaimArtistRequest, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedRequest(req);
        setRejectReasonInput("");
        setModalType("reject");
    };

    // Confirm Rejection Action
    const confirmRejection = () => {
        if (!selectedRequest) return;

        setRequests((prev) =>
            prev.map((item) =>
                item.id === selectedRequest.id
                    ? {
                        ...item,
                        status: "rejected",
                        rejectionReason: rejectReasonInput.trim() || "Request did not meet representative verification criteria.",
                    }
                    : item
            )
        );

        toast.error(`Rejected claim request for ${selectedRequest.name}`);
        setModalType(null);
        setSelectedRequest(null);
    };

    // Open Detail Modal
    const openDetailModal = (req: ClaimArtistRequest) => {
        setSelectedRequest(req);
        setModalType("detail");
    };

    // Status Badge Helper Component
    const StatusBadge = ({ status }: { status: "pending" | "approved" | "rejected" }) => {
        if (status === "approved") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approved
                </span>
            );
        }
        if (status === "rejected") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                    <XCircle className="w-3.5 h-3.5" />
                    Rejected
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                Pending Review
            </span>
        );
    };

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 text-gray-100 min-h-screen">
            {/* Top Banner / Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f242d] pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        Claim Artist Requests
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Review and manage artist representation claims from booking agents, managers, and representatives.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setRequests(INITIAL_REQUESTS);
                            toast.info("Reset dataset to initial state");
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-[#131720] hover:bg-[#1a202c] text-gray-300 rounded-xl border border-[#262c38] transition-all cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                        Reset Data
                    </button>
                </div>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total */}
                <div className="p-4 rounded-2xl bg-[#0e1117] border border-[#1b202a] flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-400">Total Claims</p>
                        <p className="text-2xl font-bold text-white mt-1">{counts.all}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <UserCheck className="w-5 h-5" />
                    </div>
                </div>

                {/* Pending */}
                <div className="p-4 rounded-2xl bg-[#0e1117] border border-[#1b202a] flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-400">Pending Review</p>
                        <p className="text-2xl font-bold text-amber-400 mt-1">{counts.pending}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                {/* Approved */}
                <div className="p-4 rounded-2xl bg-[#0e1117] border border-[#1b202a] flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-400">Approved</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">{counts.approved}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>

                {/* Rejected */}
                <div className="p-4 rounded-2xl bg-[#0e1117] border border-[#1b202a] flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-gray-400">Rejected</p>
                        <p className="text-2xl font-bold text-red-400 mt-1">{counts.rejected}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                        <XCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search Controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#0e1117] p-3 rounded-2xl border border-[#1b202a]">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
                    {(["all", "pending", "approved", "rejected"] as const).map((tab) => {
                        const isActive = activeTab === tab;
                        const count = counts[tab];

                        let activeClass = "bg-[#181d27] text-white border-[#2e3748]";
                        if (isActive) {
                            if (tab === "pending")
                                activeClass = "bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]";
                            else if (tab === "approved")
                                activeClass = "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]";
                            else if (tab === "rejected")
                                activeClass = "bg-red-950/60 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.15)]";
                            else
                                activeClass = "bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]";
                        }

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all shrink-0 cursor-pointer ${isActive
                                    ? activeClass
                                    : "bg-[#090b0e] text-gray-400 border-[#191d26] hover:bg-[#121620] hover:text-gray-200"
                                    }`}
                            >
                                <span className="capitalize">{tab}</span>
                                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-black/40 text-gray-300 font-mono">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Genre Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3">


                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search artist, agent, agency..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs bg-[#090b0e] text-gray-200 placeholder-gray-500 rounded-xl border border-[#191d26] focus:outline-none focus:border-cyan-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            {filteredRequests.length === 0 ? (
                <div className="py-16 text-center bg-[#0e1117] rounded-2xl border border-[#1b202a] space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto text-gray-500">
                        <Search className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-300">No Claim Requests Found</p>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        Try adjusting your search criteria or switching status tabs.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {filteredRequests.map((req) => (
                        <div
                            key={req.id}
                            onClick={() => openDetailModal(req)}
                            className="group relative bg-[#0e1117] hover:bg-[#12161f] rounded-2xl border border-[#1b202a] hover:border-cyan-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-cyan-500/5"
                        >
                            {/* Card Header & Artist Banner */}
                            <div className="p-5 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3.5">
                                        {/* Avatar Image or Fallback */}
                                        <div className="relative">
                                            {req.image ? (
                                                <img
                                                    src={req.image}
                                                    alt={req.name}
                                                    className="w-14 h-14 rounded-2xl object-cover border border-[#2b3240] shadow-md group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        // Fallback if image fails to load
                                                        (e.target as HTMLElement).style.display = "none";
                                                        (e.target as HTMLElement).nextElementSibling?.classList.remove("hidden");
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`w-14 h-14 rounded-2xl ${req.avatarBg || "bg-cyan-600"} ${req.image ? "hidden" : "flex"
                                                    } items-center justify-center text-white font-bold text-base border border-[#2b3240] shadow-md`}
                                            >
                                                {req.initials}
                                            </div>
                                        </div>

                                        {/* Artist Main Details */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                    {req.name}
                                                </h3>
                                                {/* <button
                                                    onClick={(e) => handleToggleFavorite(req.id, e)}
                                                    title="Toggle Favorite"
                                                    className="text-gray-500 hover:text-amber-400 transition-colors"
                                                >
                                                    <Star
                                                        className={`w-4 h-4 ${req.isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-500"
                                                            }`}
                                                    />
                                                </button> */}
                                            </div>

                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#191e29] border border-[#262d3d] text-gray-300 text-[11px] font-medium">
                                                    <Music className="w-3 h-3 text-cyan-400" />
                                                    {req.genre}
                                                </span>
                                                {req.isAvails && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                                                        <Sparkles className="w-3 h-3" /> Avails
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <StatusBadge status={req.status} />
                                </div>

                                {/* Representative Details Box */}
                                <div className="p-3.5 rounded-xl bg-[#08090d] border border-[#171b24] space-y-2 text-xs">
                                    <div className="flex items-center justify-between border-b border-[#141720] pb-2">
                                        <span className="text-gray-400 font-medium flex items-center gap-1.5">
                                            <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Representative:
                                        </span>
                                        <span className="font-semibold text-white">{req.yourName}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 font-medium flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-gray-500" /> Agency/Company:
                                        </span>
                                        <span className="font-medium text-gray-200 truncate max-w-[150px]" title={req.companyAgency}>
                                            {req.companyAgency}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 font-medium flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Role:
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-[#161c28] text-cyan-300 text-[11px] font-medium border border-[#232d40]">
                                            {req.role}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 font-medium flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-gray-500" /> Territory:
                                        </span>
                                        <span className="text-gray-300 font-medium">{req.representation}</span>
                                    </div>
                                </div>

                                {/* Contact snippet */}
                                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                                    <span className="flex items-center gap-1 truncate max-w-[170px]" title={req.businessEmail}>
                                        <Mail className="w-3 h-3 text-gray-500 shrink-0" />
                                        {req.businessEmail}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-gray-500 shrink-0" />
                                        {req.phone}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons Footer */}
                            <div className="p-4 bg-[#090b0e] border-t border-[#191d26] flex items-center justify-between gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDetailModal(req);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#131720] hover:bg-[#1a202c] text-gray-300 border border-[#262c38] transition-colors cursor-pointer"
                                >
                                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                    View Details
                                </button>

                                {req.status === "pending" ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => openRejectModal(req, e)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Reject
                                        </button>
                                        <button
                                            onClick={(e) => openApproveModal(req, e)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)] transition-all cursor-pointer"
                                        >
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            Accept
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        {req.status === "approved" && (
                                            <span className="text-[11px] text-emerald-400 font-medium">Claim Verified</span>
                                        )}
                                        {req.status === "rejected" && (
                                            <span className="text-[11px] text-red-400 font-medium">Claim Denied</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DETAIL MODAL */}
            {modalType === "detail" && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0e1117] border border-[#232936] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-5 bg-[#090b0e] border-b border-[#1d222e] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Artist Claim Details</h2>
                                    <p className="text-xs text-gray-400">Request ID: {selectedRequest.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setModalType(null);
                                    setSelectedRequest(null);
                                }}
                                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content Scrollable */}
                        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
                            {/* Artist Overview Banner */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[#121620] border border-[#212734]">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {selectedRequest.image ? (
                                            <img
                                                src={selectedRequest.image}
                                                alt={selectedRequest.name}
                                                className="w-16 h-16 rounded-2xl object-cover border border-[#2d3546]"
                                            />
                                        ) : (
                                            <div
                                                className={`w-16 h-16 rounded-2xl ${selectedRequest.avatarBg || "bg-cyan-600"
                                                    } flex items-center justify-center text-white font-bold text-lg border border-[#2d3546]`}
                                            >
                                                {selectedRequest.initials}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{selectedRequest.name}</h3>
                                        <p className="text-xs text-gray-400">{selectedRequest.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30">
                                                {selectedRequest.genre}
                                            </span>
                                            <span className="text-gray-400">{selectedRequest.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <StatusBadge status={selectedRequest.status} />
                                </div>
                            </div>

                            {/* Representative / Claimant Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-[#090b0e] border border-[#191d26] space-y-2.5">
                                    <h4 className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
                                        Representative Info
                                    </h4>
                                    <div>
                                        <span className="text-gray-400 block text-[10px]">Full Name</span>
                                        <span className="text-sm font-semibold text-white">{selectedRequest.yourName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px]">Role / Position</span>
                                        <span className="text-xs font-medium text-gray-200">{selectedRequest.role}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px]">Business Email</span>
                                        <span className="text-xs font-medium text-cyan-300">{selectedRequest.businessEmail}</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-[#090b0e] border border-[#191d26] space-y-2.5">
                                    <h4 className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
                                        Agency & Territory
                                    </h4>
                                    <div>
                                        <span className="text-gray-400 block text-[10px]">Company / Agency</span>
                                        <span className="text-sm font-semibold text-white">{selectedRequest.companyAgency}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px]">Representation Territory</span>
                                        <span className="text-xs font-medium text-gray-200">{selectedRequest.representation}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px]">Claim Status Tag</span>
                                        <span className="text-xs font-medium text-gray-300">{selectedRequest.claimStatus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection / Note Box if present */}
                            {selectedRequest.rejectionReason && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-1">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <AlertCircle className="w-4 h-4 text-red-400" /> Rejection Reason:
                                    </div>
                                    <p className="text-xs">{selectedRequest.rejectionReason}</p>
                                </div>
                            )}

                            {selectedRequest.notes && (
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Admin Note:
                                    </div>
                                    <p className="text-xs">{selectedRequest.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-[#090b0e] border-t border-[#1d222e] flex items-center justify-between">
                            <button
                                onClick={() => {
                                    setModalType(null);
                                    setSelectedRequest(null);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#131720] hover:bg-[#1a202c] text-gray-300 border border-[#262c38]"
                            >
                                Close
                            </button>

                            {selectedRequest.status === "pending" && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setRejectReasonInput("");
                                            setModalType("reject");
                                        }}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                                    >
                                        Reject Claim
                                    </button>
                                    <button
                                        onClick={() => {
                                            setApprovalNoteInput("");
                                            setModalType("approve");
                                        }}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                                    >
                                        Accept Claim
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* APPROVE CONFIRMATION MODAL */}
            {modalType === "approve" && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0e1117] border border-[#232936] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Approve Claim Request</h3>
                                <p className="text-xs text-gray-400">Assign representation rights to {selectedRequest.yourName}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed bg-[#090b0e] p-3 rounded-xl border border-[#191d26]">
                            You are about to verify <strong className="text-white">{selectedRequest.yourName}</strong> from{" "}
                            <strong className="text-white">{selectedRequest.companyAgency}</strong> as the official representative
                            for <strong className="text-cyan-300">{selectedRequest.name}</strong>.
                        </p>

                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-400 font-medium">Optional Approval Note</label>
                            <textarea
                                rows={3}
                                placeholder="Add any verification note or scope details..."
                                value={approvalNoteInput}
                                onChange={(e) => setApprovalNoteInput(e.target.value)}
                                className="w-full p-3 text-xs bg-[#090b0e] text-gray-200 rounded-xl border border-[#1e2330] focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setModalType(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#131720] hover:bg-[#1a202c] text-gray-300 border border-[#262c38]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApproval}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                            >
                                Confirm Approval
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REJECT CONFIRMATION MODAL */}
            {modalType === "reject" && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0e1117] border border-[#232936] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Reject Claim Request</h3>
                                <p className="text-xs text-gray-400">Decline representation claim for {selectedRequest.name}</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-400 font-medium">Rejection Reason / Feedback</label>
                            <textarea
                                rows={3}
                                placeholder="Specify why this claim request is being rejected (e.g. invalid documentation)..."
                                value={rejectReasonInput}
                                onChange={(e) => setRejectReasonInput(e.target.value)}
                                className="w-full p-3 text-xs bg-[#090b0e] text-gray-200 rounded-xl border border-[#1e2330] focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setModalType(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#131720] hover:bg-[#1a202c] text-gray-300 border border-[#262c38]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRejection}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

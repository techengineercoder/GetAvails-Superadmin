"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  useGetAllTermsQuery, 
  useUpdateTermsMutation 
} from "@/redux/feature/termsSlice";
import { toast } from "sonner";
import { 
  Loader2, 
  Save, 
  FileText, 
  Eye, 
  Code, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Link2, 
  Unlink, 
  Undo, 
  Redo, 
  Maximize2, 
  Minimize2, 
  RefreshCw,
  Globe,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface TermsPageItem {
  id: number;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ToolbarButtonProps {
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({ onClick, active = false, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      title={title}
      className={`p-1.5 rounded hover:bg-[#1e2229] transition-colors flex items-center justify-center cursor-pointer ${
        active ? "text-cyan-400 bg-[#12151a]" : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function SiteTermsManagement() {
  const { data: termsData, isLoading: listLoading, error: fetchError, refetch } = useGetAllTermsQuery(undefined);
  const [updateTerms, { isLoading: isSaving }] = useUpdateTermsMutation();

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Keep track of original values to detect unsaved changes
  const [originalValues, setOriginalValues] = useState({
    title: "",
    content: "",
    isPublished: true,
  });

  const [isCodeView, setIsCodeView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const listItems = termsData?.results || [];
  const selectedItem = listItems.find((item: TermsPageItem) => item.slug === selectedSlug);

  // Set selected item on list load if none selected
  useEffect(() => {
    if (listItems.length > 0 && !selectedSlug) {
      const firstSlug = listItems[0].slug;
      setSelectedSlug(firstSlug);
    }
  }, [listItems, selectedSlug]);

  // Load selected item data into form states
  useEffect(() => {
    if (selectedItem) {
      setTitle(selectedItem.title);
      setContent(selectedItem.content);
      setIsPublished(selectedItem.is_published);
      setOriginalValues({
        title: selectedItem.title,
        content: selectedItem.content,
        isPublished: selectedItem.is_published,
      });
      setIsCodeView(false);

      // Populate contentEditable div directly to avoid React cursor resetting
      if (editorRef.current) {
        editorRef.current.innerHTML = selectedItem.content;
      }
    }
  }, [selectedSlug, selectedItem]);

  // Sync content state when exiting code view back to visual view
  useEffect(() => {
    if (!isCodeView && editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [isCodeView, content]);

  const hasUnsavedChanges = 
    title !== originalValues.title || 
    content !== originalValues.content || 
    isPublished !== originalValues.isPublished;

  const executeCommand = (command: string, value: string = "") => {
    if (isCodeView) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    if (isCodeView) return;
    const url = prompt("Enter the URL link:");
    if (url) {
      const href = url.startsWith("http") ? url : `https://${url}`;
      executeCommand("createLink", href);
    }
  };

  const formatBlock = (blockType: string) => {
    executeCommand("formatBlock", blockType);
  };

  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

  const handleSave = async () => {
    if (!selectedSlug) return;
    if (!title.trim()) {
      toast.error("Document title cannot be empty.");
      return;
    }

    try {
      await updateTerms({
        slug: selectedSlug,
        data: {
          slug: selectedSlug,
          title,
          content,
          is_published: isPublished,
        }
      }).unwrap();

      toast.success("Document updated successfully!");
      // Update original values
      setOriginalValues({
        title,
        content,
        isPublished,
      });
    } catch (err: any) {
      console.error("Save terms error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to update page contents.");
    }
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate word and character count
  const getEditorStats = () => {
    const text = content.replace(/<[^>]*>/g, " ").trim();
    const chars = text.length;
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return { words, chars };
  };

  const { words, chars } = getEditorStats();

  return (
    <div className="space-y-6">
      {/* Visual Rich Text Editor Typography Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .editor-content h1 {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #ffffff !important;
          line-height: 1.25 !important;
        }
        .editor-content h2 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.5rem !important;
          color: #ffffff !important;
          line-height: 1.3 !important;
        }
        .editor-content h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
          color: #ffffff !important;
          line-height: 1.4 !important;
        }
        .editor-content p {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.625 !important;
          color: #d1d5db !important;
        }
        .editor-content ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }
        .editor-content ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }
        .editor-content li {
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .editor-content a {
          color: #00b4d8 !important;
          text-decoration: underline !important;
        }
        .editor-content a:hover {
          color: #00f0ff !important;
        }
        .editor-content blockquote {
          border-left: 3px solid #00b4d8 !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          color: #9ca3af !important;
          margin: 1rem 0 !important;
        }
      `}} />
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Site Terms & Conditions Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage public platform documents, privacy guidelines, and policies with rich layout configuration.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f131a] hover:bg-[#1a1f29] border border-[#1b202a] rounded-xl text-xs text-gray-300 hover:text-white transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Content
        </button>
      </div>

      {listLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0c0e12] border border-[#1e2229] rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-3" />
          <p className="text-xs text-gray-400">Loading terms data and layouts...</p>
        </div>
      ) : fetchError ? (
        <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-200">Failed to load platform documents</p>
          <p className="text-xs text-red-400 mt-1">Please ensure the backend api is active and authorized.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel - Document Cards List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
              Documents ({listItems.length})
            </h2>
            <div className="space-y-3">
              {listItems.map((item: TermsPageItem) => {
                const isActive = item.slug === selectedSlug;
                const itemHasUnsaved = item.slug === selectedSlug && hasUnsavedChanges;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        const confirmLeave = window.confirm("You have unsaved changes in this document. Leave anyway?");
                        if (!confirmLeave) return;
                      }
                      setSelectedSlug(item.slug);
                    }}
                    className={`w-full text-left rounded-xl p-4 border transition-all cursor-pointer flex flex-col gap-2 relative ${
                      isActive
                        ? "bg-[#0c0e12] border-[#222733] shadow-lg shadow-cyan-500/[0.02]"
                        : "bg-[#08090a] border-[#12151c] hover:border-[#1e2229] hover:bg-[#0c0e12]/40"
                    }`}
                  >
                    {/* Unsaved indicator */}
                    {itemHasUnsaved && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" title="Unsaved changes" />
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isActive ? "text-cyan-400" : "text-white"}`}>
                        {item.title || item.slug}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.is_published 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}>
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 text-[10px] text-gray-500">
                      <span>Slug: <span className="font-mono text-gray-400">{item.slug}</span></span>
                      <span>Last updated: {formatDate(item.updated_at)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel - Rich Text Editor Workspace */}
          <div className="lg:col-span-8">
            {selectedSlug ? (
              <div className={`bg-[#0c0e12] border border-[#1e2229] rounded-2xl flex flex-col relative overflow-hidden transition-all duration-300 ${
                isFullscreen ? "fixed inset-4 z-50 bg-[#0c0e12] shadow-2xl" : ""
              }`}>
                {/* Header configuration */}
                <div className="p-4 border-b border-[#1b202a] space-y-4">
                  {/* Title configuration */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Document Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#12151a] border border-[#222733] rounded-xl px-4 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        placeholder="Privacy Policy"
                      />
                    </div>

                    {/* Status Publish selector */}
                    <div className="flex flex-row md:flex-col justify-between items-center md:items-start gap-1">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Publish Status
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPublished(!isPublished)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                            isPublished ? "bg-emerald-500" : "bg-gray-700"
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow ${
                            isPublished ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                        <span className={`text-xs font-semibold ${isPublished ? "text-emerald-400" : "text-gray-400"}`}>
                          {isPublished ? "Published (Public)" : "Draft (Restricted)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Slug detail link */}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pl-0.5">
                    <Globe className="w-3.5 h-3.5 text-gray-600" />
                    <span>Public Route:</span>
                    <span className="font-mono text-cyan-500 hover:underline cursor-pointer">
                      /pages/{selectedSlug}
                    </span>
                  </div>
                </div>

                {/* Editor formatting toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 bg-[#0e1117] border-b border-[#1b202a]">
                  <div className="flex flex-wrap items-center gap-1">
                    {/* Headings */}
                    <ToolbarButton onClick={() => formatBlock("P")} title="Normal Text">
                      <span className="text-[10px] font-extrabold font-mono">P</span>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => formatBlock("H1")} title="Heading 1">
                      <span className="text-[10px] font-extrabold font-mono">H1</span>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => formatBlock("H2")} title="Heading 2">
                      <span className="text-[10px] font-extrabold font-mono">H2</span>
                    </ToolbarButton>
                    <ToolbarButton onClick={() => formatBlock("H3")} title="Heading 3">
                      <span className="text-[10px] font-extrabold font-mono">H3</span>
                    </ToolbarButton>

                    <div className="w-[1px] h-4 bg-[#222733] mx-1" />

                    {/* Inline Formatting */}
                    <ToolbarButton onClick={() => executeCommand("bold")} title="Bold">
                      <Bold className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("italic")} title="Italic">
                      <Italic className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("underline")} title="Underline">
                      <Underline className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("strikeThrough")} title="Strikethrough">
                      <Strikethrough className="w-3.5 h-3.5" />
                    </ToolbarButton>

                    <div className="w-[1px] h-4 bg-[#222733] mx-1" />

                    {/* Alignments */}
                    <ToolbarButton onClick={() => executeCommand("justifyLeft")} title="Align Left">
                      <AlignLeft className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("justifyCenter")} title="Align Center">
                      <AlignCenter className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("justifyRight")} title="Align Right">
                      <AlignRight className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("justifyFull")} title="Justify">
                      <AlignJustify className="w-3.5 h-3.5" />
                    </ToolbarButton>

                    <div className="w-[1px] h-4 bg-[#222733] mx-1" />

                    {/* Lists */}
                    <ToolbarButton onClick={() => executeCommand("insertUnorderedList")} title="Bullet List">
                      <List className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("insertOrderedList")} title="Numbered List">
                      <ListOrdered className="w-3.5 h-3.5" />
                    </ToolbarButton>

                    <div className="w-[1px] h-4 bg-[#222733] mx-1" />

                    {/* Links */}
                    <ToolbarButton onClick={addLink} title="Insert Link">
                      <Link2 className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("unlink")} title="Remove Link">
                      <Unlink className="w-3.5 h-3.5" />
                    </ToolbarButton>

                    <div className="w-[1px] h-4 bg-[#222733] mx-1" />

                    {/* Undo / Redo */}
                    <ToolbarButton onClick={() => executeCommand("undo")} title="Undo">
                      <Undo className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => executeCommand("redo")} title="Redo">
                      <Redo className="w-3.5 h-3.5" />
                    </ToolbarButton>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-1">
                    {/* Code mode toggle */}
                    <ToolbarButton 
                      onClick={() => setIsCodeView(!isCodeView)} 
                      active={isCodeView} 
                      title={isCodeView ? "Visual Editor" : "HTML Code Editor"}
                    >
                      {isCodeView ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
                    </ToolbarButton>

                    {/* Full screen toggle */}
                    <ToolbarButton 
                      onClick={() => setIsFullscreen(!isFullscreen)} 
                      active={isFullscreen} 
                      title={isFullscreen ? "Minimize" : "Full Screen"}
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </ToolbarButton>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className={`p-4 overflow-y-auto ${
                  isFullscreen ? "flex-1 min-h-[300px]" : "h-[380px]"
                }`}>
                  {isCodeView ? (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-full bg-[#12151a] text-mono text-xs text-[#00ffcc] p-4 rounded-xl border border-[#222733] focus:outline-none focus:border-cyan-500 font-mono resize-none leading-relaxed"
                      placeholder="<h1>Title</h1><p>Writing raw HTML structure here...</p>"
                    />
                  ) : (
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleContentInput}
                      className="w-full h-full text-sm text-gray-200 focus:outline-none leading-relaxed editor-content max-w-none focus:ring-0 select-text"
                      style={{ minHeight: "100%" }}
                    />
                  )}
                </div>

                {/* Editor Footer metadata */}
                <div className="px-4 py-3 bg-[#0e1117] border-t border-[#1b202a] flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>{words} words</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span>{chars} characters</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Unsaved changes badge */}
                    {hasUnsavedChanges && (
                      <span className="flex items-center gap-1 text-amber-500 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Unsaved changes
                      </span>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-50 disabled:bg-[#1a1f29] disabled:text-gray-500 disabled:border-transparent text-white font-semibold rounded-lg shadow-md transition-all cursor-pointer text-xs"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 py-24 bg-[#0c0e12] border border-[#1e2229] rounded-2xl text-center">
                <ShieldCheck className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-sm font-semibold text-gray-300">No document selected</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
                  Please select one of the legal policy documents from the left to load its editor settings.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

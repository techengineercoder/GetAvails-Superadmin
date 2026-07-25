"use client";

import React, { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
  Quote,
  Eraser,
  Heading2,
  Heading3,
} from "lucide-react";

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function WysiwygEditor({
  content,
  onChange,
  placeholder = "Compose your article here...",
}: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor innerHTML once on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const executeCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addHyperlink = () => {
    const url = prompt("Enter the hyperlink URL (e.g. https://google.com):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const clearFormatting = () => {
    executeCommand("removeFormat");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = e.clipboardData.getData("text/plain");
    const hasHtmlTags = /<[a-z/][\s\S]*>/i.test(pastedText);

    if (hasHtmlTags) {
      e.preventDefault();
      document.execCommand("insertHTML", false, pastedText);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-[#1e2229] bg-[#0c0e12] focus-within:border-cyan-500/80 transition-all shadow-md">
      {/* Dynamic CSS for contenteditable placeholder */}
      <style>{`
        .wysiwyg-editor:empty:before {
          content: attr(data-placeholder);
          color: #4b5563;
          font-style: italic;
          cursor: text;
        }
      `}</style>

      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-[#08090a] border-b border-[#1e2229] select-none items-center">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("strikeThrough")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[#1e2229] mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<h2>")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<h3>")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[#1e2229] mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[#1e2229] mx-1" />

        <button
          type="button"
          onClick={addHyperlink}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Add Link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<blockquote>")}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-[#1e2229] mx-1" />

        <button
          type="button"
          onClick={clearFormatting}
          className="p-1.5 hover:bg-[#12151f] hover:text-cyan-400 text-gray-400 rounded transition-colors cursor-pointer"
          title="Clear Formatting"
        >
          <Eraser className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* WYSIWYG Content Editable Zone */}
      <div
        ref={editorRef}
        contentEditable
        data-placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
        className="wysiwyg-editor w-full min-h-[250px] max-h-[355px] overflow-y-auto custom-scrollbar p-4 bg-[#0d0f12] text-gray-200 text-xs focus:outline-none leading-relaxed prose prose-invert max-w-none"
        style={{ outline: "none" }}
      />
    </div>
  );
}

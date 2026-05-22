import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, FileText, Hash } from "lucide-react";
import type { NoteId } from "../types";

interface QuickSwitcherProps {
  onSelectNote: (id: NoteId) => void;
  onClose: () => void;
}

export function QuickSwitcher({ onSelectNote, onClose }: QuickSwitcherProps) {
  const notes = useQuery(api.notes.list, {}) ?? [];
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.toLowerCase();
  const filtered = notes.filter((n: any) =>
    (n.title || "").toLowerCase().includes(q) ||
    (n.content || "").toLowerCase().includes(q) ||
    (n.tags || []).some((t: string) => t.toLowerCase().includes(q))
  ).slice(0, 20);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[selectedIdx]) {
        e.preventDefault();
        onSelectNote(filtered[selectedIdx]._id);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [query, selectedIdx]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl mx-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-3 border-b border-[var(--color-border-subtle)]">
          <Search size={16} className="text-[var(--color-text-tertiary)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Search notes..."
            className="flex-1 h-11 text-sm bg-transparent outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]"
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-1">
          {filtered.map((note: any, i: number) => (
            <button
              key={note._id}
              onClick={() => { onSelectNote(note._id); onClose(); }}
              onMouseEnter={() => setSelectedIdx(i)}
              className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                i === selectedIdx ? "bg-[var(--color-surface-subtle)]" : ""
              }`}
            >
              <FileText size={14} className="shrink-0 text-[var(--color-text-tertiary)]" />
              <span className="flex-1 text-sm text-[var(--color-text)] truncate">
                {note.title || "Untitled"}
              </span>
              {note.tags?.length > 0 && (
                <div className="flex gap-1 shrink-0">
                  {note.tags.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-0.5">
                      <Hash size={8} />{tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
          {query && filtered.length === 0 && (
            <p className="py-6 text-xs text-center text-[var(--color-text-tertiary)]">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

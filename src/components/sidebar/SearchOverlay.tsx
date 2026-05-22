import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Search, FileText, X, Hash } from "lucide-react";
import { formatDate } from "../../lib/utils";
import type { NoteId } from "../../types";

interface SearchOverlayProps {
  onClose: () => void;
  onSelectNote: (id: NoteId) => void;
}

export function SearchOverlay({ onClose, onSelectNote }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const allNotes = useQuery(api.notes.list, {}) ?? [];
  const searchResults = useQuery(api.notes.search, { query }) ?? [];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const queryLower = query.toLowerCase().trim();

  const combinedResults = queryLower
    ? [
        ...searchResults.filter((n: any) =>
          n.title?.toLowerCase().includes(queryLower) || n.content?.toLowerCase().includes(queryLower)
        ),
        ...allNotes.filter((n: any) => {
          if (searchResults.some((r: any) => r._id === n._id)) return false;
          return (
            n.title?.toLowerCase().includes(queryLower) ||
            n.tags?.some((t: string) => t.toLowerCase().includes(queryLower))
          );
        }),
      ].slice(0, 20)
    : [];

  const highlightMatches = (text: string) => {
    if (!queryLower) return text;
    const idx = text.toLowerCase().indexOf(queryLower);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + queryLower.length);
    const after = text.slice(idx + queryLower.length);
    return `${before}**${match}**${after}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 border-b border-[var(--color-border-subtle)]">
          <Search size={16} className="text-[var(--color-text-tertiary)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, content, tags..."
            className="flex-1 h-11 text-sm bg-transparent outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="rounded-lg p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-subtle)]">
              <X size={14} />
            </button>
          )}
          <button onClick={onClose} className="rounded-lg p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-subtle)]">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {queryLower && combinedResults.length === 0 && (
            <div className="py-8 text-center">
              <Search size={24} className="mx-auto mb-2 text-[var(--color-text-tertiary)]" />
              <p className="text-xs text-[var(--color-text-tertiary)]">No results found for "{query}"</p>
            </div>
          )}
          {combinedResults.map((note: any) => {
            const matchInContent = queryLower && note.content?.toLowerCase().includes(queryLower);
            const contentPreview = note.content?.slice(0, 120) || "";
            const matchIdx = contentPreview.toLowerCase().indexOf(queryLower);
            const excerpt = matchIdx >= 0
              ? "..." + contentPreview.slice(Math.max(0, matchIdx - 30), matchIdx + queryLower.length + 60) + "..."
              : contentPreview.slice(0, 80);

            return (
              <button
                key={note._id}
                onClick={() => { onSelectNote(note._id); onClose(); }}
                className="w-full flex items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--color-surface-subtle)]"
              >
                <FileText size={14} className="shrink-0 mt-0.5 text-[var(--color-text-tertiary)]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-text)] truncate">
                    {note.title || "Untitled"}
                  </div>
                  {matchInContent && (
                    <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 line-clamp-2">
                      {excerpt}
                    </div>
                  )}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {note.tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] rounded-full bg-[var(--color-accent-light)] px-1.5 py-0.5 text-[var(--color-accent)]">
                          <Hash size={8} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0">
                  {formatDate(note.updatedAt)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FileText, Plus, Trash2, Pin, Download, Sparkles, Hash, Copy, Check } from "lucide-react";
import { formatDate } from "../lib/utils";
import { useState, useCallback } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import type { NoteId } from "../types";
import { downloadAllAsZip } from "../lib/export";
import { queueNoteOp } from "../lib/offlineNotes";

interface NotesPageProps {
  onSelectNote: (id: NoteId) => void;
}

const TIPS = [
  { icon: Sparkles, text: "Press Cmd/Ctrl + D to create a daily note" },
  { icon: Hash, text: "Type #tag in a note to organize by topic" },
  { icon: FileText, text: "Press Cmd/Ctrl + P to quickly switch notes" },
  { icon: Plus, text: "Click + or press Cmd/Ctrl + K for shortcuts" },
];

export function NotesPage({ onSelectNote }: NotesPageProps) {
  const { token } = useAuth();
  const notes = useQuery(api.notes.list, token ? { token } : "skip") ?? [];
  const allTags = useQuery(api.notes.getAllTags, token ? { token } : "skip") ?? [];
  const createNote = useMutation(api.notes.create);
  const deleteNote = useMutation(api.notes.remove);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activeTag
    ? notes.filter((n: any) => n.tags?.includes(activeTag))
    : notes;

  const sorted = [...filtered].sort((a: any, b: any) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return (b.updatedAt as number) - (a.updatedAt as number);
  });

  const handleCreate = async () => {
    if (!token) return;
    if (!navigator.onLine) {
      await queueNoteOp({ type: "create", title: "Untitled" });
      return;
    }
    const id = await createNote({ title: "Untitled", token });
    onSelectNote(id);
  };

  const handleCreateDaily = async () => {
    if (!token) return;
    const today = new Date().toISOString().slice(0, 10);
    if (!navigator.onLine) {
      await queueNoteOp({ type: "create", title: `Daily Note — ${today}` });
      return;
    }
    const id = await createNote({ title: `Daily Note — ${today}`, token });
    onSelectNote(id);
  };

  const handleDelete = async (e: React.MouseEvent, noteId: NoteId) => {
    e.stopPropagation();
    if (!token) return;
    if (!confirm("Delete this note?")) return;
    if (!navigator.onLine) await queueNoteOp({ type: "remove", noteId });
    else await deleteNote({ noteId, token });
  };

  const handleCopy = useCallback(async (e: React.MouseEvent, note: any) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(note.content || "");
      setCopiedId(note._id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = note.content || "";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(note._id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  }, []);

  return (
    <div className="h-full overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="md:max-w-3xl md:mx-auto px-4 md:px-6 pt-3 md:pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text)]">
            {activeTag ? (
              <span className="flex items-center gap-2">
                <Hash size={18} />
                {activeTag}
              </span>
            ) : (
              "Notes"
            )}
          </h1>
          <div className="flex items-center gap-2">
            {notes.length > 0 && (
              <button
                onClick={() => downloadAllAsZip(notes)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors active:scale-95"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export all</span>
              </button>
            )}
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] active:scale-95"
            >
              <Plus size={16} />
              <span className="hidden md:inline">New Note</span>
            </button>
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            <button
              onClick={() => setActiveTag(null)}
              className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors active:scale-95"
              style={{
                background: activeTag === null ? "var(--color-accent)" : "var(--color-surface)",
                color: activeTag === null ? "white" : "var(--color-text-secondary)",
                border: activeTag === null ? "none" : "0.5px solid var(--color-border-subtle)",
              }}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => setActiveTag(tag.name)}
                className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors active:scale-95"
                style={{
                  background: activeTag === tag.name ? "var(--color-accent)" : "var(--color-surface)",
                  color: activeTag === tag.name ? "white" : "var(--color-text-secondary)",
                  border: activeTag === tag.name ? "none" : "0.5px solid var(--color-border-subtle)",
                }}
              >
                {tag.name} ({tag.count})
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {sorted.length === 0 && !activeTag && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 text-center space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
                <FileText size={32} className="text-[var(--color-accent)]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">Welcome to Notico</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto leading-relaxed">
                  Your MDX-native note-taking app. Quick, fast, and offline-ready.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors active:scale-95"
              >
                <Plus size={16} />
                Create your first note
              </button>
              <button
                onClick={handleCreateDaily}
                className="flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors active:scale-95"
              >
                <FileText size={16} />
                Start daily note
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 max-w-md mx-auto">
              {TIPS.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.text} className="flex items-start gap-2.5 text-left p-2.5 rounded-xl bg-[var(--color-surface-subtle)]">
                    <Icon size={14} className="shrink-0 mt-0.5 text-[var(--color-accent)]" />
                    <span className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{tip.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty tag filter */}
        {sorted.length === 0 && activeTag && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Hash size={36} className="text-[var(--color-text-tertiary)] mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)]">
              No notes with tag <strong>{activeTag}</strong>
            </p>
            <button
              onClick={() => setActiveTag(null)}
              className="mt-2 text-sm text-[var(--color-accent)] hover:underline font-medium"
            >
              View all notes
            </button>
          </div>
        )}

        {/* Note list */}
        {sorted.length > 0 && (
          <div className="space-y-2">
            {sorted.map((note: any) => {
              const isCopied = copiedId === note._id;
              return (
                <div key={note._id} className="flex w-full min-w-0 items-stretch gap-2 overflow-hidden">
                <div
                  className="group min-w-0 flex-1 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3.5 transition-all active:scale-[0.98] cursor-pointer hover:border-[var(--color-border)] hover:shadow-sm"
                  onClick={() => onSelectNote(note._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0 mt-0.5">
                      <FileText size={18} className="text-[var(--color-text-tertiary)]" />
                      {note.isPinned && (
                        <Pin size={10} className="absolute -top-1.5 -right-1.5 text-[var(--color-accent)] fill-[var(--color-accent)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                        {note.title || "Untitled"}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] truncate mt-1 leading-relaxed">
                        {note.content?.slice(0, 100).replace(/[#*`\[\]]/g, "") || "Empty note"}
                      </p>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {note.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[10px] rounded-full px-2 py-0.5 font-medium"
                              style={{
                                background: "var(--color-accent-light)",
                                color: "var(--color-accent)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[10px] text-[var(--color-text-tertiary)]">
                          {formatDate(note.updatedAt)}
                        </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDelete(e, note._id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors active:scale-90"
                          title="Delete note"
                          aria-label="Delete note"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleCopy(e, note)}
                  className="flex w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors active:scale-95 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] sm:w-12"
                  title="Copy content"
                  aria-label="Copy note content"
                >
                  {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

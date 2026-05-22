import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FileText, Plus, Trash2, Pin, Download, Sparkles, Hash } from "lucide-react";
import { formatDate } from "../lib/utils";
import { useState } from "react";
import type { NoteId } from "../types";
import { downloadAllAsZip } from "../lib/export";

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
  const notes = useQuery(api.notes.list, {}) ?? [];
  const allTags = useQuery(api.notes.getAllTags) ?? [];
  const createNote = useMutation(api.notes.create);
  const deleteNote = useMutation(api.notes.remove);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? notes.filter((n: any) => n.tags?.includes(activeTag))
    : notes;

  const sorted = [...filtered].sort((a: any, b: any) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return (b.updatedAt as number) - (a.updatedAt as number);
  });

  const handleCreate = async () => {
    const id = await createNote({ title: "Untitled" });
    onSelectNote(id);
  };

  const handleCreateDaily = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const id = await createNote({ title: `Daily Note — ${today}` });
    onSelectNote(id);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-3 md:px-6 py-3 md:py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text)]">
            {activeTag ? <span className="flex items-center gap-2"><Hash size={18} />{activeTag}</span> : "Notes"}
          </h1>
          <div className="flex items-center gap-2">
            {notes.length > 0 && (
              <button
                onClick={() => downloadAllAsZip(notes)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export all</span>
              </button>
            )}
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              <Plus size={16} />
              <span className="hidden md:inline">New Note</span>
            </button>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                activeTag === null
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)]"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => setActiveTag(tag.name)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  activeTag === tag.name
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)]"
                }`}
              >
                {tag.name} ({tag.count})
              </button>
            ))}
          </div>
        )}

        {sorted.length === 0 && !activeTag && (
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 md:p-8 text-center space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
                <FileText size={28} className="text-[var(--color-accent)]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">Welcome to Notico</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto">
                  Your MDX-native note-taking app with real-time sync, AI, and offline support.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                <Plus size={16} />
                Create your first note
              </button>
              <button
                onClick={handleCreateDaily}
                className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              >
                <FileText size={16} />
                Start daily note
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 max-w-md mx-auto">
              {TIPS.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.text} className="flex items-start gap-2 text-left p-2 rounded-lg bg-[var(--color-surface-subtle)]">
                    <Icon size={14} className="shrink-0 mt-0.5 text-[var(--color-accent)]" />
                    <span className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{tip.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sorted.length === 0 && activeTag && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Hash size={36} className="text-[var(--color-text-tertiary)] mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)]">No notes with tag <strong>{activeTag}</strong></p>
            <button
              onClick={() => setActiveTag(null)}
              className="mt-2 text-sm text-[var(--color-accent)] hover:underline font-medium"
            >
              View all notes
            </button>
          </div>
        )}

        {sorted.length > 0 && (
          <div className="space-y-1">
            {sorted.map((note: any) => (
              <div
                key={note._id}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[var(--color-surface)] cursor-pointer border border-transparent hover:border-[var(--color-border-subtle)]"
                onClick={() => onSelectNote(note._id)}
              >
                <div className="relative shrink-0">
                  <FileText size={16} className="text-[var(--color-text-tertiary)]" />
                  {note.isPinned && (
                    <Pin size={9} className="absolute -top-1 -right-1 text-[var(--color-accent)] fill-[var(--color-accent)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">
                    {note.title || "Untitled"}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] truncate mt-0.5">
                    {note.content?.slice(0, 80).replace(/[#*`\[\]]/g, "") || "Empty note"}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {note.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[10px] rounded-full bg-[var(--color-accent-light)] px-1.5 py-0.5 text-[var(--color-accent)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[var(--color-text-tertiary)] hidden sm:block">
                    {formatDate(note.updatedAt)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote({ noteId: note._id }); }}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

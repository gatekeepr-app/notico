import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowLeftFromLine, FileText } from "lucide-react";
import type { NoteId } from "../../types";

interface BacklinksPanelProps {
  noteId: NoteId;
  onSelectNote: (id: NoteId) => void;
}

export function BacklinksPanel({ noteId, onSelectNote }: BacklinksPanelProps) {
  const currentNote = useQuery(api.notes.get, { noteId });
  const allNotes = useQuery(api.notes.list, {}) ?? [];

  if (!currentNote) return null;

  const targetTitle = currentNote.title?.toLowerCase() || "";
  const backlinks = allNotes.filter((n: any) =>
    n._id !== noteId &&
    n.content?.toLowerCase().includes(`[[${targetTitle}]]`)
  );

  if (backlinks.length === 0) return null;

  return (
    <div className="border-t border-[var(--color-border-subtle)] px-5 py-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
        <ArrowLeftFromLine size={12} />
        {backlinks.length} {backlinks.length === 1 ? "backlink" : "backlinks"}
      </div>
      <div className="space-y-0.5">
        {backlinks.map((note: any) => (
          <button
            key={note._id}
            onClick={() => onSelectNote(note._id)}
            className="w-full flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <FileText size={12} className="shrink-0" />
            <span className="truncate">{note.title || "Untitled"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

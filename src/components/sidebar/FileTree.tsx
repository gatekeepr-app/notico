import { FileText, Folder, FolderOpen, Pin } from "lucide-react";
import { formatDate } from "../../lib/utils";
import type { Note, Folder as FolderType, NoteId } from "../../types";

interface FileTreeProps {
  notes: Note[];
  folders: FolderType[];
  activeNoteId: NoteId | null;
  onSelectNote: (id: NoteId) => void;
}

export function FileTree({ notes, folders, activeNoteId, onSelectNote }: FileTreeProps) {
  const sorted = [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return (b.updatedAt as number) - (a.updatedAt as number);
  });

  return (
    <div className="space-y-0.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 py-1.5">
        Notes
      </div>
      {sorted.map((note) => (
        <button
          key={note._id}
          onClick={() => onSelectNote(note._id)}
          className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
            activeNoteId === note._id
              ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
              : "text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"
          }`}
        >
          <div className="relative shrink-0">
            <FileText size={14} className="text-[var(--color-text-tertiary)]" />
            {note.isPinned && (
              <Pin size={8} className="absolute -top-1 -right-1 text-[var(--color-accent)] fill-[var(--color-accent)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="truncate block">{note.title || "Untitled"}</span>
            {note.tags && note.tags.length > 0 && (
              <div className="flex gap-1 mt-0.5 flex-wrap">
                {note.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] rounded-full bg-[var(--color-accent-light)] px-1.5 py-0.5 text-[var(--color-accent)]"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="text-[9px] text-[var(--color-text-tertiary)]">
                    +{note.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0">
            {formatDate(note.updatedAt as number)}
          </span>
        </button>
      ))}
      {sorted.length === 0 && (
        <p className="px-2 py-4 text-xs text-center text-[var(--color-text-tertiary)]">
          No notes yet. Create one to get started.
        </p>
      )}
    </div>
  );
}

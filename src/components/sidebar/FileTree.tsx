import { useState } from "react";
import { FileText, Folder, FolderOpen, Pin, ChevronRight } from "lucide-react";
import { formatDate } from "../../lib/utils";
import type { Note, Folder as FolderType, NoteId } from "../../types";

interface FileTreeProps {
  notes: Note[];
  folders: FolderType[];
  activeNoteId: NoteId | null;
  onSelectNote: (id: NoteId) => void;
}

export function FileTree({ notes, folders, activeNoteId, onSelectNote }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    folders.forEach((f) => initial.add(f._id));
    return initial;
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const notesByFolder = new Map<string | undefined, Note[]>();
  for (const note of notes) {
    const key = note.folderId ?? "__unfiled__";
    const arr = notesByFolder.get(key) || [];
    arr.push(note);
    notesByFolder.set(key, arr);
  }

  const sortedNotes = (arr: Note[]) =>
    [...arr].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return (b.updatedAt as number) - (a.updatedAt as number);
    });

  const rootFolders = folders.filter((f) => !f.parentId);
  const unfiledNotes = sortedNotes(notesByFolder.get("__unfiled__") || []);

  const renderNote = (note: Note) => (
    <button
      key={note._id}
      onClick={() => onSelectNote(note._id)}
      className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
        activeNoteId === note._id
          ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
      }`}
    >
      <div className="relative shrink-0">
        <FileText size={13} className="text-[var(--color-text-tertiary)]" />
        {note.isPinned && (
          <Pin size={7} className="absolute -top-1 -right-1 text-[var(--color-accent)] fill-[var(--color-accent)]" />
        )}
      </div>
      <span className="truncate flex-1">{note.title || "Untitled"}</span>
      <span className="text-[9px] text-[var(--color-text-tertiary)] shrink-0">
        {formatDate(note.updatedAt as number)}
      </span>
    </button>
  );

  const renderFolder = (folder: FolderType, depth = 0) => {
    const isExpanded = expandedFolders.has(folder._id);
    const folderNotes = sortedNotes(notesByFolder.get(folder._id) || []);
    const subFolders = folders.filter((f) => f.parentId === folder._id);

    return (
      <div key={folder._id}>
        <button
          onClick={() => toggleFolder(folder._id)}
          className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <ChevronRight
            size={12}
            className="shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-150"
            style={{ transform: isExpanded ? "rotate(90deg)" : "none" }}
          />
          {isExpanded ? (
            <FolderOpen size={13} className="shrink-0 text-[var(--color-accent)]" />
          ) : (
            <Folder size={13} className="shrink-0 text-[var(--color-text-tertiary)]" />
          )}
          <span className="truncate flex-1">{folder.name}</span>
          {folderNotes.length > 0 && (
            <span className="text-[9px] text-[var(--color-text-tertiary)]">{folderNotes.length}</span>
          )}
        </button>
        {isExpanded && (
          <div className="space-y-px" style={{ marginLeft: `${20 + depth * 12}px` }}>
            {subFolders.map((sf) => renderFolder(sf, depth + 1))}
            {folderNotes.map((note) => renderNote(note))}
            {folderNotes.length === 0 && subFolders.length === 0 && (
              <p className="text-[10px] text-[var(--color-text-tertiary)] py-1 px-2 italic">
                Empty folder
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const hasContent = rootFolders.length > 0 || unfiledNotes.length > 0;

  if (!hasContent) {
    return (
      <p className="px-2 py-4 text-xs text-center text-[var(--color-text-tertiary)]">
        No notes yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className="space-y-0.5">
      {rootFolders.map((folder) => renderFolder(folder))}
      {unfiledNotes.length > 0 && rootFolders.length > 0 && (
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 pt-2 pb-1">
          Unfiled
        </div>
      )}
      {unfiledNotes.map((note) => renderNote(note))}
    </div>
  );
}

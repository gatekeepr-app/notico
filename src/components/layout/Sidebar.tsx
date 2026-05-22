import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FileTree } from "../sidebar/FileTree";
import { TagList } from "../sidebar/TagList";
import { SearchOverlay } from "../sidebar/SearchOverlay";
import { useState } from "react";
import {
  Plus, Search, FolderPlus, X,
  Calendar, Settings, FileText, Clock,
} from "lucide-react";
import type { NoteId } from "../../types";
import { formatDate } from "../../lib/utils";

type View = "notes" | "editor" | "search" | "settings" | "calendar";

interface SidebarProps {
  open: boolean;
  mobileOpen: boolean;
  view: View;
  onToggle: () => void;
  onClose: () => void;
  onSelectNote: (id: NoteId) => void;
  onViewChange: (v: View) => void;
  activeNoteId: NoteId | null;
}

export function Sidebar({ open, mobileOpen, view, onClose, onSelectNote, onViewChange, activeNoteId }: SidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allNotes = useQuery(api.notes.list, {});
  const taggedNotes = useQuery(api.notes.listByTag, { tag: activeTag ?? "" });
  const isTagged = activeTag !== null;
  const displayNotes = isTagged ? (taggedNotes ?? []) : (allNotes ?? []);
  const tags = useQuery(api.notes.getAllTags) ?? [];
  const folders = useQuery(api.folders.list, {});
  const createNote = useMutation(api.notes.create);
  const createFolder = useMutation(api.folders.create);

  const handleNewNote = async () => {
    const id = await createNote({ title: "Untitled" });
    onSelectNote(id);
  };

  const handleNewFolder = async () => {
    const name = prompt("Folder name:");
    if (name?.trim()) {
      await createFolder({ name: name.trim() });
    }
  };

  const handleSelectTag = (tag: string | null) => {
    setActiveTag(tag);
  };

  const recentNotes = (allNotes ?? [])
    .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  const navItems = [
    { id: "notes" as View, label: "Notes", icon: FileText },
    { id: "calendar" as View, label: "Calendar", icon: Calendar },
    { id: "settings" as View, label: "Settings", icon: Settings },
  ];

  const content = (
    <>
      <div className="flex items-center justify-between px-4 h-12 shrink-0 border-b border-[var(--color-border-subtle)]">
        <span className="text-sm font-semibold text-[var(--color-text)]">Notico</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <Search size={16} />
          </button>
          <button
            onClick={handleNewFolder}
            className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <FolderPlus size={16} />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors md:hidden"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {recentNotes.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 py-1.5">
              <Clock size={12} />
              Recent
            </div>
            <div className="space-y-0.5 mt-1">
              {recentNotes.map((note: any) => (
                <button
                  key={note._id}
                  onClick={() => { onSelectNote(note._id); if (mobileOpen) onClose(); }}
                  className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    activeNoteId === note._id
                      ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                      : "text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"
                  }`}
                >
                  <FileText size={12} className="shrink-0 text-[var(--color-text-tertiary)]" />
                  <span className="truncate flex-1">{note.title || "Untitled"}</span>
                  <span className="text-[9px] text-[var(--color-text-tertiary)] shrink-0">{formatDate(note.updatedAt)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <TagList activeTag={activeTag} onSelectTag={handleSelectTag} />
        <FileTree
          notes={displayNotes}
          folders={folders ?? []}
          activeNoteId={activeNoteId}
          onSelectNote={(id) => { onSelectNote(id); if (mobileOpen) onClose(); }}
        />
      </div>

      <div className="border-t border-[var(--color-border-subtle)] px-2 pt-1 pb-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onViewChange(item.id); if (mobileOpen) onClose(); }}
            className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
              view === item.id
                ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
            }`}
          >
            <item.icon size={14} />
            <span>{item.label}</span>
          </button>
        ))}
        <div className="pt-1">
          <button
            onClick={handleNewNote}
            className="w-full flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            <Plus size={14} />
            New Note
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <aside
            className="relative w-80 max-w-[85vw] h-full bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </aside>
        </div>
      )}

      <aside
        className={`hidden md:flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-200 ${
          open ? "w-60" : "w-0 overflow-hidden"
        }`}
      >
        {content}
      </aside>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onSelectNote={onSelectNote} />}
    </>
  );
}

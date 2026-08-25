import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FileTree } from "../sidebar/FileTree";
import { TagList } from "../sidebar/TagList";
import { SearchOverlay } from "../sidebar/SearchOverlay";
import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import {
  Plus, Search, FolderPlus, X,
  Calendar, Settings, FileText, Clock, User, Pin, Hash,
} from "lucide-react";
import type { NoteId } from "../../types";
import { formatDate } from "../../lib/utils";
import { FolderModal } from "../FolderModal";

type View = "notes" | "editor" | "search" | "settings" | "calendar" | "profile";

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
  const { token, user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allNotes = useQuery(api.notes.list, token ? { token } : "skip");
  const taggedNotes = useQuery(api.notes.listByTag, token && activeTag ? { tag: activeTag, token } : "skip");
  const isTagged = activeTag !== null;
  const displayNotes = isTagged ? (taggedNotes ?? []) : (allNotes ?? []);
  const tags = useQuery(api.notes.getAllTags, token ? { token } : "skip") ?? [];
  const folders = useQuery(api.folders.list, token ? { token } : "skip");
  const createNote = useMutation(api.notes.create);
  const createFolder = useMutation(api.folders.create);

  const noteCount = allNotes?.length ?? 0;
  const pinnedNotes = (allNotes ?? []).filter((n: any) => n.isPinned);
  const recentNotes = (allNotes ?? [])
    .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  const handleNewNote = async () => {
    if (!token) return;
    const id = await createNote({ title: "Untitled", token });
    onSelectNote(id);
    if (mobileOpen) onClose();
  };

  const handleNewFolder = async (name: string) => {
    if (!token) return;
    await createFolder({ name, token });
  };

  const handleSelectTag = (tag: string | null) => {
    setActiveTag(tag);
  };

  const navItems = [
    { id: "notes" as View, label: "Notes", icon: FileText },
    { id: "calendar" as View, label: "Calendar", icon: Calendar },
    { id: "settings" as View, label: "Settings", icon: Settings },
    { id: "profile" as View, label: "Profile", icon: User },
  ];

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 shrink-0 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[var(--color-text)] tracking-tight">Notico</span>
          {noteCount > 0 && (
            <span className="text-[10px] font-medium text-[var(--color-text-tertiary)] bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-full">
              {noteCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setFolderModalOpen(true)}
            className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            title="New folder"
          >
            <FolderPlus size={15} />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors md:hidden"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--color-text-tertiary)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-border-subtle)] transition-colors text-left"
        >
          <Search size={14} />
          <span>Search notes...</span>
          <span className="ml-auto text-[10px] text-[var(--color-text-tertiary)] opacity-60">Ctrl+P</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {/* Pinned notes */}
        {pinnedNotes.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 py-1.5">
              <Pin size={11} />
              Pinned
            </div>
            <div className="space-y-px">
              {pinnedNotes.map((note: any) => (
                <button
                  key={note._id}
                  onClick={() => { onSelectNote(note._id); if (mobileOpen) onClose(); }}
                  className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    activeNoteId === note._id
                      ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                      : "text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"
                  }`}
                >
                  <FileText size={12} className="shrink-0 text-[var(--color-accent)]" />
                  <span className="truncate flex-1 font-medium">{note.title || "Untitled"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent notes */}
        {recentNotes.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 py-1.5">
              <Clock size={11} />
              Recent
            </div>
            <div className="space-y-px">
              {recentNotes.map((note: any) => (
                <button
                  key={note._id}
                  onClick={() => { onSelectNote(note._id); if (mobileOpen) onClose(); }}
                  className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    activeNoteId === note._id
                      ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
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

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 py-1.5">
              <Hash size={11} />
              Tags
            </div>
            <TagList tags={tags} activeTag={activeTag} onSelectTag={handleSelectTag} />
          </div>
        )}

        {/* Folders & file tree */}
        <FileTree
          notes={displayNotes}
          folders={folders ?? []}
          activeNoteId={activeNoteId}
          onSelectNote={(id) => { onSelectNote(id); if (mobileOpen) onClose(); }}
        />
      </div>

      {/* Bottom nav + new note */}
      <div className="border-t border-[var(--color-border-subtle)] px-2 pt-1.5 pb-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onViewChange(item.id); if (mobileOpen) onClose(); }}
            className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
              view === item.id
                ? "bg-[var(--color-accent-light)] text-[var(--color-accent)] font-medium"
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
          >
            <Plus size={14} strokeWidth={2.5} />
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
          <div
            className="absolute inset-0 transition-opacity duration-200"
            style={{
              background: "rgba(0,0,0,0.3)",
              WebkitBackdropFilter: "blur(4px)",
              backdropFilter: "blur(4px)",
            }}
          />
          <aside
            className="relative w-80 max-w-[85vw] h-full bg-[var(--color-surface)] flex flex-col sidebar-slide-in"
            style={{
              boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
              borderRight: "0.5px solid var(--color-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </aside>
        </div>
      )}

      <aside
        className={`hidden md:flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-200 ${
          open ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {content}
      </aside>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onSelectNote={onSelectNote} />}
      <FolderModal
        open={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        onSubmit={handleNewFolder}
      />
    </>
  );
}

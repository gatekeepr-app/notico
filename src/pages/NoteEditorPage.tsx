import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { EditorPane } from "../components/editor/EditorPane";
import { useState, useEffect, useCallback, useRef } from "react";
import { marked } from "marked";
import { useToast } from "../components/Toast";
import { useAuth } from "../components/auth/AuthProvider";
import { sanitizeHtml } from "../lib/sanitize";
import { queueNoteOp } from "../lib/offlineNotes";
import type { NoteId } from "../types";
import type { SaveState } from "../components/editor/SaveIndicator";

interface NoteEditorPageProps {
  noteId: NoteId;
  previewOpen: boolean;
  onTogglePreview: () => void;
  onGoBack?: () => void;
}

export function NoteEditorPage({ noteId, previewOpen, onTogglePreview, onGoBack }: NoteEditorPageProps) {
  const { token } = useAuth();
  const note = useQuery(api.notes.get, token ? { noteId, token } : "skip");
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.remove);
  const [title, setTitle] = useState("");
  const [mdx, setMdx] = useState("");
  const [html, setHtml] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mountedRef = useRef(true);

  const renderMarkdown = useCallback(async (content: string) => {
    try {
      const parsed = await Promise.resolve(marked.parse(content));
      if (mountedRef.current) setHtml(sanitizeHtml(parsed));
    } catch {
      if (mountedRef.current) setHtml(content);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (note && mounted) {
      setTitle(note.title);
      setMdx(note.content ?? "");
      setTags(note.tags ?? []);
      setPinned(note.isPinned ?? false);
      setPublished(note.isPublished ?? false);
      if (note.content) {
        renderMarkdown(note.content);
      } else {
        setHtml("");
      }
    }
  }, [note, mounted, renderMarkdown]);

  const save = useCallback(async (currentTitle: string, currentMdx: string, currentTags: string[], currentPinned: boolean, currentPublished: boolean) => {
    if (!token) return;
    if (!currentTitle.trim() && !currentMdx.trim()) return;
    setSaveState("saving");
    try {
      const payload = {
        noteId,
        title: currentTitle || "Untitled",
        content: currentMdx,
        tags: currentTags,
        isPinned: currentPinned,
        isPublished: currentPublished,
      };
      if (!navigator.onLine) {
        await queueNoteOp({ type: "update", ...payload });
      } else {
        await updateNote({ ...payload, token });
      }
      if (mountedRef.current) setSaveState("saved");
      toast(navigator.onLine ? "Note saved" : "Saved offline");
    } catch {
      if (mountedRef.current) setSaveState("idle");
      toast("Unable to save", "error");
    }
  }, [noteId, updateNote, toast, token]);

  const scheduleSave = useCallback((newTitle: string, newMdx: string, newTags: string[], newPinned: boolean, newPublished: boolean) => {
    setSaveState("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(newTitle, newMdx, newTags, newPinned, newPublished), 2000);
  }, [save]);

  const handleMdxChange = useCallback((newMdx: string) => {
    setMdx(newMdx);
    renderMarkdown(newMdx);
    scheduleSave(title, newMdx, tags, pinned, published);
  }, [title, tags, pinned, published, renderMarkdown, scheduleSave]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    scheduleSave(newTitle, mdx, tags, pinned, published);
  }, [mdx, tags, pinned, published, scheduleSave]);

  const handleTogglePin = useCallback(() => {
    setPinned((prev) => {
      const next = !prev;
      scheduleSave(title, mdx, tags, next, published);
      return next;
    });
  }, [title, mdx, tags, published, scheduleSave]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mdx || title);
      toast("Copied note");
    } catch {
      toast("Unable to copy", "error");
    }
  }, [mdx, title, toast]);

  const handleDelete = useCallback(async () => {
    if (!token || !confirm("Delete this note?")) return;
    try {
      if (!navigator.onLine) await queueNoteOp({ type: "remove", noteId });
      else await deleteNote({ noteId, token });
      toast("Note deleted");
      onGoBack?.();
    } catch {
      toast("Unable to delete", "error");
    }
  }, [deleteNote, noteId, onGoBack, toast, token]);

  useEffect(() => {
    return () => clearTimeout(saveTimer.current);
  }, []);

  if (note === undefined || !mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
      </div>
    );
  }

  if (note === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">Note not found or expired</p>
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="text-sm text-[var(--color-accent)] font-medium hover:underline"
            >
              Back to notes
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <EditorPane
      title={title}
      html={html}
      mdx={mdx}
      pinned={pinned}
      previewOpen={previewOpen}
      saveState={saveState}
      onTitleChange={handleTitleChange}
      onMdxChange={handleMdxChange}
      onTogglePin={handleTogglePin}
      onTogglePreview={onTogglePreview}
      onCopy={handleCopy}
      onDelete={handleDelete}
    />
  );
}

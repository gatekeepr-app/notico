import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { EditorPane } from "../components/editor/EditorPane";
import { useState, useEffect, useCallback, useRef } from "react";
import TurndownService from "turndown";
import { marked } from "marked";
import { useToast } from "../components/Toast";
import { useAuth } from "../components/auth/AuthProvider";
import { sanitizeHtml } from "../lib/sanitize";
import { queueNoteOp } from "../lib/offlineNotes";
import type { NoteId } from "../types";
import type { SaveState } from "../components/editor/SaveIndicator";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

interface NoteEditorPageProps {
  noteId: NoteId;
  previewOpen: boolean;
  onTogglePreview: () => void;
  onSelectNote: (id: NoteId) => void;
  onGoBack?: () => void;
}

export function NoteEditorPage({ noteId, previewOpen, onTogglePreview, onSelectNote, onGoBack }: NoteEditorPageProps) {
  const { token } = useAuth();
  const note = useQuery(api.notes.get, token ? { noteId, token } : "skip");
  const allTags = useQuery(api.notes.getAllTags, token ? { token } : "skip") ?? [];
  const updateNote = useMutation(api.notes.update);
  const createNote = useMutation(api.notes.create);
  const deleteNote = useMutation(api.notes.remove);
  const [title, setTitle] = useState("");
  const [mdx, setMdx] = useState("");
  const [html, setHtml] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(false);
  const [richText, setRichText] = useState(true);
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

  const handleHtmlChange = useCallback((newHtml: string) => {
    setHtml(newHtml);
    const newMdx = turndown.turndown(newHtml);
    setMdx(newMdx);
    scheduleSave(title, newMdx, tags, pinned, published);
  }, [title, tags, pinned, published, scheduleSave]);

  const handleMdxChange = useCallback((newMdx: string) => {
    setMdx(newMdx);
    scheduleSave(title, newMdx, tags, pinned, published);
  }, [title, tags, pinned, published, scheduleSave]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    scheduleSave(newTitle, mdx, tags, pinned, published);
  }, [mdx, tags, pinned, published, scheduleSave]);

  const handleTagsChange = useCallback((newTags: string[]) => {
    setTags(newTags);
    scheduleSave(title, mdx, newTags, pinned, published);
  }, [title, mdx, pinned, published, scheduleSave]);

  const handleTogglePin = useCallback(() => {
    setPinned((prev) => {
      const next = !prev;
      scheduleSave(title, mdx, tags, next, published);
      return next;
    });
  }, [title, mdx, tags, published, scheduleSave]);

  const handleTogglePublish = useCallback(() => {
    setPublished((prev) => {
      const next = !prev;
      scheduleSave(title, mdx, tags, pinned, next);
      return next;
    });
  }, [title, mdx, tags, pinned, scheduleSave]);

  const handleToggleMode = useCallback(() => {
    setRichText((prev) => {
      if (prev) {
        const newMdx = turndown.turndown(html);
        setMdx(newMdx);
      } else {
        renderMarkdown(mdx);
      }
      return !prev;
    });
  }, [html, mdx, renderMarkdown]);

  const handleCreateFromTemplate = useCallback(async (templateTitle: string, content: string) => {
    if (!token) return;
    if (!navigator.onLine) {
      await queueNoteOp({ type: "create", title: templateTitle, content });
      toast("Template note queued offline");
      return;
    }
    const id = await createNote({ title: templateTitle, content, token });
    onSelectNote(id);
  }, [createNote, onSelectNote, toast, token]);

  const handleImportFile = useCallback(async (content: string) => {
    if (!token) return;
    const lines = content.split("\n");
    const firstLine = lines[0]?.replace(/^#\s*/, "").trim() || "Imported";
    setTitle(firstLine);
    setMdx(content);
    renderMarkdown(content);
    setSaveState("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(firstLine, content, tags, pinned, published), 500);
  }, [tags, pinned, published, save, token, renderMarkdown]);

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

  const handleEdit = useCallback(() => {
    if (!richText) renderMarkdown(mdx);
    setRichText(true);
  }, [mdx, renderMarkdown, richText]);

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
      noteId={noteId}
      title={title}
      html={html}
      mdx={mdx}
      tags={tags}
      tagSuggestions={allTags.map((t) => t.name)}
      pinned={pinned}
      published={published}
      previewOpen={previewOpen}
      richText={richText}
      saveState={saveState}
      onTitleChange={handleTitleChange}
      onHtmlChange={handleHtmlChange}
      onMdxChange={handleMdxChange}
      onTagsChange={handleTagsChange}
      onTogglePin={handleTogglePin}
      onTogglePreview={onTogglePreview}
      onToggleMode={handleToggleMode}
      onTogglePublish={handleTogglePublish}
      onCopy={handleCopy}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSelectNote={onSelectNote}
      onCreateFromTemplate={handleCreateFromTemplate}
      onImportFile={handleImportFile}
    />
  );
}

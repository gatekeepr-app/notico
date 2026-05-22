import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { EditorPane } from "../components/editor/EditorPane";
import { useState, useEffect, useCallback, useRef } from "react";
import TurndownService from "turndown";
import { marked } from "marked";
import { useToast } from "../components/Toast";
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
}

export function NoteEditorPage({ noteId, previewOpen, onTogglePreview, onSelectNote }: NoteEditorPageProps) {
  const note = useQuery(api.notes.get, { noteId });
  const allTags = useQuery(api.notes.getAllTags) ?? [];
  const updateNote = useMutation(api.notes.update);
  const createNote = useMutation(api.notes.create);
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
        (marked.parse as (s: string) => Promise<string>)(note.content).then(setHtml);
      } else {
        setHtml("");
      }
    }
  }, [note, mounted]);

  const save = useCallback(async (currentTitle: string, currentMdx: string, currentTags: string[], currentPinned: boolean, currentPublished: boolean) => {
    if (!currentTitle.trim() && !currentMdx.trim()) return;
    setSaveState("saving");
    try {
      await updateNote({
        noteId,
        title: currentTitle || "Untitled",
        content: currentMdx,
        tags: currentTags,
        isPinned: currentPinned,
        isPublished: currentPublished,
      });
      if (mountedRef.current) setSaveState("saved");
      toast("Note saved");
    } catch {
      if (mountedRef.current) setSaveState("idle");
      toast("Unable to save", "error");
    }
  }, [noteId, updateNote, toast]);

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
        (marked.parse as (s: string) => Promise<string>)(mdx).then(setHtml);
      }
      return !prev;
    });
  }, [html, mdx]);

  const handleCreateFromTemplate = useCallback(async (templateTitle: string, content: string) => {
    const id = await createNote({ title: templateTitle, content });
    onSelectNote(id);
  }, [createNote, onSelectNote]);

  const handleImportFile = useCallback(async (content: string) => {
    const lines = content.split("\n");
    const firstLine = lines[0]?.replace(/^#\s*/, "").trim() || "Imported";
    setTitle(firstLine);
    setMdx(content);
    (marked.parse as (s: string) => Promise<string>)(content).then(setHtml);
    setSaveState("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(firstLine, content, tags, pinned, published), 500);
  }, [tags, pinned, published, save]);

  useEffect(() => {
    return () => clearTimeout(saveTimer.current);
  }, []);

  if (!note || !mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
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
      onSelectNote={onSelectNote}
      onCreateFromTemplate={handleCreateFromTemplate}
      onImportFile={handleImportFile}
    />
  );
}

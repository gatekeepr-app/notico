import { TiptapEditor } from "./TiptapEditor";
import { SourceEditor } from "./SourceEditor";
import { TagInput } from "./TagInput";
import { PinButton } from "./PinButton";
import { BacklinksPanel } from "./BacklinksPanel";
import { AIActions } from "./AIActions";
import { SaveIndicator } from "./SaveIndicator";
import { NoteTemplates } from "./NoteTemplates";
import { DraggableSplitPane } from "./DraggableSplitPane";
import { FileText, Code, FileType, Download, X, Globe, GlobeOff } from "lucide-react";
import { downloadAsMdx, downloadAsHtml } from "../../lib/export";
import type { NoteId } from "../../types";
import { useEffect, useState, useCallback, useRef } from "react";
import type { SaveState } from "./SaveIndicator";

interface EditorPaneProps {
  noteId: NoteId;
  title: string;
  html: string;
  mdx: string;
  tags: string[];
  tagSuggestions: string[];
  pinned: boolean;
  published: boolean;
  previewOpen: boolean;
  richText: boolean;
  saveState: SaveState;
  onTitleChange: (title: string) => void;
  onHtmlChange: (html: string) => void;
  onMdxChange: (mdx: string) => void;
  onTagsChange: (tags: string[]) => void;
  onTogglePin: () => void;
  onTogglePreview: () => void;
  onToggleMode: () => void;
  onTogglePublish: () => void;
  onSelectNote: (id: NoteId) => void;
  onCreateFromTemplate: (title: string, content: string) => void;
  onImportFile: (content: string) => void;
}

export function EditorPane({
  noteId,
  title,
  html,
  mdx,
  tags,
  tagSuggestions,
  pinned,
  published,
  previewOpen,
  richText,
  saveState,
  onTitleChange,
  onHtmlChange,
  onMdxChange,
  onTagsChange,
  onTogglePin,
  onTogglePreview,
  onToggleMode,
  onTogglePublish,
  onSelectNote,
  onCreateFromTemplate,
  onImportFile,
}: EditorPaneProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const wordCount = html.replace(/<[^>]*>/g, "").trim()
    ? html.replace(/<[^>]*>/g, "").trim().split(/\s+/).length
    : 0;

  const handleAiResult = (text: string) => {
    if (richText) {
      const newHtml = html + `<p><em>${text}</em></p>`;
      onHtmlChange(newHtml);
    } else {
      onMdxChange(mdx + `\n\n> ${text}\n`);
    }
  };

  const handleImportClick = useCallback(() => {
    importRef.current?.click();
  }, []);

  const handleImportFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      onImportFile(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  }, [onImportFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.name.endsWith(".md") || file.name.endsWith(".mdx") || file.type === "text/markdown" || file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        onImportFile(text);
      };
      reader.readAsText(file);
    }
  }, [onImportFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const editorContent = (
    <div className="flex flex-col h-full" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="flex items-center gap-2 px-4 md:px-5 pt-3 md:pt-4 pb-2">
        <PinButton pinned={pinned} onToggle={onTogglePin} />
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="w-full text-base md:text-lg font-semibold bg-transparent outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]"
        />
        <NoteTemplates onSelect={onCreateFromTemplate} />
        <button
          onClick={onTogglePublish}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors shrink-0 ${
            published
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
          }`}
          title={published ? "Published" : "Unpublished"}
        >
          {published ? <Globe size={12} /> : <GlobeOff size={12} />}
          <span className="hidden sm:inline">{published ? "Published" : "Draft"}</span>
        </button>
        <button
          onClick={onToggleMode}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 md:py-1 text-[11px] font-medium transition-colors border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] shrink-0"
          title={richText ? "Switch to source" : "Switch to rich text"}
        >
          {richText ? <Code size={12} /> : <FileType size={12} />}
          <span className="hidden sm:inline">{richText ? "Source" : "Rich"}</span>
        </button>
      </div>
      <div className="px-4 md:px-5 pb-2 flex items-center gap-2">
        <TagInput tags={tags} onChange={onTagsChange} suggestions={tagSuggestions} />
        <SaveIndicator state={saveState} />
      </div>
      <div className="flex-1 overflow-hidden px-4 md:px-5 pb-3">
        <div className="h-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            {richText ? (
              <TiptapEditor content={html} onChange={onHtmlChange} />
            ) : (
              <SourceEditor content={mdx} onChange={onMdxChange} />
            )}
          </div>
          <BacklinksPanel noteId={noteId} onSelectNote={onSelectNote} />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 md:px-5 py-1.5 border-t border-[var(--color-border-subtle)]">
        <span className="text-[11px] text-[var(--color-text-tertiary)]">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
        <div className="flex items-center gap-2">
          <AIActions content={richText ? html : mdx} onResult={handleAiResult} />
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleImportClick}
              className="rounded-lg p-1.5 md:p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              title="Import MDX file"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={() => downloadAsMdx(title, mdx)}
              className="rounded-lg p-1.5 md:p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              title="Download MDX"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => downloadAsHtml(title, html)}
              className="rounded-lg p-1.5 md:p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              title="Download HTML"
            >
              <FileText size={14} />
            </button>
          </div>
        </div>
      </div>
      <input ref={importRef} type="file" accept=".md,.mdx,.txt" className="hidden" onChange={handleImportFileChange} />
    </div>
  );

  const previewContent = (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Preview</span>
        {isMobile && (
          <button onClick={onTogglePreview} className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white dark:bg-[var(--color-surface-subtle)] p-5 min-h-full">
          {html ? (
            <div
              className="prose prose-sm max-w-none prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text-secondary)] prose-a:text-[var(--color-accent)] prose-code:text-sm prose-code:bg-[var(--color-surface-subtle)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-img:rounded-xl prose-blockquote:border-l-[var(--color-accent)] prose-blockquote:text-[var(--color-text-secondary)]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText size={32} className="text-[var(--color-text-tertiary)] mb-2" />
              <p className="text-sm text-[var(--color-text-tertiary)]">Start writing to see a preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (previewOpen && isMobile) {
    return previewContent;
  }

  if (previewOpen && !isMobile) {
    return (
      <div className="flex h-full w-full">
        <DraggableSplitPane
          left={editorContent}
          right={previewContent}
          defaultRatio={0.55}
        />
      </div>
    );
  }

  return editorContent;
}

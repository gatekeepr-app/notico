import { PinButton } from "./PinButton";
import { SaveIndicator } from "./SaveIndicator";
import { DraggableSplitPane } from "./DraggableSplitPane";
import { FileText, X, Copy, Trash2 } from "lucide-react";
import { sanitizeHtml } from "../../lib/sanitize";
import { useEffect, useState } from "react";
import type { SaveState } from "./SaveIndicator";

interface EditorPaneProps {
  title: string;
  html: string;
  mdx: string;
  pinned: boolean;
  previewOpen: boolean;
  saveState: SaveState;
  onTitleChange: (title: string) => void;
  onMdxChange: (mdx: string) => void;
  onTogglePin: () => void;
  onTogglePreview: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export function EditorPane({
  title,
  html,
  mdx,
  pinned,
  previewOpen,
  saveState,
  onTitleChange,
  onMdxChange,
  onTogglePin,
  onTogglePreview,
  onCopy,
  onDelete,
}: EditorPaneProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const wordCount = html.replace(/<[^>]*>/g, "").trim()
    ? html.replace(/<[^>]*>/g, "").trim().split(/\s+/).length
    : 0;

  const editorContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 pt-2 md:pt-4 pb-1.5 md:pb-2">
        <PinButton pinned={pinned} onToggle={onTogglePin} />
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="w-full text-base md:text-lg font-semibold bg-transparent outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]"
        />
        <SaveIndicator state={saveState} />
      </div>
      <div className="flex-1 overflow-hidden px-3 md:px-5 pb-2 md:pb-3">
        <textarea
          value={mdx}
          onChange={(e) => onMdxChange(e.target.value)}
          placeholder="Write or paste here..."
          className="h-full w-full resize-none rounded-lg md:rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)]"
        />
      </div>
      <div className="flex items-center justify-between px-3 md:px-5 py-1 md:py-1.5 border-t border-[var(--color-border-subtle)]">
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
          <Copy size={13} />
          Copy
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[var(--color-text-tertiary)]">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
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
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
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

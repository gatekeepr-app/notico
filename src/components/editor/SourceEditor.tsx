import { useRef, useEffect } from "react";

interface SourceEditorProps {
  content: string;
  onChange: (mdx: string) => void;
}

export function SourceEditor({ content, onChange }: SourceEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] shrink-0">
        <span className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
          MDX Source
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full resize-none bg-transparent p-5 font-mono text-sm leading-relaxed text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
        placeholder="Write in Markdown / MDX..."
        spellCheck={false}
      />
    </div>
  );
}

interface CodeBlockProps {
  lang?: string;
  highlight?: string;
  children: string;
}

export function CodeBlock({ lang, children }: CodeBlockProps) {
  return (
    <div className="my-2 overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[#1e1e2e]">
      {lang && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
          <span className="text-[11px] text-white/50 font-mono">{lang}</span>
          <button
            onClick={() => navigator.clipboard.writeText(String(children).trim())}
            className="text-[11px] text-white/40 hover:text-white/70 transition-colors"
          >
            Copy
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-3 text-sm leading-relaxed">
        <code className="font-mono text-white/90">{children}</code>
      </pre>
    </div>
  );
}

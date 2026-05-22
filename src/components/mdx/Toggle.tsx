interface ToggleProps {
  summary: string;
  children: React.ReactNode;
}

export function ToggleBlock({ summary, children }: ToggleProps) {
  return (
    <details className="group my-2 rounded-lg border border-[var(--color-border-subtle)]">
      <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors">
        <span className="text-xs text-[var(--color-text-tertiary)] transition-transform group-open:rotate-90">▶</span>
        {summary}
      </summary>
      <div className="px-3 pb-2 text-sm text-[var(--color-text-secondary)]">
        {children}
      </div>
    </details>
  );
}

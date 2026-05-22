import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Tag } from "lucide-react";

interface TagListProps {
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagList({ activeTag, onSelectTag }: TagListProps) {
  const tags = useQuery(api.notes.getAllTags) ?? [];

  return (
    <div className="space-y-0.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 py-1.5">
        Tags
      </div>
      {tags.length === 0 && (
        <p className="px-2 py-2 text-[11px] text-[var(--color-text-tertiary)]">
          No tags yet
        </p>
      )}
      <button
        onClick={() => onSelectTag(null)}
        className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
          activeTag === null
            ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
        }`}
      >
        <Tag size={12} className="shrink-0" />
        <span className="flex-1">All notes</span>
      </button>
      {tags.map((tag) => (
        <button
          key={tag.name}
          onClick={() => onSelectTag(tag.name)}
          className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
            activeTag === tag.name
              ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
          }`}
        >
          <Tag size={12} className="shrink-0" />
          <span className="flex-1 truncate">{tag.name}</span>
          <span className="text-[10px] text-[var(--color-text-tertiary)]">{tag.count}</span>
        </button>
      ))}
    </div>
  );
}

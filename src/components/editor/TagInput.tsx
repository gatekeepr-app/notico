import { useState, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
}

export function TagInput({ tags, onChange, suggestions }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filtered = input.trim()
    ? suggestions.filter(
        (s) => s.includes(input.toLowerCase()) && !tags.includes(s)
      )
    : [];

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 rounded-full bg-[var(--color-accent-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-accent)]"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length ? "" : "Add a tag..."}
          className="flex-1 min-w-[80px] h-6 text-xs bg-transparent outline-none text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-tertiary)]"
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-lg z-10 py-1 max-h-40 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s}
              onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
              className="w-full px-3 py-1.5 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { Pin, PinOff } from "lucide-react";

interface PinButtonProps {
  pinned: boolean;
  onToggle: () => void;
}

export function PinButton({ pinned, onToggle }: PinButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors border shrink-0 ${
        pinned
          ? "bg-[var(--color-accent-light)] text-[var(--color-accent)] border-[var(--color-accent)]"
          : "border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-secondary)]"
      }`}
      title={pinned ? "Unpin note" : "Pin note"}
    >
      {pinned ? <PinOff size={12} /> : <Pin size={12} />}
      {pinned ? "Pinned" : "Pin"}
    </button>
  );
}

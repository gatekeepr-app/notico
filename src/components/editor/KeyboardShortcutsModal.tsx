import { useEffect } from "react";
import { X } from "lucide-react";

const GROUPS = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: "Cmd/Ctrl + P", desc: "Quick switcher" },
      { keys: "Cmd/Ctrl + D", desc: "Daily note" },
      { keys: "Cmd/Ctrl + K", desc: "Keyboard shortcuts" },
      { keys: "Cmd/Ctrl + 1", desc: "Notes view" },
      { keys: "Cmd/Ctrl + 2", desc: "Calendar view" },
      { keys: "Cmd/Ctrl + 3", desc: "Settings view" },
    ],
  },
  {
    title: "Editor",
    shortcuts: [
      { keys: "Cmd/Ctrl + B", desc: "Bold" },
      { keys: "Cmd/Ctrl + I", desc: "Italic" },
      { keys: "Cmd/Ctrl + Z", desc: "Undo" },
      { keys: "Cmd/Ctrl + Shift + Z", desc: "Redo" },
      { keys: "/", desc: "Slash command menu" },
    ],
  },
  {
    title: "Notes",
    shortcuts: [
      { keys: "Enter", desc: "Create note from daily note prompt" },
      { keys: "Backspace on empty", desc: "Delete empty note" },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md mx-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-subtle)] transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] px-1 mb-2">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.shortcuts.map(({ keys, desc }) => (
                  <div key={keys} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm">
                    <span className="text-[var(--color-text-secondary)]">{desc}</span>
                    <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]">
                      {keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]">
          <p className="text-[11px] text-[var(--color-text-tertiary)] text-center">
            Press <kbd className="font-mono px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}

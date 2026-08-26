import { Menu, ChevronLeft, Eye, EyeOff, Sun, Moon, User } from "lucide-react";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  view: string;
  activeNoteId: string | null;
  onBack: () => void;
  previewOpen: boolean;
  onTogglePreview: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onProfile: () => void;
}

export function TopBar({
  onToggleSidebar,
  view,
  activeNoteId,
  onBack,
  previewOpen,
  onTogglePreview,
  theme,
  onToggleTheme,
  onProfile,
}: TopBarProps) {
  const isEditor = view === "editor" && activeNoteId;

  return (
    <header
      className="flex items-center justify-between h-12 px-3 bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] shrink-0"
      style={{ paddingTop: "var(--safe-area-top)" }}
    >
      <div className="flex items-center gap-0.5">
        {isEditor ? (
          <button
            onClick={onBack}
            className="flex items-center gap-0.5 -ml-1 rounded-lg px-2 py-1.5 text-[var(--color-accent)] transition-colors active:bg-[var(--color-surface-subtle)]"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-medium">Back</span>
          </button>
        ) : (
          <button
            onClick={onToggleSidebar}
            className="hidden rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors active:bg-[var(--color-surface-subtle)] md:block"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleTheme}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors active:bg-[var(--color-surface-subtle)]"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {isEditor && (
          <button
            onClick={onTogglePreview}
            className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors active:bg-[var(--color-surface-subtle)]"
          >
            {previewOpen ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        <button
          onClick={onProfile}
          className={`rounded-lg p-2 transition-colors ${
            view === "profile"
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-text-secondary)] active:bg-[var(--color-surface-subtle)]"
          }`}
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
}

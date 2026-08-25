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
  return (
    <header className="flex items-center justify-between h-11 px-3 bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] shrink-0">
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        {view === "editor" && activeNoteId && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleTheme}
          className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        {view === "editor" && (
          <button
            onClick={onTogglePreview}
            className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            title={previewOpen ? "Hide preview" : "Show preview"}
          >
            {previewOpen ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        <button
          onClick={onProfile}
          className={`rounded-lg p-1.5 transition-colors ${
            view === "profile"
              ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
          }`}
          title="Profile"
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
}

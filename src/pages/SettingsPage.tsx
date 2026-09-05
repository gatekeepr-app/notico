import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Moon, Sun, Download, User, Keyboard } from "lucide-react";
import { useAuth } from "../components/auth/AuthProvider";
import { downloadAllAsZip } from "../lib/export";

export function SettingsPage() {
  const { user, token } = useAuth();
  const notes = useQuery(api.notes.list, token ? { token } : "skip") ?? [];
  const [theme, setTheme] = useState(() => localStorage.getItem("notico-theme") || "light");
  const [exporting, setExporting] = useState(false);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("notico-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadAllAsZip(notes);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto p-4 md:p-6 space-y-4">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Settings</h1>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Account</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center shrink-0">
              <User size={18} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">{user?.name || "Notico User"}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            {theme === "dark" ? <Moon size={16} className="text-[var(--color-accent)]" /> : <Sun size={16} className="text-[var(--color-accent)]" />}
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Appearance</h2>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
            <span className="text-xs text-[var(--color-text-tertiary)]">Click to toggle</span>
          </button>
        </section>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Download size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Data</h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Export all {notes.length} note{notes.length !== 1 ? "s" : ""} as a ZIP of MDX files.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting || notes.length === 0}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors disabled:opacity-50"
          >
            <Download size={14} />
            {exporting ? "Exporting..." : "Export all notes"}
          </button>
        </section>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-[var(--color-accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Keyboard shortcuts</h2>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ["Cmd/Ctrl + P", "Quick switcher"],
              ["Cmd/Ctrl + D", "Daily note"],
              ["Cmd/Ctrl + 1", "Notes view"],
              ["Cmd/Ctrl + 2", "Settings view"],
              ["Cmd/Ctrl + 3", "Profile"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-[var(--color-surface-subtle)]">
                <span className="text-[var(--color-text-secondary)]">{desc}</span>
                <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem("notico-theme") || "light");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("notico-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto p-4 md:p-6 space-y-4">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Settings</h1>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Appearance</h2>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
            </div>
            <span className="text-xs text-[var(--color-text-tertiary)]">Click to toggle</span>
          </button>
        </section>

        <section className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">Keyboard shortcuts</h2>
          <div className="space-y-2 text-sm">
            {[
              ["Cmd/Ctrl + P", "Quick switcher"],
              ["Cmd/Ctrl + D", "Daily note"],
              ["Cmd/Ctrl + 1", "Notes view"],
              ["Cmd/Ctrl + 2", "Calendar view"],
              ["Cmd/Ctrl + 3", "Settings view"],
              ["Cmd/Ctrl + 4", "Profile"],
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

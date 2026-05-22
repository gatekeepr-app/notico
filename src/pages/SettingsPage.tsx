import { useState, useEffect } from "react";
import { Moon, Sun, Key, Check, ExternalLink } from "lucide-react";

export function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem("notico-theme") || "light");
  const [ollamaKey, setOllamaKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    setOllamaKey(localStorage.getItem("notico-ollama-key") || "");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("notico-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const saveKey = () => {
    localStorage.setItem("notico-ollama-key", ollamaKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
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
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">AI (Ollama Cloud)</h2>
            <a
              href="https://ollama.com/cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-[var(--color-accent)] hover:underline"
            >
              Get API key <ExternalLink size={10} />
            </a>
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
            Used for Summarize and Rewrite actions in the editor.
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                value={ollamaKey}
                onChange={(e) => setOllamaKey(e.target.value)}
                type="password"
                placeholder="sk-..."
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] pl-9 pr-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]"
              />
            </div>
            <button
              onClick={saveKey}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors shrink-0 ${
                keySaved
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
              }`}
            >
              <Check size={14} />
              {keySaved ? "Saved" : "Save"}
            </button>
          </div>
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

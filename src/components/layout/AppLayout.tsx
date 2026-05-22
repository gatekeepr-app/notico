import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";
import { FAB } from "./FAB";
import { NotesPage } from "../../pages/NotesPage";
import { NoteEditorPage } from "../../pages/NoteEditorPage";
import { CalendarPage } from "../../pages/CalendarPage";
import { SettingsPage } from "../../pages/SettingsPage";
import { QuickSwitcher } from "../QuickSwitcher";
import { KeyboardShortcutsModal } from "../editor/KeyboardShortcutsModal";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { NoteId } from "../../types";

type View = "notes" | "editor" | "search" | "settings" | "calendar";

export function AppLayout() {
  const [view, setView] = useState<View>("notes");
  const [activeNoteId, setActiveNoteId] = useState<NoteId | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [quickSwitcherOpen, setQuickSwitcherOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const createNote = useMutation(api.notes.create);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("notico-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("notico-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleDailyNote = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const title = `Daily Note — ${today}`;
    const id = await createNote({ title });
    setActiveNoteId(id);
    setView("editor");
    setSidebarOpen(false);
  }, [createNote]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        setQuickSwitcherOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        handleDailyNote();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShortcutsOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "1") { e.preventDefault(); setView("notes"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "2") { e.preventDefault(); setView("calendar"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "3") { e.preventDefault(); setView("settings"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleDailyNote]);

  const openNote = useCallback((id: NoteId) => {
    setActiveNoteId(id);
    setView("editor");
    setSidebarOpen(false);
  }, []);

  const goBack = useCallback(() => {
    setActiveNoteId(null);
    setView("notes");
  }, []);

  const handleQuickAdd = useCallback(async () => {
    const id = await createNote({ title: "Untitled" });
    openNote(id);
  }, [createNote, openNote]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-[var(--color-surface-subtle)]">
      <Sidebar
        open={sidebarOpen && !isMobile}
        mobileOpen={sidebarOpen && isMobile}
        view={view}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
        onSelectNote={openNote}
        onViewChange={setView}
        activeNoteId={activeNoteId}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          view={view}
          activeNoteId={activeNoteId}
          onBack={goBack}
          previewOpen={previewOpen}
          onTogglePreview={() => setPreviewOpen(!previewOpen)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 overflow-hidden bg-[var(--color-surface-subtle)]">
          {view === "notes" && <NotesPage onSelectNote={openNote} />}
          {view === "editor" && activeNoteId && (
            <NoteEditorPage
              noteId={activeNoteId}
              previewOpen={previewOpen}
              onTogglePreview={() => setPreviewOpen(!previewOpen)}
              onSelectNote={openNote}
            />
          )}
          {view === "calendar" && <CalendarPage onSelectNote={openNote} />}
          {view === "settings" && <SettingsPage />}
        </main>
      </div>

      {view === "notes" && isMobile && <FAB onClick={handleQuickAdd} />}
      <MobileNav view={view} onViewChange={setView} />

      {quickSwitcherOpen && (
        <QuickSwitcher
          onSelectNote={(id) => { openNote(id); setQuickSwitcherOpen(false); }}
          onClose={() => setQuickSwitcherOpen(false)}
        />
      )}

      {shortcutsOpen && (
        <KeyboardShortcutsModal onClose={() => setShortcutsOpen(false)} />
      )}
    </div>
  );
}

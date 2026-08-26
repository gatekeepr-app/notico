import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";
import { FAB } from "./FAB";
import { NotesPage } from "../../pages/NotesPage";
import { NoteEditorPage } from "../../pages/NoteEditorPage";
import { CalendarPage } from "../../pages/CalendarPage";
import { SettingsPage } from "../../pages/SettingsPage";
import { ProfilePage } from "../../pages/ProfilePage";
import { ProfileErrorBoundary } from "../ProfileErrorBoundary";
import { QuickSwitcher } from "../QuickSwitcher";
import { KeyboardShortcutsModal } from "../editor/KeyboardShortcutsModal";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { queueNoteOp } from "../../lib/offlineNotes";
import type { NoteId } from "../../types";

type View = "notes" | "editor" | "search" | "settings" | "calendar" | "profile";

export function AppLayout() {
  const { user, token } = useAuth();
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
    if (!window.history.state) {
      window.history.replaceState({ view: "notes" }, "");
    }
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleDailyNote = useCallback(async () => {
    if (!token) return;
    const today = new Date().toISOString().slice(0, 10);
    const title = `Daily Note — ${today}`;
    const id = await createNote({ title, token });
    setActiveNoteId(id);
    setView("editor");
    setSidebarOpen(false);
  }, [createNote, token]);

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
      if ((e.metaKey || e.ctrlKey) && e.key === "4") { e.preventDefault(); setView("profile"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleDailyNote]);

  const openNote = useCallback((id: NoteId) => {
    setActiveNoteId(id);
    setView("editor");
    setSidebarOpen(false);
    window.history.pushState({ view: "editor", noteId: id }, "");
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setActiveNoteId(null);
      setView("notes");
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const state = window.history.state;
      if (state?.view === "editor" && state?.noteId) {
        setActiveNoteId(state.noteId);
        setView("editor");
      } else {
        setActiveNoteId(null);
        setView("notes");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!isMobile || view !== "editor") return;
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = Math.abs(e.changedTouches[0].clientY - startY);
      if (dx > 80 && dy < 60 && startX < 40) {
        goBack();
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, view, goBack]);

  const handleQuickAdd = useCallback(async () => {
    if (!token) return;
    if (!navigator.onLine) {
      await queueNoteOp({ type: "create", title: "Untitled" });
      return;
    }
    const id = await createNote({ title: "Untitled", token });
    openNote(id);
  }, [createNote, openNote, token]);

  useEffect(() => {
    if (!token || !user) return;
    const params = new URLSearchParams(window.location.search);
    const shared = [params.get("share_title"), params.get("share_text"), params.get("share_url"), params.get("shared")]
      .filter(Boolean)
      .join("\n")
      .trim();
    const action = params.get("action");
    const viewParam = params.get("view");

    if (viewParam === "profile") setView("profile");
    if (action === "new") void handleQuickAdd();
    if (!shared) return;

    const title = params.get("share_title") || "Shared to Notico";
    const createShared = async () => {
      if (navigator.onLine) {
        const id = await createNote({ title, content: shared, token });
        openNote(id);
      } else {
        await queueNoteOp({ type: "create", title, content: shared });
      }
      window.history.replaceState({}, "", window.location.pathname);
    };
    void createShared();
  }, [createNote, handleQuickAdd, openNote, token, user]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[var(--color-surface-subtle)]" style={{ height: "100dvh" }}>
      <div className="flex flex-1 min-h-0">
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

        <div className="flex flex-1 flex-col min-w-0 min-h-0">
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
            onProfile={() => setView("profile")}
          />

          <main className="flex-1 min-h-0 overflow-hidden bg-[var(--color-surface-subtle)]">
            {view === "notes" && token && <NotesPage onSelectNote={openNote} />}
            {view === "editor" && activeNoteId && token && (
              <NoteEditorPage
                noteId={activeNoteId}
                previewOpen={previewOpen}
                onTogglePreview={() => setPreviewOpen(!previewOpen)}
                onSelectNote={openNote}
                onGoBack={goBack}
              />
            )}
            {view === "calendar" && token && <CalendarPage onSelectNote={openNote} />}
            {view === "settings" && <SettingsPage />}
            {view === "profile" && <ProfileErrorBoundary><ProfilePage /></ProfileErrorBoundary>}
          </main>
        </div>
      </div>

      {view === "notes" && isMobile && <FAB onClick={handleQuickAdd} />}
      <MobileNav view={view} onViewChange={setView} />

      {quickSwitcherOpen && token && (
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

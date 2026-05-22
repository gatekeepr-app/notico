# Notico — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-05-23

### Project Complete

Notico is a fully functional MDX-native note-taking PWA with TipTap rich text editing, Convex backend, Chrome extension, and AI features.

### Features Implemented

**Core Editor**
- TipTap WYSIWYG editor with full toolbar (bold, italic, headings, lists, checklists, code, blockquote, image, undo/redo)
- Source mode toggle between TipTap (rich text) and raw MDX textarea
- Image paste/drop/upload (clipboard, drag-drop, file picker → inline base64)
- `/` slash command menu (heading 1-3, bullet/ordered/task list, blockquote, code block, divider)
- Autosave with 2s debounce, save status indicator (saving/saved/unsaved)
- Live preview pane renders TipTap HTML directly (no server save needed)
- Draggable split pane divider between editor and preview
- Word count in editor footer

**Note Management**
- Create, edit, delete notes with real-time Convex sync
- Tags system (TagInput with autocomplete, TagList in sidebar, tag filter pills, getAllTags query)
- Pin/favorites (isPinned field, PinButton, sorted to top in FileTree + NotesPage)
- Note templates (Daily Note, Meeting Notes, Blank — with pre-structured content)
- File tree sidebar with folder organization
- Backlinks panel below editor (scans all notes for [[Note Title]] references)

**Search & Navigation**
- Full-text search across titles + content + tags (SearchOverlay)
- Cmd+P quick switcher with fuzzy search
- Cmd+K keyboard shortcuts cheat sheet modal
- Quick switcher with fuzzy search
- Daily notes (Cmd+D auto-create with date)

**Views**
- Notes list view with pin indicators, tag display, content preview
- Calendar view (month grid, dots on days with notes, click to see notes list)
- Settings page (theme toggle, Ollama API key input, keyboard shortcuts reference)

**AI Features**
- Summarize + Rewrite buttons in editor footer
- Calls Ollama Cloud API (https://api.ollama.com/api/chat)
- API key stored in localStorage, configurable in Settings page
- Convex server actions use process.env.OLLAMA_API_KEY

**Export & Import**
- Download individual note as MDX or HTML
- Export all notes as ZIP via JSZip
- Import `.mdx`/`.md` files via file picker or drag-drop into editor

**PWA**
- vite-plugin-pwa with service worker
- Manifest with icons, install prompt
- Offline caching of static assets

**UI/UX**
- Dark/light theme toggle with localStorage persistence
- Apple/Linear-inspired UI (Inter font, #5E6AD2 accent, frosted overlays)
- Mobile responsive (bottom nav with 3 tabs, full-screen preview on mobile, responsive padding)
- Toast notifications (success/error, 3s auto-dismiss)
- Empty states with onboarding tips for first-time users
- Cmd+1/2/3 keyboard shortcuts for view switching
- Recent notes list in sidebar

**Chrome Extension (Notico Clipper)**
- Floating clip button injected on all pages
- Keyboard shortcut (Cmd+Shift+N) to clip current page
- Sidebar with quick note input, recent notes list, Convex URL configuration
- Pre-fills note with page title, URL, and selected text
- Background service worker routing (avoids CORS)

### Technical Details

| Aspect | Detail |
|--------|--------|
| Stack | Vite + React 19 + TypeScript + Tailwind v4 |
| Backend | Convex (real-time WebSocket, server actions, full-text search) |
| Editor | TipTap with StarterKit, TaskList, Image, Link, CodeBlockLowlight, Placeholder |
| Router | No router (single-page app with view state) |
| PWA | vite-plugin-pwa + Workbox |
| AI | Ollama Cloud API (llama3.2) |
| Extension | Chrome MV3, service worker, sidePanel |
| Build output | ~1,030 KB JS, ~33 KB CSS |
| Zero TypeScript errors | Yes |

### Files Structure

```
convex/
  notes.ts          — CRUD + search + getAllTags + migrateRemoveCompiled
  ai.ts             — Ollama Cloud summarize + rewrite actions
  schema.ts         — notes (isPinned, isPublished, tags), folders, attachments
  folders.ts        — folder CRUD
extension/
  manifest.json     — MV3, permissions, commands, sidePanel
  background.js     — Service worker, Convex API calls, keyboard shortcut handler
  content.js        — Floating clip button + clipboard feedback
  content.css       — Clip button styles
  sidebar/
    index.html      — Quick note input, note list, Convex URL config
src/
  components/
    editor/
      TiptapEditor.tsx      — TipTap WYSIWYG with toolbar
      SourceEditor.tsx      — Raw MDX textarea
      EditorPane.tsx        — Layout: title, tags, editor, preview, footer
      SlashMenu.tsx         — / slash command popup
      PinButton.tsx         — Pin/unpin toggle
      TagInput.tsx          — Inline tag input with autocomplete
      BacklinksPanel.tsx    — [[Note Title]] references
      AIActions.tsx         — Summarize + Rewrite buttons
      SaveIndicator.tsx      — Saving/saved/unsaved state
      NoteTemplates.tsx     — Daily/Meeting/Blank templates
      DraggableSplitPane.tsx — Resizable split pane divider
      KeyboardShortcutsModal.tsx — Cmd+K shortcuts reference
    layout/
      AppLayout.tsx         — View routing, theme, shortcuts, modals
      Sidebar.tsx           — Desktop + mobile sidebar, nav, recent, tags
      TopBar.tsx            — Header with menu, back, preview, theme
      MobileNav.tsx         — Bottom nav (Notes, Calendar, Settings)
      FAB.tsx               — Floating action button (mobile only)
    sidebar/
      FileTree.tsx          — Note list with folder grouping
      TagList.tsx           — Tag filter list
      SearchOverlay.tsx     — Full-text search overlay
    QuickSwitcher.tsx       — Cmd+P fuzzy search
    Toast.tsx               — Toast notification system
  pages/
    NotesPage.tsx           — Note list with filters, empty states
    NoteEditorPage.tsx      — Single note editor with autosave
    CalendarPage.tsx        — Month grid calendar
    SettingsPage.tsx        — Theme, API key, keyboard shortcuts
  lib/
    export.ts               — downloadAsMdx, downloadAsHtml, downloadAllAsZip
    utils.ts                — cn, formatDate, generateSlug
  main.tsx                  — App root with ConvexProvider + ToastProvider
```

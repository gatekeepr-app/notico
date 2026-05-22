# Notico — Product Context

## Elevator Pitch

A local-first, MDX-native note-taking PWA that syncs across phone and desktop. Write in Markdown with rich text editing, get live preview, and never worry about vendor lock-in. Notes are just files.

## Vision

Everyone should have a personal knowledge system that's fast, portable, and actually fun to use. Notico combines the best of Obsidian (local files, graph), Notion (database, components), and Apple Notes (speed, simplicity) — without the lock-in or bloat.

## Core Differentiators

| vs Obsidian | vs Notion | vs Apple Notes |
|-------------|-----------|----------------|
| TipTap WYSIWYG + Markdown | Local-first, works offline | Cross-platform PWA |
| Real-time Convex sync | Exportable .mdx files | Rich text + Markdown |
| AI Summarize + Rewrite | Instant WebSocket sync | Chrome extension clipper |

## Target Users

1. **Developers** — want code blocks, image embeds, git-friendly `.mdx` files, keyboard shortcuts
2. **Writers / Engineers** — want clean markdown, collapsible sections, clean export
3. **Knowledge workers** — want fast search, bi-directional links, tags, offline access

## Design Principles

- **Local-first** — Offline is not an edge case. PWA works on any device.
- **Fast by default** — TipTap for WYSIWYG, Convex real-time push, minimal JS payload.
- **Portable** — Export as real `.mdx` files. No proprietary format. Git-friendly.
- **Sync, not sync** — Real-time sync between devices. Just works.
- **Progressive** — PWA installable on any device. No app store needed.

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend | Vite + React + TypeScript | Fast dev, TipTap integration, Convex hooks |
| Backend | Convex | Real-time sync, server actions, search, zero ops |
| Editor | TipTap | ProseMirror-based, extensible, rich text + Markdown |
| PWA | vite-plugin-pwa | Zero-config service worker, manifest |
| AI | Ollama Cloud API | No local GPU needed, pay-per-use |
| UI | Tailwind v4 + CSS variables | Clean Apple/Linear aesthetic |
| Chrome Extension | MV3 + service worker | CORS-safe, keyboard shortcuts, sidePanel |

## Current Feature Set

### Editor
- TipTap WYSIWYG with toolbar (bold, italic, headings, lists, checklists, code, blockquote, image, undo/redo)
- Source mode toggle (TipTap ↔ raw MDX)
- `/` slash command menu for quick insert
- Image paste/drop/upload
- Autosave with status indicator
- Live preview pane (draggable split)
- Note templates (Daily, Meeting, Blank)

### Notes
- Create, edit, delete with real-time Convex sync
- Tags with autocomplete and sidebar filter
- Pin/favorites with visual indicators
- Backlinks panel ([[Note Title]] references)
- Full-text search across titles + content + tags
- Quick switcher (Cmd+P), cheat sheet (Cmd+K)

### Views
- Notes list with pin sorting, tags, content preview
- Calendar month grid with per-day notes
- Settings (theme, Ollama API key, shortcuts reference)

### AI
- Summarize + Rewrite via Ollama Cloud API
- Configurable API key in Settings or Convex env vars

### Export/Import
- Download individual note as MDX or HTML
- Export all notes as ZIP
- Import via file picker or drag-drop

### Chrome Extension
- Floating clip button on all pages
- Cmd+Shift+N keyboard shortcut to clip
- Sidebar with quick note and note list
- Pre-fills with page URL, title, and selected text
- Configurable Convex deployment URL

### PWA
- Service worker caching, install prompt, manifest
- Dark/light theme, mobile responsive, toast notifications

## Evolution

Notico evolved from an MDX-compiler-focused app (CodeMirror + esbuild WASM) to a TipTap rich text editor that converts to MDX on save. This eliminated the complexity of client-side MDX compilation (~5MB WASM payload) while keeping all the benefits of Markdown portability.

The Chrome extension was added to support web clipping, routing through a background service worker to avoid CORS restrictions.

# Notico — Product Requirements Document (PRD)

**Status:** Complete v1  
**Last Updated:** 2026-05-23  
**Stack:** Vite + React 19 + Convex + PWA + TipTap

---

## 1. Overview

Notico is a local-first, MDX-native note-taking PWA with real-time sync, TipTap WYSIWYG editing, and a Chrome extension clipper.

### 1.1 Goals

- Provide a **rich text + Markdown** note-taking experience with live preview
- Work **offline-first** — PWA installable on any device
- Sync **seamlessly** across devices via Convex WebSocket
- Allow **web clipping** via Chrome extension
- Keep notes **portable** as real `.mdx` files

### 1.2 Non-Goals (v1)

- Collaborative editing with multi-cursor
- Native mobile apps (iOS/Android)
- Notion / Google Drive sync
- Public API

---

## 2. Functional Requirements

### 2.1 Note Management

| ID | Requirement | Status |
|----|-------------|--------|
| N1 | Create a new note | ✅ |
| N2 | Edit note content (TipTap rich text or raw MDX) | ✅ |
| N3 | Delete notes | ✅ |
| N4 | Rename notes inline | ✅ |
| N5 | Organize notes in folders | ✅ |
| N7 | Star / pin important notes | ✅ |
| N8 | View word count | ✅ |

### 2.2 Editor

| ID | Requirement | Status |
|----|-------------|--------|
| E1 | TipTap WYSIWYG editor with toolbar | ✅ |
| E2 | Source mode toggle (raw MDX textarea) | ✅ |
| E3 | Live preview from HTML (no server save needed) | ✅ |
| E4 | Toolbar: bold, italic, headings, lists, code, quote, undo/redo | ✅ |
| E5 | Checklists | ✅ |
| E6 | Image paste/drop/upload | ✅ |
| E7 | Slash command menu | ✅ |
| E8 | Autosave with indicator | ✅ |
| E9 | Draggable split pane preview | ✅ |

### 2.3 Search

| ID | Requirement | Status |
|----|-------------|--------|
| S1 | Full-text search across titles + content + tags | ✅ |
| S2 | Search highlights with excerpts | ✅ |
| S3 | Filter by tags | ✅ |

### 2.4 Notes Views

| ID | Requirement | Status |
|----|-------------|--------|
| V1 | Notes list with pin/tag/preview | ✅ |
| V2 | Calendar month grid with per-day notes | ✅ |
| V3 | Settings page (theme, API key, shortcuts) | ✅ |

### 2.5 AI

| ID | Requirement | Status |
|----|-------------|--------|
| A1 | Summarize note via Ollama Cloud | ✅ |
| A2 | Rewrite note via Ollama Cloud | ✅ |
| A3 | Configurable API key | ✅ |

### 2.6 Export/Import

| ID | Requirement | Status |
|----|-------------|--------|
| X1 | Download as MDX | ✅ |
| X2 | Download as HTML | ✅ |
| X3 | Export all as ZIP | ✅ |
| X4 | Import .mdx/.md files | ✅ |

### 2.7 Chrome Extension

| ID | Requirement | Status |
|----|-------------|--------|
| C1 | Floating clip button on all pages | ✅ |
| C2 | Keyboard shortcut (Cmd+Shift+N) | ✅ |
| C3 | Sidebar with quick note input | ✅ |
| C4 | Pre-fills with page context (URL, title, selection) | ✅ |
| C5 | Configurable Convex URL | ✅ |

### 2.8 PWA

| ID | Requirement | Status |
|----|-------------|--------|
| P1 | Install prompt | ✅ |
| P2 | Service worker caching | ✅ |
| P3 | App manifest with icons | ✅ |
| P4 | Works offline (static assets cached) | ✅ |

### 2.9 UX

| ID | Requirement | Status |
|----|-------------|--------|
| U1 | Dark/light theme | ✅ |
| U2 | Mobile responsive | ✅ |
| U3 | Toast notifications | ✅ |
| U4 | Keyboard shortcuts (Cmd+P/D/K/1/2/3) | ✅ |
| U5 | Empty states with onboarding tips | ✅ |
| U6 | Bottom mobile nav | ✅ |

---

## 3. Technical Architecture

### 3.1 Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React 19 SPA |
| Backend | Convex (DB, real-time sync, server actions) |
| Editor | TipTap (ProseMirror) |
| PWA | vite-plugin-pwa + Workbox |
| Extension | Chrome MV3, service worker, sidePanel |
| AI | Ollama Cloud API (llama3.2) |
| UI | Tailwind CSS v4 + CSS variables + Lucide icons |

### 3.2 Convex Schema

```typescript
notes: {
  title, content, tags, folderId,
  isPinned, isPublished, publishedSlug,
  createdAt, updatedAt
}
folders: {
  name, parentId, createdAt
}
attachments: {
  noteId, storageId, name, type, size
}
```

### 3.3 Data Flow

```
User edits in TipTap
  → TipTap emits HTML
  → Turndown converts HTML → MDX
  → Debounced save (2s) → Convex mutation
  → WebSocket push to all connected clients
  → Other devices receive update in real-time
```

### 3.4 Chrome Extension Flow

```
User clicks clip button (or Cmd+Shift+N)
  → Content script reads page title, URL, selection
  → Message sent to background service worker
  → Background worker calls Convex HTTP API
  → Note created with page context
  → Content script shows success feedback
```

---

## 4. UI Layout

### Desktop
```
┌─────────────────────────────────────┐
│  TopBar: menu | back | theme | prev │
├────────┬────────────────────────────┤
│        │                            │
│Sidebar │  Editor + Preview          │
│Nav     │  (draggable split)         │
│Recent  │                            │
│Tags    │  Title | Pin | Template    │
│FileTree│  Tags | SaveIndicator      │
│        │  TipTap / Source Editor    │
│Calendar│  Backlinks                 │
│Settings│  WordCount | AI | Export   │
│New Note│                            │
└────────┴────────────────────────────┘
```

### Mobile
```
┌────────────────┐
│  TopBar        │
├────────────────┤
│  Editor or     │
│  Preview       │
│  (full screen) │
├────────────────┤
│ Notes|Cal|Settings │
└────────────────┘
```

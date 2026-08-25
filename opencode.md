# Notico - Project Context

## What is Notico?
A multi-platform note-taking app: **Chrome extension** for quick paste/save + **PWA website** for viewing/managing notes. Notes have a **10-minute lifetime** and auto-expire.

## Architecture
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Convex (real-time serverless DB)
- **Extension**: Chrome MV3 side panel (vanilla HTML/JS, no build step)
- **Auth**: Email/password with session tokens, extension pairs via 6-char codes

## How it works
1. User signs up/logs in on the PWA (`/profile`)
2. User generates a pairing code on the Profile page
3. User enters code in the extension sidebar → paired
4. User pastes text in the extension → saves to Convex DB with 10-min TTL
5. Same notes appear in PWA notes tab in real-time (Convex reactivity)
6. Notes auto-expire after 10 minutes (filtered in queries, cleaned up by `cleanupExpired` mutation)

## Key files

### Convex Backend (`convex/`)
- `schema.ts` — DB schema: users, sessions, pairing_codes, notes (with `expiresAt`), folders, attachments
- `auth.ts` — signup/login/logout/me with SHA-256 password hashing
- `pairing.ts` — generate 6-char codes (5-min expiry), validate for extension auth
- `notes.ts` — CRUD with token auth, 10-min TTL filtering, `cleanupExpired` mutation
- `folders.ts` — folder CRUD (not yet user-scoped)

### PWA Frontend (`src/`)
- `main.tsx` — app entry, wrapped in AuthProvider
- `index.css` — CSS variables, accent `#8B5CF6`, Inter font, dark mode
- `components/auth/AuthProvider.tsx` — auth context (user, token, login, signup, logout)
- `components/auth/LoginPage.tsx` — email/password form
- `components/layout/AppLayout.tsx` — auth gate, view routing, Cmd+1-4 shortcuts
- `components/layout/TopBar.tsx` — header with profile button
- `components/layout/Sidebar.tsx` — sidebar with profile nav, tag list
- `components/layout/MobileNav.tsx` — bottom nav
- `pages/NotesPage.tsx` — notes list
- `pages/NoteEditorPage.tsx` — note editor
- `pages/ProfilePage.tsx` — user info, pair extension button
- `pages/SettingsPage.tsx` — theme toggle, keyboard shortcuts

### Extension (`extension/`)
- `manifest.json` — MV3 manifest, side_panel only (no content scripts)
- `background.js` — service worker: save note, get notes, pair/unpair, config
- `sidebar/index.html` — pair screen + paste/save screen
- `sidebar/app.js` — sidebar logic (paste, save, pair, list notes with TTL countdown)
- `icon-*.png` — extension icons

## Design tokens
- Accent: `#8B5CF6` (violet), hover light: `#7C3AED`, hover dark: `#A78BFA`
- Font: Inter (sans-serif)
- Dark mode via `prefers-color-scheme` + class toggle

## Commands
- `pnpm dev` — start Vite dev server
- `pnpm build` — production build
- `pnpm exec tsc --noEmit` — type check
- `pnpm exec convex dev` — Convex dev server

## Current state
- Auth system working (signup/login/pairing)
- Extension simplified: paste → save → 10-min TTL → shows in PWA
- No clip overlay on pages (removed)
- No AI features (removed)
- Package manager: pnpm (with `.npmrc` shamefully-hoist=true)
- Convex deployment: `https://admirable-swan-348.convex.cloud`

## Known issues
- PWA icons missing: `public/icons/icon-192.png` and `public/icons/icon-512.png` needed
- Extension white screen was fixed by moving inline JS to external `app.js` (MV3 CSP)

## Next steps (from blueprint)
- Extension quick add enhancements (tag picker, folder selector, templates)
- Landing page
- Dark mode polish
- Offline support

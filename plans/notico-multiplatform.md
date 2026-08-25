# Notico Multi-Platform Blueprint

**Objective:** Ship a production-grade browser extension (quick add + clip features), then convert the existing React+Vite+Convex app into a responsive PWA/website with authentication and a landing page.

**Architecture:** One React codebase serves both PWA (mobile) and website (desktop). Extension is a separate vanilla JS project (MV3, no build step).

---

## Phase 1: Browser Extension — Quick Add & Quick Features

### Step 1.1: Extension Rebuild — React Sidebar with Build System

**Context:** The current extension sidebar is a raw HTML file (`extension/sidebar/index.html`, 228 lines) with inline CSS/JS. The background script (`extension/background.js`) handles Convex mutations via raw HTTP. This is fragile, unstyled relative to the main app, and hard to maintain. Rebuild the sidebar as a small React app with its own Vite build, sharing Tailwind tokens with the main app.

**Tasks:**
- [ ] Create `extension/src/` directory with React entry point
- [ ] Add a second `vite.config.ts` at `extension/vite.config.ts` for building the sidebar
- [ ] Configure it to output to `extension/sidebar/dist/` so `manifest.json` can reference the built files
- [ ] Share the same Tailwind CSS variables from `src/index.css` (copy the CSS custom properties block)
- [ ] Build a minimal sidebar React app with: quick note textarea, save button, recent notes list, Convex URL config
- [ ] Update `extension/manifest.json` to point `side_panel.default_path` to `sidebar/dist/index.html`
- [ ] Add `extension/package.json` with React, Tailwind, Vite as dev deps (separate from main app)

**Verification:** `cd extension && npm run build` produces `sidebar/dist/index.html` that opens in Chrome's side panel.

**Exit criteria:** Extension sidebar renders in Chrome with same visual style as main app. Quick note save works via background.js message passing.

---

### Step 1.2: Extension — Enhanced Quick Add Features

**Context:** Current quick add is bare: type text, save. Add power-user features that make the extension a real productivity tool.

**Tasks:**
- [ ] **Tag picker** — dropdown to select/add tags before saving (reuse tag list from Convex `getAllTags`)
- [ ] **Folder selector** — dropdown to pick a folder (reuse `folders:list` query)
- [ ] **Template quick-pick** — buttons for "Quick Note", "Bookmark", "Meeting Snippet" templates
- [ ] **Page context auto-fill** — already pre-fills title+URL+selection; add domain as a tag automatically
- [ ] **Recent notes** — show last 5 notes in sidebar with tap-to-open (opens in the main app URL)
- [ ] **Search** — search bar at top of sidebar to find notes before saving (avoid duplicates)

**Verification:** Open extension sidebar on any page. Tag picker shows existing tags. Saving with a tag persists it. Recent notes list appears. Search returns matching notes.

**Exit criteria:** Extension supports tagged, foldered, templated quick-add with search and recent notes.

---

### Step 1.3: Extension — Clip Enhancements

**Context:** Current clip only captures title + URL + selection. Enhance to capture richer content.

**Tasks:**
- [ ] **Clip selected HTML** — capture formatted selection (not just plain text) via `contentEditable` or `outerHTML` of range
- [ ] **Full page clip** — option to clip entire page body content (parsed to Markdown via turndown, which is already a dependency)
- [ ] **Image clip** — detect selected images, save URL as `![alt](src)` in note
- [ ] **Clip confirmation toast** — replace the inline button state change with a proper notification popup
- [ ] **Clip history** — store last 10 clips in `chrome.storage.local` for quick re-access
- [ ] **Clip to existing note** — option to append clip to an existing note instead of always creating new

**Verification:** Select formatted text on a page, clip it — the note preserves bold/links/lists. Clip an image — note contains markdown image. Full page clip creates a complete page capture.

**Exit criteria:** Extension handles rich content clipping, images, and appending to existing notes.

---

### Step 1.4: Extension — Polish & Publish Prep

**Tasks:**
- [ ] Dark mode support in extension sidebar (detect `prefers-color-scheme` or add toggle)
- [ ] Loading/skeleton states for note list
- [ ] Error handling for network failures with retry button
- [ ] Remove hardcoded `DEFAULT_URL` in `background.js` — require first-time setup
- [ ] Add extension icon states (idle, clipping, success, error) via `chrome.action.setIcon`
- [ ] Test on Chrome, Edge, Firefox (Manifest V3 compatible)
- [ ] Write `extension/README.md` with install/dev/publish instructions

**Verification:** Extension works in Chrome and Edge. Dark mode follows system. Error states are handled gracefully.

**Exit criteria:** Extension is publishable to Chrome Web Store.

---

## Phase 2: PWA/Website — Auth, Landing Page, Responsive Shell

### Step 2.1: Authentication with Convex Auth

**Context:** Currently there's no auth — anyone with the Convex URL can read/write all notes. Add Convex Auth (the official Convex auth solution) so the app supports email/password + OAuth login.

**Tasks:**
- [ ] Install `@convex-dev/auth` and configure in `convex/auth.config.ts`
- [ ] Add Convex Auth provider to `src/main.tsx` wrapping `ConvexProvider`
- [ ] Create `src/components/auth/LoginPage.tsx` — email/password form + Google/GitHub OAuth buttons
- [ ] Create `src/components/auth/AuthScreen.tsx` — already exists at `src/components/auth/AuthScreen.tsx`, update to use Convex Auth
- [ ] Add `convex/auth.ts` with login/signup/logout mutations using Convex Auth
- [ ] Add user field to `notes` schema: `userId: v.optional(v.id("users"))` — tie notes to users
- [ ] Update `convex/notes.ts` queries/mutations to filter by `ctx.auth.getUserIdentity()`
- [ ] Add a user menu to TopBar (avatar, email, logout)
- [ ] Protect all note queries/mutations behind auth — unauthenticated users see the landing page

**Verification:** User can sign up with email, log in, see only their notes. Logging out returns to login page. Notes are scoped per user.

**Exit criteria:** Auth is functional. All note operations are user-scoped. Logout works.

---

### Step 2.2: Landing Page

**Context:** Need a public-facing landing page for the website (not the PWA). This is the first thing unauthenticated visitors see.

**Tasks:**
- [ ] Create `src/pages/LandingPage.tsx` — hero section, features grid, CTA buttons
- [ ] Hero: "Your notes, everywhere." tagline + "Get Started" / "Login" buttons
- [ ] Features section: 3-column grid (Editor, Sync, AI) with icons from lucide-react
- [ ] Social proof section (optional, can be placeholder)
- [ ] Footer with links
- [ ] Route: if not authenticated, show `LandingPage`; if authenticated, show `AppLayout`
- [ ] Make the landing page fully responsive (mobile: stacked, desktop: grid)
- [ ] Add `LandingPage` to the view router in `AppLayout.tsx`

**Verification:** Visiting the site while logged out shows the landing page. Clicking "Get Started" goes to signup. After login, redirects to notes view. Mobile layout stacks correctly.

**Exit criteria:** Landing page is responsive and serves as the unauthenticated entry point.

---

### Step 2.3: Responsive Shell — PWA + Website Unification

**Context:** The current app has basic mobile support (sidebar toggle, bottom nav) but isn't truly responsive. The PWA needs to feel native on mobile; the website needs to work well on desktop. Same codebase.

**Tasks:**
- [ ] Audit and fix `AppLayout.tsx` responsive breakpoints — use `sm:`, `md:`, `lg:` consistently
- [ ] Sidebar: on mobile, slide-over overlay; on desktop, persistent collapsible sidebar
- [ ] TopBar: on mobile, show back button + title; on desktop, show full controls
- [ ] Editor: on mobile, full-width single column; on desktop, optional split pane
- [ ] MobileNav: only show on mobile (`md:hidden`)
- [ ] FAB: only show on mobile (`md:hidden`)
- [ ] Settings: responsive card layout (single column mobile, grid desktop)
- [ ] Calendar: responsive grid (3-col mobile → 7-col desktop)
- [ ] Touch gestures: swipe to go back (mobile), long-press for context menu
- [ ] Safe area insets for notch devices (`env(safe-area-inset-*)`)
- [ ] Test at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px+ (desktop)

**Verification:** App looks and feels native at every breakpoint. No horizontal scroll. Touch interactions work. PWA install prompt appears on mobile.

**Exit criteria:** Single codebase works well from 375px to 1920px+.

---

### Step 2.4: PWA Hardening

**Context:** The PWA config exists (`vite.config.ts` with `VitePWA`) but needs hardening for production mobile use.

**Tasks:**
- [ ] Add offline fallback page (`public/offline.html`)
- [ ] Configure workbox runtimeCaching for all Convex API routes (currently only `*.convex.site`)
- [ ] Add `apple-mobile-web-app-status-bar-style` meta for standalone mode
- [ ] Handle the install prompt with a custom "Add to Home Screen" banner
- [ ] Test offline behavior: create note offline → syncs when online
- [ ] Add push notification support (optional, for daily note reminder)
- [ ] Verify service worker updates don't break the app (test `autoUpdate`)
- [ ] Add proper manifest icons (192, 512, maskable) — verify they exist in `public/icons/`

**Verification:** App installs on iOS Safari and Android Chrome. Works offline (creates notes, syncs when back online). Service worker updates cleanly.

**Exit criteria:** PWA passes Lighthouse PWA audit. Installable on iOS and Android. Offline mode works.

---

### Step 2.5: User-Scoped Data & Settings

**Context:** With auth in place, tie user preferences and data to their account.

**Tasks:**
- [ ] Migrate theme preference from `localStorage` to user profile (or keep both with sync)
- [ ] Migrate Ollama API key from `localStorage` to Convex user document (encrypted or per-user)
- [ ] Add user settings page: display name, theme, AI preferences
- [ ] Add note sharing (optional, future): public link for published notes
- [ ] Update `SettingsPage.tsx` to show user info and handle per-user settings
- [ ] Add data export per user (already has `downloadAllAsZip`, scope to user's notes)

**Verification:** User settings persist across devices. Theme syncs. API key is per-user.

**Exit criteria:** User preferences are account-bound, not device-bound.

---

## Dependency Graph

```
Step 1.1 (Extension React Sidebar)
  └─→ Step 1.2 (Quick Add Features)
       └─→ Step 1.3 (Clip Enhancements)
            └─→ Step 1.4 (Extension Polish)

Step 2.1 (Auth)
  ├─→ Step 2.2 (Landing Page)
  └─→ Step 2.3 (Responsive Shell)
       └─→ Step 2.4 (PWA Hardening)
            └─→ Step 2.5 (User Settings)
```

**Parallel opportunity:** Phase 1 (extension) and Phase 2.1 (auth) can run in parallel since they touch separate codebases. Step 2.2 and 2.3 can also run in parallel after 2.1.

---

## Anti-Patterns to Avoid

1. **Don't build a second React app inside extension/** — keep it minimal. The extension sidebar should be ~500 lines max, not a full SPA. Use the Vite build but keep it lean.
2. **Don't abstract the Convex client** — the background.js HTTP calls are fine for the extension. Don't create a shared "Convex client" layer.
3. **Don't add a router library** — the current `view` state approach works. Just add auth gating.
4. **Don't over-engineer auth** — Convex Auth handles sessions, JWTs, OAuth. Just wire it up, don't build a custom auth layer.
5. **Don't create separate PWA and website builds** — one build, responsive CSS handles both.

---

## Files to Create/Modify

### New Files
- `extension/package.json`
- `extension/vite.config.ts`
- `extension/tsconfig.json`
- `extension/src/main.tsx`
- `extension/src/Sidebar.tsx`
- `extension/src/index.css`
- `extension/src/lib/convex.ts` (message-passing wrapper)
- `public/offline.html`
- `src/pages/LandingPage.tsx`
- `src/components/auth/LoginPage.tsx`
- `convex/auth.config.ts`
- `convex/auth.ts`
- `plans/notico-multiplatform.md` (this file)

### Modified Files
- `extension/manifest.json` — update side_panel path
- `extension/background.js` — remove DEFAULT_URL, add clip features
- `extension/content.js` — enhanced clip logic
- `convex/schema.ts` — add userId to notes
- `convex/notes.ts` — add auth filtering
- `src/main.tsx` — add auth provider
- `src/components/layout/AppLayout.tsx` — add auth gate, landing page route
- `src/components/layout/TopBar.tsx` — add user menu
- `src/components/layout/Sidebar.tsx` — responsive fixes
- `src/pages/SettingsPage.tsx` — user settings, per-user prefs
- `src/index.css` — responsive utility classes
- `vite.config.ts` — PWA manifest updates

---

## Rollback Strategy

Each step is independently revertible:
- **Extension:** Delete `extension/src/`, restore `extension/sidebar/index.html`
- **Auth:** Remove auth provider from `main.tsx`, remove userId from schema
- **Landing page:** Delete `LandingPage.tsx`, remove route from AppLayout
- **Responsive:** Revert CSS breakpoint changes
- **PWA:** Revert `vite.config.ts` workbox changes

---

## Execution Order

| Step | Depends On | Can Parallel With | Est. Lines Changed |
|------|-----------|-------------------|-------------------|
| 1.1 Extension React Sidebar | — | 2.1 | ~400 new |
| 1.2 Quick Add Features | 1.1 | 2.1 | ~200 new |
| 1.3 Clip Enhancements | 1.2 | 2.2 | ~150 modified |
| 1.4 Extension Polish | 1.3 | 2.3 | ~100 modified |
| 2.1 Auth | — | 1.1 | ~300 new + modified |
| 2.2 Landing Page | 2.1 | 1.2, 2.3 | ~200 new |
| 2.3 Responsive Shell | 2.1 | 1.2, 2.2 | ~200 modified |
| 2.4 PWA Hardening | 2.3 | — | ~100 modified |
| 2.5 User Settings | 2.3 | — | ~150 modified |

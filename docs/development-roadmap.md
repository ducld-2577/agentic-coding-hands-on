# Development Roadmap — SAA 2025

## Overview

Living roadmap tracking project phases, milestones, and implementation progress for the Sun Asterisk Awards (SAA) 2025 platform.

**Last Updated:** 2026-05-24

---

## Phases

### Phase 1: Authentication & Login Screen
**Status:** Completed (2026-05-18)

- Supabase integration (local + cloud-ready)
- Login page with email/password form
- OAuth integration (Google, GitHub)
- Session management via cookies
- "Remember me" functionality
- Language selector (Vietnamese/English)
- Responsive design (mobile-first)

**Tests:** 20 unit tests passing

---

### Phase 2: Home Page Implementation
**Status:** Completed (2026-05-19)

**Components:**
- Home page at `/home` — protected by auth middleware (redirects unauthenticated users to `/login`)
- Header with active nav, language selector, account menu (role-based), notification bell placeholder
- Hero section: ROOT FURTHER keyvisual, countdown timer (env-var driven, 60s refresh interval), event info, CTA buttons, Root Further description
- 6 award category cards (responsive 2/3-column grid), static data, hash-link navigation
- Sun* Kudos promotional block
- Floating Widget button placeholder
- Responsive footer
- 4 stub pages: /awards-information, /sun-kudos, /profile, /admin

**Tests:** 15 new tests + 20 existing tests passing (35 total)

---

### Phase 3: Sun* Kudos — Live Board
**Status:** Completed (2026-05-24)

**Components:**
- Supabase schema: `departments`, `kudos_categories`, `kudos_hashtags`, `profiles`, `kudos`, `kudos_images`, `kudos_hearts` tables
- Seed data: 10 departments, 6 categories, 10 hashtags, 4 sample users
- API data layer: TypeScript types, data queries, server actions for submit/heart/fetch
- KV Banner: Statistics display (total kudos, new kudos, hearts)
- Submit Input: User selection, content editor, hashtag input with autocomplete
- Filter components: Department, category, hashtag filters
- Highlight Carousel: Recent top-starred kudos with badge, user info, action buttons
- Spotlight Board: D3 force simulation with interactive tooltips (names, departments)
- All Kudos Feed: Paginated chronological feed with infinite scroll
- Sidebar: Statistics block, prize list, filters
- Dialogs: Submit kudos modal, receiver search, secret box dialog, toast notifications
- Security: Server-side validation (content ≤1000 chars, hashtags ≤5, images ≤5), URL validation, atomic DB counters
- Page assembly: `/app/sun-kudos/page.tsx` with authentication

**Tests:** All implementation complete — integration tests pending (not in Phase 8 scope)

**Technical Details:**
- Supabase migrations with 6 atomic counter functions
- React Server Components + Client Components for proper hydration
- D3 v7 for force-directed graph visualization
- Tailwind CSS v4 custom components
- Next.js 16 Server Actions for mutations
- TypeScript strict mode throughout

---

## Milestones

| Milestone | Target | Status | Completed |
|-----------|--------|--------|-----------|
| MVP Launch (Auth + Home) | 2026-05-19 | Completed | 2026-05-19 |
| Sun* Kudos Live Board | 2026-05-24 | Completed | 2026-05-24 |
| Awards Detail Pages | TBD | Not Started | - |
| User Profile | TBD | Not Started | - |
| Admin Panel | TBD | Not Started | - |

---

## Key Decisions

- **Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Supabase
- **Auth:** Server Components + Supabase auth cookies (RFC 6265bis standard)
- **Design System:** MoMorph (Figma) → code (responsive, accessible)
- **Testing:** Vitest + React Testing Library (unit tests in `__tests__/`)
- **Deployment:** Vercel (staging + production)

---

## Risk Register

| Risk | Impact | Status | Mitigation |
|------|--------|--------|-----------|
| Countdown timer timezone mismatch | Medium | Resolved | ENV var in ISO-8601 + server-client sync |
| Header z-index conflicts | Medium | Resolved | Established z-index scale (content: z-10, header: z-30) |
| Vietnamese text truncation | High | Resolved | Use `whitespace-nowrap` instead of `truncate` |
| Unprotected routes | High | Resolved | Auth guard in middleware, public routes explicit |

### 2026-05-21 Update

- Switched Google login UX from popup OAuth to full-page redirect OAuth
- Middleware (`proxy.ts`) now enforces:
	- logged-in users hitting `/login` are redirected to `/home`
	- unauthenticated users are redirected from protected routes to `/login`

---

## Next Steps

1. Integration test suite for Sun* Kudos Live Board
2. Implement awards detail pages (`/awards-information`)
3. Build user profile dashboard (`/profile`)
4. Create admin control panel (`/admin`)
5. User testing & feedback loop

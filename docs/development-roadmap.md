# Development Roadmap — SAA 2025

## Overview

Living roadmap tracking project phases, milestones, and implementation progress for the Sun Asterisk Awards (SAA) 2025 platform.

**Last Updated:** 2026-05-21

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

## Milestones

| Milestone | Target | Status | Completed |
|-----------|--------|--------|-----------|
| MVP Launch (Auth + Home) | 2026-05-19 | Completed | 2026-05-19 |
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

1. Implement awards detail pages (`/awards-information`)
2. Build user profile dashboard (`/profile`)
3. Create admin control panel (`/admin`)
4. Add real data sources (database integration)
5. User testing & feedback loop

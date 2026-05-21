# Project Changelog — SAA 2025

All notable changes to the SAA 2025 project are documented here.

---

## [2026-05-21] OAuth Redirect Flow & Middleware Auth — UPDATED

### Changed
- Replaced Google OAuth popup flow with same-tab redirect flow from `/login`
- OAuth success path now returns directly to `/home` via callback `next=/home`
- OAuth failure path remains redirect to `/login?error=auth-failed`
- Re-enabled route protection in `proxy.ts` for authenticated sections (`/home`, `/admin`, `/profile`, `/sun-kudos`, `/awards-information`)
- Added authenticated-user guard: accessing `/login` while signed in redirects to `/home`

### Fixed
- Removed popup/BroadcastChannel dependency that could stall login completion after Google sign-in
- Corrected route rule test expectation for `/home` (now protected)

### Notes
- Home header profile/notification controls continue to render when `user` exists; with protected `/home`, this now consistently appears after successful login

---

## [2026-05-19] Home Page Implementation — COMPLETED

**Version:** 0.2.0

### Added
- Home page route (`/home`) — publicly accessible
- Hero section with ROOT FURTHER keyvisual, title, event info
- Dynamic countdown timer (env var driven, 60s refresh interval)
- "Coming Soon" label (toggles based on countdown state)
- Event details block (time, location, live stream info)
- Two CTA buttons: "ABOUT AWARDS" → `/awards-information`, "ABOUT KUDOS" → `/sun-kudos`
- Root Further description paragraph
- Header component with:
  - Navigation links (Home, Awards, Kudos, etc.)
  - Language selector (reused from login)
  - Account menu (role-based, logged-in users only)
  - Notification bell placeholder (logged-in users only)
- Award categories section: 6 responsive cards (2/3-column grid), static data
- Hash-link navigation to award categories
- Sun* Kudos promotional block
- Floating Widget button (placeholder, no actions defined in specs)
- Responsive footer with links
- Stub pages for deferred implementation:
  - `/awards-information`
  - `/sun-kudos`
  - `/profile`
  - `/admin`

### Testing
- 15 new unit tests added
- 20 existing unit tests continue passing
- 35 total passing tests
- Coverage: countdown logic, award slug utilities, navigation routing

### Technical Details
- Removed `redirect('/login')` guard from `/home` (now public)
- Implemented z-index scale for header/content layering
- Applied lesson from login: use `whitespace-nowrap` (not `truncate`) for Vietnamese text
- Avoided `overflow-hidden` on main wrapper (prevents dropdown clipping)
- Server/Client component split: Header + Hero (Server), Countdown (Client)

### Environment Variables
- `NEXT_PUBLIC_EVENT_DATETIME` — ISO-8601 event timestamp (controls countdown + "Coming Soon" visibility)

---

## [2026-05-18] Authentication & Login Screen — COMPLETED

**Version:** 0.1.0

### Added
- Supabase integration (local + cloud environments)
- Login page (`/login`) with email/password authentication
- OAuth providers (Google, GitHub)
- Session management via HTTP-only cookies (RFC 6265bis)
- "Remember me" checkbox
- Language selector (Vietnamese/English)
- Error handling and form validation
- Responsive design (mobile-first)
- Dark mode support
- Protected routes middleware

### Testing
- 20 unit tests for auth flows, form validation, language selection

### Technical Details
- Server Components + `createServerClient` for auth
- Cookie-based session storage
- PKCE flow for OAuth security
- Vitest + React Testing Library

---

## Future Releases (Planned)

### Awards Detail Pages
- Award criteria, scoring, previous winners
- Award submission form
- Voting/ranking interface

### User Profile
- Personal information management
- Submission history
- Notification preferences
- Account settings

### Admin Panel
- User management
- Award configuration
- Results management
- Analytics dashboard

---

## Known Limitations

- Widget button actions not yet specified (placeholder only)
- Notification system placeholder (no data model defined)
- Profile, Awards Info, Sun Kudos pages are stubs (not in Phase 2 scope)
- Award data currently static (no database integration)

---

## Version History

| Version | Date | Phase | Status |
|---------|------|-------|--------|
| 0.1.0 | 2026-05-18 | Auth & Login | Completed |
| 0.2.0 | 2026-05-19 | Home Page | Completed |
| TBD | TBD | Awards & Profile | Planned |

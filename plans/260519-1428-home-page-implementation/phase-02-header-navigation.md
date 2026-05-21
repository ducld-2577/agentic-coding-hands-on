# Phase 02 — Header Navigation

**Status:** completed | **Priority:** high

## Overview

Implement the full home page header (A1): logo, nav links with active/hover states,
language selector (reuse existing), notification bell (placeholder), and account menu
with role-based options. Header is a server component that receives `user` from the page.

## MoMorph Refs

- Specs: A1, A1.1–A1.8
- Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

## Architecture

```
components/home/home-header.tsx              — Server wrapper, passes user to client parts
components/home/home-nav-links.tsx           — Nav links with active/hover states ('use client')
components/home/home-account-menu.tsx        — Account dropdown: Profile/Sign out/Admin ('use client')
components/home/home-notification-bell.tsx   — Bell icon + badge placeholder ('use client')
```

Language selector: **reuse** `components/login/language-selector.tsx` as-is.

## Specs

### Header (A1)
- Fixed to top, full width, `position: fixed` or `sticky`
- `z-30` — above hero section (z-10) and award cards
- No `overflow-hidden` anywhere in header

### Logo (A1.1)
- 64×60px, alt text "SAA 2025"
- Click → navigate to `/home`, scroll to top
- Use `<Link href="/home">` with scroll behavior

### Nav Links (A1.2–A1.5)
| Item | Route | Notes |
|------|-------|-------|
| About SAA 2025 | `/home` | **Selected** when on `/home` (yellow + underline) |
| Awards Information | `/awards-information` | Hover highlight |
| Sun* Kudos | `/sun-kudos` | Normal state |

- Active detection: use `usePathname()` from `next/navigation`
- Selected state: `text-yellow-400 underline` (or Figma exact color)
- Hover state: bright background highlight (`hover:bg-white/10`)
- If selected and clicked again → scroll to top (use `window.scrollTo(0,0)` onClick)

### Language Selector (A1.7)
- Reuse `<LanguageSelector />` from `components/login/language-selector.tsx`
- No changes needed — already handles VN/EN, cookie persistence, click-outside

### Notification Bell (A1.6)
- 40×40px icon button
- Only shown when `user !== null` (authenticated)
- Red badge when `hasUnread` (placeholder: always false for now — no data model)
- Click → toggle a simple panel placeholder (empty for now)
- Keyboard: Enter/Space opens, Esc closes

### Account Menu (A1.8)
- 40×40px icon button, only shown when `user !== null`
- Click → dropdown menu:
  - "Profile" → `/profile`
  - "Sign out" → calls `supabase.auth.signOut()` then `router.push('/login')`
  - "Admin Dashboard" → `/admin` — only shown if `user.app_metadata?.role === 'admin'`
- Click outside → close (same pattern as LanguageSelector)
- Keyboard: Enter/Space opens; Esc closes

## Files to Create
- `components/home/home-header.tsx`
- `components/home/home-nav-links.tsx`
- `components/home/home-account-menu.tsx`
- `components/home/home-notification-bell.tsx`

## Implementation Steps

1. `HomeHeader` (Server Component): receives `user`, renders logo + `<HomeNavLinks />` + controls
2. `HomeNavLinks` (Client Component): `usePathname()` for active detection, renders 3 nav links
3. `HomeAccountMenu` (Client Component): dropdown with `useRef` click-outside, sign-out handler
4. `HomeNotificationBell` (Client Component): simple bell icon + badge placeholder, toggle panel

## z-index Rule (from login lessons)

Header container: `fixed top-0 z-30`. Hero section: `z-10`. Award/other sections: `z-0` default.
Any dropdown from header items: `z-50` (above header itself).

## Todo

- [ ] `HomeHeader` server component
- [ ] `HomeNavLinks` with active/hover states
- [ ] `HomeAccountMenu` with role-based sign-out
- [ ] `HomeNotificationBell` placeholder

## Success Criteria

- "About SAA 2025" shows selected (yellow/underline) when on `/home`
- Language dropdown opens/closes, persists selection
- Account menu shows/hides Admin Dashboard based on user role
- Sign out clears session and redirects to `/login`
- Header dropdowns NOT clipped (no `overflow-hidden` on parent)

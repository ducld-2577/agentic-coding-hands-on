# Phase 01 — Layout & Hero Section

**Status:** completed | **Priority:** high

## Overview

Replace the stub `app/home/page.tsx` with the full home page layout. Implement the hero section
(keyvisual banner) including the ROOT FURTHER title, Coming Soon label, event info block (B2),
CTA buttons (B3), and Root Further description paragraph (B4).

## MoMorph Refs

- Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
- Specs: B1.2 (Coming soon), B2 (Event info), B3/B3.1/B3.2 (CTA), B4 (description), 3.5 (Keyvisual)

## Architecture

```
app/home/page.tsx                       — Server Component, orchestrates sections
components/home/home-hero-section.tsx   — Keyvisual background + ROOT FURTHER title
components/home/home-event-info.tsx     — Static event time/location block (B2)
components/home/home-cta-buttons.tsx    — ABOUT AWARDS + ABOUT KUDOS buttons (B3)
components/home/home-root-further.tsx   — "Root Further" description paragraph (B4)
```

## Specs

### Keyvisual (3.5)
- Background: decorative root/line pattern (static image asset)
- Title: "ROOT FURTHER" — very large font, centered
- Dark overlay gradient (same pattern as login)

### Coming Soon label (B1.2)
- Text: "Coming soon"
- Visible when `Date.now() < EVENT_DATETIME`
- Hidden when countdown reaches zero (logic lives in phase-03 Countdown component)
- This phase: render as a static prop `showComingSoon` passed from server

### Event Info (B2) — static display only
- "Thời gian: 18h30"
- "Địa điểm: Nhà hát nghệ thuật quân đội"
- "Tường thuật trực tiếp tại Group Facebook Sun* Family"
- Responsive: stacks vertically on small screens

### CTA Buttons (B3.1 / B3.2)
- "ABOUT AWARDS" → `/awards-information` (yellow fill, hover state)
- "ABOUT KUDOS" → `/sun-kudos` (outline, normal state)
- Both buttons use `whitespace-nowrap` (lesson from login: no `truncate`)
- Hover: yellow fill ↔ outline swap on hover

### Root Further description (B4)
- Static paragraph text, light color on dark background
- Responsive: wraps naturally

## Layout Rules (lessons from login)

- `<main>` must NOT have `overflow-hidden` — keep it clean for dropdowns
- Background layers go in a dedicated `aria-hidden` inner div
- Hero section: `relative z-10` (content sections use z-10 or lower)
- Header will use `z-30` (phase-02)

## Files to Modify
- `app/home/page.tsx` — replace stub with full page structure

## Files to Create
- `components/home/home-hero-section.tsx`
- `components/home/home-event-info.tsx`
- `components/home/home-cta-buttons.tsx`
- `components/home/home-root-further.tsx`

## Implementation Steps

1. Rewrite `app/home/page.tsx`:
   - Remove `if (!user) redirect('/login')` guard (page becomes public — handled in phase-06)
   - Still call `createClient()` to get `user` for conditional header in phase-02
   - Compose: `<HomeHeader user={user} />`, `<HomeHeroSection />`, `<HomeCountdown />`, awards, kudos, footer
   - `<main>` with `relative min-h-screen` — no `overflow-hidden`
2. Create `HomeHeroSection`: keyvisual bg (inner div with `overflow-hidden`), ROOT FURTHER title, pass `showComingSoon` down to Countdown (phase-03)
3. Create `HomeEventInfo`: static render with label/value pairs, responsive flex-col
4. Create `HomeCtaButtons`: two Next.js `<Link>` styled as buttons, hover swap via Tailwind `group`
5. Create `HomeRootFurther`: static paragraph block

## Todo

- [ ] Rewrite `app/home/page.tsx`
- [ ] `HomeHeroSection` component with background layers
- [ ] `HomeEventInfo` static block
- [ ] `HomeCtaButtons` with hover styling
- [ ] `HomeRootFurther` paragraph

## Success Criteria

- ROOT FURTHER title visible over decorative background
- Event info renders correctly on desktop and mobile
- CTA buttons navigate correctly without text truncation
- No `overflow-hidden` on `<main>`

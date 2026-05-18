---
phase: 03
title: Login Screen UI
status: completed
priority: high
effort: large
blockedBy: [phase-02]
momorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
---

# Phase 03 — Login Screen UI

## Overview

Implement the Login screen UI matching the MoMorph design exactly. Static/presentational components with mock data — auth wiring happens in Phase 04.

## Design Structure (from MoMorph specs + test cases)

```
┌─────────────────────────────────────────────────────┐
│ A. Header                                            │
│  [Logo Sun Annual Awards 2025]    [🇻🇳 VN ▼]        │
├───────────────────────────┬─────────────────────────┤
│ B. Hero Area              │ C. Keyvisual            │
│  B.1 Key Visual (bg)      │   (decorative panel)   │
│  B.2 Content:             │                         │
│    "ROOT FURTHER"         │                         │
│    description 1          │                         │
│    description 2          │                         │
│  B.3 [LOGIN With Google]  │                         │
├───────────────────────────┴─────────────────────────┤
│ D. Footer (fixed bottom)                            │
└─────────────────────────────────────────────────────┘
```

> Note: Verify exact layout split (left/right panels vs full-width) from MoMorph image during implementation using `mcp__momorph__get_frame_image`.

## Component Structure

```
app/login/page.tsx                   ← Server Component, layout root
components/login/
  login-header.tsx                   ← Logo + Language selector
  language-selector.tsx              ← VN/EN dropdown (Client Component)
  login-hero-section.tsx             ← Key visual + content overlay
  google-login-button.tsx            ← Button with loading/disabled state (Client Component)
  login-footer.tsx                   ← Fixed footer
```

## Implementation Steps

### 1. `app/login/page.tsx` — Login page root

Server Component. Assembles layout sections.

```tsx
import LoginHeader from '@/components/login/login-header'
import LoginHeroSection from '@/components/login/login-hero-section'
import LoginFooter from '@/components/login/login-footer'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <LoginHeader />
      <LoginHeroSection />
      <LoginFooter />
    </div>
  )
}
```

### 2. `components/login/login-header.tsx`

Logo left, language selector right. Fixed top.

- Logo: non-interactive image (`/public/logo-saa-2025.svg` or `.png`)
- Language selector: Client Component (needs state)

### 3. `components/login/language-selector.tsx` (Client Component)

```tsx
'use client'
// State: current locale (VN | EN), stored in cookie 'locale'
// UI: flag emoji + locale code + chevron-down icon
// On click: toggles dropdown showing VN / EN options
// On select: sets cookie, re-renders with new locale
```

- Default locale: `VN`
- Read initial locale from cookie `locale` (falls back to VN)
- Write to cookie on change: `document.cookie = 'locale=EN; path=/'`
- Pass locale to parent via prop or use context

### 4. `components/login/login-hero-section.tsx`

Contains B.1 (key visual background) + B.2 (text content) + B.3 (login button).

- Background: CSS `background-image` or `<Image>` with `fill` for key visual
- Text content sourced from `loginTranslations[locale]`
- GoogleLoginButton slotted below descriptions

### 5. `components/login/google-login-button.tsx` (Client Component)

```tsx
'use client'
// Props: onClick handler, isLoading boolean
// UI: Google SVG icon + text label
// States:
//   default: full color, pointer cursor
//   hover: shadow/elevated effect (test case: "shadow or elevated effect while hovered")
//   loading: disabled, spinner replaces icon
//   disabled: opacity reduced, no-pointer
```

Google icon: use inline SVG (no external dependency needed).

### 6. `components/login/login-footer.tsx`

Fixed bottom, non-interactive. Static text/copyright.

## Asset Requirements

| Asset | Source | Path |
|-------|---------|------|
| SAA 2025 Logo | Fetch from MoMorph via `get_design_item_image` | `public/logo-saa-2025.png` |
| Key Visual image | Fetch from MoMorph | `public/key-visual.png` |
| VN flag emoji | Unicode `🇻🇳` | inline |
| EN flag emoji | Unicode `🇬🇧` | inline |
| Google icon | Inline SVG | in component |

> Fetch assets during implementation using `mcp__momorph__get_design_item_image` for node IDs:
> - Logo node: `I662:14391;186:2166` (A.1)
> - Key Visual node: `662:14395` (B.1)
> - Keyvisual right panel: `662:14388` (C)

## Design Tokens (to verify from Figma)

Use `mcp__momorph__get_node` or `get_frame_node_tree` during implementation to extract:
- Background colors, font sizes, spacing
- Button colors (primary, hover, disabled)
- Header height

## Files

| Action | File |
|--------|------|
| Create | `app/login/page.tsx` |
| Create | `components/login/login-header.tsx` |
| Create | `components/login/language-selector.tsx` |
| Create | `components/login/login-hero-section.tsx` |
| Create | `components/login/google-login-button.tsx` |
| Create | `components/login/login-footer.tsx` |
| Add | `public/logo-saa-2025.png` |
| Add | `public/key-visual.png` |

## Todo

- [ ] Create `app/login/page.tsx`
- [ ] Create `components/login/login-header.tsx`
- [ ] Create `components/login/language-selector.tsx` with VN/EN toggle + cookie persistence
- [ ] Create `components/login/login-hero-section.tsx` with key visual background
- [ ] Create `components/login/google-login-button.tsx` with loading/disabled/hover states
- [ ] Create `components/login/login-footer.tsx`
- [ ] Fetch and save logo + key visual assets from MoMorph
- [ ] Verify pixel-accurate layout against MoMorph screenshot
- [ ] Run `npx tsc --noEmit` — no errors

## Success Criteria

- Login page renders at `/login` matching MoMorph design
- Language selector toggles VN ↔ EN, persists in cookie
- Google button shows hover shadow, loading spinner, disabled state
- Footer is fixed at bottom regardless of scroll
- Logo is top-left, language selector is top-right
- No TypeScript errors

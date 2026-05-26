# Phase 05 — Sun* Kudos, Widget Button & Footer

**Status:** completed | **Priority:** medium

## Overview

Implement three remaining sections: the Sun* Kudos promo block (D1/D2), the floating Widget
action button (item 6), and the Footer navigation bar (item 7).

## MoMorph Refs

- Specs: D1/D2/D2.1 (Kudos), 6 (Widget button), 7/7.1–7.5 (Footer)
- Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

## Architecture

```
components/home/home-kudos-section.tsx    — Sun* Kudos promo block (Server Component)
components/home/home-widget-button.tsx    — Floating action button ('use client')
components/home/home-footer.tsx           — Footer with logo, nav links, copyright (Server Component)
```

## Sun* Kudos Block (D1/D2)

### Display
- Label: "Phong trào ghi nhận" (small caption)
- Title: "Sun* Kudos" (large text)
- Description: short paragraph
- Image: illustrative asset on right side
- Button: "Chi tiết" with icon

### Function
- "Chi tiết" click → `<Link href="/sun-kudos">`
- Static render — no interactivity beyond navigation

## Widget Button (item 6)

### Display
- Fixed position: `fixed bottom-6 right-6 z-50`
- Pill shape: `105×64px`, yellow background (`#F5C518` or Figma value), fully rounded
- Left icon: pencil/edit icon (SVG)
- Right icon: SAA brand icon (SVG)
- Separator: "/" character between icons

### Function
- Click → toggle a quick-action menu (opens above the button)
- Menu content: placeholder — show a small panel with "Coming soon" text
- Click outside or click button again → close menu
- State: `isOpen` boolean in component

## Footer (item 7)

### Display
- Three-column layout: logo (left) | nav links (center) | copyright (right)
- Logo: SAA icon, 69×64px, alt text
- Nav links: About SAA 2025 · Awards Information · Sun* Kudos · Tiêu chuẩn chung
- Copyright: "Bản quyền thuộc vè Sun* © 2025"

### Function
- Logo click → navigate to `/home`, scroll to top
- Nav link clicks: same routes as header (About SAA 2025 → `/home`, Awards → `/awards-information`, Kudos → `/sun-kudos`, Tiêu chuẩn chung → `/tieu-chuan-chung`)
- Hover/active states matching header nav styles

### Responsive
- Mobile: stack vertically (logo top, links below, copyright bottom)
- Desktop: three columns in single row

## Files to Create
- `components/home/home-kudos-section.tsx`
- `components/home/home-widget-button.tsx`
- `components/home/home-footer.tsx`

## Implementation Steps

1. `HomeKudosSection`: server component, static render with Link to `/sun-kudos`
2. `HomeWidgetButton`: client component, fixed positioning, toggle state, click-outside handler
3. `HomeFooter`: server component, three-column flex, `<Link>` for each nav item

## Todo

- [ ] `HomeKudosSection` with "Chi tiết" link
- [ ] `HomeWidgetButton` with toggle menu placeholder
- [ ] `HomeFooter` responsive three-column layout

## Success Criteria

- "Chi tiết" on Kudos section navigates to `/sun-kudos`
- Widget button visible fixed at bottom-right, yellow pill shape
- Widget menu opens/closes on click and click-outside
- Footer displays logo, 4 nav links, copyright text
- Footer is responsive (stacks on mobile)

# Phase 03 — Countdown Prelaunch Page

**Status:** ✅ Done | **Priority:** High | **Depends on:** Phase 01, 02 | **Completed:** 2026-05-27

## MoMorph refs
- Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU (screenId: 8PJQswPZmU)
- Clarifications: ./clarifications.md

## Goal
Implement the Countdown Prelaunch page at `/countdown` — full-screen dark background with
colorful organic pattern, centered title "Sự kiện sẽ bắt đầu sau", and LED-style countdown.
Page is **public** (no auth required).

## Design specs (from MoMorph)
- BG: full-screen image `public/countdown/bg.png` + dark overlay
- Title: "Sự kiện sẽ bắt đầu sau" — white, medium weight, centered, above countdown
- Countdown: DAYS | HOURS | MINUTES — LED-style digit boxes, centered
- Layout: everything centered vertically and horizontally

## Related files
- Read: `components/countdown/countdown-unit.tsx` (phase 02 output)
- Read: `lib/config/event.config.ts` (phase 01 output)
- Read: `lib/utils/countdown.ts`
- Create: `components/countdown/countdown-prelaunch.tsx`
- Create: `app/countdown/page.tsx`
- Download: BG image from MoMorph node 2268:35129 → `public/countdown/bg.png`

## Implementation steps

1. Download background image:
   - Fetch signed URL from MoMorph media files for screenId `8PJQswPZmU`
   - Save binary to `public/countdown/bg.png`

2. Create `components/countdown/countdown-prelaunch.tsx`:
   ```
   'use client'
   - Import: EVENT_DATETIME from lib/config/event.config
   - Import: calculateCountdown from lib/utils/countdown
   - Import: CountdownUnit from ./countdown-unit
   - State: countdown (CountdownResult), updates every 60s via setInterval
   - Layout: min-h-screen, full BG image cover + dark overlay, flex center
   - Title: "Sự kiện sẽ bắt đầu sau" — white, font-montserrat, bold
   - Countdown row: flex gap-10 centered — Days, Hours, Minutes using CountdownUnit
   - Separator: vertical divider lines between units (match Figma: thin white/gold lines)
   ```

3. Create `app/countdown/page.tsx`:
   ```ts
   import { CountdownPrelaunch } from '@/components/countdown/countdown-prelaunch'
   export default function CountdownPage() {
     return <CountdownPrelaunch />
   }
   ```
   - No auth wrapper — public route

## Design detail (from Figma)
- Background: dark navy + colorful abstract pattern right side
- Digit boxes: frosted-glass, gold border (reuse DigitBox from countdown-unit)
- Separators: thin vertical lines between DAYS|HOURS and HOURS|MINUTES groups
- Title font size: ~20–24px white, centered above countdown row

## Success criteria
- `/countdown` route renders without auth
- Countdown ticks using EVENT_DATETIME from config
- All digit values are 2-digit zero-padded
- Expired state: all units show "00"
- Background image covers full viewport

## Todo
- [x] Download bg.png to `public/countdown/bg.png`
- [x] Create `components/countdown/countdown-prelaunch.tsx`
- [x] Create `app/countdown/page.tsx`
- [x] Verify build passes
- [x] Visual check: layout matches Figma design

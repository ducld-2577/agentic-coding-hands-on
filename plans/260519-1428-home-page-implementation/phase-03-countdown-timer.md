# Phase 03 — Countdown Timer

**Status:** completed | **Priority:** high

## Overview

Implement the real-time countdown component (B1) that counts down to the SAA event.
Reads target datetime from `NEXT_PUBLIC_EVENT_DATETIME` env var (ISO-8601), updates every
minute, shows "Coming soon" label until event starts, then freezes at 00/00/00.

## MoMorph Refs

- Specs: B1 (section), B1.2 (Coming soon label), B1.3 (Countdown), B1.3.1-3.3 (Days/Hours/Minutes)
- Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

## Architecture

```
components/home/home-countdown.tsx       — 'use client', owns all countdown state
lib/utils/countdown.ts                   — Pure calculation: ms → { days, hours, minutes }
```

No server component wrapper needed — countdown is fully client-side.

## Specs

### Countdown (B1.3)
- 3 units: DAYS, HOURS, MINUTES (no seconds per spec)
- Each unit: 2 digits with zero-padding (`05`, `09`, `00`)
- Auto-updates: recalculate on every minute tick
- When reaches 0: freeze at `00 / 00 / 00`, hide "Coming soon" label

### Coming Soon (B1.2)
- Text: "Coming soon"
- Visible: `eventDatetime > now`
- Hidden: `eventDatetime <= now`

### Environment Variable
```
NEXT_PUBLIC_EVENT_DATETIME=2025-12-31T18:30:00+07:00
```
- Must be `NEXT_PUBLIC_` (exposed to browser)
- Invalid/missing → fallback: all zeros, no crash

### Countdown Calculation (pure function)
```typescript
// lib/utils/countdown.ts
export function calculateCountdown(targetIso: string): { days: number; hours: number; minutes: number; expired: boolean }
// Returns expired=true when target is in the past or invalid
```

### Timer Logic
- `useEffect` with `setInterval` (60 000ms)
- Clear interval on unmount
- Initial value calculated synchronously (no flash of zeros)

## Files to Create
- `components/home/home-countdown.tsx`
- `lib/utils/countdown.ts`

## Files to Modify
- `.env.local` — add `NEXT_PUBLIC_EVENT_DATETIME` example
- `supabase/.env` — no changes needed

## Implementation Steps

1. Write `lib/utils/countdown.ts`:
   - `calculateCountdown(targetIso)` → `{ days, hours, minutes, expired }`
   - Handle invalid ISO string → return `{ days:0, hours:0, minutes:0, expired:true }`
   - Total remaining ms → decompose into days/hours/minutes (floor divisions)
2. Write `HomeCountdown` component:
   - Read `process.env.NEXT_PUBLIC_EVENT_DATETIME`
   - Initialize state from `calculateCountdown` synchronously
   - `setInterval(60_000)` to re-calculate each minute
   - Render 3 countdown tiles + labels + "Coming soon" label conditional

## Todo

- [ ] `lib/utils/countdown.ts` pure function
- [ ] `HomeCountdown` component with interval
- [ ] Add `NEXT_PUBLIC_EVENT_DATETIME` to `.env.local`

## Success Criteria

- Countdown displays correct remaining days/hours/minutes on load
- Values update every minute (verify by mocking Date in tests)
- Single-digit values show leading zero ("05" not "5")
- "Coming soon" hidden when `expired === true`
- No crash if env var is missing or invalid

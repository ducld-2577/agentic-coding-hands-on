# Phase 02 — Extract Shared Countdown-Unit Components

**Status:** ✅ Done | **Priority:** High (blocks phase 03) | **Completed:** 2026-05-27

## Goal
Extract `DigitBox` and `CountdownUnit` from `home-countdown.tsx` into a shared module
so both the homepage and the prelaunch page reuse them without duplication (DRY).

## Related files
- Read: `components/home/home-countdown.tsx` (source of DigitBox + CountdownUnit)
- Create: `components/countdown/countdown-unit.tsx`
- Modify: `components/home/home-countdown.tsx`

## Components to extract

### DigitBox
- Frosted-glass box: 51×82px, gradient + gold border (#FFEA9E) + blur(16px)
- Renders a single digit character (string)
- No changes needed — extract as-is

### CountdownUnit
- Two `DigitBox` instances side-by-side (gap 14px) + label below (gap 14px)
- Label: `font-montserrat font-bold text-white 24px`
- Props: `value: string` (2-char zero-padded), `label: string`
- No changes needed — extract as-is

## Implementation steps

1. Create `components/countdown/countdown-unit.tsx`:
   - Move `DigitBox` and `CountdownUnit` from `home-countdown.tsx` verbatim
   - Export both as named exports

2. Update `components/home/home-countdown.tsx`:
   - Remove `DigitBox` and `CountdownUnit` definitions
   - Add import: `import { CountdownUnit } from '@/components/countdown/countdown-unit'`

## Success criteria
- `home-countdown.tsx` renders identically after refactor
- `countdown-unit.tsx` exports `DigitBox` and `CountdownUnit`
- Build compiles without errors

## Todo
- [x] Create `components/countdown/countdown-unit.tsx` with extracted components
- [x] Update `home-countdown.tsx` to import from new module
- [x] Verify build passes

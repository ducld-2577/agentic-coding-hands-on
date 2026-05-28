# Phase 01 — Event Config Centralization

**Status:** ✅ Done | **Priority:** High (blocks phases 02–04) | **Completed:** 2026-05-27

## Goal
Create a single TypeScript config file as the authoritative source for the event datetime,
so both the homepage countdown and the new prelaunch page read from the same place.

## Related files
- Read: `lib/utils/countdown.ts`
- Read: `components/home/home-countdown.tsx`
- Read: `.env.local` (NEXT_PUBLIC_EVENT_DATETIME already defined)
- Create: `lib/config/event.config.ts`
- Modify: `components/home/home-countdown.tsx`

## Implementation steps

1. Create `lib/config/event.config.ts`:
   ```ts
   export const EVENT_DATETIME = process.env.NEXT_PUBLIC_EVENT_DATETIME ?? ''
   ```
   - Single export, no logic — just reads the env var
   - All components import `EVENT_DATETIME` from here instead of reading `process.env` directly

2. Update `components/home/home-countdown.tsx`:
   - Replace `const targetIso = process.env.NEXT_PUBLIC_EVENT_DATETIME ?? ''`
   - With `import { EVENT_DATETIME } from '@/lib/config/event.config'` and use `EVENT_DATETIME`

## Success criteria
- `home-countdown.tsx` no longer references `process.env` directly
- `lib/config/event.config.ts` exports `EVENT_DATETIME`
- Build compiles without errors

## Todo
- [x] Create `lib/config/event.config.ts`
- [x] Update `home-countdown.tsx` to import from config
- [x] Run `npm run build` to verify no compile errors

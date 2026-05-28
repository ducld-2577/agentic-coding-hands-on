# Phase 04 — Login Page: Add Countdown Link Button

**Status:** ✅ Done | **Priority:** Medium | **Depends on:** Phase 03 | **Completed:** 2026-05-27

## Goal
Add a button on the login page that redirects users to `/countdown` (the Prelaunch page),
positioned below the Google login button.

## Related files
- Read: `components/login/login-interactive.tsx`
- Read: `components/login/login-hero-section.tsx`
- Modify: `components/login/login-interactive.tsx`

## Design decision
- `LoginHeroSection` already has a `loginButtonSlot: ReactNode` prop
- Approach: wrap both buttons in a flex column inside `LoginInteractive`, pass as the slot
- No changes needed to `LoginHeroSection` — slot pattern already supports this

## Button styling
- Secondary / ghost style — less prominent than the gold Google login button
- Outline: `1px solid rgba(255,255,255,0.3)`, white text
- Hover: slightly brighter border
- Label (Vietnamese): "Xem đếm ngược" (or bilingual if locale-aware)
- Uses Next.js `<Link>` for client-side navigation to `/countdown`

## Implementation steps

1. Update `components/login/login-interactive.tsx`:
   - Import `Link` from `next/link`
   - In the `loginButtonSlot` prop, wrap `GoogleLoginButton` and a new `<Link href="/countdown">` button in a `<div className="flex flex-col gap-3">`
   - Style the countdown link as an outline button matching the dark login theme

## i18n consideration
- The login page uses `loginTranslations[locale]` for text
- For simplicity: hardcode "Xem đếm ngược" (only Vietnamese needed per app context) OR add key to translations
- Decision: hardcode for now (YAGNI — no multilingual requirement stated)

## Success criteria
- Login page shows the countdown button below Google login
- Clicking it navigates to `/countdown`
- Button is styled consistently with the login page design

## Todo
- [x] Update `login-interactive.tsx` to add countdown link button
- [x] Verify button renders and navigates correctly
- [x] Verify Google login still works (no regression)

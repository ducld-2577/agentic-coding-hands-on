---
reviewer: reviewer-agent
date: 2026-05-27
feature: Countdown Prelaunch
branch: feature.profile
---

## Code Review Summary

### Scope
- Files: `lib/config/event.config.ts`, `components/countdown/countdown-unit.tsx`, `components/countdown/countdown-prelaunch.tsx`, `app/countdown/page.tsx`, `components/home/home-countdown.tsx`, `components/login/login-interactive.tsx`
- Supporting: `lib/utils/countdown.ts`, `proxy.ts`, `components/login/login-hero-section.tsx`
- LOC: ~200 across new/modified files

### Overall Assessment
Implementation is clean and functionally correct for the happy path. DRY goal achieved — `CountdownUnit`/`DigitBox` are properly shared, zero duplication. The main concerns are a stale-countdown bug on initial mount, an out-of-sync interval (60 s tick vs seconds-granularity display), missing null guard on `value` in `CountdownUnit`, an unguarded route in `proxy.ts`, and a hardcoded Vietnamese string blocking i18n on the new button.

---

### Critical Issues

None.

---

### High Priority

**1. Stale countdown on first render (hydration / SSR mismatch)**

`countdown-prelaunch.tsx` and `home-countdown.tsx` both initialize state via `useState(() => calculateCountdown(EVENT_DATETIME))`. On the server this runs at request time; on the client it runs at JS-parse time. These two timestamps differ, producing a hydration mismatch warning and a visible "jump" when React reconciles. More importantly, `calculateCountdown` is called once and then not ticked until the interval fires 60 seconds later — so the displayed value can be up to 59 s stale on page load.

Fix: initialize state to `null` (or a loading sentinel) and populate it inside `useEffect`:
```ts
const [countdown, setCountdown] = useState<CountdownResult | null>(null)
useEffect(() => {
  if (!EVENT_DATETIME) return
  setCountdown(calculateCountdown(EVENT_DATETIME))
  const id = setInterval(() => setCountdown(calculateCountdown(EVENT_DATETIME)), 60_000)
  return () => clearInterval(id)
}, [])
```
Render a skeleton/placeholder while `countdown === null`.

**2. `/countdown` route is not in `proxy.ts` PUBLIC_ROUTES or PROTECTED_ROUTES**

`proxy.ts` lists explicit protected routes. `/countdown` is in neither list, so it falls through to `return supabaseResponse` — effectively public, which matches the stated requirement ("Countdown page is public (no auth)"). However this is silently implicit. If an unauthenticated user can reach `/countdown` and then clicks the Google login link that redirects to `/home`, the open-redirect concern (already flagged as an open issue) still applies: `/auth/callback?next=/home` — the `next` param is unvalidated. Existing known bug, but the new Link at `/login` that sends users to `/countdown` and the new `/countdown` → Google OAuth path keep this unvalidated redirect live in the new feature surface.

No new code needed beyond flagging that this known issue now has an additional path: login → countdown → Google login (if ever added to countdown page).

---

### Medium Priority

**3. `CountdownUnit` will render `undefined` if `value` is shorter than 2 characters**

`countdown-unit.tsx` line 33–34:
```tsx
<DigitBox digit={value[0]} />
<DigitBox digit={value[1]} />
```
`DigitBox` receives `digit: string`. If `value` is `"0"` (1 char), `value[1]` is `undefined` — TypeScript does not catch this because string index access returns `string`, not `string | undefined` (unless `noUncheckedIndexedAccess` is enabled). At runtime `DigitBox` renders the literal text `undefined` inside the span.

In practice `pad()` always produces a 2-char string, so this only fires if a caller forgets to pad. The fix is defensive:
```ts
<DigitBox digit={value[0] ?? '0'} />
<DigitBox digit={value[1] ?? '0'} />
```
Or assert at the prop boundary: `value: string` → document as "must be exactly 2 chars" and add a runtime assert in dev.

**4. Interval granularity vs. display granularity**

The countdown displays DAYS / HOURS / MINUTES. `calculateCountdown` truncates seconds (correct). But the interval fires every 60 000 ms (60 s), which means the displayed minute count can lag by up to 59 s. If the event datetime is, say, `HH:MM:30`, the display will show `01` minutes for 90 s before snapping to `00`. For a minutes-level display this is acceptable product-wise, but the comment "60 000 ms interval" should explicitly state this is intentional to avoid future "fix" PRs changing it to 1 000 ms.

**5. Typo in `home-countdown.tsx`**

Line 32: `"Comming soon"` — double `m`. Should be `"Coming soon"`.

**6. Hardcoded Vietnamese string in `login-interactive.tsx`**

Line 62: `Xem đếm ngược` is hardcoded in the JSX. The sibling `GoogleLoginButton` uses `t.loginButton` from `loginTranslations`. This string is not in the translation map, making the button non-translatable if the locale switches to English. Either add it to `loginTranslations` or document that this feature is intentionally Vietnamese-only.

---

### Low Priority

**7. `home-countdown.tsx`: unnecessary intermediate variable**

Line 13: `const targetIso = EVENT_DATETIME` — `targetIso` is used exactly once. Inline it directly (same as `countdown-prelaunch.tsx` does) to reduce noise. Minor, but violates KISS.

**8. No `aria-label` or accessible name on the countdown `<main>`**

`countdown-prelaunch.tsx` renders a `<main>` with no `aria-label`. Screen readers will announce it as "main landmark" without context. Add `aria-label="Countdown to event"` or a visually-hidden `<h1>`.

---

### Edge Cases Found

- **`EVENT_DATETIME` empty string in production**: `calculateCountdown('')` returns `expired: true` (handled by the guard in `countdown.ts`). `countdown-prelaunch.tsx` checks `if (!EVENT_DATETIME) return` inside `useEffect` so the interval is skipped — correct. However, the initial `useState` call still runs `calculateCountdown('')` synchronously, returning `{ days:0, hours:0, minutes:0, expired:true }`. The prelaunch page will render `00 DAYS / 00 HOURS / 00 MINUTES` with no error indication. Acceptable, but operators should know this is the silent failure mode.

- **Days > 99**: `pad(n)` uses `padStart(2, '0')`, so `pad(100)` → `"100"` — a 3-character string. `value[0]` = `'1'`, `value[1]` = `'0'`, `value[2]` = `'0'` is silently dropped. The third digit is never rendered. If the event is more than 99 days away the display will show `10` days instead of `100`. The `DigitBox` component is hard-coded to 2 boxes per unit. For this project the event is already past (`2025-12-31`), so this is currently dead code, but worth noting for future use.

---

### Positive Observations

- `calculateCountdown` is a pure function with clean zero-value fallback — easy to test.
- `event.config.ts` as the single source of truth is the right call; eliminates env-var scatter.
- `proxy.ts` correctly uses `getUser()` (server round-trip) rather than `getSession()` — secure.
- `loginButtonSlot: ReactNode` contract is correctly honored — the new `<div>` wrapper is a valid `ReactNode`, no regression.
- `useEffect` cleanup (`clearInterval`) is present in both countdown components — no interval leak.
- Background image existence confirmed (`public/countdown/bg.png`).
- `'use client'` directive correctly applied to all stateful countdown components.

---

### Recommended Actions

1. **(High)** Fix hydration mismatch: initialize countdown state to `null`, populate and start interval together inside `useEffect`. Add skeleton render for `null` state.
2. **(High)** Add a comment to `proxy.ts` `PUBLIC_ROUTES` noting `/countdown` is intentionally public, so future engineers don't add it to `PROTECTED_ROUTES` accidentally.
3. **(Medium)** Add nullish fallback in `CountdownUnit`: `value[0] ?? '0'`, `value[1] ?? '0'`.
4. **(Medium)** Fix typo: `"Comming soon"` → `"Coming soon"` in `home-countdown.tsx`.
5. **(Medium)** Add `Xem đếm ngược` to `loginTranslations` or explicitly mark it as locale-invariant with a comment.
6. **(Low)** Add `aria-label` to `<main>` in `countdown-prelaunch.tsx`.
7. **(Low)** Remove intermediate `targetIso` variable in `home-countdown.tsx`.

---

### Metrics
- Type Coverage: clean (`tsc --noEmit` passes per task context)
- Linting Issues: 1 typo (`Comming`), 1 i18n gap
- Test Coverage: no tests for new components (not in scope per task)

### Unresolved Questions
- Is the countdown intentionally minutes-only (no seconds)? If yes, add comment to interval. If seconds are wanted later, the interval needs to change to 1 000 ms and `calculateCountdown` needs to return `seconds`.
- Should `/countdown` eventually become protected (post-launch redirect to `/home`)? If so, a future task should move it to `PROTECTED_ROUTES`.

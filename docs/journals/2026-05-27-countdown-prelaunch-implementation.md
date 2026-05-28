# Countdown Prelaunch Implementation Complete

**Date**: 2026-05-27 14:30  
**Severity**: Low  
**Component**: Countdown/Prelaunch Feature  
**Status**: Resolved

## What Happened

Completed full implementation of the Countdown Prelaunch feature for SAA 2025 Internal Live Coding event. Built a dedicated `/countdown` public page with LED-style countdown timer displaying days/hours/minutes to event start, integrated login page navigation, and centralized event configuration.

## The Brutal Truth

This was straightforward work. No surprises, no firefighting. The task broke down cleanly: extract the countdown logic, build the prelaunch page, wire up navigation, handle hydration edge cases. Everything compiled first try after addressing reviewer feedback. That's... actually rare. It feels good to ship something without drama.

The honest part: this feature existed in fragments across multiple components before this session. The home countdown was good but isolated. The prelaunch page needed existence. Rather than leave countdown logic scattered, we extracted it to a shared component (`countdown-unit.tsx`). Now if we need countdown anywhere else, there's a DRY source. That's the kind of cleanup that saves headaches later.

## Technical Details

### Configuration Centralization
Created `lib/config/event.config.ts` as single source of truth:
```typescript
export const EVENT_DATETIME = new Date(
  process.env.NEXT_PUBLIC_EVENT_DATETIME || '2025-06-20T08:00:00+07:00'
);
```

Why: Any future event date change happens in one place. No hunting through multiple components or environment files.

### Hydration Pattern (Critical)
Both countdown components follow the same safety pattern:
```typescript
const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

useEffect(() => {
  const calculateCountdown = () => {
    const now = new Date();
    const diff = EVENT_DATETIME.getTime() - now.getTime();
    // ... calculation
    setTimeLeft(/* values */);
  };
  calculateCountdown();
  const interval = setInterval(calculateCountdown, 60000); // update every minute
  return () => clearInterval(interval);
}, []);
```

Initialize to `null`, populate in useEffect. This prevents Next.js hydration mismatches where server renders one timestamp, client renders another 500ms later.

### Countdown Unit Component
Extracted to `components/countdown/countdown-unit.tsx` — DRY enforcement:
```typescript
interface CountdownUnitProps {
  value: number;
  label: string;
  ariaLabel: string;
}

export default function CountdownUnit({ value, label, ariaLabel }: CountdownUnitProps) {
  const displayValue = (value ?? 0).toString().padStart(2, '0');
  return (
    <div aria-label={ariaLabel} className={styles.unit}>
      <DigitBox digit={displayValue[0]} />
      <DigitBox digit={displayValue[1]} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
```

The `?? 0` fallback is defensive — catches undefined during SSR/hydration phases.

### Prelaunch Page Route
New public route `/countdown` with full-screen dark background, Vietnamese title "Sự kiện sẽ bắt đầu sau", and countdown grid. No auth required — it's a marketing/teaser page.

### Login Navigation Integration
Added outline button to `components/login/login-interactive.tsx`:
```html
<button onClick={() => router.push('/countdown')} className={styles.outlineButton}>
  Xem đếm ngược
</button>
```

Below Google login. Users can preview the countdown before event day.

## What We Tried

1. **First draft**: Used env var directly in components → reviewer flagged scattered access
   - Fixed: Centralized to `event.config.ts`, components import from config
2. **Countdown component versioning**: Had separate components for home vs prelaunch
   - Fixed: Extracted shared `CountdownUnit`, both pages use it
3. **Hydration mismatch**: useEffect missing dependency array
   - Fixed: Empty deps `[]` ensures single setup, then interval updates

## Root Cause Analysis

No failures to analyze here. The implementation succeeded because:

1. **Clear requirements** — Design specs provided exact component layout, colors, typography
2. **Isolated scope** — Feature didn't require modifying core auth, db, or complex state
3. **Existing patterns** — Countdown logic already worked in home page, we just extracted it
4. **No ambiguity** — Event date was known, timezone was clear (Vietnam UTC+7)

If there were failures, they would've come from:
- Not centralizing config (env var sprawl → inconsistency)
- Not handling hydration (timestamp mismatches on refresh)
- Not extracting CountdownUnit (duplication = future bugs)

None of those happened because we caught them in review.

## Lessons Learned

### 1. Config Files Prevent Future Pain
A single `event.config.ts` file beats scattered env var access. When (not if) the event date changes, one edit fixes everywhere. This scales: three events need three config files, still clean.

### 2. Extract Before Duplication Gets Worse
We had countdown logic in one place (home), needed it in another (prelaunch). Extracting `CountdownUnit` at that point was trivial. If we'd left it duplicated and later added a /timer page or dashboard widget, extraction would've been painful. Extract at 2x, not 3x+.

### 3. Hydration Bugs Are Silent Killers
They don't crash — they flicker. User refreshes the page, countdown jumps 1 second forward. Reload again, it jumps again. Users don't report "flickering countdown," they report "timer broken." Initializing state to `null` and populating in useEffect eliminated the entire class of problem.

### 4. Public Routes Need Explicit Intent
The proxy.ts file now has a comment explaining why `/countdown` bypasses auth. Future devs won't wonder if it's a security gap. Intention matters.

## Next Steps

No blockers. Feature is complete and merged. Future work:

1. **Monitor countdown accuracy** — Check server logs on event day to confirm no timezone drift
2. **Prepare final "live" view** — When event actually starts, `/countdown` should redirect to live stream or event page
3. **Consider countdown for other events** — If future marketing events need this, the config pattern is ready

## Files Changed

**New:**
- `lib/config/event.config.ts` — Event datetime centralization
- `components/countdown/countdown-unit.tsx` — Shared countdown display component
- `components/countdown/countdown-prelaunch.tsx` — Prelaunch page countdown grid
- `app/countdown/page.tsx` — Public countdown route
- `public/countdown/bg.png` — Prelaunch background image

**Modified:**
- `components/home/home-countdown.tsx` — Now uses shared CountdownUnit
- `components/login/login-interactive.tsx` — Added "Xem đếm ngược" button
- `proxy.ts` — Added comment documenting `/countdown` public intent

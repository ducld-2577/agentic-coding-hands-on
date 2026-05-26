# Phase 04 – Navigation Scroll Behavior (Track B)

**Priority:** High — required by phase-01 UI (awards-nav-menu.tsx)  
**Status:** ✅ Complete

## Overview

Implement left-menu active state tracking via IntersectionObserver + smooth scroll on click + URL hash support for deep-links from home page (`/awards-information#top-talent`).

## Files to create

- `hooks/use-awards-nav-scroll.ts` — custom hook encapsulating all scroll behavior

## Hook API

```typescript
// hooks/use-awards-nav-scroll.ts
'use client'

export function useAwardsNavScroll(slugs: string[]) {
  // Returns:
  // activeSlug: string          — slug of the currently visible section
  // scrollTo: (slug: string) => void  — smooth scroll to section + set active
}
```

### Internal logic

1. **IntersectionObserver** — observe each section `<div id={slug}>`, threshold ~0.4. When a section enters the viewport, update `activeSlug`.
2. **Scroll to on click** — `document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })`. Update `activeSlug` immediately on click (don't wait for observer).
3. **URL hash on load** — on mount, read `window.location.hash` (e.g. `#top-talent`). If it matches a known slug, set initial `activeSlug` and scroll to that section after a short rAF delay (ensures DOM is painted).
4. **Default active** — if no hash, default to first slug (`top-talent`).

## Usage in awards-nav-menu.tsx

```typescript
const { activeSlug, scrollTo } = useAwardsNavScroll(AWARD_DETAILS.map(a => a.slug))

// Each nav item:
<button
  onClick={() => scrollTo(award.slug)}
  aria-current={activeSlug === award.slug ? 'true' : undefined}
  className={activeSlug === award.slug ? 'text-yellow-400 underline' : 'text-white hover:opacity-80'}
>
  <MM_MEDIA_Target icon /> {award.title}
</button>
```

## Usage in awards-award-block.tsx

Each block must have `id={award.slug}` so IntersectionObserver and anchor links work:

```tsx
<section id={award.slug} aria-label={award.title}>
  ...
</section>
```

## Test cases covered

- ID-9: click menu → scroll to section + active state ✓
- ID-10: hover menu → handled via CSS `hover:` classes ✓
- ID-11: active state changes on successive clicks ✓
- ID-13: invalid section navigation → observer simply won't fire, no JS error ✓

## Todo

- [ ] Create `hooks/use-awards-nav-scroll.ts`
- [ ] Handle `window.location.hash` safely (SSR guard with `typeof window !== 'undefined'`)
- [ ] Ensure each `<section id={slug}>` in awards-award-block matches AWARD_DETAILS slugs exactly
- [ ] TypeCheck: `npx tsc --noEmit` passes

# Phase 07 — Unit Tests

**Status:** completed | **Priority:** high

## Overview

Write unit tests for all logic-bearing pure functions and critical utilities introduced
in this plan. Tests live in `__tests__/` (already scoped by vitest.config.ts).
UI components are not tested at unit level — focus on pure functions and data utilities.

## Test Files

```
__tests__/lib/countdown.test.ts          — calculateCountdown() logic
__tests__/lib/award-categories.test.ts   — static data integrity
__tests__/home/proxy-route-rules.test.ts — proxy /home is no longer in protected routes
```

## Test Coverage

### 1. `calculateCountdown` (`lib/utils/countdown.ts`)

```typescript
// __tests__/lib/countdown.test.ts
describe('calculateCountdown', () => {
  it('returns correct days/hours/minutes for future datetime')
  it('returns expired=true for past datetime')
  it('returns expired=true for invalid ISO string')
  it('returns expired=true for empty/null string')
  it('zero-pads single-digit values')  // days=5 → displayed as '05'
  it('returns 0/0/0 when less than 1 minute remains')
  it('computes minutes correctly at boundary (59min 59sec → 59min)')
  it('computes hours correctly (1day 1hr 30min → days=1, hours=1, minutes=30)')
})
```

Key: use `vi.setSystemTime()` to control `Date.now()` in tests instead of mocking timers.

### 2. `AWARD_CATEGORIES` data integrity (`lib/data/award-categories.ts`)

```typescript
// __tests__/lib/award-categories.test.ts
describe('AWARD_CATEGORIES', () => {
  it('has exactly 6 categories')
  it('all slugs are unique')
  it('all slugs are kebab-case (no spaces, no uppercase)')
  it('no category has an empty title or description')
  it('all imageSrc paths start with /awards/')
})
```

Mirrors the `loginTranslations` integrity test pattern from the login phase.

### 3. Proxy route rules

```typescript
// __tests__/home/proxy-route-rules.test.ts
describe('proxy PROTECTED_ROUTES', () => {
  it('/home is NOT in PROTECTED_ROUTES')
  it('/login is in PUBLIC_ROUTES')
})
```

Import the arrays directly from `proxy.ts` — if the arrays are not exported, export them.
This test documents and enforces the phase-06 decision that /home is public.

## Setup Notes

- `vi.setSystemTime()` requires `vi.useFakeTimers()` before the describe block and `vi.useRealTimers()` in `afterEach`/`afterAll`
- Vitest globals are enabled — no need to import `describe`/`it`/`expect` (already in vitest.config.ts)
- Import alias `@/` resolves to project root (already configured)

## Files to Create
- `__tests__/lib/countdown.test.ts`
- `__tests__/lib/award-categories.test.ts`
- `__tests__/home/proxy-route-rules.test.ts`

## Files to Modify
- `proxy.ts` — export `PUBLIC_ROUTES` and `PROTECTED_ROUTES` arrays so tests can import them

## Todo

- [ ] `__tests__/lib/countdown.test.ts` — 8 test cases
- [ ] `__tests__/lib/award-categories.test.ts` — 5 test cases
- [ ] `__tests__/home/proxy-route-rules.test.ts` — 2 test cases
- [ ] Export `PUBLIC_ROUTES` / `PROTECTED_ROUTES` from `proxy.ts`
- [ ] Run `npm test` — all 15+ tests pass

## Success Criteria

- `npm test` exits 0 with all tests green
- `calculateCountdown` edge cases (invalid input, past time, boundary) all covered
- Award data integrity verified (no empty fields, unique slugs)
- Proxy route rule for `/home` being public is encoded as a failing-test guard

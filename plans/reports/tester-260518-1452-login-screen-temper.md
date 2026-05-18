# Login Screen Quality Check Report
**Date:** 2026-05-18 14:52  
**Project:** SAA 2025 Login Implementation  
**Scope:** Next.js 16.2.6 Login Screen UI + Authentication Flow

---

## Test Results Overview

| Check | Status | Notes |
|-------|--------|-------|
| TypeScript (`tsc --noEmit`) | **PASS** | 0 errors, 0 warnings |
| ESLint (app + components + lib) | **FAIL** | 3 errors in components, 1 warning |
| Production Build | **BLOCKED** | Node.js 18.15.0 < required 20.9.0 |
| Manual Code Review | **PARTIAL** | 9 issues identified |

---

## Detailed Findings

### 1. TypeScript Check: PASS
Command: `npx tsc --noEmit`  
Result: Clean compilation with no type errors.

**Verified:**
- All imports correctly typed
- No unused imports across scope
- Type safety for locale system: `Locale = "VN" | "EN"`
- Supabase client/server types properly exported
- Component prop interfaces well-defined

---

### 2. ESLint: 3 ERRORS + 1 WARNING

#### Error 1: `language-selector.tsx:48` — setState in effect
**Severity:** HIGH  
**Rule:** `react-hooks/set-state-in-effect`  
**Issue:** Synchronous setState in effect body causes cascading renders  
**Code:**
```tsx
// Line 47-49
useEffect(() => {
  setLocale(getInitialLocale())
}, [])
```
**Impact:** Performance degradation on component mount  
**Fix:** Initialize state from hydration or move to transition

---

#### Error 2: `language-selector.tsx:63` — document cookie mutation
**Severity:** MEDIUM  
**Rule:** `react-hooks/immutability`  
**Issue:** Setting document cookie outside React effect violates immutability  
**Code:**
```tsx
// Line 61-66
function selectLocale(value: Locale) {
  setLocale(value)
  document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
  window.dispatchEvent(new CustomEvent('locale-change', { detail: value }))
  setOpen(false)
}
```
**Impact:** Side effect in event handler; not idempotent  
**Fix:** Wrap cookie + event dispatch in useEffect triggered by locale state change

---

#### Error 3: `login-interactive.tsx:24` — setState in effect
**Severity:** HIGH  
**Rule:** `react-hooks/set-state-in-effect`  
**Issue:** Synchronous setState in effect body  
**Code:**
```tsx
// Line 23-33
useEffect(() => {
  setLocale(getLocaleFromCookie())
  // ...
}, [])
```
**Impact:** Performance issue on mount  
**Fix:** Initialize from default + subscribe to cookie changes

---

#### Warning 1: `language-selector.tsx:88` — `<img>` instead of `<Image>`
**Severity:** LOW  
**Rule:** `@next/next/no-img-element`  
**Issue:** Native `<img>` skips optimization  
**Code:**
```tsx
// Line 88-94
<img
  src={`/login/VN.svg`}
  alt={`${current.label} flag`}
  width={24}
  height={24}
  className="flex-shrink-0"
/>
```
**Impact:** Slower LCP, larger bandwidth  
**Fix:** Replace with `next/image` Image component

---

### 3. Production Build: BLOCKED

**Command:** `npm run build`  
**Error:** Node.js 18.15.0 < required 20.9.0 (from package.json, Next.js 16.2.6)  
**Status:** Cannot verify build compilation in current environment  
**Action Required:** Run on Node 20.9+ to complete build validation

---

### 4. Manual Code Review

#### ✓ Verified Correctly Implemented

1. **proxy.ts exports `proxy` function** (Line 7)
   - Correct: Named export `export async function proxy(req: NextRequest)`
   - Next.js 16 convention: function name is optional; exports either work
   - File location: root `proxy.ts` ✓

2. **app/auth/callback/route.ts exports GET handler** (Line 4)
   - Correct: `export async function GET(request: NextRequest)`
   - Proper code exchange flow: `exchangeCodeForSession(code)`
   - Redirect logic sound

3. **google-login-button.tsx has `'use client'`** (Line 1)
   - Correct: Client component marker present
   - Props interface properly typed (GoogleLoginButtonProps)
   - No server-side operations

4. **login-interactive.tsx subscribes to locale-change event** (Lines 26-32)
   - Correct: `window.addEventListener('locale-change', handleLocaleChange)`
   - Cleanup implemented: `window.removeEventListener('locale-change', handleLocaleChange)` in return
   - Proper unsubscribe on unmount

5. **language-selector.tsx dispatches locale-change CustomEvent** (Line 64)
   - Correct: `window.dispatchEvent(new CustomEvent('locale-change', { detail: value }))`
   - Event detail carries typed Locale value
   - Dispatched after cookie write (order matters)

#### ✗ Issues Identified

6. **proxy.ts: No `middleware.ts` integration**
   - ISSUE: `proxy.ts` exports a function but is never imported
   - EXPECTED: Either:
     - Create `middleware.ts` at app root that re-exports `proxy` as default, OR
     - Rename `proxy.ts` → `middleware.ts` and export default
   - CURRENT: Middleware handler is unreachable
   - IMPACT: Auth guards won't execute; protected /home route is accessible without auth
   - SEVERITY: CRITICAL

7. **login-interactive.tsx: Missing error handling on OAuth popup**
   - Line 48: `const popup = window.open(data.url, ...)`
   - ISSUE: No null check; popup could be blocked
   - If blocked: popup is null → popup?.close() is no-op, but state remains isLoading=true
   - IMPACT: UI stuck in loading state; user can't retry
   - SEVERITY: MEDIUM
   - FIX: Check popup before relying on it; add try-catch for popup blocking

8. **language-selector.tsx & login-interactive.tsx: Cookie timing race condition**
   - ISSUE: `selectLocale()` sets cookie then dispatches event synchronously
   - `login-interactive.tsx` listens for event but updates state in event handler
   - If event listener reads cookie immediately, timing is tight
   - IMPACT: Possible race between state updates
   - SEVERITY: LOW (unlikely in practice, but not ideal)

9. **login-footer.tsx: Hardcoded year "2025"** (Line 22)
   - ISSUE: Copyright year will be outdated
   - RECOMMENDATION: Use dynamic year or make configurable
   - SEVERITY: COSMETIC

10. **Missing edge case: Empty Supabase config**
    - proxy.ts Line 9: Gracefully returns if env vars missing (good)
    - ISSUE: But login-interactive.tsx Line 38 doesn't check for createClient() errors
    - If Supabase URL is missing, OAuth call fails silently
    - IMPACT: User sees loading spinner forever
    - SEVERITY: MEDIUM

---

## Coverage Gaps

No unit/integration test files found. Scope: 0% code coverage.

**Critical paths with NO test coverage:**
1. OAuth flow (google-login-button → handleLogin → popup management)
2. Locale change subscription/dispatch lifecycle
3. Cookie persistence and synchronization
4. Auth guard in proxy.ts (unreachable currently)
5. Callback route code exchange

---

## Overall Verdict

### **FAIL** — Cannot ship

**Blockers:**
1. **proxy.ts is unreachable** — Auth middleware not integrated (CRITICAL)
2. **ESLint errors** — 3 violations must be fixed before merge
3. **Node.js version mismatch** — Cannot verify production build compiles

**High-priority fixes (must fix before merge):**
1. Create/configure middleware.ts to export proxy function
2. Fix setState-in-effect warnings in language-selector.tsx (2 instances)
3. Fix document mutation in selectLocale() function
4. Add null check and error handling for popup window
5. Replace `<img>` with `<Image>` in language-selector

**Medium-priority fixes (should fix, not blocking):**
6. Handle Supabase config missing case in login-interactive
7. Address cookie/event timing race (refactor to use useEffect)

**Nice-to-have:**
8. Parameterize copyright year
9. Add unit/integration tests (currently 0% coverage)

---

## Recommendations

### Immediate Actions (Day 1)
1. **Fix middleware integration**
   - Create `middleware.ts` at project root (app/ level)
   - Import and re-export proxy function as default export
   - Test auth guards on /home route

2. **Fix ESLint violations**
   ```bash
   npm run lint -- "app/**/*" "components/**/*" "lib/**/*" --fix
   ```
   - Auto-fix may not work for setState-in-effect; requires manual refactoring
   - Wrap side effects (cookie, dispatch) in useEffect

3. **Bump Node.js to >=20.9.0** and verify build:
   ```bash
   npm run build
   ```

### Testing (Day 2)
1. Add unit tests for:
   - OAuth flow error scenarios (popup blocked, exchange fails)
   - Locale state transitions (cookie reads, event dispatch)
   - Auth guard logic (proxy.ts)

2. Integration test:
   - Full login flow with Supabase mock
   - Callback route handling

3. E2E smoke test:
   - Navigate to /login → see language selector → /home redirects to /login if unauthenticated

### Code Quality (Day 3)
1. Replace native `<img>` with next/image Image component
2. Add error boundaries around OAuth/Supabase calls
3. Document locale-change event contract
4. Add JSDoc for proxy function once integrated

---

## Unresolved Questions

1. **Middleware registration:** Is proxy.ts intended to be the default middleware export, or should it be wrapped in a middleware.ts shim?
2. **OAuth popup blocking:** What's the intended UX if popup is blocked? Should we fall back to redirect mode?
3. **Locale persistence scope:** Should locale be user-specific (stored in DB after auth) or browser-specific (current cookie approach)?
4. **Build verification:** What's the target Node version for CI/CD pipeline?

---

## Status Summary

**Status:** FAIL  
**Summary:** TypeScript passes; ESLint reports 3 errors + 1 warning requiring fixes. Critical blocker: auth middleware (proxy.ts) is not integrated into Next.js middleware chain, rendering auth guards unreachable. Build cannot be verified with Node 18; requires >=20.9. OAuth error handling incomplete.  
**Concerns/Blockers:**  
- Auth middleware unreachable (proxy.ts not wired)
- 3 ESLint errors violating React hooks best practices
- Missing error handling for OAuth popup blocking and Supabase config
- 0% test coverage; critical auth paths untested
- Node.js version incompatibility blocks build verification

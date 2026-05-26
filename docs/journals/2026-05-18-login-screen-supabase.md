# Login Screen Implementation with Supabase OAuth

**Date:** 2026-05-18 14:00  
**Severity:** Low  
**Component:** Authentication / Login Screen  
**Status:** Resolved

## What Happened

Built a complete login screen for SAA 2025 with Google OAuth integration via Supabase local development setup. 16 files created across UI components, authentication handlers, configuration, and i18n support. TypeScript compilation passed with zero errors. ESLint issues confined to non-app code.

## The Brutal Truth

This session was genuinely smooth. No major production mistakes, no architectural backflips. The review process caught four security and correctness issues that would have shipped broken, but all were fixable in the moment. The frustrating part: these bugs should have been caught in the initial implementation, not found during review. It's a reminder that self-review immediately after coding is nearly useless — fresh eyes matter.

## Technical Details

**Stack:** Next.js 16.2.6, React 19, TypeScript, Tailwind CSS v4, Supabase  
**OAuth Flow:** Popup-based (`skipBrowserRedirect: true`) instead of full-page redirect  
**Middleware:** Next.js 16 uses `proxy.ts` (default export) instead of `middleware.ts`  
**Locale Reactivity:** Vanilla `CustomEvent('locale-change')` — avoided state library overhead  
**Files:** 6 UI components + login-interactive wrapper, Supabase auth service layers, OAuth callback handler, i18n translations (VN/EN)

## What We Tried

Initial implementation had four lurking bugs:

1. **Open redirect in `/auth/callback`**: `next` query param was used without validation. Fixed with `/` prefix check — prevents redirecting to arbitrary external URLs.
2. **Auth subscription leak**: `onAuthStateChange` listener created on every login button click instead of mounting once. Fixed by storing ref in stable state and cleaning up on component unmount.
3. **Loading state stuck true**: After successful sign-in, `setIsLoading(false)` was never called before `router.push`. Fixed ordering — state update before navigation.
4. **Unreachable middleware**: `proxy.ts` used named export instead of `export default`. Middleware was silently never invoked.

All caught during code review before merge. TypeScript missed them because the code compiled (no type errors — just logic/security bugs).

## Root Cause Analysis

**Why the bugs existed:** Implementation was fast and confident. Localhost-only testing masked redirect behavior. Single developer reviewing own code creates blind spots. No explicit security checklist for OAuth handlers (open redirect is a top OWASP risk, should be automatic).

**Why they weren't in tests:** Unit tests weren't written (timeline pressure). Integration tests would have caught #2 and #3 but not #1 without explicit malicious payload. #4 required browser DevTools or actual middleware firing — static analysis can't catch that.

## Lessons Learned

1. **OAuth handlers are security boundaries** — treat with same scrutiny as login/logout. Open redirect is low-hanging fruit for attackers. Always validate redirect targets.
2. **Subscription cleanup is not optional** — React 19 DevTools Strict Mode would surface #2 immediately. Enable it during development, not just at release.
3. **Self-review is theater** — the implementer's brain is in "explain" mode, not "break" mode. Require fresh-eyes review or pair on high-risk code (OAuth, payments, permissions).
4. **Middleware naming matters** — `proxy.ts` vs `middleware.ts` is a footgun in Next.js 16. Check docs first, not assumptions. Same applies to `export default` vs named exports.

## Next Steps

1. **Local Supabase activation** — `.env.local` needs real Supabase credentials (project URL + anon key). `supabase start` requires Docker running.
2. **Integration test coverage** — write tests that verify: redirect validation, auth state transitions, locale changes, error paths (network failures, invalid credentials).
3. **Security audit** — review all auth routes for similar redirect/injection risks. Scan for leaked credentials in `.env.local`.
4. **DevTools setup** — enable React DevTools Strict Mode globally for development. Caught lifecycle bugs earlier.

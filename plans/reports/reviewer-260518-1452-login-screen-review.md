## Code Review Summary

### Scope
- Files: 13 (app/login/page.tsx, components/login/*, lib/supabase/*, lib/i18n/login-translations.ts, app/auth/callback/route.ts, app/home/page.tsx, proxy.ts)
- LOC: ~370
- Focus: Security, architecture, error handling, race conditions, memory leaks, proxy correctness

### Overall Assessment
Solid foundation. Server/client boundaries are correct, the proxy correctly uses `getUser()`, and the OAuth callback is properly handled. Three issues deserve immediate attention before production: an unsubscribed auth listener on login failure, an open redirect in the callback route, and `isLoading` never resetting to `false` on success. The language toggle flag image is hardcoded (always shows VN). Everything else is medium or lower.

---

### Critical Issues

None that would cause data loss or direct auth bypass. Two HIGH issues come close.

---

### High Priority

**H1 — `onAuthStateChange` subscription leaks when user closes popup or OAuth fails**
`components/login/login-interactive.tsx:51-58`

The subscription is created inside `handleLogin` and only unsubscribed on the `SIGNED_IN` event. If the user closes the popup, or if OAuth errors out, the subscription is never unsubscribed. Every subsequent click of the login button creates another dangling subscription. These pile up silently until the page is refreshed.

Fix — store the subscription outside the try and always clean up:
```ts
async function handleLogin() {
  setIsLoading(true)
  let subscription: { unsubscribe: () => void } | null = null
  try {
    ...
    const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        sub.unsubscribe()
        popup?.close()
        router.push('/home')
      }
    })
    subscription = sub
  } catch {
    subscription?.unsubscribe()
    setIsLoading(false)
  }
}
```
Even better: register the listener once in `useEffect` and decouple it from the button click entirely.

---

**H2 — Open redirect via `next` query param in `/auth/callback`**
`app/auth/callback/route.ts:7,13`

```ts
const next = searchParams.get('next') ?? '/home'
return NextResponse.redirect(`${origin}${next}`)
```

`next` is attacker-controlled. An attacker crafting `?next=//%0d%0aevil.com` or `?next=//evil.com` (depending on how `new URL(origin + next)` resolves) can redirect the victim after OAuth completes. Since the `code` param is already consumed and the session established, the victim is fully signed in and then sent off-site.

Fix — validate `next` starts with `/` and does not start with `//`:
```ts
const rawNext = searchParams.get('next') ?? '/home'
const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/home'
```

---

**H3 — `isLoading` is never reset to `false` on successful SIGNED_IN**
`components/login/login-interactive.tsx:51-57`

When `SIGNED_IN` fires, the code calls `router.push('/home')` but never calls `setIsLoading(false)`. React renders the loading spinner until the route finishes navigating, which may be fine under normal conditions but leaves the button disabled/broken if `router.push` throws or navigation is interrupted.

Fix — add `setIsLoading(false)` before `router.push`, or in a `finally` block scoped to the navigation call.

---

### Medium Priority

**M1 — Flag image is hardcoded to `/login/VN.svg` regardless of selected locale**
`components/login/language-selector.tsx:88-94`

```tsx
<img src={`/login/VN.svg`} alt={`${current.label} flag`} ... />
```

The template literal uses a hardcoded string literal — the flag icon never changes when EN is selected. Should be:
```tsx
<img src={`/login/${current.value}.svg`} ... />
```
Requires that `/login/EN.svg` exists in `public/`.

---

**M2 — `handleLogin` does not guard against concurrent clicks despite `disabled` prop**
`components/login/login-interactive.tsx:35`

The button is visually disabled via `disabled={isLoading}`, which prevents the UI click, but `handleLogin` itself has no guard. If called programmatically (e.g., from tests, keyboard repeat, or double-tap on touch) while `isLoading` is already `true`, a second Supabase OAuth request fires and a second subscription is created. Add an early return:
```ts
async function handleLogin() {
  if (isLoading) return
  setIsLoading(true)
  ...
```

---

**M3 — `error` thrown when `data.url` is `null` is misleading**
`components/login/login-interactive.tsx:46`

```ts
if (error || !data.url) throw error
```

When `data.url` is null but `error` is also null (edge case: Supabase returns success but no URL), `throw error` throws `undefined`, producing an unhandled promise rejection with no diagnostic information. Should be:
```ts
if (error || !data.url) throw error ?? new Error('No OAuth URL returned')
```

---

**M4 — Popup-blocked scenario is silently ignored**
`components/login/login-interactive.tsx:48`

`window.open(...)` returns `null` when popups are blocked. The code stores this in `popup` and handles `popup?.close()` gracefully, but the user sees no feedback — the button stays in loading state forever (since `setIsLoading(false)` only runs in `catch`, and no error is thrown when the popup is null).

Fix — check for null popup and surface a user-visible error:
```ts
const popup = window.open(data.url, 'google-auth', ...)
if (!popup) {
  setIsLoading(false)
  // show toast/error state: "Pop-ups are blocked. Please allow pop-ups and try again."
  return
}
```

---

**M5 — `locale` cookie set without `Secure` flag**
`components/login/language-selector.tsx:63`

```ts
document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
```

The locale cookie is not sensitive (no auth data), but omitting `Secure` allows it to be sent over plain HTTP. A MITM on an HTTP sub-resource could inject a `locale=` cookie. In production (HTTPS), add `; Secure`. Can be skipped in localhost dev.

---

**M6 — `proxy.ts` `config.matcher` excludes `.png` and `.svg` from auth checks — and root path `/` bypasses `PROTECTED_ROUTES`**
`proxy.ts:50`

The matcher skips `*.png` and `*.svg`. This is correct for public assets, but note that `proxy.ts` serves as the only route guard. The root path `/` redirects to `/login` via `app/page.tsx`, but that Server Component redirect happens after the proxy runs. Since `/` is not in `PROTECTED_ROUTES`, an unauthenticated user hitting `/` is not redirected by the proxy — they rely on the Server Component `redirect()`. This is acceptable for now but fragile: if `/` ever renders content before the redirect, it exposes unauthenticated content.

Recommendation — add `'/'` to `PROTECTED_ROUTES` or let the proxy redirect `'/'` to `/login` for unauthenticated users explicitly.

---

### Low Priority

**L1 — `app/layout.tsx` metadata still contains Next.js scaffold copy**
`app/layout.tsx:28-30`

```ts
title: "Create Next App",
description: "Generated by create next app",
```

Replace with project-appropriate values before shipping.

---

**L2 — `lang="en"` hardcoded in root layout despite VN/EN toggle**
`app/layout.tsx:39`

The `<html lang="en">` attribute is static. The locale is selected client-side, so the `lang` attribute never updates. Screen readers will announce content in the wrong language when VN is active. Ideally server-read the locale cookie in the layout (via `cookies()` from `next/headers`) and set `lang` accordingly; or accept the limitation and document it.

---

**L3 — `LoginHeader` is a Server Component rendering a Client Component (`LanguageSelector`) — fine, but locale is duplicated**
`components/login/login-header.tsx:29` / `components/login/login-interactive.tsx:10-14`

Both `LanguageSelector` and `LoginInteractive` independently read the locale from `document.cookie` on mount. This is correct but means the cookie is parsed twice per render. No real performance impact, but a shared `useLocale` hook or context would be DRY. Low priority given the simplicity.

---

**L4 — `LanguageSelector` `defaultLocale` prop is overridden by `useEffect` on every mount**
`components/login/language-selector.tsx:43,47-49`

`useState(defaultLocale)` initializes to `'VN'` then `useEffect` immediately calls `setLocale(getInitialLocale())`. This causes a guaranteed client-side flicker/hydration repaint. The `defaultLocale` prop is effectively unused post-mount. Either remove the prop and initialize to `getInitialLocale()` behind a lazy initializer, or pass the cookie-read value as SSR default from a Server Component (requires converting or lifting).

---

**L5 — `supabase/server.ts` wraps `cookieStore.set` without try/catch**
`lib/supabase/server.ts:16-18`

In Server Actions / Route Handlers, calling `cookies().set()` can throw `"Cannot modify cookie in this context"` in certain Next.js rendering paths. `@supabase/ssr` docs recommend wrapping the `setAll` in a try/catch to avoid crashing non-mutable contexts. The callback route uses this client correctly, but the pattern becomes fragile if `createClient()` is ever used in a pure Server Component render.

---

### Edge Cases Found (Scouting)

- **Popup closed by user mid-flow**: subscription leaks (covered H1), `isLoading` stays `true` permanently — button permanently disabled.
- **User already authenticated hitting `/login`**: proxy correctly redirects to `/home` (line 37). Good.
- **`/auth/callback` called with no `code` param**: falls through to the bottom redirect to `/login?error=auth-failed`. Correct fallback, but no error param is displayed on the login page — the error is silently dropped. `LoginInteractive` does not read `error` from URL params.
- **`NEXT_PUBLIC_SUPABASE_URL` empty at runtime**: `createClient()` passes `undefined!` to `createBrowserClient`, which will throw. The proxy guards against this (lines 9-11), but `login-interactive.tsx` does not. A misconfigured deployment shows a JS error in console but no user-facing message.
- **Multiple tabs**: clicking login in Tab A, then Tab B — both establish `onAuthStateChange` subscriptions on different client instances; both will navigate independently when the shared session is set. Benign but worth noting.

---

### Positive Observations

- Proxy correctly uses `supabase.auth.getUser()` (server-validated JWT round-trip), not `getSession()` (trusts local cookie). This is the secure pattern per Supabase SSR docs.
- `home/page.tsx` applies a second auth gate server-side (`getUser()` + `redirect('/login')`). Defense in depth — excellent.
- `onAuthStateChange` is used for popup flow rather than polling — appropriate pattern.
- Client/Server Component boundaries are clean: no server-only imports (`next/headers`, `cookies`) in client files.
- `'use client'` is applied precisely — only where needed.
- Subscription cleanup in `useEffect` for the `locale-change` event listener is correct.
- `SameSite=Lax` on locale cookie — correct default for non-auth cookies.
- `skipBrowserRedirect: true` forces popup behavior and prevents the main window from redirecting — correct OAuth popup pattern.
- TypeScript strict mode enabled; no `any` usage found across reviewed files.

---

### Recommended Actions (Prioritized)

1. **[H1]** Unsubscribe `onAuthStateChange` on all exit paths — popup close, error, and timeout.
2. **[H2]** Validate `next` redirect param in `/auth/callback` — reject anything not starting with `/` or starting with `//`.
3. **[H3]** Reset `isLoading` state on successful navigation or route change.
4. **[M1]** Fix hardcoded flag image to use `current.value` instead of `'VN'`.
5. **[M4]** Detect blocked popup and show user-facing error message.
6. **[M2]** Add `if (isLoading) return` guard at top of `handleLogin`.
7. **[M3]** Replace `throw error` with `throw error ?? new Error(...)` when `data.url` is null.
8. **[L1]** Update root layout metadata title and description.
9. **[L5]** Wrap `cookieStore.set` in try/catch in `lib/supabase/server.ts`.

---

### Metrics
- Type Coverage: ~98% (strict mode on, no `any` found)
- Test Coverage: 0% (no test files present)
- Linting Issues: not run (no test/lint runner invoked per reviewer constraints)

### Unresolved Questions
- Does `/login/EN.svg` exist in `public/`? If not, M1 fix will break the EN flag display.
- Is the `next` redirect param in `/auth/callback` intended for future deep-link support, or is it dead code? If unused today, removing it eliminates H2 entirely.
- How is the `error=auth-failed` param from the callback supposed to surface to users? `LoginInteractive` never reads URL search params.

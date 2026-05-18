---
phase: 04
title: Auth Logic & Callback
status: completed
priority: critical
effort: medium
blockedBy: [phase-02]
---

# Phase 04 — Auth Logic & Callback

## Overview

Wire Google OAuth popup flow using Supabase. Includes the login button handler, OAuth callback route, and session management.

## Auth Flow

```
User clicks "LOGIN With Google"
  → googleLoginButton calls signInWithOAuth({ skipBrowserRedirect: true })
  → Supabase returns OAuth URL
  → App opens URL in popup window
  → User authenticates in popup
  → Google redirects popup to /auth/callback?code=...
  → Callback route exchanges code for session
  → Supabase sets session cookies
  → Popup closes (or redirects to /auth/callback/close)
  → Main window detects SIGNED_IN event via onAuthStateChange
  → Main window redirects to /home
```

## Implementation Steps

### 1. Update `components/login/google-login-button.tsx`

Add actual auth logic:

```typescript
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function GoogleLoginButton({ label }: { label: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      })
      if (error || !data.url) throw error

      // Open Google auth in popup
      const popup = window.open(data.url, 'google-auth', 'width=500,height=600,left=200,top=100')

      // Listen for session from popup completion
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          subscription.unsubscribe()
          popup?.close()
          router.push('/home')
        }
      })
    } catch {
      setIsLoading(false)
    }
  }

  return <button onClick={handleLogin} disabled={isLoading} ...>
}
```

### 2. Create `app/auth/callback/route.ts`

Handles the OAuth code exchange. Called inside the popup window.

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect popup to close page or home
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
```

### 3. Environment variable validation

Add to `lib/supabase/client.ts` — guard against missing env vars at module load:

```typescript
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}
```

## Files

| Action | File |
|--------|------|
| Update | `components/login/google-login-button.tsx` — add auth handler |
| Create | `app/auth/callback/route.ts` |

## Todo

- [ ] Add `handleLogin` to `google-login-button.tsx` with popup flow
- [ ] Create `app/auth/callback/route.ts`
- [ ] Test: clicking button opens Google auth popup
- [ ] Test: successful auth redirects to `/home`
- [ ] Test: button shows loading + disabled during auth
- [ ] Test: failed auth shows no crash (loading resets)
- [ ] Run `npx tsc --noEmit`

## Success Criteria

- Clicking "LOGIN With Google" opens Google OAuth popup
- After auth, user is redirected to `/home`
- Button is disabled with loader while auth is in progress
- Callback route exchanges code without errors
- Auth state is persisted via Supabase SSR cookies

## Security

- `exchangeCodeForSession` runs server-side (Route Handler) — code never exposed to client JS
- Session stored in HttpOnly cookies via `@supabase/ssr`
- No auth tokens logged or exposed

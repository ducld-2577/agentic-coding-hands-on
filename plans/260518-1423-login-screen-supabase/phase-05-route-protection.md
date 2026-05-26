---
phase: 05
title: Route Protection & Home Placeholder
status: completed
priority: high
effort: small
blockedBy: [phase-04]
---

# Phase 05 — Route Protection & Home Placeholder

## Overview

Add `proxy.ts` (Next.js 16 route protection, replaces `middleware.ts`) to redirect unauthenticated users to `/login` and authenticated users away from `/login`. Create `/home` placeholder page.

## Route Table

| Route | Authenticated | Unauthenticated |
|-------|--------------|-----------------|
| `/login` | → redirect `/home` | show login page |
| `/home` | show home page | → redirect `/login` |
| `/auth/callback` | pass through | pass through |
| `/_next/*`, `/api/*` | pass through | pass through |

## Implementation Steps

### 1. Create `proxy.ts`

**Note:** Next.js 16 uses `proxy.ts` at project root (not `middleware.ts`).

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = ['/login', '/auth/callback']
const PROTECTED_ROUTES = ['/home']

export async function proxy(req: NextRequest) {
  const response = NextResponse.next({ request: req })
  const path = req.nextUrl.pathname

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Redirect authenticated user away from login
  if (PUBLIC_ROUTES.includes(path) && isAuthenticated && path !== '/auth/callback') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // Redirect unauthenticated user away from protected routes
  if (PROTECTED_ROUTES.some(r => path.startsWith(r)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
}
```

### 2. Create `app/home/page.tsx`

Minimal placeholder — sufficient for testing auth redirect flow.

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">SAA 2025</h1>
        <p className="mt-2 text-zinc-500">Welcome, {user.email}</p>
      </div>
    </main>
  )
}
```

### 3. Update `app/page.tsx`

Root route should redirect to `/login` (or `/home` if authenticated).

```tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/login')
}
```

## Files

| Action | File |
|--------|------|
| Create | `proxy.ts` (project root) |
| Create | `app/home/page.tsx` |
| Update | `app/page.tsx` — redirect to `/login` |

## Todo

- [ ] Create `proxy.ts` at project root
- [ ] Create `app/home/page.tsx` with user email display
- [ ] Update `app/page.tsx` to redirect to `/login`
- [ ] Test: unauthenticated user visiting `/home` → redirected to `/login`
- [ ] Test: authenticated user visiting `/login` → redirected to `/home`
- [ ] Test: `/auth/callback` passes through proxy without redirect
- [ ] Run `npx tsc --noEmit`

## Success Criteria

- Unauthenticated access to `/home` redirects to `/login`
- Authenticated access to `/login` redirects to `/home`
- `/home` page displays logged-in user's email
- Root `/` redirects to `/login`
- No TypeScript errors

## Notes

- `proxy.ts` uses `createServerClient` directly (not `lib/supabase/server.ts`) because it needs to set cookies on the `NextResponse` object, not `next/headers`
- `getUser()` makes a network call to Supabase Auth server — this is the secure check (not `getSession()` which only reads from cookie without verification)

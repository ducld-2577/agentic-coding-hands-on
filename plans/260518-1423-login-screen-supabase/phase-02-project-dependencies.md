---
phase: 02
title: Project Dependencies & Supabase Client
status: completed
priority: critical
effort: small
blockedBy: [phase-01]
---

# Phase 02 — Project Dependencies & Supabase Client

## Overview

Install Supabase packages and create reusable client utilities following the `@supabase/ssr` pattern for Next.js App Router (server + browser clients).

## Requirements

- `@supabase/supabase-js` and `@supabase/ssr` installed
- Browser client for client components
- Server client for Server Components / Route Handlers / proxy
- Simple i18n dictionary for VN/EN login page strings

## Implementation Steps

### 1. Install packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Create browser Supabase client

**`lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3. Create server Supabase client

**`lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### 4. Create i18n dictionary

**`lib/i18n/login-translations.ts`**

Simple dictionary — no external library needed for single-screen text.

```typescript
export const loginTranslations = {
  VN: {
    tagline: 'ROOT FURTHER',
    description1: 'Bắt đầu hành trình của bạn cùng SAA 2025.',
    description2: 'Đăng nhập để khám phá!',
    loginButton: 'ĐĂNG NHẬP BẰNG GOOGLE',
  },
  EN: {
    tagline: 'ROOT FURTHER',
    description1: 'Begin your journey with SAA 2025.',
    description2: 'Sign in to explore!',
    loginButton: 'LOGIN WITH GOOGLE',
  },
} as const

export type Locale = keyof typeof loginTranslations
```

## Files

| Action | File |
|--------|------|
| Create | `lib/supabase/client.ts` |
| Create | `lib/supabase/server.ts` |
| Create | `lib/i18n/login-translations.ts` |

## Todo

- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`
- [ ] Create `lib/supabase/client.ts`
- [ ] Create `lib/supabase/server.ts`
- [ ] Create `lib/i18n/login-translations.ts`
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`

## Success Criteria

- No TypeScript errors in client/server utils
- Both clients can be imported without errors

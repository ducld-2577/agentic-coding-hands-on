# Phase 06 — Routes & Proxy Adjustments

**Status:** completed | **Priority:** high

## Overview

Make `/home` publicly accessible (test case ID-0: unauthenticated users see homepage content).
Add stub pages for linked routes so navigation does not 404. Update proxy.ts to reflect new
route rules.

## Changes Required

### proxy.ts
- Remove `/home` from `PROTECTED_ROUTES` array
- `/home` is now semi-public: accessible to all, personalization handled at component level

```typescript
// Before
const PROTECTED_ROUTES = ['/home']

// After
const PROTECTED_ROUTES: string[] = []   // no protected routes yet; /home is public
```

Keep the rest of proxy logic intact: still redirects authenticated users away from `/login`.

### Stub Pages

These routes are linked from the homepage but are out of scope for this plan:

| Route | File | Content |
|-------|------|---------|
| `/awards-information` | `app/awards-information/page.tsx` | Stub: "Awards Information — Coming soon" |
| `/sun-kudos` | `app/sun-kudos/page.tsx` | Stub: "Sun* Kudos — Coming soon" |
| `/profile` | `app/profile/page.tsx` | Stub: "Profile — Coming soon" |
| `/admin` | `app/admin/page.tsx` | Stub: "Admin Dashboard — Coming soon" |

All stubs: Server Component, no auth check, placeholder content only.

### app/home/page.tsx auth handling

Since page is now public, `user` may be null. The page must handle both:

```typescript
// app/home/page.tsx
export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // user may be null — no redirect

  return (
    <main className="relative min-h-screen ...">
      <HomeHeader user={user} />
      ...
    </main>
  )
}
```

Header conditionally renders bell + avatar only when `user !== null`.

## Security Note

Removing `/home` from PROTECTED_ROUTES does NOT expose any sensitive data — the homepage
content (countdown, awards, kudos) is all public event information. Supabase user data is
only used to conditionally render the account menu/bell; the data itself is never exposed
to the client beyond what Next.js already provides through the auth cookie.

## Files to Modify
- `proxy.ts` — remove `/home` from PROTECTED_ROUTES
- `app/home/page.tsx` — remove forced redirect, handle nullable user

## Files to Create
- `app/awards-information/page.tsx`
- `app/sun-kudos/page.tsx`
- `app/profile/page.tsx`
- `app/admin/page.tsx`

## Todo

- [ ] Remove `/home` from `PROTECTED_ROUTES` in `proxy.ts`
- [ ] Update `app/home/page.tsx` to accept nullable user
- [ ] Create `app/awards-information/page.tsx` stub
- [ ] Create `app/sun-kudos/page.tsx` stub
- [ ] Create `app/profile/page.tsx` stub
- [ ] Create `app/admin/page.tsx` stub

## Success Criteria

- Unauthenticated user can visit `/home` without being redirected to `/login`
- Authenticated user on `/login` still redirects to `/home`
- Clicking any nav/footer link does not result in 404
- No TypeScript errors from nullable `user`

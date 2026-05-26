# Phase 03 – Page Auth & Layout (Track B)

**Priority:** High — blocks phase-05  
**Status:** ✅ Complete

## Overview

Add Supabase auth protection to `/awards-information` and wire up the page skeleton with reusable layout components.

## Files to modify

- `app/awards-information/page.tsx` — replace stub with full page

## Files to read for context

- `app/home/page.tsx` — auth pattern reference
- `components/home/home-header.tsx` — reuse as-is
- `components/home/home-footer.tsx` — reuse as-is

## Implementation

### page.tsx structure

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { AwardsKeyvisual } from '@/components/awards-information/awards-keyvisual'
import { AwardsTitleSection } from '@/components/awards-information/awards-title-section'
import { AwardsSystemSection } from '@/components/awards-information/awards-system-section'
import { AwardsKudosBanner } from '@/components/awards-information/awards-kudos-banner'

export default async function AwardsInformationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      <HomeHeader user={user} />
      <AwardsKeyvisual />
      <AwardsTitleSection />
      <AwardsSystemSection />
      <AwardsKudosBanner />
      <HomeFooter />
    </main>
  )
}
```

### Test cases covered
- ID-0: authenticated user can access `/awards-information` ✓
- ID-1: unauthenticated → redirect to `/login` ✓
- ID-2: navigation from main menu ✓ (HomeHeader nav already links here)
- ID-3: overall layout structure ✓

## Todo

- [ ] Replace stub `app/awards-information/page.tsx` with auth-protected page
- [ ] Verify `createClient` import path matches project convention
- [ ] Verify redirect target is `/login` (not `/auth/login`)
- [ ] TypeCheck: `npx tsc --noEmit` passes

# Phase 03 — Page Integration

**Status:** Complete  
**Blocked by:** Phase 01, Phase 02

## Overview

Replace the placeholder `app/profile/page.tsx` with the real implementation. Reuse `HomeHeader`.

## Files to Modify

- `app/profile/page.tsx` — full replacement

## Page Structure

```tsx
// Server component
export default async function ProfilePage() {
  // 1. Auth check — redirect to /login if unauthenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Parallel data fetch
  const [profile, stats, secretBoxes, initialFeed] = await Promise.all([
    getUserProfile(user.id),
    getKudosStats(user.id),
    getUserSecretBoxes(user.id),
    getProfileKudosFeed(user.id, 'sent', null),
  ])

  // 3. Render
  return (
    <main className="min-h-screen bg-[#00101A]">
      <HomeHeader user={user} />
      <div className="pt-[72px]">  {/* offset fixed header */}
        <ProfileHeroSection profile={profile} />
        <ProfileStatsSection stats={stats} secretBoxes={secretBoxes} userId={user.id} />
        <ProfileKudosFeed
          initialItems={initialFeed.items}
          initialCursor={initialFeed.nextCursor}
          userId={user.id}
        />
      </div>
    </main>
  )
}
```

## Layout Notes

- `pt-[72px]` accounts for the fixed header height
- Max content width: `max-w-[800px] mx-auto px-4 sm:px-8` for stats + feed sections
- Hero section spans full width (background keyvisual), content centered
- Dark background `#00101A` consistent with other pages

## Server Action for Feed Filter

Add a Server Action (or use existing fetch pattern) in `profile-kudos-feed.tsx` to load more / re-filter:

```ts
// Inside profile-kudos-feed.tsx (client component)
async function fetchFeed(userId: string, filter: ProfileFeedFilter, cursor: string | null) {
  const res = await fetch(`/api/profile/feed?userId=${userId}&filter=${filter}&cursor=${cursor ?? ''}`)
  return res.json()
}
```

Or simpler: use a route handler at `app/api/profile/feed/route.ts` that calls `getProfileKudosFeed`.

**Decision:** Use route handler (KISS — consistent with existing fetch patterns).

## Todo

- [x] Replace `app/profile/page.tsx` with server component
- [x] Add `app/api/profile/feed/route.ts` route handler
- [x] Verify `HomeHeader` renders correctly on profile page (user passed)
- [x] Test full page render — no TypeScript errors

## Success Criteria

- `/profile` loads without errors
- Correct user data shown (name, avatar, stats)
- Filter toggle switches between sent/received kudos
- Secret box button triggers dialog (only when unopened boxes exist)
- Design matches Figma (hero, stats card, feed layout)

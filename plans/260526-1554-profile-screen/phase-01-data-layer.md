# Phase 01 — Data Layer

**Status:** Complete  
**Priority:** High — blocks all other phases

## Overview

Add two new query functions and update types to support the profile screen.

## Files to Modify

- `lib/kudos/queries.ts` — add `getUserProfile`, `getProfileKudosFeed`
- `lib/kudos/types.ts` — add `ProfileFeedFilter` type; verify `KudosStats` coverage

## Implementation Steps

### 1. Add `getUserProfile(userId)` to `lib/kudos/queries.ts`

```ts
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, badge_title, star_level, kudos_received_count, kudos_sent_count, hearts_received, department_id, department_name')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}
```

### 2. Add `getProfileKudosFeed(userId, filter, cursor)` to `lib/kudos/queries.ts`

- `filter: 'sent' | 'received'`
- When `sent`: query kudos where `sender_id = userId`
- When `received`: query kudos where `receiver_id = userId`
- Cursor-based pagination (same pattern as `getKudosFeed`)
- Join profiles for sender + receiver, hashtags, like_count, user_liked
- Include `status` column on kudos row (for spam/flag badge display)
- Page size: 10

### 3. Add type to `lib/kudos/types.ts`

```ts
export type ProfileFeedFilter = 'sent' | 'received'
```

## Todo

- [x] Add `getUserProfile` query
- [x] Add `getProfileKudosFeed` query (sent + received variants)
- [x] Add `ProfileFeedFilter` type
- [x] Check if `kudos` table has a `status` column; if not, omit that field silently

## Success Criteria

- TypeScript compiles without errors
- Queries return correct shape matching existing `KudosFeedItem` / `Profile` types

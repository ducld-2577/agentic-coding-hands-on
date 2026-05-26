# Phase 02 — API Data Layer

**Status:** ✅ DONE | **Priority:** P0 | **Requires:** Phase 01

## Context Links
- Clarifications: [clarifications.md](./clarifications.md)
- DB Schema: [phase-01-db-schema-migrations.md](./phase-01-db-schema-migrations.md)

## Overview
Type definitions + Supabase query functions + Server Actions for mutations.
All under `lib/kudos/`.

## Files to Create

### `lib/kudos/types.ts`
```ts
Department, KudosHashtag, KudosCategory, Profile (with dept + badge),
Kudos (with sender, receiver, hashtags, category, like_count, user_liked),
KudosLike, PrizeRecipient, SecretBox, KudosFeedItem,
KudosStats { received, sent, hearts, opened_boxes, unopened_boxes }
SpotlightNode { id, name, avatar_url, kudos_count, last_received_at }
```

### `lib/kudos/queries.ts`  (server-side, uses `lib/supabase/server.ts`)
```ts
// Feed
getKudosFeed(filters: { hashtag_id?, department_id?, cursor? }): Promise<{ data: KudosFeedItem[], nextCursor }>
  -- SELECT kudos + profiles (sender+receiver) + departments + hashtags + user_liked
  -- ORDER BY created_at DESC, page size 10, cursor-based pagination

// Highlight
getHighlightKudos(filters: { hashtag_id?, department_id? }): Promise<KudosFeedItem[]>
  -- SELECT top 5 kudos ORDER BY like_count DESC LIMIT 5

// Stats (current user)
getKudosStats(userId: string): Promise<KudosStats>
  -- COUNT kudos received/sent, SUM hearts, COUNT boxes

// Spotlight
getSpotlightData(): Promise<SpotlightNode[]>
  -- SELECT profiles with kudos_received_count > 0, ORDER BY kudos_received_count DESC

getKudosTotalCount(): Promise<number>
  -- SELECT COUNT(*) FROM kudos

// Filters
getDepartments(): Promise<Department[]>
getHashtags(): Promise<KudosHashtag[]>
getKudosCategories(): Promise<KudosCategory[]>

// Prize recipients (D.3)
getRecentPrizeRecipients(limit = 10): Promise<PrizeRecipient[]>
  -- SELECT prize_recipients JOIN profiles ORDER BY received_at DESC LIMIT 10

// Secret boxes (current user)
getUserSecretBoxes(userId: string): Promise<SecretBox[]>
```

### `lib/kudos/actions.ts`  (Server Actions — `'use server'`)
```ts
likeKudos(kudosId: string): Promise<{ success, hearts_added }>
  -- INSERT INTO kudos_likes, +1/+2 hearts to receiver profile
  -- Check: not sender, not already liked
  -- Check is_special_day from admin config (future: settings table)

unlikeKudos(kudosId: string): Promise<{ success }>
  -- DELETE FROM kudos_likes, revoke hearts from receiver profile

submitKudos(data: { receiver_id, content, category_id, hashtag_ids[], image_urls[] }): Promise<{ kudos_id }>
  -- INSERT kudos + kudos_to_hashtags
  -- UPDATE profiles.kudos_sent_count for sender
  -- UPDATE profiles.kudos_received_count + star_level + badge_title for receiver

openSecretBox(boxId: string): Promise<{ prize_description }>
  -- UPDATE secret_boxes SET is_opened=true, opened_at=now()
```

## Key Query Pattern (Feed with user_liked)
```sql
SELECT
  k.*,
  s.full_name AS sender_name, s.avatar_url AS sender_avatar,
  s.department_id, sd.name AS sender_dept,
  s.badge_title AS sender_badge, s.star_level AS sender_stars,
  r.full_name AS receiver_name, r.avatar_url AS receiver_avatar,
  rd.name AS receiver_dept,
  r.badge_title AS receiver_badge, r.star_level AS receiver_stars,
  array_agg(DISTINCT h.name) AS hashtag_names,
  EXISTS(SELECT 1 FROM kudos_likes kl WHERE kl.kudos_id=k.id AND kl.user_id=:userId) AS user_liked
FROM kudos k
JOIN profiles s ON k.sender_id = s.id
JOIN profiles r ON k.receiver_id = r.id
LEFT JOIN departments sd ON s.department_id = sd.id
LEFT JOIN departments rd ON r.department_id = rd.id
LEFT JOIN kudos_to_hashtags kth ON kth.kudos_id = k.id
LEFT JOIN kudos_hashtags h ON h.id = kth.hashtag_id
WHERE (k.sender_id IN (SELECT id FROM profiles JOIN departments ON ...) OR :dept_filter IS NULL)
GROUP BY k.id, s.id, r.id, sd.id, rd.id
ORDER BY k.created_at DESC
LIMIT 10 OFFSET :cursor
```

## Implementation Steps
1. Create `lib/kudos/` directory
2. Write `types.ts` with all interfaces
3. Write `queries.ts` — start with `getKudosFeed`, `getHighlightKudos`, `getKudosStats`
4. Write `queries.ts` — add `getSpotlightData`, `getKudosTotalCount`, `getDepartments`, `getHashtags`
5. Write `actions.ts` — `likeKudos`/`unlikeKudos` with optimistic update support
6. Write `actions.ts` — `submitKudos` with profile counter updates
7. Write `actions.ts` — `openSecretBox`

## Success Criteria
- [ ] TypeScript compiles with no errors
- [ ] `getKudosFeed()` returns typed data with sender/receiver/hashtags
- [ ] `likeKudos` properly enforces one-like-per-user and sender-cannot-like-own
- [ ] `submitKudos` correctly updates `kudos_received_count` + `star_level` + `badge_title`

# Code Review: Sun* Kudos Live Board

**Date:** 2026-05-24
**Files reviewed:** `lib/kudos/actions.ts`, `lib/kudos/queries.ts`, `app/sun-kudos/page.tsx`, `components/sun-kudos/kudos-live-board-client.tsx`, `kudos-action-bar.tsx`, `kudos-feed.tsx`, `kudos-submit-dialog.tsx`, `kudos-spotlight-board.tsx`, `kudos-highlight-section.tsx`, `kudos-secret-box-dialog.tsx`, `kudos-receiver-search.tsx`, `kudos-all-kudos-section.tsx`, `kudos-sidebar.tsx`, `kudos-toast.tsx`
**LOC:** ~1 200 across reviewed files

---

## Critical Issues

### C1 — TOCTOU / race condition on `like_count` and `hearts_received` counters (`actions.ts` lines 33–56, 85–111)

Both `likeKudos` and `unlikeKudos` do a read-then-write:

```
SELECT like_count … → UPDATE like_count = fetched + 1
SELECT hearts_received … → UPDATE hearts_received = fetched + N
```

Two concurrent likes on the same kudos will read the same value and both write `count + 1`, losing one increment. This is a classic lost-update. **Supabase/Postgres supports atomic increment directly:**

```sql
UPDATE kudos SET like_count = like_count + 1 WHERE id = $1
UPDATE profiles SET hearts_received = hearts_received + 1 WHERE id = $1
```

Use `.update({ like_count: supabase.rpc(...) })` or a raw SQL function. The same pattern repeats in `submitKudos` for `kudos_sent_count` / `kudos_received_count`.

---

### C2 — Off-by-one in RPC-path cursor extraction (`queries.ts` lines 108–111)

```ts
const nextCursor = data && data.length > FEED_PAGE_SIZE
  ? data[FEED_PAGE_SIZE - 1].created_at   // ← wrong index
  : null
```

The query fetches `FEED_PAGE_SIZE + 1` rows to detect "has more". The cursor should be the **last item of the current page**, i.e. `data[FEED_PAGE_SIZE - 1]`, which is correct in 0-indexed terms only if you then pass back the first `FEED_PAGE_SIZE` items **and** the next page uses `created_at < cursor`. However, `data[FEED_PAGE_SIZE - 1]` is the 10th item (index 9), and `data.slice(0, FEED_PAGE_SIZE)` returns items 0–9. So the cursor equals the `created_at` of the last returned item. On the next call, `lt('created_at', cursor)` is a strict less-than — it excludes that item correctly. This is actually correct for `getKudosFeedDirect` too (line 202).

**Revised finding:** The cursor logic is correct in both paths. No bug here.

---

### C3 — `image_urls` array passed to DB without server-side URL or MIME validation (`actions.ts` lines 122, 137)

`submitKudos` accepts `image_urls: string[]` from the client and stores them directly in the `kudos` row. There is no check that:
- URLs belong to the project's own Supabase storage bucket (an attacker can inject arbitrary external URLs)
- The count is capped (client caps at 5, but server trusts the array length)
- The content type was actually an image (Supabase storage `accept: "image/*"` is a browser hint only)

At minimum, validate that each URL starts with the expected Supabase storage prefix and that `image_urls.length <= 5`.

---

### C4 — `content` length not validated server-side (`actions.ts` line 128)

Client truncates at 1 000 chars in the textarea, but `submitKudos` only checks `content.trim()` is non-empty. A direct call to the server action bypasses the client limit. Without a length cap, a malicious client could insert a several-MB string into `kudos.content`.

Fix: add `if (data.content.length > 1000) return { error: '...' }`.

---

### C5 — `hashtag_ids` array not bounded server-side (`actions.ts` lines 121, 144–147)

Client caps hashtags at 5, server inserts whatever array length is passed. A crafted call could insert thousands of `kudos_to_hashtags` rows per submission. Add `if (data.hashtag_ids.length > 5) return { error: '...' }`.

---

## Warnings

### W1 — Type mismatch: `loadMore` cursor parameter (`kudos-feed.tsx` line 14 vs `actions.ts` line 226)

`KudosFeed` declares:
```ts
loadMore: (cursor: string, filters: FilterState) => Promise<FeedPage>
```

`fetchKudosFeed` in actions is:
```ts
export async function fetchKudosFeed(cursor: string | null, filters: …)
```

`KudosLiveBoardClient` passes `fetchKudosFeed` as `loadMore` directly. TypeScript will accept this (a function that accepts `string | null` satisfies a caller that passes `string`), but `KudosAllKudosSection` re-declares the same narrower signature and passes it to `KudosFeed`. It only calls `loadMore` when `cursor` is already non-null (line 43–47 of `kudos-feed.tsx`), so no actual null is ever passed. Not a runtime bug, but the inconsistent types will cause confusion. Align them to `string | null` throughout or narrow at the call site.

---

### W2 — D3 simulation effect runs on every `mode` change, re-creating the full simulation (`kudos-spotlight-board.tsx` line 162)

`mode` is in the dependency array of the main `useEffect` that builds the entire D3 simulation. Toggling between pan/zoom stops the old simulation, wipes all DOM nodes, and runs a fresh force layout. The second `useEffect` (lines 164–176) exists to swap behaviors without re-simulating, but is bypassed because the first effect fires first and rebuilds everything. The animation re-plays on every mode switch. Move `mode` out of the first effect's deps and let the second effect exclusively manage the pan/zoom swap.

---

### W3 — Unbounded `IN` clause in `getSpotlightData` (`queries.ts` line 347)

```ts
.in('receiver_id', profileIds)   // profileIds = all profiles with kudos_received_count > 0
```

As the user base grows, `profileIds` could be thousands of UUIDs, producing a massive `WHERE receiver_id IN (...)` query on the `kudos` table with no limit. Add `.limit(500)` (or cap `profileIds`) and accept slightly stale last-received data for overflow users.

---

### W4 — `setTimeout` without cleanup in `kudos-secret-box-dialog.tsx` (line 57)

```ts
setTimeout(() => setShakingId(null), 600)
```

If the dialog unmounts before the 600 ms timer fires, `setShakingId` runs on an unmounted component. Capture the id and clear on unmount, or use `useEffect` with cleanup.

---

### W5 — `onDismiss` in `KudosToast` will restart the timer on every parent re-render

`onDismiss` is an inline arrow `() => setToast(null)` (live-board-client line 125). It is a new function reference each render. The `useEffect` in `KudosToast` depends on it, so every unrelated state update in `KudosLiveBoardClient` resets the 3 s toast timer. Wrap `onDismiss` in `useCallback` or pass `setToast` directly.

---

### W6 — `fetchHighlight` is a new function reference on every parent render (`kudos-highlight-section.tsx` line 43)

`fetchHighlight` (a server action) is in the `useEffect` deps array. Server action references are stable across renders (they're module-level), so this is safe today. However, the pattern is fragile — if `fetchHighlight` is ever swapped for a non-stable function, the effect will loop. Document the assumption or guard with `useCallback`.

---

### W7 — `kudos-all-kudos-section.tsx` missing `'use client'` directive

This component imports `KudosFeed` (client) and `KudosSidebar` (no directive, passes `onOpenSecretBox` handler). It does not have `'use client'` itself. In the current Next.js RSC model, since it renders client components, Next.js will auto-treat it as a client boundary — but the intent is ambiguous and the component has no server-only logic. Add `'use client'` explicitly to signal intent.

---

### W8 — `kudos-sidebar.tsx` missing `'use client'` directive but renders with event handler prop

`onOpenSecretBox: () => void` is a function prop from a client component. Without `'use client'`, this component is technically a Server Component receiving a non-serializable prop. Next.js typically surfaces a build/runtime error here. It compiles without error only because the parent (`kudos-all-kudos-section.tsx`) is implicitly a client boundary. Add `'use client'` to both.

---

### W9 — `receiver_id` not validated as UUID format server-side (`actions.ts` line 127)

`user.id === data.receiver_id` is the only check. An empty string or malformed UUID still passes and will produce a Supabase error at insert time, leaking `insertError.message` back to the client. Validate UUID format before the DB call.

---

## Notes

### N1 — `getHighlightKudos` fetches 20 rows but returns 5 — unused data (`queries.ts` line 246)

Comment says "fetch 20 and slice top-5" but `.limit(5)` is used. Ordering by `like_count DESC` with `.limit(5)` already returns the correct top-5 efficiently. The comment is misleading; remove it.

---

### N2 — `filtersRef` in `kudos-feed.tsx` is used in `fetchMore` to avoid stale closure, but `cursor` is also captured by value

This is a correct and intentional stale-closure workaround. Worth a comment explaining _why_ `filtersRef` is needed vs using filters directly in the `useCallback` dep array.

---

### N3 — `Date.now()` in image upload path is not collision-safe for parallel uploads

```ts
const path = `kudos/${Date.now()}-${preview.file.name}`
```

Multiple files uploaded simultaneously within the same millisecond will produce identical paths. Use `crypto.randomUUID()` instead.

---

### N4 — `getSpotlightData` makes two sequential queries (profiles then kudos); could be a single join

Not a blocking issue, but worth a future RPC or a single join query for performance at scale.

---

### N5 — `shapeKudosRow` uses `any` with `eslint-disable` comment

Acceptable given the RPC output is dynamic, but the function is a single point of truth for mapping — a typed interface for the raw RPC row would eliminate the comment and add safety.

---

## Positive Observations

- Auth check on every mutating server action (`likeKudos`, `unlikeKudos`, `submitKudos`, `openSecretBox`, `fetchHighlightKudos`, `fetchKudosFeed`) — comprehensive, no bypass paths visible.
- `openSecretBox` correctly scopes the UPDATE to `.eq('user_id', user.id)` AND `.eq('is_opened', false)` — no IDOR, idempotent.
- Optimistic like toggle correctly reverts on error or network failure.
- IntersectionObserver in `kudos-feed.tsx` is properly cleaned up via `observer.disconnect()` in the effect return.
- D3 simulation is stopped on cleanup (`simulation.stop()`).
- `kudos-receiver-search.tsx` debounce cleanup is correct (clears timer on effect re-run and unmount).
- Server/client boundary is respected: `lib/kudos/queries.ts` is only imported in `app/sun-kudos/page.tsx` (server); client components use server actions only.
- `cursor` pagination correctly detects "has more" by fetching N+1 rows and slicing N back.

---

## Recommended Actions (priority order)

1. **[Critical]** Replace read-modify-write counter updates with atomic SQL increments (C1).
2. **[Critical]** Add server-side `image_urls` URL-prefix validation and array length cap (C3).
3. **[Critical]** Add `content.length <= 1000` check in `submitKudos` (C4).
4. **[Critical]** Add `hashtag_ids.length <= 5` check in `submitKudos` (C5).
5. **[Warning]** Fix `setTimeout` leak in `kudos-secret-box-dialog` (W4).
6. **[Warning]** Fix toast timer reset by stabilising `onDismiss` with `useCallback` (W5).
7. **[Warning]** Remove `mode` from the D3 simulation effect deps (W2).
8. **[Warning]** Cap `profileIds` in `getSpotlightData` to prevent unbounded IN clause (W3).
9. **[Warning]** Add `'use client'` to `kudos-all-kudos-section.tsx` and `kudos-sidebar.tsx` (W7, W8).
10. **[Note]** Replace `Date.now()` with `crypto.randomUUID()` in image upload path (N3).

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Implementation is largely correct and well-structured. Auth is consistent. Critical concerns are: non-atomic counter updates (race condition under concurrent likes), and missing server-side bounds on `content`, `hashtag_ids`, and `image_urls` — all are trivially exploitable by direct server-action calls.
**Concerns:** Items C1, C3, C4, C5 must be fixed before production traffic.

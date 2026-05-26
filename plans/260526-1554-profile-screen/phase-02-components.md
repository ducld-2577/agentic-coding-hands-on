# Phase 02 — Components

**Status:** Complete  
**Blocked by:** Phase 01

## Overview

Create 3 new components under `components/profile/`. All follow existing patterns from `components/sun-kudos/`.

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `components/profile/profile-hero-section.tsx` | Server/pure | Keyvisual bg + avatar + name + badge + badge collection row |
| `components/profile/profile-stats-section.tsx` | Client | Stats rows + Mở Secret Box button + dialog |
| `components/profile/profile-kudos-feed.tsx` | Client | Filter toggle + post cards + detail dialog |

---

## A. `profile-hero-section.tsx`

**Props:** `{ profile: Profile }`

Layout (matches design):
```
[keyvisual background image — same as awards keyvisual]
  [center column]
    [avatar — circular 80px, border white 2px]
    [name — font-montserrat text-2xl font-bold text-white]
    [KudosBadge component if badge_title is set]
  
  [badge collection row]
    6 × circle 40px bg-white/20 (static placeholders)
    label: "Bộ sưu tập icon của tôi" text-white/60 text-sm
```

Keyvisual: reuse `/awards-information/keyvisual.png` (same image used in `awards-keyvisual.tsx`)  
Avatar fallback: show initials circle if `avatar_url` is null

---

## B. `profile-stats-section.tsx`

**Props:** `{ stats: KudosStats; secretBoxes: SecretBox[]; userId: string }`

Layout:
```
[card — dark bg similar to kudos sidebar]
  Kudos bạn nhận được:         [stats.received]
  Kudos bạn đã gửi:            [stats.sent]
  Số tim bạn nhận được:        [stats.hearts]
  Secret Box bạn đã mở:        [stats.opened_boxes]
  Secret Box chưa mở:          [stats.unopened_boxes]
  
  [Button "Mở Secret Box 🎁" — shown only when stats.unopened_boxes > 0]
    → opens KudosSecretBoxDialog
```

Reuse `KudosSecretBoxDialog` from `components/sun-kudos/kudos-secret-box-dialog.tsx`

---

## C. `profile-kudos-feed.tsx`

**Props:** `{ initialItems: KudosFeedItem[]; initialCursor: string | null; userId: string }`

State:
- `filter: ProfileFeedFilter` — default `'sent'`
- `items`, `cursor`, `loading` for infinite scroll / load-more

Header row:
```
"Sun* Annual Awards 2025"  [small label]
KUDOS                      [large heading, font-montserrat bold]
[Dropdown: "Đã gửi (N) ▼" | "Đã nhận (N) ▼"]
```

When filter changes → refetch from server action (or route handler)  
Post cards: reuse `KudosPostCard`  
Spam badge: if `item.status === 'spam'` (or similar), overlay yellow chip top-right of card  
Detail dialog: reuse `KudosDetailDialog`

Load more: button at bottom (no infinite scroll, KISS)

---

## Todo

- [x] `profile-hero-section.tsx` — hero + avatar + badge + placeholder collection
- [x] `profile-stats-section.tsx` — stats + secret box CTA
- [x] `profile-kudos-feed.tsx` — feed client component with filter

## Success Criteria

- TypeScript compiles
- Components render with mock props (no runtime errors)
- Pixel layout matches design sections A, B, C, D

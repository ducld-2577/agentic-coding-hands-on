# Phase 06 — All Kudos Feed + Sidebar

**Status:** ✅ DONE | **Priority:** P1 | **Requires:** Phase 02, Phase 04 (shared components)

## Context Links
- MoMorph refs: Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- Clarifications: [clarifications.md](./clarifications.md)
- Figma nodes: C (2940:13475), C.1 (2940:14221), C.2 (2940:13482), C.3 (3127:21871), D (2940:13488)

## Design Specs

### C — All Kudos Section
- Header: "Sun* Annual Awards 2025" (subtitle) + "ALL KUDOS" (large title)
- Two-column layout: feed (680px, left, x=144) + sidebar (422px, right, x=874)
- Feed column has `max-h` with independent scroll on sidebar

### C.3 — Kudos Post Card (680×749px)
- Background: warm cream `#F5F0E4`, border-radius 16px
- **Sender block** (C.3.1): avatar 48px + name + dept + badge, hover → yellow ring, click → profile
- **Sent icon** (C.3.2): arrow/send icon (vertical, right side), non-interactive
- **Receiver block** (C.3.3): same layout as sender
- **Time** (C.3.4): `10:00 - 10/30/2025`, format `HH:mm - MM/DD/YYYY`, muted small
- **Category label**: "IDOL GIỚI TRẺ" — centered, uppercase, bold (not a hashtag)
- **Content** (C.3.5): message text, **max 5 lines** (`line-clamp-5`), `...` overflow; click → detail page
- **Image gallery** (C.3.6): up to 5 square thumbnails inline, click → lightbox
- **Hashtag row** (C.3.7): red `#E84A4A` tags, max 5 on one line, `...` overflow; click → filter
- **Action bar** (C.4): like count + heart + "Copy Link" — same as highlight card but NO "Xem chi tiết"

### C.3 vs B.3 difference
| | Highlight (B.3) | All Kudos (C.3) |
|---|---|---|
| Max content lines | 3 | 5 |
| Action bar | Like + Copy + View Details | Like + Copy only |
| Avatar size | 40px | 48px |
| Card width | 528px | 680px |
| Image gallery | No | Yes (max 5) |

### Image Lightbox
- Click thumbnail → fullscreen overlay, `<img>` centered, click outside/X to close
- ESC key closes
- Simple custom implementation (no library)

### Infinite Scroll
- Initial: 10 items (SSR)
- `useIntersectionObserver` on sentinel div at bottom of list
- Trigger: `getKudosFeed({ cursor: lastId, ...filters })`
- Append new items to state
- Loading spinner while fetching
- "Hiện tại chưa có Kudos nào." when list is empty

---

### D — Right Sidebar (422px, sticky top-[88px])

### D.1 — Statistics Block (0–405px height)
- Card: dark `rgba(255,255,255,0.06)`, border `rgba(255,255,255,0.08)`, rounded-xl, padding 24px
- 6 rows (label: value format):
  - "Số Kudos bạn nhận được:" — `kudosStats.received`
  - "Số Kudos bạn đã gửi:" — `kudosStats.sent`
  - "Số tim bạn nhận được:" — `kudosStats.hearts` with ×2 gold indicator
  - Divider line (D.1.5)
  - "Số Secret Box bạn đã mở:" — `kudosStats.opened_boxes`
  - "Số Secret Box chưa mở:" — `kudosStats.unopened_boxes`
- Values: right-aligned, gold `#F5C842`, bold
- **"Mở quà" button** (D.1.8): full-width, gold background or outlined gold, opens `KudosSecretBoxDialog`

### D.3 — Prize Recipients List (429–933px)
- Title: "10 SUNNER NHẬN QUÀ MỚI NHẤT" (uppercase, muted/gold small)
- List: up to 10 items
- Each item: avatar 40px circle (white border) + name (bold, gold `#FFEA9E`) + prize description (white, right-align or below)
- Layout per spec D.3.4: horizontal row, 8px gap
- Click avatar/name → profile
- Hover avatar/name → yellow ring
- Empty: "Chưa có dữ liệu"
- List is scrollable inside sidebar

## Files to Create

```
components/sun-kudos/
  kudos-post-card.tsx           -- Full kudos post card (C.3+C.4)
  kudos-image-gallery.tsx       -- Thumbnail row + lightbox (C.3.6)
  kudos-image-lightbox.tsx      -- Fullscreen image overlay
  kudos-feed.tsx                -- Infinite scroll feed (C.2)
  kudos-all-kudos-section.tsx   -- C section wrapper (header + feed + sidebar)
  kudos-sidebar.tsx             -- D sidebar wrapper
  kudos-stats-block.tsx         -- D.1 stats card
  kudos-prize-list.tsx          -- D.3 prize recipients list
```

## Component Interfaces

```ts
// kudos-post-card.tsx
interface KudosPostCardProps {
  item: KudosFeedItem
  currentUserId: string
  onHashtagClick: (hashtagId: number) => void
  onLikeToggle: (kudosId: string) => void
}

// kudos-feed.tsx
interface KudosFeedProps {
  initialItems: KudosFeedItem[]
  initialCursor: string | null
  filters: FilterState
  currentUserId: string
  onHashtagClick: (hashtagId: number) => void
}

// kudos-sidebar.tsx
interface KudosSidebarProps {
  stats: KudosStats
  prizeRecipients: PrizeRecipient[]
  currentUserId: string
}
```

## Implementation Steps
1. `kudos-image-lightbox.tsx` — overlay portal, ESC handler, close on backdrop click
2. `kudos-image-gallery.tsx` — thumbnail row, click → open lightbox
3. `kudos-post-card.tsx` — assemble full card reusing `KudosUserInfoBlock`, `KudosActionBar`, `KudosHashtagTag`
4. `kudos-feed.tsx` — `useState(items)`, intersection observer, fetch next page on trigger
5. `kudos-stats-block.tsx` — static display, "Mở quà" button calls `onOpenSecretBox`
6. `kudos-prize-list.tsx` — list of recipient rows
7. `kudos-sidebar.tsx` — sticky sidebar, combines stats + prize list
8. `kudos-all-kudos-section.tsx` — header + two-column layout

## Success Criteria
- [ ] Kudos cards render with correct cream bg, fonts, layout
- [ ] Image gallery shows thumbnails, lightbox opens on click, ESC closes
- [ ] Hashtag tags are red, clickable, update filter
- [ ] Content truncated at 5 lines with `...`
- [ ] Infinite scroll loads more on reaching bottom
- [ ] Empty feed: "Hiện tại chưa có Kudos nào."
- [ ] Sidebar sticky, scrolls independently
- [ ] Stats show correct numbers for current user
- [ ] "Mở quà" button opens Secret Box dialog
- [ ] Prize list shows up to 10 recipients, avatar click → profile
- [ ] Empty prize list: "Chưa có dữ liệu"

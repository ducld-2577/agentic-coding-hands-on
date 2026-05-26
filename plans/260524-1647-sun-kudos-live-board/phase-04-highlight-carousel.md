# Phase 04 — Highlight Kudos Carousel + Card

**Status:** ✅ DONE | **Priority:** P1 | **Requires:** Phase 02

## Context Links
- MoMorph refs: Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- Clarifications: [clarifications.md](./clarifications.md)
- Figma nodes: B (2940:13451), B.2 (2940:13461), B.3 (2940:13465), B.4 (2940:13448)

## Design Specs

### B — Highlight Section
- Header row: "Sun* Annual Awards 2025" (small, muted) + "HIGHLIGHT KUDOS" (large, bold white)
- Horizontal rule separator between subtitle and title row
- Filter buttons (Hashtag + Phòng ban) — right-aligned on same row as title
- Background: `#00101A`

### B.2 — Carousel (1440px wide, 525px tall)
- Shows 3 cards visible: center (active, full opacity), two sides (faded, `opacity-40`, non-interactive)
- Active card: center, `scale-100`, full opacity
- Side cards: `scale-90 opacity-40`, pointer-events-none
- Cards: 528px wide × 525px tall
- Gaps: 24px between cards
- Prev button (B.2.1): large circle icon-button, left side overlay
- Next button (B.2.2): large circle icon-button, right side overlay
- Both disabled at respective ends (opacity-30, pointer-events-none)
- Pagination: "2/5" format — bottom center (B.5)

### B.3 — Highlight Kudos Card (528×525px)
- Background: warm cream `#F5F0E4` (beige)
- Border radius: 16px
- **Sender row**: avatar (40px circle) + name (bold, dark) + dept + badge pill
- Arrow icon (→) center between sender/receiver
- **Receiver row**: avatar (40px circle) + name (bold, dark) + dept + badge pill
- Divider line
- Time: `10:00 - 10/30/2025` — small, muted
- Content: kudos message, max 3 lines, `line-clamp-3`, `...` overflow
- Hashtag tags: red `#E84A4A`, `#Dedicated #Inspiring...`, max 5 on one line, `...`
- Action bar: `[like_count] ❤️` + `Copy Link 🔗` + `Xem chi tiết →`
- Heart: gray when not liked, red `#E84A4A` when liked

### B.3.2/B.3.6 — User Info Block (shared component)
- Avatar: 40px circle, `object-cover`, hover → yellow ring `ring-2 ring-[#F5C842]`
- Name: click → `/profile/[id]`, hover → yellow ring on name text
- Dept: small muted text
- Badge pill (danh hiệu): colored pill with hover tooltip
  - New Hero: teal/green gradient
  - Rising Hero: blue/purple gradient
  - Legend Hero: gold `#F5C842` gradient
- Star count hover tooltip (★): text from spec B.3.2

## Files to Create

```
components/sun-kudos/
  kudos-badge.tsx               -- Award badge pill with hover tooltip
  kudos-user-info-block.tsx     -- Sender/receiver info (avatar+name+dept+badge)
  kudos-hashtag-tag.tsx         -- Clickable hashtag tag (#Dedicated style)
  kudos-action-bar.tsx          -- Like count + Copy Link + Xem chi tiết
  kudos-highlight-card.tsx      -- Highlight variant card (B.3)
  kudos-highlight-carousel.tsx  -- Carousel with prev/next + pagination (B.2+B.5)
  kudos-highlight-section.tsx   -- Full B section (header + filters + carousel)
```

## Component Interfaces

```ts
// kudos-badge.tsx
interface KudosBadgeProps {
  badge: 'New Hero' | 'Rising Hero' | 'Legend Hero'
  starLevel: 0 | 1 | 2 | 3
}

// kudos-user-info-block.tsx
interface KudosUserInfoBlockProps {
  user: { id, full_name, avatar_url, department, badge_title, star_level }
  onHashtagClick?: (hashtag: string) => void
}

// kudos-action-bar.tsx
interface KudosActionBarProps {
  kudosId: string
  likeCount: number
  userLiked: boolean
  isSender: boolean       -- disables like button
  showViewDetails?: boolean
  onCopyLink: () => void
  onLikeToggle: (kudosId: string) => void
}

// kudos-highlight-carousel.tsx
interface KudosHighlightCarouselProps {
  items: KudosFeedItem[]  -- exactly 5
  currentUserId: string
  onHashtagClick: (hashtagId: number) => void
}

// kudos-highlight-section.tsx
interface KudosHighlightSectionProps {
  initialItems: KudosFeedItem[]
  hashtags: KudosHashtag[]
  departments: Department[]
  currentUserId: string
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
}
```

## Carousel Implementation
- State: `currentIndex` (0–4)
- Render 3 items: `[currentIndex-1, currentIndex, currentIndex+1]` with wrapping
- CSS `transition-transform duration-300` for slide animation
- Disable Prev at index 0, disable Next at index 4
- Pagination display: `{currentIndex + 1}/{items.length}`

## Like Interaction (Optimistic)
1. `onClick` → immediate UI toggle (optimistic)
2. Call `likeKudos(id)` / `unlikeKudos(id)` server action
3. On error → revert optimistic state + toast error
4. Business rules enforced both client (disable button) and server (action check)

## Copy Link + Toast
- Copy: `navigator.clipboard.writeText(window.location.origin + '/sun-kudos/' + kudosId)`
- Toast: "Link copied — ready to share!" (spec exact text)
- Toast component: 3s auto-dismiss, bottom-right, dark pill style

## Implementation Steps
1. `kudos-badge.tsx` — pill with gradient bg + Radix/custom tooltip
2. `kudos-user-info-block.tsx` — avatar + name + dept + badge, hover states
3. `kudos-hashtag-tag.tsx` — red text button, onClick sets filter
4. `kudos-action-bar.tsx` — heart toggle + copy link + view details
5. `kudos-highlight-card.tsx` — assemble full card
6. `kudos-highlight-carousel.tsx` — carousel logic + prev/next
7. `kudos-highlight-section.tsx` — wraps header + filter buttons + carousel

## Success Criteria
- [ ] Carousel shows 3 cards, center active, sides faded
- [ ] Prev/Next navigate correctly, disabled at ends
- [ ] Pagination "1/5" updates on navigation
- [ ] Like toggle works with optimistic update
- [ ] Copy link copies URL and shows toast "Link copied — ready to share!"
- [ ] "Xem chi tiết" navigates to `/sun-kudos/[id]`
- [ ] Badge hover shows correct tooltip text
- [ ] Avatar hover shows yellow ring
- [ ] Hashtag click sets filter, updates both Highlight + All Kudos
- [ ] Empty state: "Hiện tại chưa có Kudos nào."
- [ ] Filters applied, carousel resets to page 1

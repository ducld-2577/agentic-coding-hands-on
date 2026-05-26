# Phase 04 — Award Cards Grid

**Status:** completed | **Priority:** high

## Overview

Implement the awards section (C1 + C2): section header and 6 award cards in a responsive
grid. Cards navigate to `/awards-information#{slug}` so the browser auto-scrolls to the
matching section. Data is static (no DB per specs).

## MoMorph Refs

- Specs: C1 (header), C2 (list), C2.1–C2.6 (cards), C2.1.1–C2.1.4 (card anatomy)
- Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

## Architecture

```
components/home/home-awards-section.tsx   — Section wrapper (Server Component)
components/home/home-award-card.tsx       — Single card (Server Component, Link-based)
lib/data/award-categories.ts              — Static award data array
```

## Award Data (static)

```typescript
// lib/data/award-categories.ts
export interface AwardCategory {
  slug: string          // URL hash slug (e.g. 'top-talent')
  title: string
  description: string
  imageSrc: string      // /awards/top-talent.png etc. (public/ assets)
}

export const AWARD_CATEGORIES: AwardCategory[] = [
  { slug: 'top-talent',         title: 'Top Talent',               description: 'Vinh danh top cá nhân xuất sắc trên mọi phương diện',      imageSrc: '/awards/top-talent.png' },
  { slug: 'top-project',        title: 'Top Project',              description: 'Ghi nhận dự án nổi bật và đóng góp xuất sắc',              imageSrc: '/awards/top-project.png' },
  { slug: 'top-project-leader', title: 'Top Project Leader',       description: 'Vinh danh người lãnh đạo dự án xuất sắc',                  imageSrc: '/awards/top-project-leader.png' },
  { slug: 'best-manager',       title: 'Best Manager',             description: 'Ghi nhận nhà quản lý truyền cảm hứng và hiệu quả',         imageSrc: '/awards/best-manager.png' },
  { slug: 'signature-creator',  title: 'Signature 2025 — Creator', description: 'Vinh danh cá nhân sáng tạo xuất sắc của năm',              imageSrc: '/awards/signature-creator.png' },
  { slug: 'mvp',                title: 'MVP',                      description: 'Most Valuable Person — người có đóng góp giá trị nhất',     imageSrc: '/awards/mvp.png' },
]
```

Note: image files are placeholder assets — use a consistent fallback image if real assets unavailable.

## Card Spec (C2.1)

| Element | Behaviour |
|---------|-----------|
| Thumbnail image | Square, rounded corners, gold border, glow effect |
| Title | Click → `/awards-information#{slug}` |
| Description | Max 2 lines, `line-clamp-2` (NOT `truncate`) |
| "Chi tiết" link | Icon + text, navigates same href |
| Whole card (img + title + Chi tiết) | All three trigger same navigation |
| Hover | Card elevates (`translate-y-[-4px]`), border/glow highlights |

## Grid Layout

- Desktop (≥1024px): 3 columns — `grid-cols-3`
- Tablet/Mobile (<1024px): 2 columns — `grid-cols-2`
- Tailwind: `grid grid-cols-2 lg:grid-cols-3 gap-6`

## Navigation Pattern

All clickable elements on a card → `<Link href={/awards-information#${slug}}>`.
Wrap entire card content in a `<Link>` block; "Chi tiết" is a visual element inside it,
not a separate anchor (prevents nested `<a>` elements).

## Files to Create
- `components/home/home-awards-section.tsx`
- `components/home/home-award-card.tsx`
- `lib/data/award-categories.ts`

## Implementation Steps

1. Create `lib/data/award-categories.ts` with the 6 entries above
2. Create `HomeAwardCard`: receives `AwardCategory`, renders image + title + description (`line-clamp-2`) + "Chi tiết", wrapped in `<Link>`
3. Create `HomeAwardsSection`: renders C1 header (caption + title + subtitle) + grid of `HomeAwardCard`

## Todo

- [ ] `lib/data/award-categories.ts` static data
- [ ] `HomeAwardCard` component
- [ ] `HomeAwardsSection` component

## Success Criteria

- 6 cards render in 3-col desktop / 2-col tablet/mobile
- Descriptions truncate at 2 lines (`line-clamp-2`)
- Click on image, title, or "Chi tiết" all navigate to `/awards-information#{slug}`
- Hover effect: card lifts, border highlights
- No nested `<a>` tags (accessibility)

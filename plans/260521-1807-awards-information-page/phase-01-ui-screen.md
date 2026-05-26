# Phase 01 – UI Implementation (Track A)

**MoMorph screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD  
**Figma node:** `313:8449` (Bìa — main content container)  
**Goal:** Pixel-perfect UI for all visual sections of the "Hệ thống giải" screen.  
**Status:** ✅ Complete

## Out of scope
- Auth logic (phase-03)
- IntersectionObserver / scroll behavior (phase-04)
- Figma image download/export (phase-02)
- Data wiring with real AWARD_DETAILS (phase-05)

## Integration contract (inputs expected from other phases)

| Prop / import | Provided by |
|---------------|-------------|
| `AWARD_DETAILS` from `@/lib/data/award-categories` | phase-02 |
| Auth user session in `page.tsx` | phase-03 |
| `useAwardsNavScroll()` hook | phase-04 |
| Images at `/public/awards-information/*.png` | phase-02 |

## Components to create

```
components/awards-information/
├── awards-keyvisual.tsx          – hero banner (keyvisual bg + Root Further logo)
├── awards-title-section.tsx      – section A: subtitle + gold main heading
├── awards-nav-menu.tsx           – section C: left sticky nav, 6 items, active state
├── awards-award-block.tsx        – section D: individual award card (image + content)
├── awards-system-section.tsx     – section B: 2-col layout (nav + award list)
└── awards-kudos-banner.tsx       – section D1: Sun* Kudos promo + Chi tiết button
```

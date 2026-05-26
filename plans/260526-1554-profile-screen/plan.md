# Profile Screen — Implementation Plan

**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/3FoIx6ALVb/items  
**Figma:** https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding?node-id=362-5050  
**Branch:** feature.profile  
**Status:** Complete

## Phases

| Phase | File | Status |
|-------|------|--------|
| 01 | [Data Layer](./phase-01-data-layer.md) | Complete |
| 02 | [Components](./phase-02-components.md) | Complete |
| 03 | [Page Integration](./phase-03-page-integration.md) | Complete |

## Screen Sections

| ID | Name | Notes |
|----|------|-------|
| A | User Info (hero) | Avatar + name + badge_title over keyvisual bg |
| A.3 + B2–B7 | Badge collection | 6 gray placeholder circles, static |
| B | Thống kê | Stats rows + Mở Secret Box button |
| C | Awards header | Title + KUDOS + Đã gửi/Đã nhận filter dropdown |
| D | Kudos feed | Post cards filtered by sent/received |

## Key Decisions (from clarifications)
- C.3 dropdown: 2 options — "Đã gửi" / "Đã nhận"
- D.3.1 badge: shows kudos `status` when flagged/spam
- B.6 button: opens KudosSecretBoxDialog; hidden when unopened_boxes = 0
- Badges B2–B7: 6 static gray circle placeholders

## Reused Components
- `HomeHeader` — site-wide header (already links to /profile)
- `KudosPostCard` — feed cards
- `KudosSecretBoxDialog` — secret box dialog
- `KudosBadge` — badge display in hero

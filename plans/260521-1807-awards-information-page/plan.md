# Plan: Hệ thống giải (Awards Information Page)

**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD  
**Figma:** https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding?node-id=313-8449  
**Design frame screenshot:** https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/313:8436/5e4e9de36ab6da2fb22160362c214bed.png  
**Route:** `/awards-information`  
**Clarifications:** [clarifications.md](./clarifications.md)

## Tracks

| Track | Focus | Status |
|-------|-------|--------|
| A – UI | `momorph-implement-design` handles pixel-perfect layout | ✅ Complete |
| B – Data & Behavior | Auth, data layer, IntersectionObserver scroll sync | ✅ Complete |

## Phases

| Phase | Track | Description | Status |
|-------|-------|-------------|--------|
| [phase-01-ui-screen.md](./phase-01-ui-screen.md) | A | UI implementation via momorph-implement-design | ✅ Complete |
| [phase-02-data-and-assets.md](./phase-02-data-and-assets.md) | B | Extend award data + download Figma images | ✅ Complete |
| [phase-03-page-auth-and-layout.md](./phase-03-page-auth-and-layout.md) | B | Auth protection + page skeleton | ✅ Complete |
| [phase-04-nav-scroll-behavior.md](./phase-04-nav-scroll-behavior.md) | B | IntersectionObserver + smooth scroll + URL hash | ✅ Complete |
| [phase-05-integration.md](./phase-05-integration.md) | A+B | Wire data into UI, verify home page anchor links | ✅ Complete |

## Key Constraints

- Images: keyvisual (`2167:5138`) and award card images must be exported from Figma
- Auth: redirect to `/login` if unauthenticated (same pattern as `/home`)
- Anchor IDs on award blocks must match slugs used by home page card links (`/awards-information#top-talent` etc.)
- Sun* Kudos "Chi tiết" button → `/sun-kudos`
- Menu icon: `MM_MEDIA_Target` (24×24px) before each nav label

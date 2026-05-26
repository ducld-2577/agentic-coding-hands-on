# Sun* Kudos — Live Board Implementation Plan

**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ  
**Figma:** https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding?node-id=2940-13434  
**Clarifications:** [clarifications.md](./clarifications.md)  
**Branch:** `feature.award`

## Phases

| # | Phase | Status | Priority |
|---|-------|--------|----------|
| 1 | [DB Schema & Migrations](./phase-01-db-schema-migrations.md) | ✅ DONE | P0 |
| 2 | [API Data Layer](./phase-02-api-data-layer.md) | ✅ DONE | P0 |
| 3 | [KV Banner + Input + Filters](./phase-03-banner-input-filters.md) | ✅ DONE | P1 |
| 4 | [Highlight Kudos Carousel](./phase-04-highlight-carousel.md) | ✅ DONE | P1 |
| 5 | [Spotlight Board (D3)](./phase-05-spotlight-board.md) | ✅ DONE | P1 |
| 6 | [All Kudos Feed + Sidebar](./phase-06-all-kudos-sidebar.md) | ✅ DONE | P1 |
| 7 | [Dialogs — Submit + Secret Box](./phase-07-dialogs.md) | ✅ DONE | P2 |
| 8 | [Page Assembly + Auth](./phase-08-page-assembly.md) | ✅ DONE | P2 |

## Key Dependencies

- Phase 1 → Phase 2 → all UI phases
- Phase 3–7 are independent of each other (can parallel)
- Phase 8 requires all prior phases done

## Stack

- Next.js 16.2.6 · React 19 · Tailwind CSS v4
- Supabase SSR (`@supabase/ssr ^0.10.3`)
- D3 (add `d3 ^7` for Spotlight)
- No new UI library — Tailwind + custom components only

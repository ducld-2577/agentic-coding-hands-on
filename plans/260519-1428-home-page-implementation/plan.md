---
title: Home Page — SAA 2025
status: completed
created: 2026-05-19
completed: 2026-05-19
momorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
blockedBy: []
blocks: []
---

# Home Page — SAA 2025

## Overview

Implement the Homepage SAA screen from MoMorph design. The page is publicly accessible
(unauthenticated users see content; authenticated users see personalized header controls).

**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Supabase (local)

**Clarifications:** [clarifications.md](./clarifications.md)

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [phase-01](./phase-01-layout-and-hero.md) | Layout, Hero section, CTA buttons, event info, Root Further copy | completed |
| [phase-02](./phase-02-header-navigation.md) | Header: nav links, language (reuse), account menu, notification bell | completed |
| [phase-03](./phase-03-countdown-timer.md) | Countdown client component, env var, auto-update, Coming Soon toggle | completed |
| [phase-04](./phase-04-award-cards.md) | Awards section: header + 6-card responsive grid, hash-link nav | completed |
| [phase-05](./phase-05-kudos-widget-footer.md) | Sun* Kudos block, floating Widget button, Footer | completed |
| [phase-06](./phase-06-routes-and-proxy.md) | Make /home public, add stub pages for /awards-information + /sun-kudos | completed |
| [phase-07](./phase-07-unit-tests.md) | Unit tests: countdown logic, award slug util, proxy route rules | completed |

## Key Decisions

- **Route:** `/home` (existing stub, publicly accessible — unauthenticated users see full content)
- **Auth personalization:** Header shows bell + avatar only when logged in
- **Countdown env var:** `NEXT_PUBLIC_EVENT_DATETIME` (ISO-8601)
- **Award data:** Static (no DB table/column in specs)
- **Notification panel:** Placeholder (no data model in specs for this screen)
- **Widget button actions:** Placeholder quick-action menu (actions not specified in specs)
- **Language selector:** Reuse `LanguageSelector` from `components/login/`
- **Linked pages:** `/awards-information` and `/sun-kudos` — stub pages only (not in scope)

## Lessons from Login Implementation

1. **No `overflow-hidden` on outer wrapper** — clips absolutely positioned children (dropdowns, menus)
2. **Header z-index must beat content** — use `z-30` minimum; content sections use `z-10`
3. **Button text: `whitespace-nowrap`, not `truncate`** — Vietnamese uppercase overflows fixed widths
4. **Vitest include pattern** — `__tests__/**/*.test.ts` already set; don't widen it
5. **Supabase cookie in Route Handler** — use `createServerClient` directly on `NextResponse` object
6. **URL allowlist** — both `localhost` and `127.0.0.1` variants needed for local OAuth

---
title: Login Screen — Supabase Google OAuth
status: completed
created: 2026-05-18
completed: 2026-05-18
momorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
blockedBy: []
blocks: []
---

# Login Screen — Supabase Google OAuth

## Overview

Implement the Login screen from SAA 2025 MoMorph design with Google OAuth via Supabase local project.

**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Supabase (local)

**Clarifications:** [clarifications.md](./clarifications.md)

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [phase-01](./phase-01-supabase-local-setup.md) | Supabase Local Setup | completed |
| [phase-02](./phase-02-project-dependencies.md) | Project Dependencies & Supabase Client | completed |
| [phase-03](./phase-03-login-ui.md) | Login Screen UI | completed |
| [phase-04](./phase-04-auth-logic.md) | Auth Logic & Callback | completed |
| [phase-05](./phase-05-route-protection.md) | Route Protection & Home Placeholder | completed |

## Key Decisions

- Post-login redirect → `/home`
- Languages: VN (default) + EN — simple dictionary, cookie-persisted
- OAuth: Popup flow (`skipBrowserRedirect: true`)
- Session management: Supabase SSR cookies via `@supabase/ssr`
- Route protection: `proxy.ts` (Next.js 16 pattern, replaces `middleware.ts`)

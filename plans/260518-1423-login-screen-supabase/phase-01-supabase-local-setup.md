---
phase: 01
title: Supabase Local Setup
status: completed
priority: critical
effort: medium
---

# Phase 01 — Supabase Local Setup

## Overview

Set up Supabase local project with Google OAuth provider enabled. This is the infrastructure prerequisite for all auth phases.

## Requirements

- Supabase CLI installed and project initialized
- Local Supabase instance running (`supabase start`)
- Google OAuth configured in `supabase/config.toml`
- `.env.local` populated with local credentials
- Supabase project linked (optional for local-only dev)

## Implementation Steps

### 1. Install Supabase CLI

```bash
npm install supabase --save-dev
```

### 2. Initialize Supabase project

```bash
npx supabase init
```

This creates `supabase/config.toml` and `supabase/` directory.

### 3. Configure Google OAuth in config.toml

Edit `supabase/config.toml` — add under `[auth.external.google]`:

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_GOOGLE_SECRET)"
redirect_uri = ""  # leave empty for local, Supabase handles it
```

> For local dev, Google OAuth requires a real Google Cloud project with OAuth credentials.
> Redirect URI to add in Google Console: `http://127.0.0.1:54321/auth/v1/callback`

### 4. Start local Supabase

```bash
npx supabase start
```

Output will show:
```
API URL: http://127.0.0.1:54321
anon key: <ANON_KEY>
service_role key: <SERVICE_ROLE_KEY>
```

### 5. Create .env.local

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
SUPABASE_AUTH_GOOGLE_CLIENT_ID=<from Google Cloud Console>
SUPABASE_AUTH_GOOGLE_SECRET=<from Google Cloud Console>
```

Also create `.env.local.template` (safe to commit):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_AUTH_GOOGLE_CLIENT_ID=
SUPABASE_AUTH_GOOGLE_SECRET=
```

## Files

| Action | File |
|--------|------|
| Create | `supabase/config.toml` (via `supabase init`) |
| Create | `.env.local` (local only, gitignored) |
| Create | `.env.local.template` |
| Update | `.gitignore` — ensure `.env.local` is ignored |

## Todo

- [ ] Install Supabase CLI as dev dependency
- [ ] Run `supabase init`
- [ ] Add Google OAuth config to `supabase/config.toml`
- [ ] Run `supabase start` and verify output
- [ ] Create `.env.local` with credentials
- [ ] Create `.env.local.template`
- [ ] Add `.env.local` to `.gitignore`

## Success Criteria

- `supabase start` runs without errors
- `http://127.0.0.1:54321` responds
- Google OAuth section enabled in config.toml

## Security

- `.env.local` MUST be in `.gitignore` — never commit secrets
- Use `env()` wrapper in config.toml to reference env vars, not hardcode credentials

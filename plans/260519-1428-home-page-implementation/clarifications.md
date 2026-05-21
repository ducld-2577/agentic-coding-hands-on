# Clarifications

## Session 2026-05-19

- Q: Is the home page at `/home` publicly accessible (no login required)? → A: Yes — unauthenticated users see all content; authenticated users additionally see notification bell and account menu. Remove `/home` from PROTECTED_ROUTES in proxy.ts.
- Q: What env var name controls the countdown event datetime? → A: `NEXT_PUBLIC_EVENT_DATETIME` (ISO-8601 format, e.g. `2025-12-31T18:30:00+07:00`)
- Q: Is award card data (titles, descriptions, images) static or fetched from Supabase? → A: Static — no `databaseTable`/`databaseColumn` specified in any award card spec
- Q: What does the Widget button quick-action menu show? → A: Placeholder (options not defined in specs); implement toggle open/close UI only
- Q: What does the notification panel show when opened? → A: Placeholder (panel content not defined in this screen's specs); implement toggle only
- Q: Where do Award card "Chi tiết" links and CTA buttons navigate? → A: `/awards-information` for ABOUT AWARDS, `/sun-kudos` for ABOUT KUDOS. Both are stub pages (out of scope for this plan)
- Q: What role check is used for "Admin Dashboard" in account menu? → A: Check `user.app_metadata.role === 'admin'` from Supabase auth user object

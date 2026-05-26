# Phase 08 — Page Assembly + Auth + Integration

**Status:** ✅ DONE | **Priority:** P2 | **Requires:** All prior phases

## Context Links
- MoMorph refs: Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- Clarifications: [clarifications.md](./clarifications.md)
- Reference page pattern: `app/awards-information/page.tsx`

## Page Route
`app/sun-kudos/page.tsx` — replace the "Coming soon" stub

## Full Page Layout (1440px, 5894px total height)

```
[HomeHeader (fixed, z-30)]
  [pt-[72px]]  ← offset for fixed header
  [KudosKvBanner]           h=160px
  [KudosSubmitInput]        h=72px  (centered, w=738px, within 1440px)
  [KudosHighlightSection]   h=786px (header + carousel + pagination)
  [KudosSpotlightSection]   h=791px (header + board)
  [KudosAllKudosSection]    h=3237px (header + feed+sidebar)
[HomeFooter]
```

Horizontal padding: `px-4 sm:px-8 md:px-[72px] lg:px-[144px]`  
Background: `bg-[#00101A]`

## Server-Side Data Fetching (SSR)

```ts
export default async function SunKudosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Parallel fetches — all independent
  const [
    highlightKudos,
    { data: feedItems, nextCursor },
    stats,
    spotlightNodes,
    totalKudosCount,
    departments,
    hashtags,
    categories,
    prizeRecipients,
    secretBoxes,
  ] = await Promise.all([
    getHighlightKudos({}),
    getKudosFeed({ cursor: null }),
    getKudosStats(user.id),
    getSpotlightData(),
    getKudosTotalCount(),
    getDepartments(),
    getHashtags(),
    getKudosCategories(),
    getRecentPrizeRecipients(10),
    getUserSecretBoxes(user.id),
  ])
  ...
}
```

## Client-Side State (in `KudosLiveBoardClient`)

```ts
// Filter state (shared between Highlight + All Kudos)
const [filters, setFilters] = useState<FilterState>({
  hashtag_ids: [],
  department_id: null,
})

// Dialog state
const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
const [secretBoxDialogOpen, setSecretBoxDialogOpen] = useState(false)

// Toast state
const [toast, setToast] = useState<string | null>(null)
```

## Files to Create/Modify

```
app/sun-kudos/
  page.tsx                    -- Server component (auth + SSR data fetch)
  
components/sun-kudos/
  kudos-live-board-client.tsx -- Client shell (filter state + dialog state)
```

## Filter Re-fetch Strategy
When filters change (user selects hashtag/dept):
- Highlight section: re-fetches via `useEffect → getHighlightKudos(filters)` (client-side)
- All Kudos feed: resets cursor to null, re-fetches feed with new filters
- Both sections subscribe to same `filters` state from `KudosLiveBoardClient`

## `next.config.ts` Update
Add Supabase storage domain for image optimization:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }
  ]
}
```

## `package.json` Update
Add D3:
```bash
npm install d3
npm install --save-dev @types/d3
```

## Implementation Steps
1. Update `next.config.ts` — add Supabase image remote pattern
2. Install `d3` + `@types/d3`
3. Create `kudos-live-board-client.tsx` — client shell with all state
4. Replace `app/sun-kudos/page.tsx`:
   - Auth check + redirect
   - Parallel `Promise.all` data fetch
   - Pass all data as props to `KudosLiveBoardClient`
5. Wire filter state → `KudosHighlightSection` + `KudosFeed`
6. Wire dialog triggers: A.1 click → submit dialog, "Mở quà" → secret box dialog
7. Wire toast state → `KudosToast` at page level
8. Test full page render: no hydration errors, data loads correctly

## Accessibility
- Page `<main>` has `aria-label="Sun* Kudos Live Board"`
- All interactive elements have `aria-label` or visible text
- Focus management: dialog opens → focus trapped; dialog closes → focus returns to trigger

## Success Criteria
- [ ] `/sun-kudos` redirects to `/login` when unauthenticated
- [ ] Page loads with all sections visible: banner, input, highlight, spotlight, all-kudos
- [ ] All SSR data populates correctly (no "undefined" or empty sections when DB has data)
- [ ] Filter change re-fetches both highlight + all kudos
- [ ] Hashtag click from card sets filter and re-fetches
- [ ] Submit dialog opens from A.1, new kudos appears after submit
- [ ] Secret box dialog opens from sidebar "Mở quà"
- [ ] Toast appears globally for: copy link, kudos submitted
- [ ] No TypeScript or build errors (`npm run build` passes)
- [ ] No hydration mismatches (SSR matches client render)

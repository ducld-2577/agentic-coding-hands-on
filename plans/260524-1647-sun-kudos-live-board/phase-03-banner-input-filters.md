# Phase 03 — KV Banner + Input + Filter Components

**Status:** ✅ DONE | **Priority:** P1 | **Requires:** Phase 02

## Context Links
- MoMorph refs: Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- Clarifications: [clarifications.md](./clarifications.md)
- Figma nodes: A (2940:13437), A.1 (2940:13449), B.1 (2940:13452), B.1.1 (2940:13459), B.1.2 (2940:13460)

## Design Specs

### A — KV Banner (readonly)
- Background: `#00101A` (page bg)
- Title: "Hệ thống ghi nhận và cảm ơn" — Montserrat, bold, gold/yellow `#F5C842`
- Logo: Sun* S icon (red) + "KUDOS" text (cream/beige `#E8DCC8`, large)
- Asset: `/public/kudos/kudos-logo.png` already exists
- Height: 160px, horizontal padding: 144px (lg), full width

### A.1 — Submit Input (pill, 738×72px)
- Pill shape: `border-radius: 36px`
- Background: dark card `rgba(255,255,255,0.08)` or similar
- Left icon: pencil/edit icon (Lucide `PenLine`)
- Placeholder: `Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?` (truncated)
- On click → opens `KudosSubmitDialog`
- Read-only input (clicking anywhere opens dialog)

### B.1.1 — Hashtag Filter Button (136×56px)
- Icon + text: hashtag icon + "Hashtag"
- Style: dark pill button, border `rgba(255,255,255,0.2)`
- Active state: yellow border `#F5C842`, filled icon
- Click → toggles `KudosHashtagDropdown`
- Dropdown: dark panel, multi-select max 5, checkmarks (yellow ✓)
- Header: "+ Hashtag · Tối đa 5"
- Items from DB: `getHashtags()`

### B.1.2 — Phòng ban Filter Button (158×56px)
- Icon + text: building icon + "Phòng ban"
- Style: same as hashtag button
- Active state: yellow border `#F5C842`
- Click → toggles `KudosPhongbanDropdown`
- Dropdown: dark panel, single-select, yellow border on panel
- Items from DB: `getDepartments()`

### Filter State
- Global filter state: `{ hashtag_ids: number[], department_id: number | null }`
- Passed down to Highlight Carousel and All Kudos feed
- Clicking a hashtag tag in any card → sets hashtag filter

## Files to Create

```
components/sun-kudos/
  kudos-kv-banner.tsx           -- Hero section (A)
  kudos-submit-input.tsx        -- Pill input (A.1)
  kudos-filter-buttons.tsx      -- Container for both filters
  kudos-hashtag-dropdown.tsx    -- Multi-select hashtag dropdown
  kudos-phongban-dropdown.tsx   -- Single-select dept dropdown
```

## Implementation Steps

1. **`kudos-kv-banner.tsx`** — `'use client'` not needed (static)
   - Use `next/image` for kudos-logo.png
   - Title text above logo, full-width dark section, 160px height

2. **`kudos-submit-input.tsx`** — `'use client'`
   - Pill div styled as input, `cursor-pointer`, `onClick → onOpen()`
   - Accept `onOpen: () => void` prop

3. **`kudos-hashtag-dropdown.tsx`** — `'use client'`
   - Props: `hashtags: KudosHashtag[], selected: number[], onChange: (ids: number[]) => void, onClose: () => void`
   - Absolute positioned dropdown panel (z-50)
   - Toggle selection, max 5 enforcement with visual indicator
   - Click outside → close

4. **`kudos-phongban-dropdown.tsx`** — `'use client'`
   - Props: `departments: Department[], selected: number | null, onChange: (id: number | null) => void, onClose: () => void`
   - Single select, click same → deselect
   - Yellow left border on selected item

5. **`kudos-filter-buttons.tsx`** — `'use client'`
   - Combines both filter buttons + dropdown state
   - Props: `hashtags, departments, filters, onFiltersChange`
   - Manages open/close state for each dropdown

## Key Design Tokens
```
bg-page:       #00101A
bg-card-dark:  rgba(255,255,255,0.06)
border-subtle: rgba(255,255,255,0.12)
border-active: #F5C842
text-gold:     #F5C842
text-muted:    rgba(255,255,255,0.5)
pill-radius:   9999px
```

## Success Criteria
- [ ] KV banner renders logo + title correctly, matches Figma proportions
- [ ] Pill input shows placeholder, opens dialog on click
- [ ] Hashtag dropdown opens, multi-selects up to 5, shows checkmarks
- [ ] Phòng ban dropdown opens, single-selects with highlight
- [ ] Active filter state reflected on button (yellow border)
- [ ] Click outside closes dropdown
- [ ] TypeScript compiles clean

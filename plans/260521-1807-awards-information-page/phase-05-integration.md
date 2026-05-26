# Phase 05 – Integration & Verification (Track A+B)

**Priority:** Final phase — requires all other phases complete  
**Status:** ✅ Complete  
**Depends on:** phase-01, phase-02, phase-03, phase-04

## Overview

Wire AWARD_DETAILS into UI components, verify home page anchor links work, run full test suite.

## Integration checklist

### Data wiring
- [ ] `AwardsSystemSection` imports `AWARD_DETAILS` and passes each item to `AwardsAwardBlock`
- [ ] `AwardsNavMenu` imports `AWARD_DETAILS` for the 6 menu labels
- [ ] `AwardsAwardBlock` uses `award.detailImageSrc`, `award.count`, `award.unit`, `award.value`, `award.valueSuffix`, `award.descriptionLong`
- [ ] Signature 2025 block renders two value rows: cá nhân + tập thể (conditional on `award.valueAlt`)

### Image verification
- [ ] Keyvisual `/public/awards-information/keyvisual-bg.png` displays at full width, cover-center
- [ ] Each award card image `/public/awards-information/<slug>.png` renders at 336×336px
- [ ] No broken image `<img>` — check browser console for 404s
- [ ] `next/image` `sizes` props set correctly for each image

### Home page anchor link verification
- [ ] Click each `HomeAwardCard` on `/home` → navigates to `/awards-information#<slug>`
- [ ] On arrival, the correct section is scrolled into view and menu item is active
- [ ] Slugs in `AWARD_DETAILS` exactly match slugs in `AWARD_CATEGORIES` (same source)

### Sun* Kudos
- [ ] "Chi tiết" button links to `/sun-kudos`
- [ ] Button hover effect renders correctly

### Spec data accuracy cross-check
| Award | count | unit | value | Verified |
|-------|-------|------|-------|---------|
| Top Talent | 10 | Cá nhân | 7.000.000 VNĐ | ⬜ |
| Top Project | 02 | Tập thể | 15.000.000 VNĐ | ⬜ |
| Top Project Leader | 03 | Cá nhân | 7.000.000 VNĐ | ⬜ |
| Best Manager | 01 | Cá nhân | 10.000.000 VNĐ | ⬜ |
| Signature 2025 | 01 | Cá nhân hoặc tập thể | 5tr / 8tr VNĐ | ⬜ |
| MVP | 01 | — | 15.000.000 VNĐ | ⬜ |

### Accessibility
- [ ] Keyvisual `alt="Keyvisual Sun* Annual Award 2025"` (per spec)
- [ ] Award images have meaningful `alt` texts
- [ ] Nav items have `aria-current` on active item
- [ ] Footer copyright text: "Bản quyền thuộc về Sun* © 2025"

## Test cases coverage

| TC | Description | Done |
|----|-------------|------|
| ID-0 | Auth user accesses `/awards-information` | ⬜ |
| ID-1 | Unauth → redirect `/login` | ⬜ |
| ID-2 | Nav from main menu | ⬜ |
| ID-3 | Overall layout structure | ⬜ |
| ID-4 | Title section display | ⬜ |
| ID-5 | Menu shows 6 items in correct order | ⬜ |
| ID-6 | All 6 award blocks with correct data | ⬜ |
| ID-7 | Award images 336×336px | ⬜ |
| ID-8 | Sun* Kudos banner display | ⬜ |
| ID-9 | Click menu → scroll + active state | ⬜ |
| ID-10 | Hover menu → highlight | ⬜ |
| ID-11 | Active state changes on click | ⬜ |
| ID-12 | "Chi tiết" → Sun* Kudos page | ⬜ |
| ID-13 | Invalid section → no JS error | ⬜ |
| ID-14 | Failed navigation → graceful error | ⬜ |

## Commands

```bash
npx tsc --noEmit          # typecheck
npm run lint              # lint
npm run test              # unit tests
npm run dev               # visual verification at localhost:3000/awards-information
```

## Todo

- [ ] Wire data into all UI components
- [ ] Visual check in browser — compare against design screenshot
- [ ] Fix any pixel-perfect discrepancies (spacing, font sizes, colors)
- [ ] Run typecheck + lint + tests
- [ ] All 15 test cases verified

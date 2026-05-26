# Phase 05 — Spotlight Board (D3 Word Scatter)

**Status:** ✅ DONE | **Priority:** P1 | **Requires:** Phase 02

## Context Links
- MoMorph refs: Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- Clarifications: [clarifications.md](./clarifications.md)
- Figma nodes: B.6 (2940:13476), B.7 (2940:14174), B.7.1 (3007:17482), B.7.2 (3007:17479), B.7.3 (2940:14833)

## Design Specs

### B.6 — Spotlight Header (same structure as Highlight header)
- Subtitle: "Sun* Annual Awards 2025" (small, muted)
- Title: "SPOTLIGHT BOARD" (large, bold white, 64px)
- Horizontal rule below subtitle

### B.7 — Spotlight Board (1157×548px canvas)
- Dark background section with decorative overlay images
- Canvas-like area: names scattered across it (word cloud)
- Header row inside board:
  - Left: search input (B.7.3) — 219×39px, placeholder "Tìm kiếm", search icon
  - Center: "388 KUDOS" (or actual count) — large bold gold text
  - Right: Pan/Zoom toggle icon (B.7.2) — 30×30px icon button
- Names rendered at various positions, sizes proportional to kudos_count
- Hover over name node → tooltip: `{name} • nhận {kudos_count} Kudos lần cuối {time}`
- Click node → navigate to `/sun-kudos?receiver={id}`
- Pan: drag to move canvas
- Zoom: scroll or toggle mode
- Loading state: spinner
- Empty state: "Chưa có dữ liệu"

## D3 Implementation Plan

### Package
```bash
npm install d3 @types/d3
```

### Data Shape
```ts
interface SpotlightNode {
  id: string
  name: string
  avatar_url: string
  kudos_count: number
  last_received_at: string
}
```

### Rendering Strategy
- Use `d3-force` simulation with `forceCollide` + `forceManyBody` to scatter nodes
- Each node = `<text>` element, `font-size` proportional to `kudos_count` (min 10px, max 28px)
- Color: white with varying opacity based on kudos_count
- Container: `<svg>` with `viewBox`, wrapped in `<div>` with `overflow-hidden`
- Pan: `d3.drag()` on SVG group `<g>`
- Zoom: `d3.zoom()` on SVG element
- Pan/Zoom toggle button switches between pan mode and zoom mode

### Force Layout
```ts
const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-30))
  .force('collide', d3.forceCollide(d => fontSize(d.kudos_count) * 3))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('x', d3.forceX(width / 2).strength(0.05))
  .force('y', d3.forceY(height / 2).strength(0.05))
```

### Search Filter
- Input filters visible nodes by name (case-insensitive)
- Non-matching nodes fade out (`opacity-20`), matching stay full opacity
- Debounce 300ms

## Files to Create

```
components/sun-kudos/
  kudos-spotlight-section.tsx  -- B.6 header + B.7 board wrapper
  kudos-spotlight-board.tsx    -- D3 canvas component ('use client')
  kudos-spotlight-tooltip.tsx  -- Hover tooltip overlay
```

## Component Interface

```ts
// kudos-spotlight-board.tsx
interface KudosSpotlightBoardProps {
  nodes: SpotlightNode[]
  totalKudosCount: number   // "388 KUDOS" label
}
```

## States
- `loading`: `simulation.alpha() > 0` — show spinner over canvas
- `empty`: `nodes.length === 0` — show "Chưa có dữ liệu"
- `interactive`: nodes rendered, pan/zoom enabled

## Implementation Steps
1. Install `d3` + `@types/d3` via npm
2. `kudos-spotlight-tooltip.tsx` — absolute positioned tooltip div
3. `kudos-spotlight-board.tsx`:
   - `useRef` for SVG + simulation
   - `useEffect` for D3 setup (init simulation, render nodes, attach pan/zoom)
   - `useState` for tooltip `{ node, x, y }` + `searchQuery` + `panZoomMode`
   - Cleanup simulation on unmount
4. `kudos-spotlight-section.tsx` — header + board layout

## Key Constraints
- Must be `'use client'` (D3 requires DOM)
- SVG must resize responsively — use `ResizeObserver`
- D3 import: `import * as d3 from 'd3'` (tree-shakeable in Next.js)
- Simulation should run `alphaDecay(0.05)` for smooth settling

## Success Criteria
- [ ] `d3` installs and TypeScript types resolve
- [ ] Names scatter across canvas with varied sizes (proportional to kudos_count)
- [ ] Pan works (drag SVG group)
- [ ] Zoom works (scroll to zoom in/out)
- [ ] Pan/Zoom toggle button switches between modes
- [ ] Hover shows tooltip with name + kudos count + last received time
- [ ] Click node navigates to filtered All Kudos view for that receiver
- [ ] Search input filters nodes visually (fades non-matching)
- [ ] Total kudos count displays correctly ("388 KUDOS" or actual DB count)
- [ ] Loading + empty states render correctly
- [ ] No memory leaks (simulation cleaned up on unmount)

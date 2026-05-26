# Phase 07 — Dialogs: Submit Kudos + Secret Box

**Status:** ✅ DONE | **Priority:** P2 | **Requires:** Phase 02, Phase 03

## Context Links
- MoMorph refs: Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- Clarifications: [clarifications.md](./clarifications.md)
- Figma nodes: A.1 (2940:13449), D.1.8 linkedFrameId 1466:7676

## Dialog 1 — Submit Kudos (A.1)

### Trigger
Clicking the pill input (A.1) → opens modal overlay

### Design
- Modal: dark overlay `rgba(0,0,0,0.7)`, centered card
- Card: `#0D1F2D` dark bg, rounded-2xl, padding 32px, max-width 600px
- Header: "Gửi lời cảm ơn" + X close button
- Body (form fields):

#### Field: Receiver (required)
- Search input with autocomplete — type name, dropdown shows matching profiles
- Shows: avatar + name + dept
- Select one profile as receiver

#### Field: Category (required)
- Dropdown: "IDOL GIỚI TRẺ", "TOP TALENT", etc.
- Style: dark select, label "Danh mục"

#### Field: Content (required)
- Textarea, placeholder matches A.1 pill: "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?"
- Min 1 char, no explicit maxLength in spec — apply 1000 char limit
- Character counter

#### Field: Hashtags (optional)
- Same multi-select UI as B.1.1 Hashtag filter, max 5

#### Field: Images (optional)
- File input, max 5 images, show previews
- Upload to Supabase Storage (bucket: `kudos-images`)
- Show thumbnail previews, remove button

#### Submit Button
- "Gửi lời cảm ơn" — gold bg `#F5C842`, text dark
- Disabled when: content empty OR receiver not selected
- Loading state during submission

### Validation
- Required: receiver, content, category
- Submit blocked if any required field empty (spec A.1: "submission is blocked; submit button disabled")
- On success: close dialog, prepend new kudos to feed (optimistic), show toast "Kudos đã được gửi!"
- On error: show inline error message

### Image Upload Flow
```
File selected → validate (type: image/*, max 5MB each)
→ upload to supabase.storage.from('kudos-images').upload(path, file)
→ get public URL → add to image_urls[]
→ on submit → pass image_urls to submitKudos()
```

---

## Dialog 2 — Secret Box (D.1.8)

### Trigger
"Mở quà" button in sidebar → opens modal

### Design
- Same modal overlay style
- Shows list of user's unopened secret boxes
- Each box: gift icon + "Secret Box #N" + "Mở" button
- Click "Mở" → animate reveal → show `prize_description`
- After opening: shows prize text, button changes to "Đã mở"
- If no unopened boxes: "Bạn chưa có Secret Box nào chưa mở"

### Animation
- Simple CSS keyframe: box shakes → reveals prize text with fade-in
- No external animation library

---

## Files to Create

```
components/sun-kudos/
  kudos-submit-dialog.tsx      -- Full kudos submission form modal
  kudos-receiver-search.tsx    -- Autocomplete receiver search input
  kudos-secret-box-dialog.tsx  -- Secret box opening modal
  kudos-toast.tsx              -- Toast notification (shared, reused in Phase 04)
```

## Component Interfaces

```ts
// kudos-submit-dialog.tsx
interface KudosSubmitDialogProps {
  open: boolean
  onClose: () => void
  categories: KudosCategory[]
  hashtags: KudosHashtag[]
  currentUserId: string
  onSuccess: (newKudos: KudosFeedItem) => void
}

// kudos-secret-box-dialog.tsx
interface KudosSecretBoxDialogProps {
  open: boolean
  onClose: () => void
  secretBoxes: SecretBox[]
  onOpen: (boxId: string) => Promise<{ prize_description: string }>
}

// kudos-toast.tsx
interface KudosToastProps {
  message: string
  duration?: number   // default 3000ms
  onDismiss: () => void
}
```

## Shared Dialog Behavior
- Click backdrop → close dialog
- ESC key → close dialog
- Focus trap inside modal while open
- `aria-modal="true"`, `role="dialog"` for accessibility

## Implementation Steps
1. `kudos-toast.tsx` — pill toast, bottom-right, auto-dismiss, slide-in animation
2. `kudos-receiver-search.tsx` — debounced search against profiles, dropdown list
3. `kudos-submit-dialog.tsx` — form with all fields, validation, submit action
4. `kudos-secret-box-dialog.tsx` — box list, open animation, prize reveal

## Supabase Storage
- Bucket name: `kudos-images` (create in migration or manually)
- Policy: authenticated users can upload; public read
- Path pattern: `kudos/{kudos_id}/{filename}`
- If storage not set up → skip images, only text kudos

## Success Criteria
- [ ] Submit dialog opens on A.1 click
- [ ] Receiver search autocompletes from profiles
- [ ] Submit blocked when required fields empty
- [ ] On success: dialog closes, new card appears at top of feed, toast shown
- [ ] Image upload previews correctly, max 5 enforced
- [ ] Secret Box dialog opens from "Mở quà"
- [ ] Opening box shows prize description with animation
- [ ] ESC and backdrop click close both dialogs
- [ ] Toast "Link copied — ready to share!" appears on copy link (used from Phase 04)

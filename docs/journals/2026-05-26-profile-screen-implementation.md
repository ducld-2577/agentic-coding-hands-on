# Profile Screen Implementation — Flying Blind Without Specs

**Date**: 2026-05-26 15:30
**Severity**: Medium
**Component**: Profile page & kudos feed
**Status**: Resolved

## What Happened

Implemented the entire "Profile bản thân" screen from MoMorph without a single valid spec row. All 28 rows in the specs CSV were null — `null`, `null`, `null` across every column. The design image was our only source of truth.

## The Brutal Truth

This was deeply unsettling. For a 4-component screen with multiple features (avatar, stats, kudos feed, filters, dialog), having zero written requirements meant any misinterpretation could go unnoticed until user testing. We built something that *looks* like what's in Figma, but is it actually what the product team intended? No way to know. That ambiguity still bothers me.

The spam badge (D.3.1 in the design) had no context whatsoever. Was it a future feature? A current but unmocked feature? We implemented it as "future-ready" — optional field, renders if present — but we guessed the entire interaction pattern.

## Technical Details

- Badge icons B2-B7: implemented as 6 static gray circles (no dynamic data)
- Spam badge: added optional `status?` field to `KudosFeedItem` type, renders conditionally
- Filter toggle: outside-click dismiss required post-review fix
- Revalidation: missing `revalidatePath('/profile')` in like/unlike actions — caught and fixed during review

All 28 specs rows: `null`
All required decisions: extracted from Figma image interpretation

## What We Tried

1. **Deep-read the specs CSV**: Every row was null. No fallback content.
2. **Scanned test cases**: Test cases CSV had values but were generic placeholders, not screen-specific.
3. **Relied solely on Figma design**: Extracted layout, text, icon count, positioning from the image.
4. **Implemented defensively**: Made badge status optional, added comments flagging future work.

## Root Cause Analysis

Someone exported a "draft" specs sheet that was never filled in. This wasn't a format issue or parsing problem — the sheet was simply never written. The project workflow assumes specs exist before implementation. They didn't here.

The assumption that "if it's in the design, we should implement it exactly" worked, but it was an assumption, not a requirement. We could have built 10 different interpretations and each would technically match the image.

## Lessons Learned

1. **Null specs are a blocker masquerading as completion**: Next time, escalate immediately rather than proceeding with pure design interpretation. Ask: "Is this actually in scope, or is the product team still deciding?"

2. **Future-ready code needs explicit owner**: We made the spam badge optional with a comment. But who decides when it becomes required? Who owns the DB migration? Document this clearly in the ticket.

3. **Reviewer role saved us twice**: Outside-click dismiss was missing and would break the UX. Revalidation was missing and would cause stale data. Code review caught both before they shipped.

4. **Static placeholder data should have a sunset date**: The 6 badge icons are hardcoded circles. This works for MVP, but needs a ticket with explicit criteria for replacement.

## Next Steps

1. **Confirm with product team**: Are the 28 null specs intentional? If so, why? If not, write them now.
2. **Owner assignment for spam badge**: Assign responsible person + estimated timeline to implement the DB column and full feature.
3. **Badge icon ticket**: Create follow-up to replace static placeholders with actual dynamic badge system.
4. **Revalidation audit**: Check all server actions across the app for missing revalidation calls.

**Commit**: `3905804 feat(profile): implement profile screen with hero, stats, and kudos feed`

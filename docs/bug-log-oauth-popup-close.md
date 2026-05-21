# OAuth Popup Does Not Close After Successful Google Login

**Date**: 2026-05-21 09:30
**Severity**: High
**Component**: Authentication / OAuth callback flow
**Status**: Resolved

## What Happened

After a user completed Google OAuth authentication in a popup window, the popup did not close. Instead, it navigated itself to `/home` and remained open. Meanwhile, the main login page window stayed on the login screen, unaware that authentication had succeeded.

This broke the entire OAuth flow: users completed authentication but saw no visual indication of success and had to manually close the popup window.

## The Brutal Truth

This bug is frustrating because it's a perfect storm of three separate mistakes layering on top of each other, each invisible in isolation. The synchronous race condition with BroadcastChannel made the message unreliable. The silent browser blocking of `window.close()` after cross-origin COOP went unnoticed. And then we invented a terrible fallback that made the bug visible but in the worst possible way.

What's particularly maddening is that the middleware file was just... not running at all. It was silently ignored by Next.js for 6 commits because the filename was wrong. A perfectly valid authentication middleware that nobody knew was dead code.

The real kick in the teeth: all of this was preventable with one simple rule: **never call `window.close()` synchronously after posting a message**. We should have known that. We didn't test it.

## Technical Details

### Error Signature

**Behavior in popup:**
```
[✓] Google OAuth completes
[✓] redirect_uri receives auth code
[✓] /api/auth/callback succeeds, returns session token
[✗] BroadcastChannel.postMessage() sends token to main window
[✗] channel.close() executes immediately
[✗] window.close() executes immediately
[✗] Popup JS execution context dies before message is dispatched
[✗] Popup navigates to /home (fallback setTimeout fires)
```

**Behavior in main window:**
```
[✗] BroadcastChannel listener never receives message (already dead)
[✗] User still sees login form
```

### Root Cause Chain

1. **Synchronous race in `close/page.tsx`:**
   ```typescript
   // BAD: channel.close() + window.close() run synchronously
   // BroadcastChannel.postMessage() is ASYNC but execution continues
   channel.postMessage({ token: data.token });
   channel.close();  // ← Closes context before message dispatches
   window.close();
   ```
   `BroadcastChannel.postMessage()` schedules message delivery for the next microtask, but `channel.close()` immediately terminates the channel. The message never gets queued.

2. **Cross-Origin-Opener-Policy (COOP) blocks `window.close()`:**
   ```
   Google OAuth response headers: Cross-Origin-Opener-Policy: same-origin
   ```
   When the popup navigates to `https://accounts.google.com`, COOP severs the browsing context group. After this, `window.close()` in the popup is silently ignored by the browser. Only the opening window can close a popup after COOP is triggered.

3. **Fallback router navigation masked the real problem:**
   ```typescript
   // This fired because window.close() failed silently
   setTimeout(() => router.replace('/home'), 300);
   ```
   This made the bug visible but in the worst way: the popup appeared to "successfully" navigate to `/home` instead of closing. This made it look like the flow was working (incorrectly).

4. **Middleware file was completely dead:**
   ```typescript
   // proxy.ts — sitting in root, never executed by Next.js
   // Next.js only recognizes: middleware.ts or middleware.js
   ```
   The authentication redirect logic for protecting routes was in `proxy.ts`, which Next.js silently ignored. This wasn't the root cause of the popup issue, but it meant the entire OAuth redirect handling was a no-op.

## What We Tried

1. **Added `useRouter` to the popup and called `router.replace('/home')`** — Symptom went away (popup navigated), but the main window still had no token. Root cause: BroadcastChannel message never arrived because the channel was closed.

2. **Added retry logic in BroadcastChannel listener** — Didn't help; the message was never sent in the first place.

3. **Increased `setTimeout` delay before `window.close()`** — Gave the message more time, but didn't fix the core race condition. Eventually worked once delays got large enough, but was fragile.

4. **Added error logging to `window.close()`** — Revealed nothing because `window.close()` fails silently in popup contexts after COOP activation.

## Root Cause Analysis

**Primary:** Synchronous execution of `channel.close()` immediately after `postMessage()` terminated the BroadcastChannel before the message was dispatched. This is a fundamental misunderstanding of async message delivery.

**Secondary:** After cross-origin navigation, COOP prevents the popup from closing itself. The browser silently blocks `window.close()`. The solution is to have the main window close the popup, not the popup close itself.

**Tertiary:** The fallback `router.replace('/home')` was added as a safety net but became a trap — it masked the real failure mode and made the bug harder to diagnose.

**Quaternary:** The middleware file was named `proxy.ts` instead of `middleware.ts`. Next.js has zero logging or error message for unrecognized middleware files. It just silently skips them. This is a Next.js design flaw, but we should have caught it during initial setup.

## Lessons Learned

1. **Never call `channel.close()` or `window.close()` synchronously after `postMessage()`.**
   - Messages are delivered asynchronously
   - The receiver needs the context to still exist to dispatch the message
   - Solution: Delay `channel.close()` by at least 100-200ms, or better yet, have the receiving window close the channel when done

2. **Cross-Origin-Opener-Policy is incompatible with popup-self-closing patterns.**
   - After OAuth redirects to a different origin, `window.close()` from the popup is always blocked
   - Modern auth flows should have the main window close the popup via `popup.close()` after receiving the token
   - The popup should display a persistent "You can close this window" message, not rely on JavaScript to close itself

3. **Next.js middleware files must be named `middleware.ts` or `middleware.js` — there are no alternatives.**
   - No warnings, no errors, no logs if the file is named something else
   - A dev can create perfectly valid middleware-shaped code and it runs nowhere
   - Always double-check the filename against the Next.js docs, even if the code looks correct

4. **Test OAuth flows in a real browser, not just unit tests.**
   - COOP, CORP, message delivery timing — these are browser-level behaviors that unit tests cannot replicate
   - Popup closing, BroadcastChannel delivery, cross-origin restrictions are all runtime browser semantics
   - Integration tests or manual testing in Chrome/Firefox are non-negotiable for OAuth

5. **Don't add fallbacks that mask the real failure.**
   - The `router.replace('/home')` fallback made the popup navigate instead of closing, which looked like partial success
   - A better fallback is: show an error message or a "manual close" message, not silent navigation
   - Fallbacks should fail loud if possible, not fail quiet and move on

## Next Steps

### Immediate (Done)
- [x] Delay `channel.close()` and `window.close()` by 200ms in `close/page.tsx`
- [x] Remove fallback `router.replace('/home')`
- [x] Remove unused `useRouter` import from popup
- [x] Add success message: "Đăng nhập thành công. Bạn có thể đóng cửa sổ này."
- [x] Add 5-minute timeout cleanup for BroadcastChannel in `login-interactive.tsx`
- [x] Rename `proxy.ts` to `middleware.ts` and ensure Next.js executes it

### Follow-up (Future Work)
- Consider re-architecting so the main window calls `popup.close()` instead of relying on the popup to close itself
- Add integration tests for OAuth popup flow in Playwright or Cypress
- Document the OAuth flow (popup vs window.open behavior, COOP implications) in project docs
- Add monitoring/logging to detect if BroadcastChannel messages are being dropped in production

### Owner
- Backend/auth: Team lead
- Testing: QA / test automation

### Timeline
- Testing fix: Complete by 2026-05-22
- Full re-architecture: Plan for next sprint

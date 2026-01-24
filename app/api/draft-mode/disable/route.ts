/**
 * Draft Mode Disable API Route
 * ============================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This API route disables "Draft Mode" in Next.js, returning the user
 * to the normal published content view.
 *
 * When this endpoint is called, it clears the draft mode cookie,
 * so subsequent requests fetch published content instead of drafts.
 *
 * WHY IS THIS NEEDED?
 * -------------------
 * When content editors are done previewing, they need a way to:
 *   1. Exit the preview mode
 *   2. See what the actual published site looks like
 *   3. Clear the draft mode state from their browser
 *
 * Without this, the editor would need to manually clear cookies
 * or use an incognito window to see the published version.
 *
 * THE FLOW:
 * ---------
 * 1. Editor is viewing the site in draft mode (cookie set)
 * 2. Editor clicks "Exit Preview" button (DisableDraftMode component)
 * 3. That component calls this /api/draft-mode/disable endpoint
 * 4. This route clears the __prerender_bypass cookie
 * 5. Redirects to the homepage
 * 6. Subsequent requests show published content only
 *
 * PSEUDOCODE:
 * -----------
 * function handleDisableDraftMode():
 *   // Access the draft mode API from Next.js
 *   draft = await draftMode()
 *
 *   // Clear the draft mode cookie
 *   draft.disable()
 *
 *   // Determine where to redirect
 *   baseUrl = process.env.NEXT_PUBLIC_BASE_URL or 'http://localhost:3000'
 *
 *   // Redirect to homepage (or could redirect to current page)
 *   return redirect(baseUrl + '/')
 *
 * THE COOKIE:
 * -----------
 * When draft mode is disabled:
 *   - The __prerender_bypass cookie is deleted
 *   - Next.js returns to normal caching behavior
 *   - sanityFetch requests published content only
 *
 * SECURITY NOTES:
 * ---------------
 * Unlike the enable endpoint, this doesn't require authentication.
 * Why? Because:
 *
 *   1. Disabling draft mode is always safe (just shows public content)
 *   2. There's no secret data being exposed
 *   3. Anyone can disable their own draft mode session
 *   4. The cookie is per-browser, so you can only disable your own
 *
 * USAGE:
 * ------
 * This endpoint is typically called by the DisableDraftMode component:
 *
 *   // components/sanity/DisableDraftMode.tsx
 *   <button onClick={() => {
 *     fetch('/api/draft-mode/disable')
 *       .then(() => router.refresh())
 *   }}>
 *     Exit Preview
 *   </button>
 *
 * Or via the server action in app/actions/draft.ts for better UX.
 *
 * REDIRECT BEHAVIOR:
 * ------------------
 * After disabling, we redirect to the homepage. This is because:
 *
 *   1. The current page content needs to be refetched without drafts
 *   2. A redirect forces a fresh request
 *   3. The homepage is a safe default that always exists
 *
 * Alternative: You could redirect back to the current page using
 * the Referer header, but that adds complexity.
 *
 * ENVIRONMENT VARIABLES:
 * ----------------------
 * NEXT_PUBLIC_BASE_URL: The base URL of your site
 *   - Production: https://yourdomain.com
 *   - Development: http://localhost:3000
 *   - Used to construct the full redirect URL
 *
 * If not set, defaults to http://localhost:3000 for local development.
 *
 * TROUBLESHOOTING:
 * ----------------
 * - Still seeing drafts after disable? Clear all cookies and try again
 * - Redirect going to wrong URL? Check NEXT_PUBLIC_BASE_URL
 * - Button not working? Check browser console for errors
 *
 * RELATED FILES:
 * --------------
 * - app/api/draft-mode/enable/route.ts: Enables draft mode
 * - app/actions/draft.ts: Server action alternative
 * - components/sanity/DisableDraftMode.tsx: UI button component
 * - app/layout.tsx: Conditionally shows disable button
 *
 * DOCUMENTATION:
 * --------------
 * - https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
 */

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET handler to disable draft mode
 *
 * This is a simple endpoint that:
 *   1. Clears the draft mode cookie
 *   2. Redirects to the homepage
 *
 * No authentication required since disabling draft mode
 * only affects the current browser session and doesn't
 * expose any protected content.
 */
export async function GET() {
  // Access the draft mode API
  // The await is needed because draftMode() returns a Promise in Next.js 15+
  const draft = await draftMode();

  // Disable draft mode (clears the __prerender_bypass cookie)
  draft.disable();

  // Construct the redirect URL
  // Use environment variable or fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Redirect to the homepage
  // NextResponse.redirect requires an absolute URL
  return NextResponse.redirect(new URL("/", baseUrl));
}

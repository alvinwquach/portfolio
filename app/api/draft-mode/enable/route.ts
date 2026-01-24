/**
 * Draft Mode Enable API Route
 * ===========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This API route enables "Draft Mode" in Next.js, allowing content
 * editors to preview unpublished changes from Sanity Studio.
 *
 * When this endpoint is called, it sets a special cookie that tells
 * Next.js to fetch draft content instead of published content.
 *
 * WHY IS DRAFT MODE NEEDED?
 * -------------------------
 * Normal flow (without draft mode):
 *   Editor writes content → Publishes → Site shows new content
 *
 * With draft mode:
 *   Editor writes content → Clicks "Preview" → Sees changes immediately
 *                         → Makes adjustments → Publishes when ready
 *
 * This is crucial for:
 *   - Content review before publishing
 *   - Catching typos and errors
 *   - Stakeholder approval workflows
 *   - Collaborative editing
 *
 * HOW IT WORKS:
 * -------------
 *
 * THE FLOW:
 * 1. Editor clicks "Preview" button in Sanity Studio
 * 2. Sanity Studio redirects to: /api/draft-mode/enable?...
 * 3. This route validates the request (security check)
 * 4. Sets a secure HTTP-only cookie (__prerender_bypass)
 * 5. Redirects to the preview URL
 * 6. All subsequent requests include the cookie
 * 7. Next.js sees the cookie and fetches draft content
 *
 * PSEUDOCODE:
 * -----------
 * function handleEnableDraftMode(request):
 *   // Extract secret from URL parameters
 *   secret = request.searchParams.get('secret')
 *
 *   // Validate the secret matches our token
 *   if not validateSecret(secret):
 *     return 401 Unauthorized
 *
 *   // Enable draft mode (sets the cookie)
 *   draftMode().enable()
 *
 *   // Get the URL to redirect to
 *   redirectUrl = request.searchParams.get('redirect') || '/'
 *
 *   // Redirect to the preview page
 *   return redirect(redirectUrl)
 *
 * SECURITY:
 * ---------
 * The defineEnableDraftMode function from next-sanity handles security:
 *
 * 1. Secret Validation: Verifies the request came from Sanity Studio
 *    using a cryptographic token
 *
 * 2. HTTP-Only Cookie: The bypass cookie can't be accessed by JavaScript,
 *    preventing XSS attacks from stealing it
 *
 * 3. Secure Cookie: In production, the cookie is only sent over HTTPS
 *
 * 4. Token Requirement: The Sanity client must have a valid viewer token
 *    to enable draft mode
 *
 * SANITY STUDIO CONFIGURATION:
 * ----------------------------
 * For this to work, Sanity Studio needs to know about this endpoint.
 * This is configured in sanity.config.ts:
 *
 *   presentationTool({
 *     previewUrl: {
 *       previewMode: {
 *         enable: '/api/draft-mode/enable',  // This file!
 *       },
 *     },
 *   }),
 *
 * THE COOKIE:
 * -----------
 * When draft mode is enabled, Next.js sets a cookie called
 * __prerender_bypass. This cookie:
 *
 *   - Is HTTP-only (not accessible to JavaScript)
 *   - Contains an encrypted value
 *   - Tells Next.js to bypass the cache
 *   - Causes sanityFetch to request draft content
 *
 * USAGE:
 * ------
 * You typically don't call this endpoint directly. Instead:
 *
 * 1. Editor opens Sanity Studio
 * 2. Clicks the "Preview" or "Open Preview" button
 * 3. Sanity automatically constructs the URL with secret
 * 4. Browser is redirected through this endpoint
 * 5. Editor sees the preview with draft content
 *
 * MANUAL TESTING:
 * ---------------
 * While developing, you can test by:
 *
 * 1. Get a preview URL from Sanity Studio's presentation tool
 * 2. Or construct: /api/draft-mode/enable?secret=YOUR_TOKEN
 * 3. Visit that URL in your browser
 * 4. Check that you're seeing draft content
 *
 * TROUBLESHOOTING:
 * ----------------
 * - 401 Error: Check SANITY_VIEWER_TOKEN in .env.local
 * - No draft content: Verify cookie is set (DevTools → Application → Cookies)
 * - Studio not showing preview: Check presentationTool config in sanity.config.ts
 *
 * RELATED FILES:
 * --------------
 * - app/api/draft-mode/disable/route.ts: Turns off draft mode
 * - sanity.config.ts: Studio configuration with preview URL
 * - sanity/lib/client.ts: Client with token configuration
 * - components/sanity/DisableDraftMode.tsx: UI to exit preview
 *
 * DOCUMENTATION:
 * --------------
 * - https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
 * - https://github.com/sanity-io/next-sanity#draft-mode
 */

import { client } from "@/sanity/lib/client";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

/**
 * Export the GET handler for enabling draft mode
 *
 * defineEnableDraftMode creates a handler that:
 *   1. Validates the request using the provided token
 *   2. Enables Next.js draft mode (sets the cookie)
 *   3. Redirects to the requested preview URL
 *
 * The client is configured with the viewer token, which allows
 * reading draft (unpublished) content from Sanity.
 */
export const { GET } = defineEnableDraftMode({
  // Client with authentication token for draft content access
  // withConfig creates a new client instance with the token added
  client: client.withConfig({
    // The viewer token allows reading drafts
    // This token should have "viewer" or "editor" permissions in Sanity
    token: process.env.SANITY_VIEWER_TOKEN,
  }),
});

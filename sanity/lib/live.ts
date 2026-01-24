/**
 * Sanity Live Content API
 * =======================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file sets up REAL-TIME content updates from Sanity.
 * When content changes in Sanity Studio, your site updates AUTOMATICALLY
 * without needing to redeploy or refresh the page.
 *
 * Think of it like a live connection to your CMS - content editors
 * see their changes reflected instantly on the site.
 *
 * WHY IS THIS IMPORTANT?
 * ----------------------
 * Traditional CMS workflow:
 *   1. Editor makes changes in CMS
 *   2. Trigger rebuild/revalidation
 *   3. Wait for deployment
 *   4. Changes appear (minutes later)
 *
 * With Sanity Live:
 *   1. Editor makes changes in CMS
 *   2. Changes appear immediately (seconds)
 *
 * This is especially powerful for:
 *   - Draft mode previews
 *   - Content review workflows
 *   - Fixing typos quickly
 *   - Live collaboration
 *
 * HOW IT WORKS UNDER THE HOOD:
 * ----------------------------
 *
 * PSEUDOCODE:
 * -----------
 * function defineLive(config):
 *   establish WebSocket connection to Sanity
 *   subscribe to document changes for this project/dataset
 *
 *   return {
 *     sanityFetch: async function(query, params):
 *       // Initial fetch
 *       result = await fetch query from Sanity API
 *
 *       // Set up listener for changes
 *       subscribe to changes matching this query
 *
 *       when document changes:
 *         re-fetch the query
 *         trigger React re-render with new data
 *
 *       return result
 *
 *     SanityLive: React component that:
 *       // Must be in your layout to enable live updates
 *       manages WebSocket connection lifecycle
 *       handles reconnection on disconnect
 *       broadcasts updates to all sanityFetch calls
 *   }
 *
 * THE DATA FLOW:
 * --------------
 *
 * ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 * │   Sanity     │────>│  WebSocket   │────>│   Your App   │
 * │   Studio     │     │  Connection  │     │  (SanityLive)│
 * │              │     │              │     │              │
 * │ Editor saves │     │ Push update  │     │ Re-render    │
 * │   content    │     │   message    │     │  component   │
 * └──────────────┘     └──────────────┘     └──────────────┘
 *
 * TOKENS EXPLAINED:
 * -----------------
 *
 * serverToken: Used during SSR (Server-Side Rendering)
 *   - Runs on your Next.js server
 *   - Safe because it never reaches the browser
 *   - Can access draft content
 *
 * browserToken: Used for client-side updates
 *   - Runs in the user's browser
 *   - Must be a "viewer" token (read-only)
 *   - Required for real-time WebSocket connection
 *   - Security: Viewer tokens can only READ, never write
 *
 * WHY SAME TOKEN FOR BOTH?
 * In this setup, we use the same viewer token for both server and browser.
 * This works because:
 *   1. Viewer tokens are read-only (safe to expose)
 *   2. They only access published content (or drafts if you're in draft mode)
 *   3. The token doesn't reveal sensitive project secrets
 *
 * For stricter security, you could:
 *   - Use a more powerful token on server
 *   - Use a restricted token on browser
 *   - Disable browser token entirely (no live updates for visitors)
 *
 * SETUP REQUIREMENTS:
 * -------------------
 *
 * 1. Add <SanityLive /> to your root layout:
 *
 *    // app/layout.tsx
 *    import { SanityLive } from '@/sanity/lib/live'
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html>
 *          <body>
 *            {children}
 *            <SanityLive />  // <-- Add this!
 *          </body>
 *        </html>
 *      )
 *    }
 *
 * 2. Use sanityFetch instead of client.fetch:
 *
 *    // Before (no live updates)
 *    import { client } from '@/sanity/lib/client'
 *    const data = await client.fetch(query)
 *
 *    // After (with live updates)
 *    import { sanityFetch } from '@/sanity/lib/live'
 *    const { data } = await sanityFetch({ query })
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // In a Server Component
 * import { sanityFetch } from '@/sanity/lib/live'
 *
 * async function ProjectList() {
 *   const { data: projects } = await sanityFetch({
 *     query: `*[_type == "project"] | order(publishedAt desc) {
 *       _id,
 *       title,
 *       slug,
 *       mainImage
 *     }`
 *   })
 *
 *   return (
 *     <ul>
 *       {projects.map(project => (
 *         <li key={project._id}>{project.title}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 *
 * // With parameters
 * const { data: project } = await sanityFetch({
 *   query: `*[_type == "project" && slug.current == $slug][0]`,
 *   params: { slug: 'my-project' }
 * })
 *
 * // With TypeScript typing
 * interface Project {
 *   _id: string
 *   title: string
 *   slug: { current: string }
 * }
 *
 * const { data } = await sanityFetch<Project[]>({
 *   query: `*[_type == "project"]`
 * })
 *
 * DRAFT MODE INTEGRATION:
 * -----------------------
 * When draft mode is enabled (via /api/draft-mode/enable), sanityFetch
 * automatically fetches draft content instead of published content.
 *
 * This means content editors can:
 *   1. Open preview link from Sanity Studio
 *   2. See their unpublished changes in real-time
 *   3. Edit content and see updates instantly
 *   4. Approve and publish when ready
 *
 * PERFORMANCE NOTES:
 * ------------------
 * - Initial page load still uses SSR (fast)
 * - WebSocket is lightweight (~100KB)
 * - Only queries with changes re-fetch (efficient)
 * - Works with Next.js caching strategies
 *
 * TROUBLESHOOTING:
 * ----------------
 * - No live updates? Check <SanityLive /> is in layout
 * - Auth errors? Verify SANITY_VIEWER_TOKEN in .env.local
 * - Console errors? Check browser network tab for WebSocket
 *
 * RELATED FILES:
 * --------------
 * - sanity/lib/client.ts: Base client configuration
 * - app/layout.tsx: Where <SanityLive /> should be added
 * - app/api/draft-mode/: Draft mode endpoints
 *
 * DOCUMENTATION:
 * --------------
 * https://github.com/sanity-io/next-sanity#live-content-api
 */

import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * Authentication token for Sanity API access
 *
 * This token enables:
 *   - Fetching published content
 *   - Fetching draft content (when in draft mode)
 *   - Real-time WebSocket subscriptions
 *
 * The token is a "viewer" token (read-only), so it's safe
 * to use on both server and client sides.
 */
const token = process.env.SANITY_VIEWER_TOKEN;

/**
 * Export the live content utilities
 *
 * sanityFetch: Use this instead of client.fetch() for queries
 *              that should update in real-time
 *
 * SanityLive:  React component that manages the WebSocket connection
 *              Must be included in your root layout for live updates to work
 */
export const { sanityFetch, SanityLive } = defineLive({
  // The base client with project configuration
  client,

  // Token for server-side rendering (SSR)
  // Used when the page first loads on the server
  serverToken: token,

  // Token for browser-side updates
  // Used for the WebSocket connection that receives live updates
  // This is a viewer token, so it's safe to expose to the browser
  browserToken: token,
});

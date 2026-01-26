/**
 * Sanity Client Configuration
 * ===========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file creates and exports the Sanity client - the connection between
 * your Next.js app and Sanity's Content Lake (their cloud database).
 *
 * Think of it like a database connection, but instead of connecting to
 * PostgreSQL or MongoDB, you're connecting to Sanity's API.
 *
 * WHY DO WE NEED A CLIENT?
 * ------------------------
 * Every time you want to:
 *   - Fetch content (GROQ queries)
 *   - Display images
 *   - Enable live preview
 *   - Use draft mode
 *
 * ...you need a configured client that knows:
 *   1. Which project to connect to (projectId)
 *   2. Which dataset to query (production, staging, etc.)
 *   3. What API version to use (for stability)
 *   4. Whether to use CDN caching
 *   5. Authentication tokens for protected content
 *
 * THE DATA FLOW:
 * --------------
 * 1. Your component calls a fetch function
 * 2. The fetch uses this client
 * 3. Client sends request to: https://{projectId}.api.sanity.io/...
 * 4. Sanity returns JSON data
 * 5. Your component renders the content
 *
 * PSEUDOCODE:
 * -----------
 * function createSanityClient(config):
 *   validate projectId exists
 *   validate dataset exists
 *   validate apiVersion format
 *
 *   return HttpClient configured with:
 *     - base URL: https://{projectId}.api.sanity.io/v{apiVersion}
 *     - headers: Authorization if token provided
 *     - CDN: edge caching if useCdn is true
 *     - Stega: invisible encoding for visual editing
 *
 * CONFIGURATION OPTIONS EXPLAINED:
 * --------------------------------
 *
 * projectId: Your unique Sanity project identifier
 *   - Found in sanity.io/manage
 *   - Example: "abc123xy"
 *
 * dataset: Which dataset to query
 *   - "production" = live content
 *   - "staging" = testing content
 *   - You can have multiple datasets per project
 *
 * apiVersion: Locks your queries to a specific API version
 *   - Format: YYYY-MM-DD (e.g., "2024-01-15")
 *   - WHY? Sanity evolves their API, but versioning ensures
 *     your queries won't break when they add new features
 *   - Use today's date when starting, then leave it alone
 *
 * useCdn: Whether to use Sanity's CDN (Content Delivery Network)
 *   - true = Faster, cached responses (good for production)
 *   - false = Fresh data every time (needed for previews/drafts)
 *   - CDN caches for ~60 seconds by default
 *
 * token: Authentication token for protected operations
 *   - SANITY_VIEWER_TOKEN = read-only access
 *   - SANITY_WRITE_TOKEN = read + write access
 *   - Never expose tokens in client-side code!
 *
 * stega: Steganography settings for visual editing
 *   - Encodes invisible metadata into strings
 *   - Allows Sanity Studio to "click to edit" any text
 *   - Only works when studioUrl is configured
 *
 * SECURITY NOTES:
 * ---------------
 * - Tokens should only be in environment variables
 * - NEXT_PUBLIC_* vars are exposed to browser - never put tokens there!
 * - This client runs on the server in Server Components
 * - For client-side fetching, use the sanityFetch from live.ts instead
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // In a Server Component
 * import { client } from '@/sanity/lib/client'
 *
 * async function getProjects() {
 *   return client.fetch(`*[_type == "project"]{ title, slug }`)
 * }
 *
 * // With parameters (prevents injection attacks)
 * async function getProjectBySlug(slug: string) {
 *   return client.fetch(
 *     `*[_type == "project" && slug.current == $slug][0]`,
 *     { slug }
 *   )
 * }
 *
 * // Fetching draft content (requires token)
 * const draftClient = client.withConfig({ perspective: 'previewDrafts' })
 *
 * RELATED FILES:
 * --------------
 * - sanity/env.ts: Environment variables
 * - sanity/lib/live.ts: Live preview client
 * - sanity/lib/image.ts: Image URL builder
 */

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * The main Sanity client instance
 *
 * This client is configured for production use with CDN caching enabled.
 * For draft/preview mode, use client.withConfig({ perspective: 'previewDrafts' })
 */
export const client = createClient({
  // Project identification
  projectId,  // Which Sanity project (from env.ts)
  dataset,    // Which dataset: production, staging, etc. (from env.ts)
  apiVersion, // API version for stability (from env.ts)

  // Performance: Use CDN for faster cached responses
  // Set to false if:
  //   - Statically generating pages (ISR)
  //   - Using tag-based revalidation
  //   - Need fresh data every request
  useCdn: true,

  // Authentication: Viewer token for read access
  // This allows fetching draft content in preview mode
  // The token is stored in .env.local (never committed to git)
  token: process.env.SANITY_VIEWER_TOKEN,

  // Visual Editing: Stega encoding configuration
  // Stega (steganography) invisibly encodes edit links into text
  // When you hover text in preview mode, Sanity shows "Edit in Studio" buttons
  stega: {
    // The URL where Sanity Studio is hosted
    // Used to generate correct edit links
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
})

/**
 * Client without CDN caching
 * Used for GraphQL resolvers to ensure fresh data
 */
export const clientWithoutCdn = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_VIEWER_TOKEN,
})

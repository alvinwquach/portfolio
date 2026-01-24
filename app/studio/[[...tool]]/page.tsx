/**
 * Sanity Studio Page
 * ==================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file mounts Sanity Studio as a page in your Next.js application.
 * When you visit /studio in your browser, this page renders the full
 * Sanity Studio content editing interface.
 *
 * THE FOLDER NAME EXPLAINED:
 * --------------------------
 * [[...tool]] is a "catch-all optional segment" in Next.js:
 *
 *   [ ]      = Single dynamic segment (e.g., [id] → /studio/123)
 *   [...]    = Catch-all segment (matches one or more: /studio/a/b/c)
 *   [[...]]  = Optional catch-all (matches zero or more segments)
 *
 * Why optional catch-all?
 *   - /studio → matches (0 segments)
 *   - /studio/desk → matches (1 segment)
 *   - /studio/vision/query → matches (2 segments)
 *
 * Sanity Studio has multiple "tools" (desk, vision, etc.) and each tool
 * can have its own sub-routes. The catch-all captures all of them.
 *
 * WHY 'use client'?
 * -----------------
 * Sanity Studio is a React application that needs:
 *   - Browser APIs (localStorage, WebSocket, etc.)
 *   - React state management
 *   - Real-time collaboration features
 *   - Interactive form inputs
 *
 * Server Components can't use these features, so we must mark this
 * as a Client Component with 'use client'.
 *
 * THE DATA FLOW:
 * --------------
 *
 * ┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
 * │   Browser       │────>│   Next.js        │────>│   This File     │
 * │   /studio       │     │   Router         │     │   page.tsx      │
 * └─────────────────┘     └──────────────────┘     └─────────────────┘
 *                                                         │
 *                                                         v
 *                                                  ┌──────────────────┐
 *                                                  │   NextStudio     │
 *                                                  │   Component      │
 *                                                  │   (from package) │
 *                                                  └──────────────────┘
 *                                                         │
 *                                                         v
 *                                                  ┌──────────────────┐
 *                                                  │   Sanity Studio  │
 *                                                  │   Full React App │
 *                                                  └──────────────────┘
 *
 * FORCE STATIC EXPLAINED:
 * -----------------------
 * export const dynamic = 'force-static'
 *
 * This tells Next.js to:
 *   - Pre-render this page at build time (not server-render per request)
 *   - Serve the same HTML to everyone
 *   - Better performance (no server processing per request)
 *
 * Since Studio is a client-side app that loads its own data,
 * the initial HTML can be static - the JavaScript takes over.
 *
 * ALTERNATIVES:
 *   - 'force-dynamic': Server-render on every request
 *   - 'auto': Let Next.js decide based on usage
 *
 * NEXTSTUDIO COMPONENT:
 * ---------------------
 * NextStudio from 'next-sanity/studio' is a wrapper that:
 *   - Sets up the correct viewport/meta tags
 *   - Handles styling isolation (Studio CSS doesn't leak)
 *   - Provides the configuration to Studio
 *   - Manages the Studio lifecycle
 *
 * CONFIG PROP:
 * ------------
 * The config comes from sanity.config.ts and includes:
 *   - Project ID and dataset
 *   - Schema definitions
 *   - Plugins (vision, presentation, etc.)
 *   - Custom structure
 *
 * ACCESSING THE STUDIO:
 * ---------------------
 * 1. Run your Next.js app: npm run dev
 * 2. Visit: http://localhost:3000/studio
 * 3. Log in with your Sanity account
 * 4. Start editing content!
 *
 * COMMON ISSUES:
 * --------------
 *
 * "401 Unauthorized":
 *   - Check NEXT_PUBLIC_SANITY_PROJECT_ID is correct
 *   - Verify you're logged into the right Sanity account
 *   - Ensure the project exists in sanity.io/manage
 *
 * "Schema not found":
 *   - Check sanity/schemaTypes/index.ts exports all schemas
 *   - Verify sanity.config.ts imports the schema correctly
 *   - Restart the dev server after schema changes
 *
 * Styles look broken:
 *   - Make sure you're using NextStudio, not the raw Studio
 *   - Check for CSS conflicts in globals.css
 *   - Try clearing the browser cache
 *
 * SECURITY NOTES:
 * ---------------
 * - Studio requires Sanity authentication to access
 * - Only users in your Sanity project can log in
 * - Role-based access controls are managed in sanity.io/manage
 *
 * CUSTOMIZATION:
 * --------------
 * To customize the Studio:
 *   1. Modify sanity.config.ts for plugins/structure
 *   2. Update schemaTypes for content models
 *   3. Create custom input components if needed
 *   4. Add custom document actions for workflows
 *
 * RELATED FILES:
 * --------------
 * - sanity.config.ts: Main Studio configuration
 * - sanity/structure.ts: Custom sidebar organization
 * - sanity/schemaTypes/: Content type definitions
 *
 * DOCUMENTATION:
 * --------------
 * - https://github.com/sanity-io/next-sanity#studio
 * - https://www.sanity.io/docs/create-a-sanity-project
 */

/**
 * 'use client' DIRECTIVE
 *
 * This marks the entire file as a Client Component.
 * Required because Sanity Studio uses browser-only APIs:
 *   - localStorage (for user preferences)
 *   - WebSocket (for real-time collaboration)
 *   - window object (for routing)
 *   - React state and effects
 */
'use client'

/**
 * NextStudio Import
 *
 * This is a special wrapper component from next-sanity that:
 *   - Properly mounts Sanity Studio in Next.js
 *   - Handles viewport configuration
 *   - Isolates Studio styles from your app
 */
import { NextStudio } from 'next-sanity/studio'

/**
 * Studio Configuration Import
 *
 * The config object from sanity.config.ts contains:
 *   - projectId: Your Sanity project identifier
 *   - dataset: Which dataset to connect to
 *   - schema: All document type definitions
 *   - plugins: Vision, presentation, structure, etc.
 *
 * The path '../../../' goes up from:
 *   app/studio/[[...tool]]/page.tsx
 *   → app/studio/
 *   → app/
 *   → (root) sanity.config.ts
 */
import config from '../../../sanity.config'

/**
 * ROUTE SEGMENT CONFIG
 *
 * This export tells Next.js how to handle this route:
 *
 * 'force-static': Pre-render at build time
 *   - The HTML is generated once and cached
 *   - Better performance (no server work per request)
 *   - Works because Studio is a client-side app
 *
 * The JavaScript in the bundle takes over after the initial
 * static HTML loads, making Studio fully interactive.
 */
export const dynamic = 'force-static'

/**
 * StudioPage Component
 *
 * This is the simplest possible component - just renders NextStudio.
 * All the complexity is handled by the NextStudio component and
 * the configuration passed to it.
 *
 * WHAT HAPPENS WHEN THIS RENDERS:
 * 1. Static HTML loads (minimal shell)
 * 2. JavaScript bundle loads
 * 3. React hydrates the component
 * 4. NextStudio initializes Sanity Studio
 * 5. Studio authenticates with Sanity
 * 6. Content editing interface appears
 *
 * @returns The Sanity Studio embedded in a Next.js page
 */
export default function StudioPage() {
  return <NextStudio config={config} />
}

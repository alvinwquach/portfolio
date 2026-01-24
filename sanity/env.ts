/**
 * Sanity Environment Variables
 * ============================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file exports validated environment variables used throughout
 * the Sanity integration. It ensures required variables exist and
 * provides a single source of truth for configuration.
 *
 * WHY CENTRALIZE ENV VARS?
 * ------------------------
 * Instead of accessing process.env directly everywhere:
 *
 *   // Bad: Repeated access, no validation
 *   const client = createClient({
 *     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
 *     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
 *   })
 *
 * We validate once and export:
 *
 *   // Good: Validated, typed, single source
 *   import { projectId, dataset } from './env'
 *
 * BENEFITS:
 * ---------
 * 1. Early Error Detection: App crashes at startup if vars missing
 * 2. Type Safety: TypeScript knows these are strings, not undefined
 * 3. Single Source of Truth: One place to update variable names
 * 4. Clear Error Messages: Helpful error tells you what's missing
 *
 * ENVIRONMENT VARIABLES EXPLAINED:
 * --------------------------------
 *
 * NEXT_PUBLIC_SANITY_API_VERSION
 *   What: The Sanity API version to use
 *   Format: YYYY-MM-DD (e.g., "2024-01-15")
 *   Why: API versioning ensures your queries won't break when Sanity
 *        adds new features or changes behavior
 *   Default: Today's date (set when file was created)
 *   When to change: Almost never. Set it once and leave it.
 *
 * NEXT_PUBLIC_SANITY_DATASET
 *   What: Which dataset to query (like a database name)
 *   Common values: "production", "staging", "development"
 *   Why: Sanity projects can have multiple datasets, allowing you to
 *        separate production content from test content
 *   Required: Yes - app won't start without it
 *
 * NEXT_PUBLIC_SANITY_PROJECT_ID
 *   What: Your unique Sanity project identifier
 *   Format: Alphanumeric string (e.g., "abc123xy")
 *   Where to find: sanity.io/manage → Your Project → Settings
 *   Required: Yes - app won't start without it
 *
 * NOTE ON NEXT_PUBLIC_ PREFIX:
 * ----------------------------
 * Variables starting with NEXT_PUBLIC_ are:
 *   - Exposed to the browser (included in client bundle)
 *   - Safe for non-sensitive configuration
 *   - Required for client-side Sanity features
 *
 * Variables WITHOUT the prefix (like SANITY_VIEWER_TOKEN) are:
 *   - Server-only (never sent to browser)
 *   - Used for sensitive operations
 *   - Safe for secrets and tokens
 *
 * THE ASSERTVALUE FUNCTION:
 * -------------------------
 *
 * PSEUDOCODE:
 * -----------
 * function assertValue<T>(value, errorMessage):
 *   if value is undefined or null:
 *     throw Error with helpful message
 *   else:
 *     return value (now typed as T, not T | undefined)
 *
 * WHY THIS PATTERN?
 * -----------------
 * TypeScript sees process.env values as `string | undefined` because
 * it can't guarantee the variable exists at compile time.
 *
 * Without assertValue:
 *   const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
 *   // Type: string | undefined
 *   // Must check for undefined everywhere you use it
 *
 * With assertValue:
 *   const projectId = assertValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, '...')
 *   // Type: string (guaranteed)
 *   // App crashes at startup if missing (fail fast)
 *
 * WHEN THE APP STARTS:
 * --------------------
 * 1. Node.js loads this file (because it's imported by other files)
 * 2. assertValue checks each required variable
 * 3. If any are missing → throws error with clear message
 * 4. If all present → exports validated values
 * 5. Other files can safely use the exports
 *
 * SETUP INSTRUCTIONS:
 * -------------------
 * 1. Copy .env.local.example to .env.local (if exists)
 * 2. Or create .env.local with:
 *
 *    NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
 *    NEXT_PUBLIC_SANITY_DATASET="production"
 *    NEXT_PUBLIC_SANITY_API_VERSION="2024-01-15"
 *    SANITY_VIEWER_TOKEN="your-viewer-token"
 *
 * 3. Get projectId from: sanity.io/manage → Your Project
 * 4. Get token from: sanity.io/manage → API → Tokens → Add Token
 *
 * TROUBLESHOOTING:
 * ----------------
 * "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
 *   → Create .env.local with the variable
 *   → Restart the dev server (env vars loaded at startup)
 *
 * Variables not updating after change?
 *   → Stop and restart the dev server
 *   → Clear .next folder if issues persist
 *
 * RELATED FILES:
 * --------------
 * - .env.local: Where variables are defined (not in git)
 * - .env.example: Template for required variables
 * - sanity/lib/client.ts: Uses these exports
 * - sanity/lib/image.ts: Uses these exports
 */

/**
 * Sanity API Version
 *
 * Format: YYYY-MM-DD
 * Used for API stability - queries use this version's behavior
 *
 * Falls back to today's date if not set (good for initial setup)
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-24'

/**
 * Sanity Dataset Name
 *
 * The dataset to query (like a database name)
 * Common values: "production", "staging", "development"
 *
 * Required - app will crash with helpful message if missing
 */
export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

/**
 * Sanity Project ID
 *
 * Your unique project identifier from sanity.io/manage
 * Format: Alphanumeric string (e.g., "abc123xy")
 *
 * Required - app will crash with helpful message if missing
 */
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

/**
 * Assert that a value is defined, or throw an error
 *
 * This is a TypeScript utility function that:
 *   1. Checks if the value exists (not undefined)
 *   2. Throws a helpful error if missing
 *   3. Returns the value with the correct type (not undefined)
 *
 * @param v - The value to check (typically from process.env)
 * @param errorMessage - The error message to show if undefined
 * @returns The value, now typed as T instead of T | undefined
 * @throws Error if the value is undefined
 *
 * @example
 * // TypeScript knows this is `string`, not `string | undefined`
 * const projectId = assertValue(
 *   process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
 *   'Missing NEXT_PUBLIC_SANITY_PROJECT_ID'
 * )
 */
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}

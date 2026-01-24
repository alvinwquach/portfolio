/**
 * Server Action: disableDraftMode
 * ================================
 *
 * WHAT IS A SERVER ACTION?
 * - Server Actions are functions that run on the SERVER, not in the browser
 * - They are marked with 'use server' directive at the top of the file
 * - They can be called directly from Client Components (like DisableDraftMode.tsx)
 * - Next.js automatically creates a secure API endpoint for them behind the scenes
 *
 * WHY USE SERVER ACTIONS?
 * - Security: Sensitive operations stay on the server
 * - Simplicity: No need to create separate API routes for simple operations
 * - Type safety: TypeScript types flow between client and server
 * - Cookies/Headers: Can access and modify HTTP-only cookies (like draft mode)
 *
 * IMPORTANT: Server Actions must be async functions
 */
'use server'

/**
 * draftMode from next/headers:
 * - A Next.js function to check/control Draft Mode
 * - Draft Mode is stored as an HTTP-only cookie
 * - .isEnabled - check if draft mode is on
 * - .enable() - turn on draft mode
 * - .disable() - turn off draft mode
 *
 * Why await? In Next.js 15+, headers/cookies functions are async
 */
import { draftMode } from 'next/headers'

/**
 * disableDraftMode Server Action
 *
 * WHAT IT DOES:
 * 1. Calls draftMode().disable() to clear the draft mode cookie
 * 2. Waits briefly to ensure the change propagates
 *
 * WHEN IT'S CALLED:
 * - From the DisableDraftMode component when user clicks "Disable draft mode"
 * - Next.js handles the network request automatically
 *
 * THE FLOW:
 * 1. User clicks button in DisableDraftMode.tsx
 * 2. disableDraftMode() is called (Next.js makes POST request to internal endpoint)
 * 3. This function runs on the server
 * 4. Draft mode cookie is cleared
 * 5. Response sent back to client
 * 6. Client calls router.refresh() to reload page content
 */
export async function disableDraftMode() {
  // Get the draftMode controller and call disable()
  // The cookie is cleared server-side - user's browser receives Set-Cookie header
  (await draftMode()).disable()

  /**
   * Why the delay?
   * - After disabling draft mode, the page needs to revalidate with published content
   * - This delay gives Next.js cache time to update
   * - Without it, the refresh might still show cached draft content
   * - 1 second is usually enough for revalidation to complete
   *
   * ALTERNATIVE APPROACHES:
   * - Could use revalidatePath('/') to force cache refresh
   * - Could return a status and let client handle timing
   */
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

/**
 * DisableDraftMode Component
 * ==========================
 *
 * PURPOSE:
 * This component provides a button to exit "Draft Mode" in Next.js + Sanity CMS.
 * Draft Mode allows content editors to preview unpublished content changes before
 * they go live. This component lets them switch back to seeing published content.
 *
 * KEY CONCEPTS:
 *
 * 1. "use client" directive:
 *    - Tells Next.js this is a Client Component (runs in browser)
 *    - Required because we use hooks (useState/useTransition) and event handlers
 *    - Server Components cannot have interactivity or use browser-only hooks
 *
 * 2. Draft Mode:
 *    - A Next.js feature that sets a cookie to show draft/unpublished content
 *    - When enabled, CMS (Sanity) queries fetch draft versions of documents
 *    - When disabled, only published content is shown
 */
"use client";

/**
 * React Imports:
 * - useTransition: React 18 hook for marking state updates as "non-urgent"
 *   This prevents blocking the UI while the async operation completes
 *   Returns [isPending, startTransition] - isPending is true during the transition
 */
import { useTransition } from "react";

/**
 * Next.js Router:
 * - useRouter: Hook to access the Next.js router for navigation/refresh
 * - router.refresh(): Tells Next.js to re-fetch server components without full page reload
 *   This updates the page content after draft mode changes
 */
import { useRouter } from "next/navigation";

/**
 * Our Server Action:
 * - disableDraftMode is a Server Action (runs on server, not browser)
 * - It clears the draft mode cookie on the server
 * - Server Actions can be called directly from Client Components
 */
import { disableDraftMode } from "@/app/actions";

/**
 * Sanity Hook:
 * - useDraftModeEnvironment: Tells us where the preview is being viewed from
 * - Returns: "live" (normal site), "presentation" (Sanity's Presentation Tool), etc.
 * - We only show this button when NOT in Sanity's Presentation Tool
 */
import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  // Get the Next.js router to refresh the page after disabling draft mode
  const router = useRouter();

  /**
   * useTransition Hook:
   * - pending: boolean - true while the transition is in progress
   * - startTransition: function - wraps async operations to mark them as transitions
   *
   * Why use this? It allows React to:
   * 1. Keep the UI responsive during the async operation
   * 2. Show a loading state (we check 'pending' below)
   * 3. Not block other user interactions
   */
  const [pending, startTransition] = useTransition();

  // Check what environment we're in (Sanity Presentation Tool vs live site)
  const environment = useDraftModeEnvironment();

  /**
   * Conditional Rendering:
   * Only show this button when viewing the live site ("live") or unknown environment.
   * When inside Sanity's Presentation Tool, that tool has its own way to exit preview.
   *
   * Returning null means "render nothing" - the component is invisible
   */
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }

  /**
   * Disable Handler:
   * - startTransition wraps our async operation
   * - disableDraftMode() calls our Server Action to clear the cookie
   * - router.refresh() tells Next.js to re-render with the new state
   *
   * This pattern (Server Action + refresh) is common for server-side state changes
   */
  const disable = () =>
    startTransition(async () => {
      await disableDraftMode();  // Server Action - clears draft mode cookie
      router.refresh();          // Refresh page to show published content
    });

  /**
   * Conditional UI:
   * - While pending (transition in progress): Show loading text
   * - Otherwise: Show the button
   *
   * This provides immediate feedback to the user that something is happening
   */
  return (
    <div>
      {pending ? (
        "Disabling draft mode..."
      ) : (
        <button type="button" onClick={disable}>
          Disable draft mode
        </button>
      )}
    </div>
  );
}

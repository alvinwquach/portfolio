/**
 * pageTransition
 * ==============
 * Module-level store for cross-page transition data.
 *
 * WHY MODULE-LEVEL: React state and refs live inside the component tree.
 * When App Router navigates, the old page unmounts before the new page mounts,
 * destroying all React state. Module-level variables survive React lifecycle
 * entirely — they persist as long as the JS module is alive (the whole session).
 * This is the only mechanism for passing data across an unmount/mount boundary.
 *
 * consumeTransition() clears the store after reading so stale data never
 * bleeds into a subsequent navigation.
 */

export interface TransitionData {
  /**
   * GSAP FlipState captured from the source card's image element.
   * Null when no image element was found (projects without thumbnails).
   * In that case the circle-expand fallback is used instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flipState: any | null;
  /** Viewport-relative click coordinates — used as the circle-expand origin. */
  clickX:    number;
  clickY:    number;
  /** Project slug — used to verify the transition targets the correct page. */
  slug:      string;
}

// Module-level singleton — intentionally outside React.
let pending: TransitionData | null = null;

export function storeTransition(data: TransitionData): void {
  pending = data;
}

/**
 * Read and clear the stored transition.
 * Returns null on direct URL entry (nothing was stored) or after the data
 * has already been consumed by a previous page mount.
 */
export function consumeTransition(): TransitionData | null {
  const data = pending;
  pending = null;
  return data;
}

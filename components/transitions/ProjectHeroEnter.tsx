/**
 * ProjectHeroEnter
 * ================
 * Behavior-only client component — renders nothing, runs usePageEnter on mount.
 *
 * WHY A SEPARATE COMPONENT:
 *   app/(marketing)/projects/[slug]/page.tsx is a Server Component.
 *   Hooks cannot run in Server Components. This component is the minimal
 *   client boundary needed to trigger the enter animation without converting
 *   the entire page to a Client Component.
 *
 *   Place it anywhere inside the server page — it has no visual presence.
 *   The animation targets [data-flip-id] elements in the DOM, not children
 *   of this component, so placement within the JSX tree doesn't matter.
 */

'use client';

import { usePageEnter } from '@/hooks/usePageEnter';

interface ProjectHeroEnterProps {
  /** Project slug — matched against the stored transition to prevent stale replays. */
  slug: string;
}

export function ProjectHeroEnter({ slug }: ProjectHeroEnterProps) {
  usePageEnter(slug);
  return null;
}

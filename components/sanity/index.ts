/**
 * Sanity Components Barrel Export
 * ================================
 *
 * WHAT IS A BARREL FILE?
 * ----------------------
 * A "barrel" file re-exports items from other files in the same directory.
 * This creates a single, clean import point for all related components.
 *
 * IMPORT PATTERNS:
 * ----------------
 *
 * WITHOUT barrel file:
 *   import { DisableDraftMode } from '@/components/sanity/DisableDraftMode'
 *   import { PreviewBanner } from '@/components/sanity/PreviewBanner'
 *   import { LiveQuery } from '@/components/sanity/LiveQuery'
 *
 * WITH barrel file (this file):
 *   import { DisableDraftMode, PreviewBanner, LiveQuery } from '@/components/sanity'
 *
 * BENEFITS:
 * ---------
 * 1. Cleaner imports in consuming files
 * 2. Can rename/reorganize internal files without breaking imports
 * 3. Single place to see all available components
 * 4. Easier to discover what's available
 *
 * NAMING CONVENTION:
 * ------------------
 * Files named 'index.ts' or 'index.tsx' are automatically resolved:
 *
 *   import { ... } from '@/components/sanity'
 *   // Actually imports from @/components/sanity/index.ts
 *
 * HOW TO ADD NEW COMPONENTS:
 * --------------------------
 * 1. Create your component file: MyComponent.tsx
 * 2. Export it from here:
 *
 *    export { MyComponent } from './MyComponent'
 *
 * 3. Now it can be imported from '@/components/sanity'
 *
 * CURRENT EXPORTS:
 * ----------------
 * - DisableDraftMode: Button to exit draft/preview mode
 *
 * FUTURE ADDITIONS MIGHT INCLUDE:
 * - PreviewBanner: Shows "You're viewing draft content"
 * - LiveQueryProvider: Wrapper for real-time queries
 * - PortableText: Custom Portable Text renderer
 * - SanityImage: Optimized image component
 *
 * RELATED FILES:
 * --------------
 * - components/sanity/DisableDraftMode.tsx: The actual component
 * - app/actions/index.ts: Similar barrel pattern for server actions
 * - sanity/schemaTypes/index.ts: Similar pattern for schemas
 *
 * DOCUMENTATION:
 * --------------
 * - https://basarat.gitbook.io/typescript/main-1/barrel
 */

/**
 * Re-export DisableDraftMode component
 *
 * This component provides a button to exit draft mode.
 * Used in layouts to allow editors to return to published view.
 *
 * Usage:
 *   import { DisableDraftMode } from '@/components/sanity'
 *
 *   // In a layout or page
 *   {draftMode().isEnabled && <DisableDraftMode />}
 */
export { DisableDraftMode } from './DisableDraftMode'

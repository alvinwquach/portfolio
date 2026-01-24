/**
 * Server Actions Index (Barrel Export)
 * =====================================
 *
 * WHAT IS A BARREL FILE?
 * - A file that re-exports from other files in the same directory
 * - Creates a single entry point for importing multiple things
 * - Common pattern: instead of importing from each file, import from index
 *
 * WITHOUT BARREL:
 *   import { disableDraftMode } from '@/app/actions/draft'
 *   import { submitForm } from '@/app/actions/form'
 *
 * WITH BARREL:
 *   import { disableDraftMode, submitForm } from '@/app/actions'
 *
 * BENEFITS:
 * - Cleaner imports in consuming files
 * - Can reorganize internal files without changing imports elsewhere
 * - Single place to see all exports from a directory
 *
 * FOR SERVER ACTIONS:
 * - All actions can be imported from '@/app/actions'
 * - Makes it easy to find and use available server actions
 *
 * NOTE: This file doesn't have 'use server' because it only re-exports
 * The actual Server Actions have 'use server' in their own files
 */
export { disableDraftMode } from './draft'

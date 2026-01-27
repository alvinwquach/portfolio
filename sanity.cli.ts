/**
 * Sanity CLI Configuration
 * ========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file configures the Sanity CLI tool. The CLI is used for running
 * commands in your terminal to manage your Sanity project.
 *
 * WHY IS THIS FILE NEEDED?
 * ------------------------
 * The Sanity CLI needs to know which project and dataset to work with
 * when you run commands like:
 *
 *   npx sanity dataset export    - Export your content
 *   npx sanity dataset import    - Import content
 *   npx sanity schema extract    - Extract schema for validation
 *   npx sanity documents delete  - Delete documents
 *   npx sanity cors add          - Add CORS origins
 *   npx sanity deploy            - Deploy Sanity Studio
 *
 * This file tells the CLI "when I run a command, use THIS project and dataset."
 *
 * COMMON CLI COMMANDS:
 * --------------------
 *
 * Schema Management:
 *   npx sanity schema extract --json
 *     - Outputs your schema as JSON (useful for validation)
 *
 *   npx sanity schema deploy
 *     - Deploys schema to Sanity's cloud (for GraphQL API)
 *
 * Data Management:
 *   npx sanity dataset export production ./backup.tar.gz
 *     - Export all content to a file
 *
 *   npx sanity dataset import ./backup.tar.gz production
 *     - Import content from a file
 *
 *   npx sanity documents delete 'drafts.**'
 *     - Delete all draft documents
 *
 * Project Management:
 *   npx sanity dataset list
 *     - List all datasets in the project
 *
 *   npx sanity cors list
 *     - List allowed CORS origins
 *
 *   npx sanity cors add https://yourdomain.com
 *     - Allow your domain to access Sanity API
 *
 * Development:
 *   npx sanity dev
 *     - Run Sanity Studio in development mode
 *
 *   npx sanity deploy
 *     - Deploy Studio to sanity.studio
 *
 * HOW IT WORKS:
 * -------------
 * When you run `npx sanity <command>`:
 * 1. CLI looks for sanity.cli.ts (or .js)
 * 2. Reads the exported configuration
 * 3. Uses projectId and dataset for the command
 * 4. Executes the command against the Sanity API
 *
 * ENVIRONMENT VARIABLES:
 * ----------------------
 * This file reads from process.env:
 *
 * NEXT_PUBLIC_SANITY_PROJECT_ID:
 *   - Your unique Sanity project identifier
 *   - Found at: sanity.io/manage → Your Project → Project ID
 *   - Example: "abc123xy"
 *
 * NEXT_PUBLIC_SANITY_DATASET:
 *   - Which dataset to use (production, staging, etc.)
 *   - Most projects just use "production"
 *   - You can create multiple datasets for different environments
 *
 * NOTE: We use NEXT_PUBLIC_ prefix so these are available in both:
 *   - Server-side code (Node.js)
 *   - Client-side code (browser)
 *
 * SETUP:
 * ------
 * Make sure your .env.local file has:
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *
 * RELATIONSHIP TO OTHER FILES:
 * ----------------------------
 * - sanity/env.ts: Also reads these env vars, adds validation
 * - sanity.config.ts: Uses same env vars via sanity/env.ts
 * - This file: Duplicates env reads because CLI runs in isolation
 *
 * WHY DUPLICATE?
 * The CLI runs outside of Next.js context, so it can't use the
 * validated exports from sanity/env.ts. It must read directly.
 *
 * RELATED FILES:
 * --------------
 * - sanity.config.ts: Full Studio configuration
 * - sanity/env.ts: Environment variable validation
 * - .env.local: Where the actual values are set
 *
 * DOCUMENTATION:
 * --------------
 * - https://www.sanity.io/docs/cli
 * - https://www.sanity.io/docs/cli#1ea4055ef27f
 */

import { defineCliConfig } from 'sanity/cli'

/**
 * Read environment variables
 *
 * These are read directly from process.env because the CLI
 * runs outside of Next.js and can't use the validated exports
 * from sanity/env.ts.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

/**
 * Export CLI Configuration
 *
 * defineCliConfig is a helper that provides type checking.
 * The api object contains the project connection details.
 */
export default defineCliConfig({
  /**
   * API Configuration
   *
   * This tells CLI commands which Sanity project to target.
   * All commands (export, import, deploy, etc.) use these values.
   */
  api: {
    projectId,  // Which Sanity project
    dataset,    // Which dataset in that project
  },
  /**
   * Studio Host Configuration
   *
   * This specifies the hostname for Sanity-hosted Studio deployment.
   * When you run `sanity deploy`, it will deploy to: <studioHost>.sanity.studio
   * 
   * This avoids the interactive prompt that can cause errors.
   * Choose a unique hostname (letters only, no numbers or symbols).
   * 
   * Your Studio will be available at: https://alvinquach.sanity.studio
   */
  studioHost: process.env.SANITY_STUDIO_HOSTNAME || 'alvinquach',
})

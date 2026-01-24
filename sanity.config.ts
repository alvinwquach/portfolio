'use client'

/**
 * Sanity Studio Configuration
 * ===========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file configures Sanity Studio - the content editing interface
 * that runs at /studio in your Next.js app.
 *
 * Sanity Studio is a React application that provides:
 *   - A visual editor for your content
 *   - Real-time collaboration features
 *   - Preview functionality
 *   - Media library
 *   - Query playground (Vision tool)
 *
 * WHY 'use client'?
 * -----------------
 * Sanity Studio is a client-side React application that needs:
 *   - Browser APIs (localStorage, fetch, WebSocket)
 *   - React state and effects
 *   - Real-time updates via WebSocket
 *
 * The 'use client' directive tells Next.js this file should only
 * run in the browser, not during server-side rendering.
 *
 * CONFIGURATION STRUCTURE:
 * ------------------------
 *
 * defineConfig({
 *   basePath: string,      // URL path where Studio is mounted
 *   projectId: string,     // Your Sanity project ID
 *   dataset: string,       // Dataset to edit (production, staging)
 *   schema: object,        // Document type definitions
 *   plugins: array,        // Studio plugins for extra features
 * })
 *
 * PLUGINS EXPLAINED:
 * ------------------
 *
 * structureTool:
 *   The main content editing interface
 *   - Shows document lists in the sidebar
 *   - Provides form editors for each document type
 *   - Can be customized with a structure builder
 *
 *   WHY CUSTOM STRUCTURE?
 *   By default, Studio shows all document types as flat lists.
 *   Custom structure lets you:
 *     - Group related types (Professional, Projects, etc.)
 *     - Add dividers and sections
 *     - Create singleton documents (one Profile document)
 *     - Add filtered views (show only "build" type nodes)
 *
 * presentationTool:
 *   Enables visual editing and preview
 *   - Shows your actual website inside Studio
 *   - Click-to-edit functionality on text
 *   - Real-time preview of changes
 *
 *   PREVIEW CONFIGURATION:
 *   - initial: Where to open the preview initially
 *   - preview: Default preview URL path
 *   - previewMode.enable: API route to enable Next.js draft mode
 *
 * visionTool:
 *   GROQ query playground
 *   - Write and test GROQ queries
 *   - See results in real-time
 *   - Useful for debugging and exploration
 *   - The defaultApiVersion ensures consistent query behavior
 *
 * codeInput:
 *   Adds syntax-highlighted code blocks
 *   - Used in knowledgeNode content for tutorials
 *   - Supports multiple languages (TypeScript, Python, etc.)
 *   - Includes filename support for code tabs
 *
 * HOW STUDIO LOADS:
 * -----------------
 *
 * PSEUDOCODE:
 * -----------
 * when user visits /studio:
 *   1. Next.js serves the Studio page (app/studio/[[...tool]]/page.tsx)
 *   2. Studio loads this configuration file
 *   3. defineConfig validates and processes the config
 *   4. Studio initializes with:
 *      - Connection to Sanity API (projectId + dataset)
 *      - Schema definitions for all document types
 *      - Plugins for editing features
 *   5. Studio fetches document list and renders UI
 *
 * THE SCHEMA OBJECT:
 * ------------------
 * The schema import contains all document type definitions:
 *
 *   import { schema } from './sanity/schemaTypes'
 *
 * This schema object has:
 *   { types: [profile, project, skill, experience, ...] }
 *
 * Each type defines:
 *   - name: The document type ID
 *   - title: Display name in Studio
 *   - fields: Array of field definitions
 *   - preview: How to display in lists
 *
 * ENVIRONMENT VARIABLES USED:
 * ---------------------------
 *
 * From sanity/env.ts:
 *   - projectId: Your Sanity project ID
 *   - dataset: Which dataset to connect to
 *   - apiVersion: API version for queries
 *
 * From process.env:
 *   - SANITY_STUDIO_PREVIEW_ORIGIN: Base URL for preview
 *   - NEXT_PUBLIC_SANITY_STUDIO_URL: Studio URL for stega links
 *
 * CUSTOMIZATION OPTIONS:
 * ----------------------
 *
 * Theme customization:
 *   import { theme } from 'sanity/theme'
 *   defineConfig({
 *     theme: {
 *       ...theme,
 *       // Custom colors, fonts, etc.
 *     },
 *   })
 *
 * Document actions:
 *   Add custom buttons to the document editor
 *   - Publish to external systems
 *   - Trigger webhooks
 *   - Custom validation
 *
 * Input components:
 *   Custom form fields beyond the defaults
 *   - Color pickers
 *   - Map selectors
 *   - Custom widgets
 *
 * TROUBLESHOOTING:
 * ----------------
 *
 * Studio not loading?
 *   - Check browser console for errors
 *   - Verify environment variables are set
 *   - Check projectId matches your Sanity project
 *
 * Schema not appearing?
 *   - Verify the type is in schemaTypes/index.ts
 *   - Check for syntax errors in the schema file
 *   - Restart the dev server
 *
 * Preview not working?
 *   - Verify SANITY_STUDIO_PREVIEW_ORIGIN is set
 *   - Check /api/draft-mode/enable route exists
 *   - Ensure SANITY_VIEWER_TOKEN has correct permissions
 *
 * RELATED FILES:
 * --------------
 * - app/studio/[[...tool]]/page.tsx: The Studio page route
 * - sanity/schemaTypes/: All document type definitions
 * - sanity/structure.ts: Custom Studio sidebar structure
 * - sanity/env.ts: Environment variable configuration
 *
 * DOCUMENTATION:
 * --------------
 * - https://www.sanity.io/docs/configuration
 * - https://www.sanity.io/docs/structure-builder
 * - https://www.sanity.io/docs/presentation
 */

import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'

// Environment variables (projectId, dataset, apiVersion)
import {apiVersion, dataset, projectId} from './sanity/env'

// Schema definitions for all document types
import {schema} from './sanity/schemaTypes'

// Custom Studio sidebar structure
import {structure} from './sanity/structure'

/**
 * Sanity Studio Configuration Export
 *
 * This configuration is used by the Studio that's mounted
 * on the /studio route in your Next.js application.
 */
export default defineConfig({
  // ===========================================
  // PROJECT IDENTIFICATION
  // ===========================================

  /**
   * Base path where Studio is mounted
   * The Studio will be accessible at: yourdomain.com/studio
   *
   * This must match the route in app/studio/[[...tool]]/page.tsx
   */
  basePath: '/studio',

  /**
   * Sanity project ID from environment variables
   * Get this from: sanity.io/manage → Your Project
   */
  projectId,

  /**
   * Dataset to edit (e.g., "production", "staging")
   * Content in different datasets is completely separate
   */
  dataset,

  // ===========================================
  // SCHEMA CONFIGURATION
  // ===========================================

  /**
   * Document type definitions
   * Imported from sanity/schemaTypes/index.ts
   *
   * This tells Studio what types of content can be created
   * and what fields each type has.
   */
  schema,

  // ===========================================
  // PLUGINS
  // ===========================================

  plugins: [
    /**
     * Structure Tool - Main content editing interface
     *
     * This is the default tool that shows when you open Studio.
     * It displays:
     *   - Sidebar with document types
     *   - Document lists
     *   - Form editors
     *
     * The custom structure organizes content into logical groups
     * (Profile, Professional, Projects, etc.) instead of a flat list.
     */
    structureTool({structure}),

    /**
     * Presentation Tool - Visual editing and preview
     *
     * Shows your actual website inside Studio so editors can:
     *   - See exactly how content will look
     *   - Click on text to edit it directly
     *   - Get real-time preview of changes
     *
     * Requires draft mode to be set up via API routes.
     */
    presentationTool({
      previewUrl: {
        // Initial URL when preview opens (uses env var for flexibility)
        initial: process.env.SANITY_STUDIO_PREVIEW_ORIGIN,

        // Default preview path
        preview: '/',

        // Draft mode configuration
        previewMode: {
          // API route that enables Next.js draft mode
          // This sets a cookie that tells Next.js to fetch drafts
          enable: '/api/draft-mode/enable',
        },
      },
    }),

    /**
     * Vision Tool - GROQ query playground
     *
     * A developer tool for writing and testing GROQ queries.
     * Access it from the Studio toolbar.
     *
     * Useful for:
     *   - Debugging queries before using in code
     *   - Exploring your content structure
     *   - Learning GROQ syntax
     *
     * The apiVersion locks query behavior to a specific date.
     */
    visionTool({defaultApiVersion: apiVersion}),

    /**
     * Code Input - Syntax-highlighted code blocks
     *
     * Adds a code field type for technical content.
     * Used in knowledgeNode for tutorials and code examples.
     *
     * Features:
     *   - Syntax highlighting for many languages
     *   - Optional filename for code tabs
     *   - Language selection dropdown
     */
    codeInput(),
  ],

})

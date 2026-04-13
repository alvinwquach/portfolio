/**
 * Schema Types Index (Barrel Export)
 * ===================================
 *
 * WHAT IS THIS FILE?
 * - This is the entry point for all Sanity schema definitions
 * - It collects all document types and exports them as a single schema object
 * - Sanity Studio reads this to know what content types exist
 *
 * WHY A BARREL FILE?
 * - Instead of importing each schema separately in sanity.config.ts:
 *     import { profile } from './schemaTypes/profile'
 *     import { skill } from './schemaTypes/skill'
 *     ... (7 more imports)
 *
 * - We can do a single import:
 *     import { schema } from './schemaTypes'
 *
 * WHAT IS SchemaTypeDefinition?
 * - A TypeScript type from Sanity that describes what a schema looks like
 * - Provides autocomplete and type checking for schema properties
 * - Ensures our schemas have the correct structure (name, type, fields, etc.)
 *
 * HOW SANITY USES THIS:
 * 1. sanity.config.ts imports this schema object
 * 2. Passes it to defineConfig({ schema: ... })
 * 3. Sanity Studio reads the types array to create:
 *    - Document types in the Studio sidebar
 *    - Form fields for editing content
 *    - Validation rules
 *    - Preview configurations
 *
 * ADDING A NEW DOCUMENT TYPE:
 * 1. Create a new file (e.g., schemaTypes/newType.ts)
 * 2. Export the schema object from that file
 * 3. Import it here
 * 4. Add it to the types array below
 */
import { type SchemaTypeDefinition } from 'sanity'
import { profile } from './profile'
import { skill } from './skill'
import { project } from './project'
import { experience } from './experience'
import { education } from './education'
import { testimonial } from './testimonial'
import { interviewQuestion } from './interviewQuestion'
import { knowledgeNode } from './knowledgeNode'
import { tag } from './tag'
import { integration } from './integration'
import { resource } from './resource'
import { roadmap } from './roadmap'

// ─── Scheduling Schemas ─────────────────────────────────────
// These three document types power the scheduling system (feat/scheduling).
// bookingRequest: Each meeting request from the /schedule page
// schedulingToken: Private scheduling links sent to specific people
// schedulingConfig: Singleton that controls scheduling behavior
import {
  bookingRequest,
  schedulingToken,
  schedulingConfig,
} from './scheduling'

// ─── Private Schemas ────────────────────────────────────────
// These document types are for personal tools, not public-facing content.
import { jobApplication } from './jobApplication'

/**
 * Schema Export Object
 * --------------------
 *
 * STRUCTURE:
 * - types: Array of all document type definitions
 *
 * WHY THIS STRUCTURE?
 * - Matches what Sanity's defineConfig expects
 * - The types array is processed to create the CMS interface
 *
 * ORDER MATTERS (sort of):
 * - The order here affects the order in Studio's sidebar
 * - Put most commonly edited types first for convenience
 * - profile is first because it's the main personal info
 * - interviewQuestion is last because it's a study tool, not portfolio content
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,        // Personal info - usually edited once
    experience,     // Work history - reference for interviews
    project,        // Portfolio projects - main showcase
    education,      // Educational background
    skill,          // Tech stack - referenced by projects
    testimonial,    // Recommendations from others
    interviewQuestion, // Interview prep content
    knowledgeNode,     // Blog posts with charts, code, visualizations
    tag,               // Reusable tags for filtering
    integration,       // API integrations and third-party services
    resource,          // External resources and references
    roadmap,           // Learning goals and milestones

    // ─── Scheduling (feat/scheduling) ───────────────────────
    bookingRequest,      // Meeting requests from /schedule page
    schedulingToken,     // Private scheduling links
    schedulingConfig,    // Singleton config for scheduling behavior

    // ─── Private ────────────────────────────────────────────
    jobApplication,      // Job application tracker
  ],
}

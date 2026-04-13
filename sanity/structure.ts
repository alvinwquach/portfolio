/**
 * Custom Studio Structure (Desk Structure)
 * ========================================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file customizes how content is organized in the Sanity Studio sidebar.
 * Instead of showing all document types as a flat list, we group them into
 * logical categories that make sense for a portfolio.
 *
 * WHY CUSTOMIZE THE STRUCTURE?
 * ----------------------------
 * Default behavior shows all document types in a flat alphabetical list.
 * For a portfolio with 17+ document types, this becomes overwhelming.
 *
 * With custom structure, we can:
 *   - Group related types (Professional: experience, education, skills)
 *   - Add dividers and sections
 *   - Create "singletons" (documents with only one instance, like Profile)
 *   - Add filtered views (show only "bug" type knowledge nodes)
 *   - Hide document types from the sidebar
 *   - Control the order of items
 *
 * THE STRUCTURE BUILDER API:
 * --------------------------
 * The 'S' parameter is the Structure Builder - a fluent API for building the sidebar:
 *
 * S.list()           - Create a list (the sidebar or a sub-list)
 * S.listItem()       - Create an item in a list (folder or link)
 * S.documentTypeList - Show all documents of a type
 * S.documentList()   - Show filtered documents
 * S.document()       - Show a specific document (for singletons)
 * S.divider()        - Add a visual separator
 *
 * STRUCTURE PATTERN:
 * ------------------
 *
 * S.list()                          // Root sidebar list
 *   .title('Name')                  // Title shown at top
 *   .items([                        // Array of items
 *     S.listItem()                  // A folder or link
 *       .title('Name')              // Display name
 *       .icon(() => 'emoji')        // Icon (can use emoji or React component)
 *       .child(                     // What opens when clicked
 *         S.list() | S.documentTypeList() | S.document()
 *       ),
 *     S.divider(),                  // Separator line
 *     ...
 *   ])
 *
 * SINGLETON PATTERN:
 * ------------------
 * Some documents should only have one instance (e.g., Profile).
 * Instead of S.documentTypeList() (shows list), use S.document():
 *
 *   S.listItem()
 *     .title('Profile')
 *     .child(
 *       S.document()
 *         .schemaType('profile')
 *         .documentId('profile')    // Fixed ID = only one document
 *     )
 *
 * FILTERED VIEWS:
 * ---------------
 * Show a subset of documents using GROQ filters:
 *
 *   S.documentList()
 *     .title('Bugs')
 *     .filter('_type == "knowledgeNode" && nodeType == "bug"')
 *
 * This shows only knowledgeNode documents where nodeType is "bug".
 *
 * HOW THIS FILE IS USED:
 * ----------------------
 * This structure is imported in sanity.config.ts:
 *
 *   import { structure } from './sanity/structure'
 *
 *   plugins: [
 *     structureTool({ structure }),  // Pass custom structure to plugin
 *   ]
 *
 * THE STRUCTURE HIERARCHY:
 * ------------------------
 *
 * Portfolio Content (root)
 * ├── Profile (singleton)
 * ├── ─────── (divider)
 * ├── Professional
 * │   ├── Work Experience
 * │   ├── Education
 * │   └── Skills
 * ├── Projects
 * ├── Interview Prep
 * │   ├── Interview Questions
 * │   └── Coding Challenges
 * ├── Testimonials
 * ├── ─────── (divider)
 * ├── Knowledge Base
 * │   ├── All Nodes
 * │   ├── Builds (filtered)
 * │   ├── Bugs (filtered)
 * │   └── ... (more filters)
 * ├── Research & Experiments
 * ├── Planning & Reflection
 * ├── Media & Demos
 * ├── Integrations
 * ├── ─────── (divider)
 * ├── Tags
 * └── All Documents (fallback)
 *
 * ICONS:
 * ------
 * .icon(() => 'emoji') uses emoji as icons.
 * For custom icons, use React components:
 *
 *   import { FiFolder } from 'react-icons/fi'
 *   .icon(FiFolder)
 *
 * RELATED FILES:
 * --------------
 * - sanity.config.ts: Uses this structure in structureTool()
 * - sanity/schemaTypes/: Document type definitions
 *
 * DOCUMENTATION:
 * --------------
 * - https://www.sanity.io/docs/structure-builder-introduction
 * - https://www.sanity.io/docs/structure-builder-cheat-sheet
 */

import type {StructureResolver} from 'sanity/structure'

/**
 * Structure Resolver Function
 *
 * StructureResolver is the type for this function.
 * It receives S (Structure Builder) and returns a structure definition.
 *
 * @param S - The Structure Builder API
 * @returns The complete sidebar structure
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio Content')
    .items([
      // Profile - Singleton (only one profile document)
      S.listItem()
        .title('Profile')
        .icon(() => '👤')
        .child(
          S.document()
            .schemaType('profile')
            .documentId('profile')
            .title('My Profile')
        ),

      S.divider(),

      // Professional Experience Group
      S.listItem()
        .title('Professional')
        .icon(() => '💼')
        .child(
          S.list()
            .title('Professional')
            .items([
              S.documentTypeListItem('experience').title('Work Experience').icon(() => '🏢'),
              S.documentTypeListItem('education').title('Education').icon(() => '🎓'),
              S.documentTypeListItem('skill').title('Skills').icon(() => '🛠️'),
            ])
        ),

      // Projects Group
      S.listItem()
        .title('Projects')
        .icon(() => '🚀')
        .child(
          S.documentTypeList('project').title('Projects')
        ),

      // Interview Prep Group
      S.listItem()
        .title('Interview Prep')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Interview Prep')
            .items([
              S.documentTypeListItem('interviewQuestion').title('Interview Questions').icon(() => '❓'),
            ])
        ),

      // Social Proof
      S.listItem()
        .title('Testimonials')
        .icon(() => '⭐')
        .child(
          S.documentTypeList('testimonial').title('Testimonials')
        ),

      S.divider(),

      // Knowledge Base / Blog
      S.listItem()
        .title('Knowledge Base')
        .icon(() => '🧠')
        .child(
          S.list()
            .title('Knowledge Base')
            .items([
              S.listItem()
                .title('All Nodes')
                .icon(() => '📝')
                .child(S.documentTypeList('knowledgeNode').title('All Nodes')),
              S.divider(),
              S.listItem()
                .title('Builds')
                .icon(() => '🏗️')
                .child(
                  S.documentList()
                    .title('Builds')
                    .filter('_type == "knowledgeNode" && nodeType == "build"')
                ),
              S.listItem()
                .title('Bugs')
                .icon(() => '🐛')
                .child(
                  S.documentList()
                    .title('Bugs')
                    .filter('_type == "knowledgeNode" && nodeType == "bug"')
                ),
              S.listItem()
                .title('Decisions')
                .icon(() => '🤔')
                .child(
                  S.documentList()
                    .title('Decisions')
                    .filter('_type == "knowledgeNode" && nodeType == "decision"')
                ),
              S.listItem()
                .title('Concepts')
                .icon(() => '💡')
                .child(
                  S.documentList()
                    .title('Concepts')
                    .filter('_type == "knowledgeNode" && nodeType == "concept"')
                ),
              S.listItem()
                .title('Tutorials')
                .icon(() => '📚')
                .child(
                  S.documentList()
                    .title('Tutorials')
                    .filter('_type == "knowledgeNode" && nodeType == "tutorial"')
                ),
              S.listItem()
                .title('Charts')
                .icon(() => '📊')
                .child(
                  S.documentList()
                    .title('Charts')
                    .filter('_type == "knowledgeNode" && nodeType == "chart"')
                ),
            ])
        ),

      // Resources
      S.listItem()
        .title('Resources')
        .icon(() => '📚')
        .child(
          S.documentTypeList('resource').title('Resources')
        ),

      // Planning
      S.listItem()
        .title('Planning')
        .icon(() => '📅')
        .child(
          S.documentTypeList('roadmap').title('Roadmap')
        ),

      // Integrations
      S.listItem()
        .title('Integrations')
        .icon(() => '🔌')
        .child(
          S.documentTypeList('integration').title('Integrations & APIs')
        ),

      S.divider(),

      // ─── Scheduling (feat/scheduling) ─────────────────────
      // This section groups all scheduling-related documents.
      // The schedulingConfig is a singleton (one document), while
      // bookingRequests and schedulingTokens are lists with filters.
      //
      // WHY FILTERED VIEWS?
      // When Alvin opens Studio to review requests, he wants to see
      // "Pending Approval" requests first (the ones needing action),
      // not all 200+ requests ever made. Filters make this fast.
      S.listItem()
        .title('Scheduling')
        .icon(() => '📅')
        .child(
          S.list()
            .title('Scheduling')
            .items([
              // Pending Approval — requests waiting for Alvin's review
              // This is the most-used view: "what do I need to act on?"
              S.listItem()
                .title('Pending Approval')
                .icon(() => '⏳')
                .child(
                  S.documentList()
                    .title('Pending Approval')
                    .filter('_type == "bookingRequest" && status == "pending_approval"')
                ),

              // Confirmed — upcoming meetings that have been approved
              S.listItem()
                .title('Confirmed')
                .icon(() => '✅')
                .child(
                  S.documentList()
                    .title('Confirmed')
                    .filter('_type == "bookingRequest" && status == "confirmed"')
                ),

              S.divider(),

              // All Requests — unfiltered list of every booking ever made
              S.documentTypeListItem('bookingRequest')
                .title('All Requests')
                .icon(() => '📋'),

              // Private Links — tokens generated for specific recipients
              S.documentTypeListItem('schedulingToken')
                .title('Private Links')
                .icon(() => '🔗'),

              S.divider(),

              // Config — singleton document that controls scheduling behavior.
              // Uses S.document() with a fixed documentId so only one can exist.
              S.listItem()
                .title('Config')
                .icon(() => '⚙️')
                .child(
                  S.document()
                    .schemaType('schedulingConfig')
                    .documentId('schedulingConfig')
                    .title('Scheduling Config')
                ),
            ])
        ),

      S.divider(),

      // ─── Private Tools ────────────────────────────────────
      S.listItem()
        .title('Job Tracker')
        .icon(() => '💼')
        .child(
          S.documentTypeList('jobApplication').title('Job Applications')
        ),

      S.divider(),

      // Tags
      S.listItem()
        .title('Tags')
        .icon(() => '🏷️')
        .child(
          S.documentTypeList('tag').title('Tags')
        ),

      // All Documents (fallback for any new types)
      S.listItem()
        .title('All Documents')
        .icon(() => '📁')
        .child(
          S.list()
            .title('All Documents')
            .items(S.documentTypeListItems())
        ),
    ])

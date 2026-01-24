import { defineField, defineType } from "sanity";

/**
 * Integration / API Schema
 * ========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema documents third-party services, APIs, and integrations
 * used across your projects. It creates a central registry of all
 * external dependencies and how they're configured.
 *
 * WHY TRACK INTEGRATIONS?
 * -----------------------
 * As a developer, you work with many external services:
 *   - Payment processors (Stripe, PayPal)
 *   - Authentication providers (Auth0, Clerk)
 *   - Databases (Neon, Supabase, PlanetScale)
 *   - AI services (OpenAI, Anthropic)
 *   - Monitoring (Sentry, LogRocket)
 *
 * Tracking these helps you:
 *   1. Remember setup steps for each service
 *   2. Know which env vars are needed
 *   3. See which projects use which services
 *   4. Evaluate alternatives for future projects
 *   5. Prepare for interviews (what have you worked with?)
 *
 * INTERVIEW VALUE:
 * ----------------
 * "Tell me about a third-party API you've integrated"
 *
 * With this data, you can say:
 * "I integrated Stripe for OpportunIQ. The setup notes I documented
 * include handling webhooks, test vs live mode, and the specific
 * env vars needed. It's currently active in production."
 *
 * SCHEMA DESIGN DECISIONS:
 * ------------------------
 *
 * 1. CATEGORY FIELD
 *    Groups integrations by purpose for easier browsing.
 *    Categories cover common integration types:
 *    - auth: Authentication/authorization
 *    - payment: Payment processing
 *    - database: Data storage
 *    - ai-ml: AI/Machine Learning services
 *
 * 2. ENV VARIABLES FIELD
 *    Lists required environment variable NAMES only.
 *    NEVER store actual values - just the names!
 *    Helps remember what to configure for new deployments.
 *
 * 3. STATUS FIELD
 *    Tracks the lifecycle of an integration:
 *    - active: Currently using in production
 *    - deprecated: Moving away from
 *    - evaluating: Testing but not committed
 *
 * 4. REFERENCES
 *    Links to projects using this integration
 *    Links to skills required to use it
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // Fetch all active integrations by category
 * *[_type == "integration" && status == "active"] | order(category) {
 *   name,
 *   category,
 *   summary,
 *   envVariables,
 *   "projectCount": count(usedInProjects)
 * }
 *
 * // Find integrations for a specific project
 * *[_type == "project" && slug.current == "opportuniq"][0] {
 *   title,
 *   "integrations": *[_type == "integration" && references(^._id)] {
 *     name,
 *     category,
 *     documentation
 *   }
 * }
 *
 * // Get setup notes for onboarding
 * *[_type == "integration" && name == "Stripe"][0] {
 *   name,
 *   documentation,
 *   envVariables,
 *   setupNotes
 * }
 *
 * DATA STRUCTURE:
 * ---------------
 *
 * {
 *   _type: "integration",
 *   name: "Stripe",
 *   slug: { current: "stripe" },
 *   summary: "Payment processing for subscriptions and one-time purchases",
 *   category: "payment",
 *   documentation: "https://stripe.com/docs",
 *   setupNotes: [...portable text blocks...],
 *   envVariables: [
 *     "STRIPE_SECRET_KEY",
 *     "STRIPE_PUBLISHABLE_KEY",
 *     "STRIPE_WEBHOOK_SECRET"
 *   ],
 *   usedInProjects: [{ _ref: "project-id-123" }],
 *   relatedSkills: [{ _ref: "skill-id-456" }],
 *   status: "active"
 * }
 *
 * RELATED SCHEMAS:
 * ----------------
 * - project: Links to projects using this integration
 * - skill: Links to skills required
 * - resource: Can link to external docs/tutorials
 *
 * VISUALIZATION IDEAS:
 * --------------------
 * - Integration dependency graph
 * - Category-based grouping
 * - Status dashboard (active vs deprecated)
 */
export const integration = defineType({
  name: "integration",
  title: "Integration / API",
  type: "document",
  icon: () => "🔌",
  fields: [
    // ============================================
    // CORE IDENTIFICATION
    // ============================================

    /**
     * Integration Name
     * e.g., "Stripe", "OpenAI", "Sentry"
     */
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The service or API name",
      validation: (Rule) => Rule.required(),
    }),

    /**
     * URL-friendly Slug
     * Auto-generated from name, used for routing
     */
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),

    /**
     * Brief Summary
     * What does this integration do? Keep it short.
     */
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      description: "Brief description of what this integration does",
    }),

    // ============================================
    // CLASSIFICATION
    // ============================================

    /**
     * Integration Category
     *
     * Groups integrations by their primary purpose.
     * Helps with filtering and organization.
     */
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "What type of service is this?",
      options: {
        list: [
          { title: "Authentication", value: "auth" },
          { title: "Payment", value: "payment" },
          { title: "Database", value: "database" },
          { title: "Storage", value: "storage" },
          { title: "Email", value: "email" },
          { title: "Analytics", value: "analytics" },
          { title: "AI/ML", value: "ai-ml" },
          { title: "CMS", value: "cms" },
          { title: "Monitoring", value: "monitoring" },
          { title: "CI/CD", value: "ci-cd" },
          { title: "Other", value: "other" },
        ],
      },
    }),

    // ============================================
    // DOCUMENTATION
    // ============================================

    /**
     * Official Documentation URL
     * Quick link to the service's docs
     */
    defineField({
      name: "documentation",
      title: "Documentation URL",
      type: "url",
      description: "Link to official documentation",
    }),

    /**
     * Setup Notes (Rich Text)
     *
     * Your personal notes on how to configure this integration.
     * Include:
     *   - Initial setup steps
     *   - Configuration gotchas
     *   - Test vs production differences
     *   - Webhook setup
     */
    defineField({
      name: "setupNotes",
      title: "Setup Notes",
      type: "array",
      of: [{ type: "block" }],
      description: "How to configure this integration (your notes)",
    }),

    /**
     * Required Environment Variables
     *
     * IMPORTANT: Store NAMES only, never actual values!
     * This helps remember what to configure for deployments.
     *
     * Example: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]
     */
    defineField({
      name: "envVariables",
      title: "Environment Variables",
      type: "array",
      of: [{ type: "string" }],
      description: "Required env vars (names only, NEVER store values!)",
    }),

    // ============================================
    // RELATIONSHIPS
    // ============================================

    /**
     * Projects Using This Integration
     * Links to project documents that use this service
     */
    defineField({
      name: "usedInProjects",
      title: "Used In Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      description: "Which projects use this integration?",
    }),

    /**
     * Related Skills
     * Skills needed to work with this integration
     * e.g., Stripe might relate to "Node.js" and "Webhooks"
     */
    defineField({
      name: "relatedSkills",
      title: "Related Skills",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description: "Skills needed to use this integration",
    }),

    // ============================================
    // LIFECYCLE
    // ============================================

    /**
     * Integration Status
     *
     * Tracks whether you're currently using this:
     * - active: In production use
     * - deprecated: Moving away from
     * - evaluating: Testing but not committed
     */
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Current lifecycle status",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Deprecated", value: "deprecated" },
          { title: "Evaluating", value: "evaluating" },
        ],
      },
      initialValue: "active",
    }),
  ],

  // ============================================
  // PREVIEW CONFIGURATION
  // ============================================
  preview: {
    select: { title: "name", category: "category", status: "status" },
    prepare({ title, category, status }) {
      // Show status indicator in subtitle
      const statusEmoji: Record<string, string> = {
        active: "🟢",
        deprecated: "🔴",
        evaluating: "🟡",
      };
      return {
        title,
        subtitle: `${statusEmoji[status] || ""} ${category || "integration"} • ${status || "active"}`,
      };
    },
  },
});

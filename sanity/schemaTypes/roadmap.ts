import { defineField, defineType } from "sanity";

/**
 * Roadmap Schema
 * ==============
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema tracks learning goals, project milestones, career objectives,
 * and future plans. It's your personal development roadmap that helps you
 * visualize your growth trajectory and stay focused on what matters.
 *
 * WHY TRACK YOUR ROADMAP?
 * -----------------------
 * Without intentional planning, it's easy to:
 *   - Jump between topics without depth
 *   - Forget what you wanted to learn
 *   - Lose sight of career goals
 *   - Miss milestones worth celebrating
 *
 * A roadmap helps you:
 *   1. Set clear learning priorities
 *   2. Track progress on goals
 *   3. Connect learning to projects
 *   4. Show intentional career growth
 *   5. Reflect on completed milestones
 *
 * INTERVIEW VALUE:
 * ----------------
 * "What are you currently learning?"
 * "Where do you see yourself in 2 years?"
 * "How do you prioritize what to learn?"
 *
 * With this data, you can say:
 * "I'm currently focused on learning Three.js for my Q1 goal of adding
 * 3D visualizations to my knowledge base. I've completed 3 of 5 milestones
 * and expect to finish by end of January."
 *
 * SCHEMA DESIGN DECISIONS:
 * ------------------------
 *
 * 1. CATEGORY FIELD
 *    Different types of roadmap items:
 *    - learning: Skills to acquire
 *    - project: Project milestones
 *    - career: Career-level goals
 *    - skill: Specific skill targets
 *    - side-project: Fun/experimental projects
 *
 * 2. STATUS WORKFLOW
 *    Lifecycle of a roadmap item:
 *    planned → in-progress → completed
 *                         → on-hold
 *                         → cancelled
 *
 * 3. PRIORITY FIELD
 *    High/Medium/Low to help focus effort
 *    Filter by priority for weekly planning
 *
 * 4. MILESTONES ARRAY
 *    Break big goals into trackable steps
 *    Each milestone can be checked off
 *
 * 5. QUARTER FIELD
 *    Organize by time period (Q1 2025, Q2 2025)
 *    Great for quarterly reviews
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // Get in-progress goals by priority
 * *[_type == "roadmap" && status == "in-progress"] | order(priority desc) {
 *   title,
 *   category,
 *   priority,
 *   targetDate,
 *   "completedMilestones": count(milestones[completed == true]),
 *   "totalMilestones": count(milestones)
 * }
 *
 * // Get goals for a specific quarter
 * *[_type == "roadmap" && quarter == "Q1 2025"] {
 *   title,
 *   status,
 *   priority
 * }
 *
 * // Find recently completed goals
 * *[_type == "roadmap" && status == "completed"] | order(completedDate desc)[0...5] {
 *   title,
 *   category,
 *   completedDate
 * }
 *
 * DATA STRUCTURE:
 * ---------------
 *
 * {
 *   _type: "roadmap",
 *   title: "Learn Three.js fundamentals",
 *   slug: { current: "learn-threejs-fundamentals" },
 *   description: "Master 3D graphics for the knowledge base visualization",
 *   category: "learning",
 *   status: "in-progress",
 *   priority: "high",
 *   targetDate: "2025-01-31",
 *   milestones: [
 *     { title: "Complete Three.js Journey course", completed: true },
 *     { title: "Build basic scene with lighting", completed: true },
 *     { title: "Add camera controls", completed: false },
 *     { title: "Render knowledge nodes as 3D objects", completed: false },
 *     { title: "Add connections between nodes", completed: false }
 *   ],
 *   relatedSkills: [{ _ref: "skill-threejs" }],
 *   relatedProjects: [{ _ref: "project-portfolio" }],
 *   quarter: "Q1 2025"
 * }
 *
 * VISUALIZATION IDEAS:
 * --------------------
 * - Kanban board by status
 * - Timeline view by target date
 * - Progress bars for milestones
 * - Quarter-based roadmap view
 *
 * RELATED SCHEMAS:
 * ----------------
 * - skill: Skills to learn/use
 * - project: Related projects
 * - resource: Learning materials
 * - journal: Daily progress notes
 */
export const roadmap = defineType({
  name: "roadmap",
  title: "Roadmap",
  type: "document",
  icon: () => "🗺️",
  fields: [
    // ============================================
    // CORE IDENTIFICATION
    // ============================================

    /**
     * Goal Title
     * Clear, actionable description of the goal
     */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "What do you want to achieve?",
      validation: (Rule) => Rule.required(),
    }),

    /**
     * URL-friendly Slug
     */
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    /**
     * Detailed Description
     * More context about this goal
     */
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Why is this goal important? What does success look like?",
    }),

    // ============================================
    // CLASSIFICATION
    // ============================================

    /**
     * Goal Category
     *
     * What type of roadmap item is this?
     */
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "What kind of goal is this?",
      options: {
        list: [
          { title: "Learning Goal", value: "learning" },
          { title: "Project Milestone", value: "project" },
          { title: "Career Goal", value: "career" },
          { title: "Skill Acquisition", value: "skill" },
          { title: "Side Project", value: "side-project" },
        ],
      },
    }),

    /**
     * Status
     *
     * Where is this goal in its lifecycle?
     */
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Current progress status",
      options: {
        list: [
          { title: "Planned", value: "planned" },
          { title: "In Progress", value: "in-progress" },
          { title: "Completed", value: "completed" },
          { title: "On Hold", value: "on-hold" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "planned",
    }),

    /**
     * Priority Level
     *
     * How important is this goal?
     * Use for filtering in weekly/monthly planning.
     */
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      description: "How urgent/important is this?",
      options: {
        list: [
          { title: "High", value: "high" },
          { title: "Medium", value: "medium" },
          { title: "Low", value: "low" },
        ],
      },
    }),

    // ============================================
    // TIMELINE
    // ============================================

    /**
     * Target Completion Date
     * When do you want to finish this?
     */
    defineField({
      name: "targetDate",
      title: "Target Date",
      type: "date",
      description: "When do you aim to complete this?",
    }),

    /**
     * Actual Completion Date
     * When did you actually finish?
     */
    defineField({
      name: "completedDate",
      title: "Completed Date",
      type: "date",
      description: "When was this actually completed?",
    }),

    /**
     * Quarter
     *
     * Organize goals by time period for quarterly planning.
     * Example: "Q1 2025", "Q2 2025"
     */
    defineField({
      name: "quarter",
      title: "Quarter",
      type: "string",
      description: "e.g., Q1 2025",
    }),

    // ============================================
    // MILESTONES
    // ============================================

    /**
     * Milestones Array
     *
     * Break down the goal into smaller, trackable steps.
     * Each milestone can be checked off as completed.
     *
     * Example:
     * [
     *   { title: "Complete tutorial", completed: true },
     *   { title: "Build first project", completed: false },
     *   { title: "Get feedback", completed: false }
     * ]
     */
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      description: "Break this goal into smaller steps",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
              description: "What needs to be done?",
            },
            {
              name: "completed",
              type: "boolean",
              title: "Completed",
              initialValue: false,
            },
            {
              name: "notes",
              type: "text",
              title: "Notes",
              description: "Any additional context or reflection",
            },
          ],
          preview: {
            select: { title: "title", completed: "completed" },
            prepare({ title, completed }) {
              return {
                title: `${completed ? "✅" : "⬜"} ${title}`,
              };
            },
          },
        },
      ],
    }),

    // ============================================
    // RELATIONSHIPS
    // ============================================

    /**
     * Related Skills
     * Skills you're learning or need for this goal
     */
    defineField({
      name: "relatedSkills",
      title: "Skills to Learn/Use",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description: "What skills does this goal involve?",
    }),

    /**
     * Related Projects
     * Projects connected to this goal
     */
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      description: "Projects where you'll apply this goal",
    }),

    /**
     * Learning Resources
     * External resources for achieving this goal
     */
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "resource" }] }],
      description: "Learning materials for this goal",
    }),
  ],

  // ============================================
  // PREVIEW CONFIGURATION
  // ============================================
  preview: {
    select: { title: "title", status: "status", priority: "priority" },
    prepare({ title, status, priority }) {
      // Visual status indicators
      const statusEmoji: Record<string, string> = {
        planned: "📋",
        "in-progress": "🔄",
        completed: "✅",
        "on-hold": "⏸️",
        cancelled: "❌",
      };
      return {
        title,
        subtitle: `${statusEmoji[status] || "📋"} ${status} • ${priority || "medium"} priority`,
      };
    },
  },
});

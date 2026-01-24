import { defineField, defineType } from "sanity";

/**
 * Experiment Schema
 * =================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema tracks technical experiments, prototypes, and proof-of-concepts.
 * It documents what you tried, your hypothesis, methodology, results, and
 * conclusions - following the scientific method for development.
 *
 * WHY TRACK EXPERIMENTS?
 * ----------------------
 * As developers, we constantly experiment:
 *   - "Will this library solve my problem?"
 *   - "Is this architecture pattern better?"
 *   - "Can I achieve better performance this way?"
 *
 * Without documentation, you:
 *   - Forget what you already tried
 *   - Repeat failed experiments
 *   - Can't explain why you chose an approach
 *   - Lose valuable learning opportunities
 *
 * Tracking experiments helps you:
 *   1. Document your technical exploration process
 *   2. Build evidence for architectural decisions
 *   3. Share learnings with your team
 *   4. Show systematic problem-solving skills
 *   5. Create content from your exploration
 *
 * INTERVIEW VALUE:
 * ----------------
 * "How do you evaluate new technologies?"
 * "Tell me about a time you had to choose between approaches"
 *
 * With this data, you can say:
 * "When evaluating edge computing for API routes, I ran a structured
 * experiment comparing cold start times. My hypothesis was that edge
 * would be faster, but I found it was only better for certain regions.
 * The data led me to a hybrid approach."
 *
 * THE SCIENTIFIC METHOD FOR CODE:
 * -------------------------------
 *
 * 1. HYPOTHESIS: What do you expect to happen?
 *    "I believe using React Query will reduce bundle size by 20%
 *    compared to our custom solution"
 *
 * 2. METHODOLOGY: How will you test it?
 *    - Create two versions of the app
 *    - Measure bundle sizes with webpack-bundle-analyzer
 *    - Test loading times with Lighthouse
 *
 * 3. RESULTS: What actually happened?
 *    - Bundle size decreased by 15%
 *    - But loading time improved by 30%
 *    - Added 50KB but removed 200KB of custom code
 *
 * 4. CONCLUSION: What did you learn?
 *    - React Query is worth it for maintainability
 *    - The caching layer was the real win
 *    - Should adopt for future projects
 *
 * SCHEMA DESIGN DECISIONS:
 * ------------------------
 *
 * 1. HYPOTHESIS FIELD
 *    Forces you to state expectations upfront
 *    Prevents confirmation bias
 *
 * 2. OUTCOME FIELD
 *    Simple classification of results:
 *    - success: Hypothesis confirmed
 *    - partial: Some aspects worked
 *    - failure: Hypothesis disproven (still valuable!)
 *    - inconclusive: Need more data
 *
 * 3. STATUS FIELD
 *    Lifecycle of an experiment:
 *    planned → in-progress → completed
 *
 * 4. METHODOLOGY & RESULTS (Rich Text + Code)
 *    Technical content needs code blocks
 *    Document the actual implementation
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // Get completed experiments by outcome
 * *[_type == "experiment" && status == "completed"] | order(endDate desc) {
 *   title,
 *   hypothesis,
 *   outcome,
 *   conclusion,
 *   "technologies": relatedSkills[]->name
 * }
 *
 * // Find failed experiments (valuable learning!)
 * *[_type == "experiment" && outcome == "failure"] {
 *   title,
 *   hypothesis,
 *   conclusion
 * }
 *
 * // Get experiments that led to project decisions
 * *[_type == "experiment" && count(relatedProjects) > 0] {
 *   title,
 *   outcome,
 *   "projects": relatedProjects[]->title
 * }
 *
 * DATA STRUCTURE:
 * ---------------
 *
 * {
 *   _type: "experiment",
 *   title: "Edge Computing Cold Start Comparison",
 *   slug: { current: "edge-cold-start-comparison" },
 *   summary: "Compare cold start times between Vercel Edge and standard Node.js",
 *   hypothesis: "Edge functions will have 50% faster cold starts globally",
 *   methodology: [...rich text with test setup...],
 *   results: [...rich text with performance data...],
 *   conclusion: "Edge is faster in EU/Asia but similar in US. Hybrid approach recommended.",
 *   status: "completed",
 *   outcome: "partial",
 *   repoUrl: "https://github.com/user/edge-experiment",
 *   tags: [{ _ref: "tag-performance" }, { _ref: "tag-edge" }],
 *   relatedSkills: [{ _ref: "skill-vercel" }],
 *   relatedProjects: [{ _ref: "project-portfolio" }],
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-05"
 * }
 *
 * FAILED EXPERIMENTS ARE VALUABLE:
 * --------------------------------
 * Don't only track successes! Failed experiments:
 *   - Prevent wasted time in future
 *   - Show thorough evaluation process
 *   - Demonstrate you make data-driven decisions
 *   - Often lead to unexpected insights
 *
 * RELATED SCHEMAS:
 * ----------------
 * - tag: Categorize by topic
 * - skill: Technologies used
 * - project: Where learnings were applied
 * - knowledgeNode: Turn conclusions into blog posts
 * - demo: Link to interactive demos
 */
export const experiment = defineType({
  name: "experiment",
  title: "Experiment",
  type: "document",
  icon: () => "🧪",
  fields: [
    // ============================================
    // CORE IDENTIFICATION
    // ============================================

    /**
     * Experiment Title
     * Clear description of what you're testing
     */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "What are you testing?",
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
     * Brief Summary
     * One-line description of the experiment
     */
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      description: "Brief overview of what you're testing",
    }),

    // ============================================
    // SCIENTIFIC METHOD
    // ============================================

    /**
     * Hypothesis
     *
     * What do you expect to happen?
     * State this BEFORE running the experiment.
     */
    defineField({
      name: "hypothesis",
      title: "Hypothesis",
      type: "text",
      rows: 2,
      description: "What do you expect to happen? State your prediction.",
    }),

    /**
     * Methodology (Rich Text + Code)
     *
     * How did you test it?
     * Include setup, tools, and approach.
     */
    defineField({
      name: "methodology",
      title: "Methodology",
      type: "array",
      of: [{ type: "block" }, { type: "code" }],
      description: "How did you set up and run the experiment?",
    }),

    /**
     * Results (Rich Text + Code)
     *
     * What actually happened?
     * Include data, measurements, observations.
     */
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      of: [{ type: "block" }, { type: "code" }],
      description: "What happened? Include data and observations.",
    }),

    /**
     * Conclusion
     *
     * What did you learn?
     * Was the hypothesis correct?
     */
    defineField({
      name: "conclusion",
      title: "Conclusion",
      type: "text",
      rows: 3,
      description: "What did you learn? Was your hypothesis correct?",
    }),

    // ============================================
    // CLASSIFICATION
    // ============================================

    /**
     * Status
     *
     * Where is this experiment in its lifecycle?
     */
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Current status of the experiment",
      options: {
        list: [
          { title: "Planned", value: "planned" },
          { title: "In Progress", value: "in-progress" },
          { title: "Completed", value: "completed" },
          { title: "Failed", value: "failed" },
          { title: "Abandoned", value: "abandoned" },
        ],
      },
    }),

    /**
     * Outcome
     *
     * How did the experiment turn out?
     * Note: "failure" is still valuable data!
     */
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "string",
      description: "What was the result? (Failure is still valuable!)",
      options: {
        list: [
          { title: "Success", value: "success" },
          { title: "Partial Success", value: "partial" },
          { title: "Failure", value: "failure" },
          { title: "Inconclusive", value: "inconclusive" },
        ],
      },
    }),

    // ============================================
    // LINKS
    // ============================================

    /**
     * Repository URL
     * Link to the experiment code
     */
    defineField({
      name: "repoUrl",
      title: "Repository URL",
      type: "url",
      description: "Link to the experiment code",
    }),

    /**
     * Demo URL
     * Link to a live demo if applicable
     */
    defineField({
      name: "demoUrl",
      title: "Demo URL",
      type: "url",
      description: "Link to a live demo",
    }),

    // ============================================
    // RELATIONSHIPS
    // ============================================

    /**
     * Tags
     * Topics covered in this experiment
     */
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description: "Topics this experiment covers",
    }),

    /**
     * Technologies Used
     * Skills/tools used in the experiment
     */
    defineField({
      name: "relatedSkills",
      title: "Technologies Used",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description: "What technologies did you use?",
    }),

    /**
     * Related Projects
     * Projects where you applied the learnings
     */
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      description: "Projects where you applied these learnings",
    }),

    // ============================================
    // TIMELINE
    // ============================================

    /**
     * Start Date
     */
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      description: "When did you start this experiment?",
    }),

    /**
     * End Date
     */
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      description: "When did you finish?",
    }),
  ],

  // ============================================
  // PREVIEW CONFIGURATION
  // ============================================
  preview: {
    select: { title: "title", status: "status", outcome: "outcome" },
    prepare({ title, status, outcome }) {
      // Outcome emoji for quick visual
      const outcomeEmoji: Record<string, string> = {
        success: "✅",
        partial: "🟡",
        failure: "❌",
        inconclusive: "❓",
      };
      return {
        title,
        subtitle: `${status || "planned"} ${outcomeEmoji[outcome] || ""}`,
      };
    },
  },
});

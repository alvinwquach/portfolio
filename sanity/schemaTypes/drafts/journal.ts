import { defineField, defineType } from "sanity";

/**
 * Journal Schema
 * ==============
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema captures daily/weekly reflections, learning logs, and
 * personal notes about your development journey. It's your development
 * diary that tracks progress, challenges, and insights over time.
 *
 * WHY KEEP A DEVELOPER JOURNAL?
 * -----------------------------
 * Without regular reflection, you:
 *   - Forget what you learned each day
 *   - Can't see patterns in your progress
 *   - Miss opportunities to improve
 *   - Underestimate how much you've grown
 *
 * A journal helps you:
 *   1. Capture learnings before you forget them
 *   2. Track your mood and productivity patterns
 *   3. Celebrate accomplishments
 *   4. Process challenges constructively
 *   5. Build a record of your growth
 *
 * INTERVIEW VALUE:
 * ----------------
 * "Tell me about a challenge you overcame recently"
 * "What have you learned in the past month?"
 *
 * With this data, you can give specific, dated examples:
 * "On January 15th, I was struggling with WebSocket reconnection logic.
 * My journal shows I tried three approaches before finding that
 * exponential backoff with jitter was the right solution."
 *
 * SCHEMA DESIGN DECISIONS:
 * ------------------------
 *
 * 1. ENTRY TYPE FIELD
 *    Different kinds of journal entries:
 *    - daily: End-of-day log
 *    - weekly: Week-in-review reflection
 *    - learning: When you learn something significant
 *    - project-update: Progress on a specific project
 *    - retro: Retrospective after completing something
 *    - brainstorm: Idea exploration
 *
 * 2. MOOD FIELD
 *    Track how you're feeling:
 *    - productive: Getting things done
 *    - focused: Deep work happening
 *    - struggling: Hitting walls
 *    - excited: Motivated and energized
 *    - neutral: Just another day
 *
 *    This helps identify patterns (do you struggle on Mondays?)
 *
 * 3. STRUCTURED SECTIONS
 *    Instead of free-form, guide reflection:
 *    - Accomplishments: What did you do?
 *    - Challenges: What was hard?
 *    - Learnings: What did you learn?
 *    - Next Steps: What's next?
 *
 * 4. VISIBILITY FIELD
 *    Some entries are personal, some can be public:
 *    - public: Show on the website
 *    - private: Personal only
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // Get recent journal entries
 * *[_type == "journal"] | order(date desc)[0...10] {
 *   title,
 *   date,
 *   entryType,
 *   mood,
 *   accomplishments,
 *   learnings
 * }
 *
 * // Find entries where you struggled (for growth analysis)
 * *[_type == "journal" && mood == "struggling"] | order(date desc) {
 *   title,
 *   date,
 *   challenges,
 *   learnings
 * }
 *
 * // Get public entries for a blog-style view
 * *[_type == "journal" && visibility == "public"] | order(date desc) {
 *   title,
 *   date,
 *   content,
 *   learnings
 * }
 *
 * DATA STRUCTURE:
 * ---------------
 *
 * {
 *   _type: "journal",
 *   title: "RSC Mental Model Click",
 *   slug: { current: "rsc-mental-model-click" },
 *   date: "2024-01-15",
 *   entryType: "learning",
 *   mood: "excited",
 *   content: [...rich text about what clicked...],
 *   accomplishments: [
 *     "Finally understood RSC data flow",
 *     "Refactored portfolio to use proper RSC patterns"
 *   ],
 *   challenges: [
 *     "Initial confusion about client/server boundaries"
 *   ],
 *   learnings: [
 *     "RSCs run only on server - no hydration needed",
 *     "useClient is a directive, not a hook"
 *   ],
 *   nextSteps: [
 *     "Apply pattern to blog post rendering",
 *     "Explore streaming with Suspense"
 *   ],
 *   tags: [{ _ref: "tag-rsc" }, { _ref: "tag-react" }],
 *   visibility: "public"
 * }
 *
 * REFLECTION PROMPTS:
 * -------------------
 * When writing entries, consider:
 * - What surprised me today?
 * - What would I do differently?
 * - What am I grateful for?
 * - What's blocking my progress?
 * - What pattern am I noticing?
 *
 * VISUALIZATION IDEAS:
 * --------------------
 * - Calendar heatmap of entries
 * - Mood tracking over time
 * - Word cloud of learnings
 * - Achievement timeline
 *
 * RELATED SCHEMAS:
 * ----------------
 * - tag: Categorize entries
 * - project: Link to active projects
 * - roadmap: Connect to goals
 * - knowledgeNode: Turn learnings into content
 */
export const journal = defineType({
  name: "journal",
  title: "Journal",
  type: "document",
  icon: () => "📔",
  fields: [
    // ============================================
    // CORE IDENTIFICATION
    // ============================================

    /**
     * Entry Title
     * A meaningful title that captures the essence
     */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Give this entry a meaningful title",
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
     * Entry Date
     * When this entry was written
     */
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "When did you write this?",
      validation: (Rule) => Rule.required(),
    }),

    // ============================================
    // CLASSIFICATION
    // ============================================

    /**
     * Entry Type
     *
     * What kind of journal entry is this?
     */
    defineField({
      name: "entryType",
      title: "Entry Type",
      type: "string",
      description: "What kind of entry is this?",
      options: {
        list: [
          { title: "Daily Log", value: "daily" },
          { title: "Weekly Reflection", value: "weekly" },
          { title: "Learning Note", value: "learning" },
          { title: "Project Update", value: "project-update" },
          { title: "Retrospective", value: "retro" },
          { title: "Brainstorm", value: "brainstorm" },
        ],
      },
    }),

    /**
     * Mood
     *
     * How were you feeling?
     * Track patterns over time.
     */
    defineField({
      name: "mood",
      title: "Mood",
      type: "string",
      description: "How are you feeling?",
      options: {
        list: [
          { title: "Productive", value: "productive" },
          { title: "Focused", value: "focused" },
          { title: "Struggling", value: "struggling" },
          { title: "Excited", value: "excited" },
          { title: "Neutral", value: "neutral" },
        ],
      },
    }),

    // ============================================
    // CONTENT
    // ============================================

    /**
     * Main Content (Rich Text)
     *
     * The full journal entry with formatting and code.
     */
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "Your detailed reflection",
      of: [
        { type: "block" },
        {
          type: "code",
          options: {
            language: "typescript",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "Python", value: "python" },
            ],
          },
        },
      ],
    }),

    // ============================================
    // STRUCTURED REFLECTION
    // ============================================

    /**
     * Accomplishments
     * What did you achieve?
     */
    defineField({
      name: "accomplishments",
      title: "Accomplishments",
      type: "array",
      of: [{ type: "string" }],
      description: "What did you achieve today?",
    }),

    /**
     * Challenges
     * What was difficult?
     */
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "array",
      of: [{ type: "string" }],
      description: "What problems did you face?",
    }),

    /**
     * Key Learnings
     * What did you learn?
     */
    defineField({
      name: "learnings",
      title: "Key Learnings",
      type: "array",
      of: [{ type: "string" }],
      description: "What did you learn?",
    }),

    /**
     * Next Steps
     * What's coming up?
     */
    defineField({
      name: "nextSteps",
      title: "Next Steps",
      type: "array",
      of: [{ type: "string" }],
      description: "What will you do next?",
    }),

    // ============================================
    // RELATIONSHIPS
    // ============================================

    /**
     * Tags
     * Categorize this entry
     */
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description: "Topics covered in this entry",
    }),

    /**
     * Related Projects
     * Projects mentioned in this entry
     */
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      description: "Projects you worked on",
    }),

    // ============================================
    // VISIBILITY
    // ============================================

    /**
     * Visibility
     *
     * Should this entry be public or private?
     * Private entries won't show on the website.
     */
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      description: "Should this be visible on your site?",
      options: {
        list: [
          { title: "Public", value: "public" },
          { title: "Private", value: "private" },
        ],
      },
      initialValue: "private",
    }),
  ],

  // ============================================
  // PREVIEW CONFIGURATION
  // ============================================
  preview: {
    select: { title: "title", date: "date", type: "entryType", mood: "mood" },
    prepare({ title, date, type, mood }) {
      // Mood emoji for quick visual
      const moodEmoji: Record<string, string> = {
        productive: "🚀",
        focused: "🎯",
        struggling: "😤",
        excited: "🎉",
        neutral: "😐",
      };
      return {
        title,
        subtitle: `${date || ""} • ${type || "entry"} ${moodEmoji[mood] || ""}`,
      };
    },
  },
});

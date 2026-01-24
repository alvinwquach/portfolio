/**
 * Interview Question Schema
 * =========================
 *
 * WHAT IS THIS?
 * - A study tool for interview preparation
 * - Stores questions with prepared answers
 * - Includes filtering, tagging, and progress tracking
 *
 * ADVANCED SCHEMA FEATURES DEMONSTRATED:
 *
 * 1. MULTIPLE ORDERINGS - Different ways to sort in Studio
 * 2. TAGS WITH LAYOUT - Tag-style array input
 * 3. CUSTOM PREVIEW WITH PREPARE FUNCTION - Dynamic preview with emojis
 * 4. MULTI-SELECT ARRAYS - Multiple values from a list
 * 5. PROGRESS TRACKING - lastPracticed, confidenceLevel
 *
 * USE CASE:
 * - Browse questions by category (React, Next.js, Behavioral)
 * - Filter by difficulty or role type
 * - Track which questions need more practice
 * - Star important questions for quick review
 *
 * GROQ QUERY EXAMPLES:
 *
 * Get all React questions:
 *   *[_type == "interviewQuestion" && category == "react"]
 *
 * Get starred, hard questions:
 *   *[_type == "interviewQuestion" && isStarred == true && difficulty == "hard"]
 *
 * Get questions needing practice (low confidence):
 *   *[_type == "interviewQuestion" && confidenceLevel < 3] | order(confidenceLevel asc)
 *
 * Get questions with specific tag:
 *   *[_type == "interviewQuestion" && "hooks" in tags]
 */
export const interviewQuestion = {
  name: 'interviewQuestion',
  title: 'Interview Questions',
  type: 'document',
  description: 'Common interview questions with prepared answers for different roles and companies',

  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'The interview question',
      validation: (rule: any) => rule.required(),
    },

    /**
     * CATEGORY - Extensive Options List
     * - Many predefined categories for organization
     * - Technical + Behavioral + Company-specific
     * - Helps filter questions by topic
     */
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          // Technical Categories
          { title: 'React', value: 'react' },
          { title: 'Next.js', value: 'nextjs' },
          { title: 'Front-end', value: 'frontend' },
          { title: 'Full-stack', value: 'fullstack' },
          { title: 'System Design', value: 'system-design' },
          { title: 'Performance & Optimization', value: 'performance' },
          { title: 'SEO', value: 'seo' },
          { title: 'Accessibility', value: 'accessibility' },
          { title: 'CMS & Content', value: 'cms' },
          { title: 'Analytics', value: 'analytics' },
          { title: 'Search', value: 'search' },
          { title: 'Forms', value: 'forms' },
          { title: 'Platform', value: 'platform' },
          { title: 'Debugging & Problem Solving', value: 'debugging' },
          { title: 'Security & Authentication', value: 'security' },
          { title: 'Testing Strategy', value: 'testing' },
          { title: 'Code Quality & Best Practices', value: 'code-quality' },
          { title: 'Software Engineering Practices', value: 'practices' },
          { title: 'Scaling & Infrastructure', value: 'scaling' },
          // Behavioral Categories
          { title: 'Behavioral - Collaboration', value: 'behavioral-collaboration' },
          { title: 'Behavioral - Ambiguity', value: 'behavioral-ambiguity' },
          { title: 'Behavioral - Failure & Learning', value: 'behavioral-failure' },
          { title: 'Behavioral - Prioritization', value: 'behavioral-prioritization' },
          { title: 'Behavioral - Growth & Learning', value: 'behavioral-growth' },
          { title: 'Behavioral', value: 'behavioral' },
          // Company-Specific
          { title: 'Stanford-Specific', value: 'stanford' },
        ],
      },
      validation: (rule: any) => rule.required(),
    },

    /**
     * TAGS - Array with Tag Layout
     * - options.layout: 'tags' creates a tag-style input
     * - Freeform: Can add any string as a tag
     * - Good for cross-cutting concerns (hooks, state, api)
     *
     * DIFFERENCE FROM CATEGORY:
     * - Category: One value from predefined list
     * - Tags: Multiple freeform values
     *
     * A question might be:
     * - Category: "React"
     * - Tags: ["hooks", "state-management", "performance"]
     */
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',  // Special tag-style UI
      },
      description: 'Additional tags for filtering (e.g., "hooks", "state-management", "api", "database")',
    },

    /**
     * ROLE TYPE - Multi-select Array
     * - type: 'array' of strings with options.list
     * - Multiple roles can be selected
     * - vs single select (just 'string' with options.list)
     *
     * PATTERN: Multi-select
     *   type: 'array',
     *   of: [{ type: 'string' }],
     *   options: { list: [...] }
     *
     * This creates checkboxes instead of a dropdown
     */
    {
      name: 'roleType',
      title: 'Role Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Frontend Engineer', value: 'frontend' },
          { title: 'Full-stack Engineer', value: 'fullstack' },
          { title: 'Software Engineer', value: 'swe' },
          { title: 'Senior Engineer', value: 'senior' },
          { title: 'All Roles', value: 'all' },
        ],
      },
      description: 'Which roles would be asked this question',
    },

    // ========================================
    // STUDY PROGRESS TRACKING
    // ========================================

    /**
     * STARRED - Boolean for Quick Access
     * - Mark important questions
     * - Filter: isStarred == true
     * - Preview shows ⭐ emoji
     */
    {
      name: 'isStarred',
      title: 'Starred',
      type: 'boolean',
      description: 'Mark important questions to review before interviews',
      initialValue: false,
    },

    /**
     * LAST PRACTICED - Datetime Field
     * - type: 'datetime' includes date AND time
     * - Track when you last reviewed this question
     * - Useful for spaced repetition
     *
     * ALTERNATIVE: type: 'date' for date only
     */
    {
      name: 'lastPracticed',
      title: 'Last Practiced',
      type: 'datetime',
      description: 'When you last practiced this question',
    },

    /**
     * CONFIDENCE LEVEL - Number with Options
     * - Numeric dropdown (1-5 scale)
     * - options.list on a number field
     * - Can filter: confidenceLevel < 3 = needs practice
     */
    {
      name: 'confidenceLevel',
      title: 'Confidence Level',
      type: 'number',
      options: {
        list: [
          { title: '1 - Need more practice', value: 1 },
          { title: '2 - Getting there', value: 2 },
          { title: '3 - Comfortable', value: 3 },
          { title: '4 - Very confident', value: 4 },
          { title: '5 - Could teach it', value: 5 },
        ],
      },
      description: 'How confident are you answering this question?',
    },

    // ========================================
    // ANSWER CONTENT
    // ========================================

    /**
     * ANSWER - Portable Text
     * - Rich text for formatted answers
     * - Can include headers, lists, links
     * - STAR format works well here
     */
    {
      name: 'answer',
      title: 'Prepared Answer',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Your prepared answer using STAR format where applicable',
    },

    /**
     * KEY POINTS - Quick Reference
     * - Bullet points to remember
     * - Easier to scan than full answer
     * - Good for last-minute review
     */
    {
      name: 'keyPoints',
      title: 'Key Points to Hit',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points to remember during the interview',
    },

    // ========================================
    // REFERENCES TO OTHER DOCUMENTS
    // ========================================

    /**
     * PROJECT REFERENCES - Array of References
     * - Link to projects you can mention in your answer
     * - "When I built X project, I encountered this..."
     * - Helps prepare concrete examples
     */
    {
      name: 'projectReferences',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Projects you can reference when answering this question',
    },

    /**
     * EXPERIENCE REFERENCES
     * - Link to work experiences
     * - "At my previous job at X..."
     */
    {
      name: 'experienceReferences',
      title: 'Related Experience',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'experience' }] }],
      description: 'Work experience you can reference when answering this question',
    },

    // ========================================
    // INTERVIEW PREP
    // ========================================

    {
      name: 'followUpQuestions',
      title: 'Likely Follow-up Questions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Anticipate what they might ask next',
    },

    {
      name: 'redFlags',
      title: 'Things to Avoid Saying',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Common mistakes or things that could hurt your answer',
    },

    {
      name: 'targetCompany',
      title: 'Target Company',
      type: 'string',
      description: 'If this question is specific to a company (e.g., "Stanford")',
    },

    /**
     * DIFFICULTY - Simple Dropdown
     * - Used in preview for color coding
     * - Easy: 🟢, Medium: 🟡, Hard: 🔴
     */
    {
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Medium', value: 'medium' },
          { title: 'Hard', value: 'hard' },
        ],
      },
    },

    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],

  /**
   * MULTIPLE ORDERINGS
   * - Several ways to sort questions in Studio
   * - Each ordering is a dropdown option
   * - Very useful for large document collections
   *
   * ORDERING STRUCTURE:
   * - title: Display name in dropdown
   * - name: Internal identifier
   * - by: Array of sort criteria (can sort by multiple fields)
   */
  orderings: [
    {
      title: 'By Category',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'By Difficulty',
      name: 'difficultyAsc',
      by: [
        { field: 'difficulty', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Starred First',
      name: 'starredFirst',
      by: [
        { field: 'isStarred', direction: 'desc' },  // true before false
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'By Confidence (Low First)',
      name: 'confidenceLowFirst',
      by: [
        { field: 'confidenceLevel', direction: 'asc' },  // 1 before 5
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Recently Practiced',
      name: 'lastPracticedDesc',
      by: [{ field: 'lastPracticed', direction: 'desc' }],
    },
    {
      title: 'Needs Practice (Not Practiced)',
      name: 'needsPractice',
      by: [
        { field: 'lastPracticed', direction: 'asc' },  // null/old first
        { field: 'confidenceLevel', direction: 'asc' },
      ],
    },
  ],

  /**
   * ADVANCED PREVIEW WITH PREPARE FUNCTION
   * - select: Maps document fields to variables
   * - prepare: Function that transforms data for display
   *
   * WHY PREPARE?
   * - Add conditional logic (emojis based on values)
   * - Format or combine fields
   * - Dynamic subtitle based on multiple fields
   *
   * PATTERN:
   * preview: {
   *   select: { fieldAlias: 'actualFieldName', ... },
   *   prepare({ fieldAlias, ... }) {
   *     return { title: ..., subtitle: ..., media: ... }
   *   }
   * }
   */
  preview: {
    select: {
      title: 'question',
      category: 'category',
      difficulty: 'difficulty',
      isStarred: 'isStarred',
      confidenceLevel: 'confidenceLevel',
    },
    /**
     * PREPARE FUNCTION
     * - Receives selected fields as object
     * - Returns preview configuration
     * - Can include any JavaScript logic
     */
    prepare({ title, category, difficulty, isStarred, confidenceLevel }: any) {
      // Add star emoji if starred
      const star = isStarred ? '⭐ ' : ''

      // Color-code by difficulty
      const difficultyEmoji = difficulty === 'hard' ? '🔴' : difficulty === 'medium' ? '🟡' : '🟢'

      // Show confidence level if set
      const confidence = confidenceLevel ? ` [${confidenceLevel}/5]` : ''

      return {
        title: `${star}${title}`,
        subtitle: `${difficultyEmoji} ${category}${confidence}`,
      }
    },
  },
}

/**
 * Project Schema
 * ==============
 *
 * WHAT IS THIS?
 * - The main portfolio piece - showcases your work
 * - Designed for INTERVIEW PREPARATION using STAR format
 * - Rich content structure for telling project stories
 *
 * STAR FORMAT EXPLAINED:
 * STAR is a method for structuring behavioral interview answers:
 * - Situation: What was the context/problem?
 * - Task: What were you trying to achieve?
 * - Action: What did you do?
 * - Result: What was the outcome?
 *
 * This schema captures STAR format so you can prep for interviews!
 *
 * SCHEMA DESIGN PATTERNS USED:
 *
 * 1. SLUG FIELD - URL-friendly identifiers
 *    Slugs are auto-generated from another field (name)
 *    Used for URLs: /projects/my-cool-project
 *
 * 2. REFERENCES - Links to other documents
 *    techStack references skill documents
 *    Enables: "Show all projects using React"
 *
 * 3. NESTED OBJECTS - Complex repeatable data
 *    tradeoffs, challenges, codeHighlights
 *    Each has its own preview config
 *
 * 4. PORTABLE TEXT - Rich text blocks
 *    narrative, architectureNotes
 *    Stored as JSON, rendered with @portabletext/react
 *
 * 5. ORDERINGS - Custom sort options in Studio
 *    Lets content editors view documents in preferred order
 */
export const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  description: 'Portfolio projects that showcase your skills and experience',

  fields: [
    {
      name: 'name',
      title: 'Project Name',
      type: 'string',
      description: 'The name of your project',
      validation: (rule: any) => rule.required(),
    },

    /**
     * SLUG FIELD
     * - Auto-generates URL-friendly string from 'name'
     * - "My Cool Project" becomes "my-cool-project"
     * - maxLength: 96 prevents overly long URLs
     *
     * Usage in frontend:
     *   /projects/[slug]/page.tsx
     *   Query: *[_type == "project" && slug.current == $slug][0]
     *
     * WHY slug.current?
     * - Sanity stores slugs as { _type: 'slug', current: 'the-slug' }
     * - This allows for slug history/redirects in the future
     */
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for the project page (auto-generated from name)',
      options: {
        source: 'name',       // Generate from 'name' field
        maxLength: 96,        // Limit length
      },
      validation: (rule: any) => rule.required(),
    },

    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short one-liner that summarizes the project (shown on cards/previews)',
    },

    // ========================================
    // STAR FORMAT FIELDS
    // ========================================

    /**
     * SITUATION (STAR)
     * - The context, problem, or opportunity
     * - Set the scene for your interviewer
     * - "The company was losing 40% of users during checkout..."
     */
    {
      name: 'situation',
      title: 'Situation',
      type: 'text',
      rows: 3,
      description: 'STAR: What was the problem or opportunity? What context led to this project?',
    },

    /**
     * TASK (STAR)
     * - Your specific goal or responsibility
     * - "I was tasked with redesigning the checkout flow..."
     */
    {
      name: 'task',
      title: 'Task',
      type: 'text',
      rows: 3,
      description: 'STAR: What were you trying to achieve? What was your goal?',
    },

    /**
     * ACTIONS (STAR)
     * - Specific steps you took
     * - Use action verbs: "Implemented", "Designed", "Led"
     * - Be specific about YOUR contributions (not the team's)
     */
    {
      name: 'actions',
      title: 'Actions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'STAR: What specific steps did you take? What did you build?',
    },

    /**
     * RESULTS (STAR)
     * - Measurable outcomes
     * - USE METRICS: "Reduced checkout abandonment by 25%"
     * - Quantify impact whenever possible
     */
    {
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'STAR: What was the measurable outcome? Use metrics where possible.',
    },

    // ========================================
    // NARRATIVE & STORYTELLING
    // ========================================

    /**
     * NARRATIVE - Rich Text Story
     * - Tell the full story with formatting
     * - Use for detailed case studies
     * - Portable Text allows links, headings, lists
     */
    {
      name: 'narrative',
      title: 'Narrative',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Tell the story like you are explaining it to a recruiter. What did you build, why does it matter, and what did you learn?',
    },

    // ========================================
    // INTERVIEW GOLD: TRADE-OFFS & DECISIONS
    // ========================================

    /**
     * TRADE-OFFS - Nested Object Array
     * - Shows you think critically about decisions
     * - Interviewers LOVE hearing about trade-offs
     *
     * NESTED OBJECT STRUCTURE:
     * - type: 'object' creates an inline object
     * - name: 'tradeoff' gives it an internal identifier
     * - fields: [...] defines the object's fields
     * - preview: Shows how it appears in the array
     */
    {
      name: 'tradeoffs',
      title: 'Trade-offs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tradeoff',
          fields: [
            {
              name: 'decision',
              title: 'Decision Made',
              type: 'string',
              description: 'What you chose to do',
            },
            {
              name: 'prosGained',
              title: 'What You Gained',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Benefits of this approach',
            },
            {
              name: 'consAccepted',
              title: 'What You Gave Up',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Downsides you accepted',
            },
            {
              name: 'whyWorthIt',
              title: 'Why It Was Worth It',
              type: 'text',
              rows: 2,
              description: 'Why the trade-off made sense for this project',
            },
          ],
          /**
           * OBJECT PREVIEW
           * - How this object appears in the array list
           * - select: Maps fields to preview properties
           * - Shows the 'decision' field as the title
           */
          preview: {
            select: { title: 'decision' },
          },
        },
      ],
      description: 'Key trade-offs you made - interviewers love to hear your reasoning',
    },

    /**
     * TECHNICAL DECISIONS
     * - "Why did you choose X over Y?"
     * - Prepare answers for common questions
     * - Shows depth of understanding
     */
    {
      name: 'technicalDecisions',
      title: 'Technical Decisions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'decision',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              description: 'e.g., "Why Next.js over Gatsby?"',
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              description: 'Your reasoning and trade-offs considered',
            },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
      description: 'Why you chose specific technologies - be ready to defend these in interviews',
    },

    /**
     * CHALLENGES & SOLUTIONS
     * - Bug stories are interview gold
     * - Shows problem-solving ability
     * - Demonstrates growth mindset
     */
    {
      name: 'challenges',
      title: 'Challenges & Solutions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'challenge',
          fields: [
            {
              name: 'problem',
              title: 'The Challenge',
              type: 'string',
              description: 'What was the hardest problem?',
            },
            {
              name: 'approach',
              title: 'Your Approach',
              type: 'text',
              rows: 3,
              description: 'How did you debug/solve it?',
            },
            {
              name: 'solution',
              title: 'The Solution',
              type: 'text',
              rows: 3,
              description: 'What was the fix?',
            },
            {
              name: 'lesson',
              title: 'Lesson Learned',
              type: 'string',
              description: 'What did you learn from this?',
            },
          ],
          preview: {
            select: { title: 'problem' },
          },
        },
      ],
      description: 'Specific bugs or challenges you solved - interviewers love these stories',
    },

    {
      name: 'lessonsLearned',
      title: 'Lessons Learned',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What would you do differently if starting over?',
    },

    {
      name: 'futureImprovements',
      title: 'Future Improvements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'How would you improve or scale this project?',
    },

    {
      name: 'architectureNotes',
      title: 'Architecture Notes',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'How do the components connect? What is the data flow? Include diagrams if helpful.',
    },

    /**
     * CODE HIGHLIGHTS
     * - For code walkthrough sessions
     * - Reference specific files/functions
     * - Explain WHY the code is interesting
     */
    {
      name: 'codeHighlights',
      title: 'Code Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'codeSnippet',
          fields: [
            {
              name: 'title',
              title: 'What This Shows',
              type: 'string',
              description: 'e.g., "WebSocket sync logic for draft rooms"',
            },
            {
              name: 'filePath',
              title: 'File Path',
              type: 'string',
              description: 'e.g., "src/lib/websocket.ts"',
            },
            {
              name: 'explanation',
              title: 'Explanation',
              type: 'text',
              rows: 4,
              description: 'Walk through what this code does and why it matters',
            },
          ],
          /**
           * MULTI-FIELD PREVIEW
           * - select can map multiple fields
           * - subtitle: shows secondary info
           */
          preview: {
            select: { title: 'title', subtitle: 'filePath' },
          },
        },
      ],
      description: 'Key code sections you want to highlight during a code walkthrough',
    },

    // ========================================
    // PROJECT METADATA
    // ========================================

    {
      name: 'role',
      title: 'Your Role',
      type: 'string',
      description: 'Your role on the project (e.g., "Solo Developer", "Frontend Lead")',
    },

    {
      name: 'teamSize',
      title: 'Team Size',
      type: 'number',
      description: 'Number of people on the project (1 for solo projects)',
    },

    {
      name: 'duration',
      title: 'Project Duration',
      type: 'string',
      description: 'How long you worked on the project (e.g., "3 months", "Ongoing")',
    },

    /**
     * REFERENCE ARRAY - Links to Other Documents
     * - of: [{ type: 'reference', to: [{ type: 'skill' }] }]
     * - Creates a picker that shows skill documents
     * - Stored as: [{ _type: 'reference', _ref: 'skill-doc-id' }]
     *
     * QUERYING REFERENCES:
     *   *[_type == "project"]{
     *     name,
     *     techStack[]->{ name, category }  // -> expands the reference
     *   }
     */
    {
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skill' }] }],
      description: 'Select the technologies used in this project',
    },

    // ========================================
    // PROJECT LINKS
    // ========================================

    {
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      description: 'Link to the live/deployed project',
    },

    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      description: 'Link to the source code repository',
    },

    {
      name: 'demoUrl',
      title: 'Demo Video URL',
      type: 'url',
      description: 'Link to a video walkthrough (Loom, YouTube, etc.)',
    },

    // ========================================
    // IMAGES
    // ========================================

    /**
     * IMAGE WITH HOTSPOT
     * - hotspot: true enables focal point selection
     * - Editors can mark the "important" part of the image
     * - Use with next/image or @sanity/image-url for smart cropping
     */
    {
      name: 'image',
      title: 'Project Image',
      type: 'image',
      description: 'Main screenshot or hero image for the project',
      options: {
        hotspot: true,
      },
    },

    /**
     * IMAGE GALLERY - Array of Images
     * - Multiple images for the project
     * - Each can have its own hotspot
     */
    {
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'Additional screenshots showing different features or views',
    },

    // ========================================
    // DISPLAY CONTROLS
    // ========================================

    /**
     * BOOLEAN FIELD
     * - Creates a toggle switch
     * - initialValue: Sets default when creating document
     */
    {
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show this project prominently on the homepage',
      initialValue: false,
    },

    /**
     * ORDER FIELD - Manual Sorting
     * - Lets you control display order
     * - Lower numbers appear first
     * - Query: *[_type == "project"] | order(order asc)
     */
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Control the order projects appear (lower numbers first)',
    },
  ],

  /**
   * ORDERINGS - Sort Options in Studio
   * - Appears in the Studio document list
   * - Lets editors view documents in different orders
   * - by: Array of sort criteria
   */
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  /**
   * PREVIEW - How Documents Appear in Lists
   * - title: Main text (project name)
   * - subtitle: Secondary text (tagline)
   * - media: Image thumbnail
   *
   * This shows in:
   * - Document list in Studio
   * - Reference pickers when linking from other documents
   * - Search results
   */
  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
      media: 'image',
    },
  },
}

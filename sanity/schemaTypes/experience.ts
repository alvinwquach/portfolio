/**
 * Experience Schema
 * =================
 *
 * WHAT IS THIS?
 * - Stores your work experience/employment history
 * - Uses STAR format for interview preparation
 * - Similar structure to Project, but for employment
 *
 * STAR FORMAT FOR WORK EXPERIENCE:
 * When describing work experience in interviews:
 * - Situation: What was the state when you joined?
 * - Task: What were your responsibilities?
 * - Action: What did you specifically do?
 * - Result: What impact did you have?
 *
 * DIFFERENCE FROM PROJECT SCHEMA:
 * - Experience = Employment at a company
 * - Project = Specific thing you built (could be at work or personal)
 *
 * You might reference the same work in both:
 * - Experience: "Software Engineer at Acme Corp"
 * - Project: "E-commerce Platform Redesign" (done at Acme)
 */
export const experience = {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  description: 'Your work experience in STAR format',

  fields: [
    // ========================================
    // BASIC JOB INFO
    // ========================================

    {
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'Name of the company or organization',
      validation: (rule: any) => rule.required(),
    },

    {
      name: 'role',
      title: 'Job Title',
      type: 'string',
      description: 'Your role or position',
      validation: (rule: any) => rule.required(),
    },

    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City, State or Remote',
    },

    /**
     * EMPLOYMENT TYPE - String with Options
     * - Creates a dropdown for predefined choices
     * - value: What's stored in database
     * - title: What's shown to content editors
     */
    {
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
          { title: 'Freelance', value: 'freelance' },
          { title: 'Internship', value: 'internship' },
        ],
      },
    },

    // ========================================
    // DATE HANDLING
    // ========================================

    /**
     * DATE AS STRING (Simple Approach)
     * - Using string instead of 'date' type
     * - More flexible: "Aug 2022", "Summer 2021", etc.
     * - Trade-off: Can't sort by actual date
     *
     * ALTERNATIVE: Use 'date' type for sortable dates
     *   type: 'date',
     *   options: { dateFormat: 'MMM YYYY' }
     */
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'string',
      description: 'When you started (e.g., "Aug 2022")',
    },

    {
      name: 'endDate',
      title: 'End Date',
      type: 'string',
      description: 'When you ended (e.g., "Jan 2025") or leave blank if current',
    },

    /**
     * BOOLEAN WITH INITIAL VALUE
     * - Toggle for "still working here"
     * - initialValue: false means new documents default to false
     * - Frontend can check: isCurrent ? "Present" : endDate
     */
    {
      name: 'isCurrent',
      title: 'Current Position',
      type: 'boolean',
      initialValue: false,
    },

    // ========================================
    // STAR FORMAT FIELDS
    // ========================================

    /**
     * SITUATION (STAR)
     * - Context when you joined
     * - "The team was struggling with..."
     * - "The codebase had no tests..."
     */
    {
      name: 'situation',
      title: 'Situation',
      type: 'text',
      rows: 3,
      description: 'STAR: What was the context or challenge? What was the state of things when you joined?',
    },

    /**
     * TASKS (STAR) - Note: "tasks" plural, array
     * - Your job responsibilities
     * - What you were hired/expected to do
     */
    {
      name: 'tasks',
      title: 'Tasks',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'STAR: What were your specific responsibilities?',
    },

    /**
     * ACTIONS (STAR)
     * - What YOU did (not the team)
     * - Use first person: "I implemented...", "I led..."
     * - Be specific with technologies and methods
     */
    {
      name: 'actions',
      title: 'Actions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'STAR: What did you do? Be specific about your contributions.',
    },

    /**
     * RESULTS (STAR)
     * - Quantify whenever possible
     * - "Reduced load time by 40%"
     * - "Increased test coverage from 0% to 80%"
     */
    {
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'STAR: What was the measurable outcome? Use metrics where possible.',
    },

    /**
     * NARRATIVE - Full Story in Rich Text
     * - Portable Text for formatting
     * - Combine STAR elements into a story
     * - Good for case studies or detailed writeups
     */
    {
      name: 'narrative',
      title: 'Narrative',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Tell the story like you are explaining it to a recruiter. What did you do, why did it matter, and what did you learn?',
    },

    // ========================================
    // INTERVIEW PREPARATION
    // ========================================

    /**
     * TRADE-OFFS - Same Pattern as Project
     * - Nested objects in an array
     * - Each has its own fields and preview
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
              description: 'Why the trade-off made sense',
            },
          ],
          preview: {
            select: { title: 'decision' },
          },
        },
      ],
      description: 'Key trade-offs you made - interviewers love to hear your reasoning',
    },

    /**
     * TECHNICAL DECISIONS
     * - "Why did you choose X technology?"
     * - Prepare for technical deep-dives
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
              description: 'e.g., "Why Sanity over Contentful?"',
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
     * - Bug stories, difficult problems
     * - Shows problem-solving skills
     * - Interviewers love hearing about real challenges
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
      description: 'What would you do differently?',
    },

    // ========================================
    // TECH STACK & ORDERING
    // ========================================

    /**
     * TECH STACK - Reference Array
     * - Links to skill documents
     * - Same pattern as project.techStack
     * - Enables: "Show all jobs where I used React"
     */
    {
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skill' }] }],
      description: 'Technologies you used in this role',
    },

    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (most recent first)',
    },
  ],

  /**
   * ORDERINGS
   * - Custom sort options for Studio document list
   * - Editors can quickly find recent or specific jobs
   */
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  /**
   * PREVIEW
   * - role as title: "Software Engineer"
   * - company as subtitle: "Acme Corp"
   * - Makes it easy to identify jobs in lists
   */
  preview: {
    select: {
      title: 'role',
      subtitle: 'company',
    },
  },
}

/**
 * Profile Schema
 * ==============
 *
 * WHAT IS A SANITY SCHEMA?
 * - A schema defines the STRUCTURE of your content
 * - Think of it like a database table definition, but for a CMS
 * - It tells Sanity Studio what fields to show and how to validate them
 *
 * ANATOMY OF A DOCUMENT SCHEMA:
 * {
 *   name: 'uniqueIdentifier',     // Used in queries: *[_type == "profile"]
 *   title: 'Display Name',        // Shown in Studio UI
 *   type: 'document',             // Top-level content type (vs 'object' which is nested)
 *   description: 'Help text',     // Shown to content editors
 *   fields: [...],                // Array of field definitions
 *   preview: {...},               // How documents appear in lists
 *   orderings: [...],             // Sort options in Studio
 * }
 *
 * FIELD TYPES IN SANITY:
 * - 'string': Single line text
 * - 'text': Multi-line text (use 'rows' option)
 * - 'number': Numeric values
 * - 'boolean': True/false toggle
 * - 'array': List of items
 * - 'object': Nested structure
 * - 'reference': Link to another document
 * - 'image': Image upload with optional hotspot
 * - 'file': Any file upload
 * - 'url': URL with validation
 * - 'block': Rich text (Portable Text)
 *
 * THIS SCHEMA:
 * - Stores personal information for the portfolio
 * - Usually only ONE profile document exists
 * - Contains contact info, bio, career goals, etc.
 */
export const profile = {
  /**
   * name: Internal identifier
   * - Used in GROQ queries: *[_type == "profile"]
   * - Must be unique across all schemas
   * - Use lowercase, no spaces (camelCase or kebab-case)
   */
  name: 'profile',

  /**
   * title: Human-readable name
   * - Displayed in Studio sidebar and document headers
   * - Can include spaces and special characters
   */
  title: 'Profile',

  /**
   * type: 'document' means this is a top-level content type
   * - Documents are standalone, can be queried directly
   * - vs 'object' which can only exist inside other documents
   */
  type: 'document',

  /**
   * description: Help text for content editors
   * - Shown at the top of the document form
   * - Explains what this content type is for
   */
  description: 'Your personal information and contact details displayed on the portfolio',

  /**
   * fields: Array of field definitions
   * - Each field becomes an input in the Studio form
   * - Order here = order in the form
   */
  fields: [
    /**
     * STRING FIELD EXAMPLE
     * - Simple single-line text input
     * - validation: (rule) => rule.required() makes it mandatory
     */
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Your full name as you want it displayed to recruiters and clients',
      validation: (rule: any) => rule.required(),
    },

    /**
     * STRING WITH INITIAL VALUE
     * - initialValue: Sets default when creating new document
     * - Helps guide content editors
     */
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'A short professional headline (e.g., "Full Stack Developer")',
      initialValue: 'Full Stack Developer',
    },

    {
      name: 'tagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'The main h1 tagline shown on the hero section (e.g., "Turning ideas into products people use")',
      initialValue: 'Turning ideas into products people use',
    },

    /**
     * PORTABLE TEXT (RICH TEXT) FIELD
     * - type: 'array' with of: [{ type: 'block' }]
     * - 'block' is Sanity's rich text format (Portable Text)
     * - Allows headings, lists, links, bold, italic, etc.
     * - Data is stored as structured JSON, not HTML
     * - Render with @portabletext/react on the frontend
     */
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'A brief summary of who you are, your experience, and what you bring to the table. You can add links to projects and format text.',
    },

    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Your city/region (e.g., "San Francisco Bay Area, CA")',
    },

    /**
     * STRING WITH OPTIONS LIST (DROPDOWN)
     * - options.list: Creates a dropdown select
     * - Each item has title (display) and value (stored)
     * - Constrains input to predefined choices
     */
    {
      name: 'availabilityStatus',
      title: 'Availability Status',
      type: 'string',
      description: 'Let recruiters know if you are open to opportunities',
      options: {
        list: [
          { title: 'Open to Work', value: 'open' },
          { title: 'Open to Freelance', value: 'freelance' },
          { title: 'Open to Both', value: 'both' },
          { title: 'Not Currently Available', value: 'unavailable' },
        ],
      },
    },

    /**
     * ARRAY OF STRINGS
     * - Creates a list where you can add/remove items
     * - Each item is a simple string
     * - Good for tags, skills, bullet points
     */
    {
      name: 'availabilityLabel',
      title: 'Availability Label',
      type: 'string',
      description: 'Human-readable label shown in search engine structured data (e.g., "Open to Full-Time & Contract Roles", "Available for Freelance"). Shown as your current employer/status in Google search results.',
    },

    {
      name: 'openToRoles',
      title: 'Open to Roles',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Types of roles you are interested in (e.g., "Full Stack Developer", "Frontend Engineer", "Contract")',
    },

    /**
     * EMAIL VALIDATION
     * - rule.email() validates email format
     * - Chaining: rule.required().email() = must exist AND be valid email
     */
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Your professional contact email',
      validation: (rule: any) => rule.required().email(),
    },

    /**
     * URL FIELD
     * - type: 'url' automatically validates URL format
     * - Stores as string, but with URL validation
     */
    {
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Link to your LinkedIn profile',
    },

    {
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
      description: 'Link to your GitHub profile',
    },

    {
      name: 'twitter',
      title: 'Twitter / X URL',
      type: 'url',
      description: 'Link to your Twitter/X profile (e.g., https://x.com/mistersjc)',
    },

    /**
     * FILE UPLOAD FIELD
     * - type: 'file' allows any file upload
     * - Files are stored in Sanity's CDN
     * - Access via asset URL in queries
     */
    {
      name: 'resume',
      title: 'Resume',
      type: 'file',
      description: 'Upload your resume/CV as a PDF for download',
    },

    /**
     * IMAGE FIELD WITH HOTSPOT
     * - type: 'image' for image uploads
     * - options.hotspot: true enables focal point selection
     * - Hotspot lets editors pick the important part of the image
     * - Frontend can use this for smart cropping
     */
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      description: 'A professional headshot or photo of yourself',
      options: {
        hotspot: true,
      },
    },

    {
      name: 'whatIEnjoy',
      title: 'What I Enjoy Working On',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Types of problems and work that energize you',
    },

    /**
     * TEXT FIELD (MULTI-LINE)
     * - type: 'text' for longer content without rich text
     * - rows: Number of visible rows (hint, not limit)
     * - Use when you want plain text, not Portable Text
     */
    {
      name: 'careerGoals',
      title: 'Career Goals (3-5 Years)',
      type: 'text',
      rows: 4,
      description: 'Where do you see yourself? What do you want to grow into?',
    },

    {
      name: 'whatImLookingFor',
      title: 'What I Am Looking For',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What matters to you in a role - team, culture, tech, growth, etc.',
    },

    {
      name: 'strengths',
      title: 'Strengths',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What you bring to a team',
    },

    {
      name: 'growthAreas',
      title: 'Growth Areas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Areas you are actively working to improve (shows self-awareness)',
    },

    /**
     * ARRAY OF OBJECTS (COMPLEX NESTED DATA)
     * - of: [{ type: 'object', fields: [...] }]
     * - Each array item is an object with its own fields
     * - Great for repeatable structured data
     * - Each object can have nested arrays too!
     */
    {
      name: 'previousCareers',
      title: 'Previous Careers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Job Title',
              type: 'string',
            },
            {
              name: 'company',
              title: 'Company',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              // Nested array inside an object
              name: 'transferableSkills',
              title: 'Transferable Skills',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
      description: 'Previous career experience before software engineering - shows diverse background',
    },

    {
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'Your country (e.g., "US", "Canada"). Used in structured data for search engines.',
      initialValue: 'US',
    },

    {
      name: 'employmentTypes',
      title: 'Employment Types',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Types of employment you are open to. Used in structured data for search engines.',
      options: {
        list: [
          { title: 'Full-Time', value: 'FULL_TIME' },
          { title: 'Part-Time', value: 'PART_TIME' },
          { title: 'Contract', value: 'CONTRACT' },
          { title: 'Temporary', value: 'TEMPORARY' },
          { title: 'Internship', value: 'INTERN' },
          { title: 'Volunteer', value: 'VOLUNTEER' },
        ],
      },
    },

    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Meta description for search results (≤155 characters). Appears in Google previews and social shares.',
    },

    {
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords for search engines (e.g., "Full Stack Developer", "React", "Next.js", "San Francisco")',
    },

    {
      name: 'hobbiesAndInterests',
      title: 'Hobbies & Interests',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
          ],
        },
      ],
      description: 'Personal interests and hobbies that show personality (e.g., DJing, sports)',
    },
    ],

  /**
   * PREVIEW CONFIGURATION
   * - Controls how documents appear in Studio lists
   * - select: Maps data to preview properties
   * - title: Main text shown
   * - subtitle: Secondary text
   * - media: Image/icon shown
   */
  preview: {
    select: {
      title: 'name',    // Use the 'name' field as the title
      media: 'image',   // Use the 'image' field as the thumbnail
    },
  },
}

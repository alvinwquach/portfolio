/**
 * Testimonial Schema
 * ==================
 *
 * WHAT IS THIS?
 * - Stores recommendations and quotes from others
 * - Adds social proof to your portfolio
 * - Can link to projects you worked on together
 *
 * WHY TESTIMONIALS MATTER:
 * - Third-party validation of your skills
 * - Shows you work well with others
 * - More credible than self-promotion
 * - Especially valuable from managers or clients
 *
 * SOURCES FOR TESTIMONIALS:
 * - LinkedIn recommendations (ask permission to use)
 * - Client feedback emails
 * - Performance review quotes
 * - Slack messages (with permission)
 *
 * SCHEMA FEATURES:
 * - Reference to project (optional link)
 * - Relationship type (client, manager, colleague)
 * - Featured flag for homepage display
 */
export const testimonial = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  description: 'Recommendations and testimonials from clients, colleagues, or managers',

  fields: [
    /**
     * THE QUOTE - Required
     * - type: 'text' for multi-line without rich text
     * - rows: 4 gives more space for longer quotes
     * - This is the main content of the testimonial
     */
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description: 'The testimonial text',
      validation: (rule: any) => rule.required(),
    },

    // ========================================
    // WHO GAVE THE TESTIMONIAL
    // ========================================

    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
      description: 'Name of the person giving the testimonial',
      validation: (rule: any) => rule.required(),
    },

    {
      name: 'role',
      title: 'Author Role',
      type: 'string',
      description: 'Their job title (e.g., "Engineering Manager at Google")',
    },

    {
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'Company they work at',
    },

    /**
     * RELATIONSHIP TYPE
     * - How you worked together
     * - Helps contextualize the testimonial
     * - "Manager" testimonials often carry more weight
     */
    {
      name: 'relationship',
      title: 'Relationship',
      type: 'string',
      description: 'How you worked together',
      options: {
        list: [
          { title: 'Client', value: 'client' },
          { title: 'Manager', value: 'manager' },
          { title: 'Colleague', value: 'colleague' },
          { title: 'Mentor', value: 'mentor' },
          { title: 'Other', value: 'other' },
        ],
      },
    },

    // ========================================
    // LINKING & CREDIBILITY
    // ========================================

    /**
     * PROJECT REFERENCE - Single Reference (not array)
     * - Links to ONE project you worked on together
     * - Note: 'reference' type (singular), not array
     * - Optional: Leave blank if not project-specific
     *
     * DIFFERENCE FROM ARRAY OF REFERENCES:
     * - Single: { type: 'reference', to: [...] }
     * - Array: { type: 'array', of: [{ type: 'reference', to: [...] }] }
     *
     * Use single when there's only one possible link.
     */
    {
      name: 'project',
      title: 'Related Project',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Link to a project you worked on together (optional)',
    },

    /**
     * AUTHOR PHOTO
     * - Adds credibility and personalization
     * - hotspot: true for smart cropping
     * - Usually a headshot from LinkedIn
     */
    {
      name: 'image',
      title: 'Author Photo',
      type: 'image',
      description: 'Photo of the person giving the testimonial',
      options: {
        hotspot: true,
      },
    },

    /**
     * LINKEDIN URL
     * - Adds credibility (proves they're real)
     * - Viewers can verify the person exists
     * - type: 'url' validates URL format
     */
    {
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Link to their LinkedIn for credibility',
    },

    // ========================================
    // DISPLAY CONTROLS
    // ========================================

    /**
     * FEATURED FLAG
     * - Boolean toggle for prominence
     * - Featured testimonials might appear on homepage
     * - initialValue: false means off by default
     *
     * QUERY PATTERN:
     *   *[_type == "testimonial" && featured == true]
     */
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this testimonial prominently',
      initialValue: false,
    },
  ],

  /**
   * PREVIEW WITH MULTIPLE FIELDS
   * - title: Author name
   * - subtitle: Their role/title
   * - media: Their photo
   *
   * Makes testimonials easy to identify in Studio lists.
   */
  preview: {
    select: {
      title: 'author',
      subtitle: 'role',
      media: 'image',
    },
  },
}

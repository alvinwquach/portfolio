/**
 * Education Schema
 * ================
 *
 * WHAT IS THIS?
 * - Simple schema for educational background
 * - Degrees, certifications, bootcamps, courses
 * - Simpler than Experience/Project - just the basics
 *
 * WHEN TO USE THIS:
 * - University degrees
 * - Coding bootcamps (e.g., "Hack Reactor")
 * - Online certifications (e.g., "AWS Certified Developer")
 * - Relevant coursework or programs
 *
 * SCHEMA DESIGN NOTE:
 * This is a "simple" schema - fewer fields, straightforward structure.
 * Not every schema needs to be complex! Simple schemas are:
 * - Faster to fill out
 * - Easier to maintain
 * - Less cognitive load for content editors
 *
 * Start simple, add complexity only when needed.
 */
export const education = {
  name: 'education',
  title: 'Education',
  type: 'document',
  description: 'Your educational background',

  fields: [
    /**
     * REQUIRED FIELDS
     * - institution: Where you studied
     * - degree: What you earned
     *
     * These two are required because every education entry
     * should at minimum have these.
     */
    {
      name: 'institution',
      title: 'Institution',
      type: 'string',
      description: 'Name of the school or program',
      validation: (rule: any) => rule.required(),
    },

    {
      name: 'degree',
      title: 'Degree / Certificate',
      type: 'string',
      description: 'Type of degree or certificate earned',
      validation: (rule: any) => rule.required(),
    },

    /**
     * OPTIONAL FIELDS
     * - No validation = optional
     * - Can be left blank
     */
    {
      name: 'field',
      title: 'Field of Study',
      type: 'string',
      description: 'Major or area of focus',
    },

    /**
     * GRADUATION YEAR AS NUMBER
     * - Using 'number' type, not 'date'
     * - Simpler: Just the year (2023, 2024)
     * - Easier to sort and compare
     *
     * NOTE: Could also use 'string' for flexibility:
     * "Expected 2025", "In Progress", etc.
     */
    {
      name: 'graduationYear',
      title: 'Graduation Year',
      type: 'number',
      description: 'Year you graduated or completed the program',
    },

    /**
     * DESCRIPTION - Multi-line text
     * - For additional details
     * - Honors, relevant coursework, thesis, etc.
     * - rows: 3 sets the textarea height (hint only)
     */
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Additional details about your studies or achievements',
    },

    /**
     * ORDER FIELD - Manual sorting
     * - Common pattern across schemas
     * - Lets you control display order
     * - Lower numbers = higher in list
     */
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],

  /**
   * ORDERINGS
   * - Sort by graduation year, newest first
   * - direction: 'desc' = descending (2024, 2023, 2022...)
   * - direction: 'asc' = ascending (2020, 2021, 2022...)
   */
  orderings: [
    {
      title: 'Graduation Year, Newest',
      name: 'graduationYearDesc',
      by: [{ field: 'graduationYear', direction: 'desc' }],
    },
  ],

  /**
   * SIMPLE PREVIEW
   * - institution as title: "Stanford University"
   * - degree as subtitle: "B.S. Computer Science"
   */
  preview: {
    select: {
      title: 'institution',
      subtitle: 'degree',
    },
  },
}

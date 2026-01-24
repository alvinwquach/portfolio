/**
 * Skill Schema
 * ============
 *
 * WHAT IS THIS?
 * - A simple document type for storing technical skills
 * - Skills are REFERENCED by other documents (projects, experiences)
 * - This creates a centralized "source of truth" for your tech stack
 *
 * WHY SEPARATE SKILL DOCUMENTS?
 * Instead of typing "React" in every project, you:
 * 1. Create ONE "React" skill document
 * 2. Reference it from multiple projects
 *
 * Benefits:
 * - Consistent naming (no "React" vs "ReactJS" vs "react.js")
 * - Easy to update (change once, updates everywhere)
 * - Can add metadata (category, icon, proficiency level)
 * - Enables filtering and grouping
 *
 * HOW REFERENCES WORK:
 *
 * In project.ts, you'll see:
 *   {
 *     name: 'techStack',
 *     type: 'array',
 *     of: [{ type: 'reference', to: [{ type: 'skill' }] }]
 *   }
 *
 * This means:
 * - techStack is an array of references
 * - Each reference points to a skill document
 * - In GROQ, you "expand" references: techStack[]->{ name, category }
 *
 * GROQ QUERY EXAMPLES:
 *
 * Get all skills:
 *   *[_type == "skill"]
 *
 * Get skills by category:
 *   *[_type == "skill" && category == "frontend"]
 *
 * Get a project with expanded skills:
 *   *[_type == "project"][0]{
 *     name,
 *     techStack[]->{ name, category }
 *   }
 *
 * The -> operator "dereferences" (follows) the reference
 */
export const skill = {
  name: 'skill',
  title: 'Skill',
  type: 'document',
  description: 'Technical skills that can be linked to projects',

  fields: [
    {
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      description: 'The name of the technology (e.g., "Next.js", "PostgreSQL")',
      validation: (rule: any) => rule.required(),
    },

    /**
     * CATEGORY WITH OPTIONS LIST
     * - Groups skills for organized display
     * - options.list creates a dropdown in Studio
     * - Frontend can use this to render skills by category
     *
     * PATTERN: Use descriptive values
     * - value: 'databases' (programmatic, lowercase)
     * - title: 'Databases & Storage' (human-readable)
     */
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Group skills by category for organized display',
      options: {
        list: [
          { title: 'Databases & Storage', value: 'databases' },
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend & APIs', value: 'backend' },
          { title: 'Data & Machine Learning', value: 'data-ml' },
          { title: 'Testing & QA', value: 'testing' },
          { title: 'Project & Workflow Tools', value: 'project-tools' },
          { title: 'Analytics, Monitoring & Integrations', value: 'analytics' },
          { title: 'CMS', value: 'cms' },
          { title: 'Communication & Documentation', value: 'communication' },
          { title: 'Product & Strategy', value: 'product' },
          { title: 'Community & Advocacy', value: 'community' },
        ],
      },
      validation: (rule: any) => rule.required(),
    },
  ],

  /**
   * SIMPLE PREVIEW
   * - title: The skill name
   * - subtitle: The category (helps identify skills in lists)
   *
   * When you reference a skill from a project, Studio uses this
   * preview to show what you're selecting
   */
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
}

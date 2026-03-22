import { defineField, defineType } from "sanity";

/**
 * Demo / Media Schema
 * ===================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema captures visual evidence of your work: videos, screenshots,
 * GIFs, interactive demos, and diagrams. It's your portfolio's proof
 * that you actually built the things you claim to have built.
 *
 * WHY CAPTURE DEMOS?
 * ------------------
 * Words describe what you did. Demos SHOW what you did.
 *
 * Benefits of good demos:
 *   1. Prove your work is real and functional
 *   2. Show the actual user experience
 *   3. Highlight specific features or interactions
 *   4. Make your portfolio more engaging
 *   5. Create shareable content for social media
 *
 * INTERVIEW VALUE:
 * ----------------
 * "Show me something you've built"
 * "Walk me through this feature"
 *
 * With demos ready, you can immediately share:
 *   - A video walkthrough of the feature
 *   - An interactive demo they can try
 *   - Screenshots showing the before/after
 *
 * TYPES OF DEMOS:
 * ---------------
 *
 * 1. VIDEO
 *    - Feature walkthroughs
 *    - Tutorial content
 *    - Bug reproduction
 *    - Loom recordings for context
 *
 * 2. SCREENSHOT
 *    - UI designs
 *    - Before/after comparisons
 *    - Error states
 *    - Data visualizations
 *
 * 3. GIF
 *    - Quick interactions
 *    - Loading states
 *    - Animations
 *    - Hover effects
 *
 * 4. INTERACTIVE
 *    - CodeSandbox embeds
 *    - StackBlitz projects
 *    - Deployed prototypes
 *    - Playground environments
 *
 * 5. SLIDES
 *    - Presentation decks
 *    - Technical talks
 *    - Architecture overviews
 *
 * 6. DIAGRAM
 *    - Architecture diagrams
 *    - Data flow visualizations
 *    - System design sketches
 *
 * SCHEMA DESIGN DECISIONS:
 * ------------------------
 *
 * 1. MEDIA TYPE FIELD
 *    Different types need different displays:
 *    - video: Embed player
 *    - screenshot: Image gallery
 *    - interactive: iframe embed
 *
 * 2. MULTIPLE SOURCE OPTIONS
 *    - image: Upload directly to Sanity
 *    - videoUrl: YouTube, Vimeo, Loom links
 *    - embedCode: For CodeSandbox, StackBlitz
 *    - demoUrl: Live deployed demos
 *
 * 3. HOTSPOT-ENABLED IMAGES
 *    Sanity's image cropping respects hotspot
 *    Set the focus point for smart cropping
 *
 * 4. FEATURED FLAG
 *    Mark the best demos for homepage display
 *
 * 5. ORDER FIELD
 *    Control display order in galleries
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // Get featured demos for homepage
 * *[_type == "demo" && featured == true] | order(order asc) {
 *   title,
 *   mediaType,
 *   image,
 *   videoUrl,
 *   demoUrl,
 *   "project": relatedProject->title
 * }
 *
 * // Get all demos for a project
 * *[_type == "demo" && references($projectId)] | order(order asc) {
 *   title,
 *   description,
 *   mediaType,
 *   image,
 *   videoUrl
 * }
 *
 * // Get interactive demos only
 * *[_type == "demo" && mediaType == "interactive"] {
 *   title,
 *   embedCode,
 *   demoUrl
 * }
 *
 * DATA STRUCTURE:
 * ---------------
 *
 * {
 *   _type: "demo",
 *   title: "Knowledge Base 3D Prototype",
 *   slug: { current: "knowledge-base-3d-prototype" },
 *   description: "Interactive 3D visualization of connected knowledge nodes",
 *   mediaType: "interactive",
 *   demoUrl: "https://portfolio.dev/demos/knowledge-3d",
 *   embedCode: "<iframe src='...'></iframe>",
 *   relatedProject: { _ref: "project-portfolio" },
 *   tags: [{ _ref: "tag-threejs" }],
 *   featured: true,
 *   order: 1
 * }
 *
 * BEST PRACTICES:
 * ---------------
 *
 * Videos:
 *   - Keep under 2 minutes for feature demos
 *   - Add captions for accessibility
 *   - Use Loom for quick recordings
 *
 * Screenshots:
 *   - Use consistent dimensions
 *   - Add alt text for accessibility
 *   - Include captions for context
 *
 * GIFs:
 *   - Optimize file size
 *   - Keep loops short
 *   - Consider using video for larger animations
 *
 * Interactive:
 *   - Test embed on multiple devices
 *   - Provide fallback for non-supporting browsers
 *   - Keep examples focused
 *
 * RELATED SCHEMAS:
 * ----------------
 * - project: Link demos to projects
 * - experiment: Demo results of experiments
 * - tag: Categorize by technology
 * - knowledgeNode: Embed in blog posts
 */
export const demo = defineType({
  name: "demo",
  title: "Demo / Media",
  type: "document",
  icon: () => "🎬",
  fields: [
    // ============================================
    // CORE IDENTIFICATION
    // ============================================

    /**
     * Demo Title
     * Descriptive name for this demo
     */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "What is this demo showing?",
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
     * Description
     * Context about what this demo shows
     */
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Brief context about what this demo shows",
    }),

    // ============================================
    // MEDIA TYPE & CONTENT
    // ============================================

    /**
     * Demo Type
     *
     * What kind of demo is this?
     * Determines how it's displayed.
     */
    defineField({
      name: "demoType",
      title: "Demo Type",
      type: "string",
      description: "What type of media is this?",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "Screenshot", value: "screenshot" },
          { title: "GIF", value: "gif" },
          { title: "Interactive Demo", value: "interactive" },
          { title: "Slide Deck", value: "slides" },
          { title: "Diagram", value: "diagram" },
        ],
      },
    }),

    /**
     * Image Upload
     *
     * For screenshots, GIFs, diagrams.
     * Hotspot enables smart cropping.
     */
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Upload screenshot, GIF, or diagram",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Describe the image for accessibility",
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
          description: "Optional caption to display",
        },
      ],
    }),

    /**
     * Video URL
     *
     * For videos hosted on YouTube, Vimeo, Loom, etc.
     */
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "YouTube, Vimeo, or Loom link",
    }),

    /**
     * Embed Code
     *
     * For interactive demos like CodeSandbox, StackBlitz.
     * Paste the full iframe/embed code.
     */
    defineField({
      name: "embedCode",
      title: "Embed Code",
      type: "text",
      description: "For interactive demos (CodeSandbox, StackBlitz, etc.)",
    }),

    /**
     * Live Demo URL
     *
     * Link to a deployed demo.
     */
    defineField({
      name: "demoUrl",
      title: "Live Demo URL",
      type: "url",
      description: "Link to the live demo",
    }),

    // ============================================
    // RELATIONSHIPS
    // ============================================

    /**
     * Related Project
     * Which project is this demo for?
     */
    defineField({
      name: "relatedProject",
      title: "Related Project",
      type: "reference",
      to: [{ type: "project" }],
      description: "Which project is this demo for?",
    }),

    /**
     * Related Experiment
     * If this demo is from an experiment
     */
    defineField({
      name: "relatedExperiment",
      title: "Related Experiment",
      type: "reference",
      to: [{ type: "experiment" }],
      description: "If this demo is from an experiment",
    }),

    /**
     * Tags
     * Topics for this demo
     */
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description: "Topics for categorization",
    }),

    /**
     * Tech Stack
     * Technologies shown in this demo (as strings)
     * For quick reference without needing skill documents
     */
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
      description: "Technologies used (e.g., 'Next.js', 'Three.js')",
    }),

    // ============================================
    // DISPLAY OPTIONS
    // ============================================

    /**
     * Featured
     *
     * Mark as featured to show on homepage.
     */
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage?",
      initialValue: false,
    }),

    /**
     * Display Order
     *
     * Control the order in galleries.
     * Lower numbers appear first.
     */
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],

  // ============================================
  // PREVIEW CONFIGURATION
  // ============================================
  preview: {
    select: {
      title: "title",
      type: "demoType",
      media: "image",
      featured: "featured",
    },
    prepare({ title, type, media, featured }) {
      return {
        title: `${featured ? "⭐ " : ""}${title}`,
        subtitle: type || "media",
        media,
      };
    },
  },
});

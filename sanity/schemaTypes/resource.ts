import { defineField, defineType } from "sanity";

/**
 * Resource / Reference Schema
 * ===========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema creates a personal library of useful external resources:
 * documentation, articles, tutorials, videos, books, and tools that
 * you've found valuable in your learning and work.
 *
 * WHY TRACK RESOURCES?
 * --------------------
 * As a developer, you constantly learn from external sources:
 *   - Official documentation
 *   - Blog posts and tutorials
 *   - Conference talks and videos
 *   - Books and courses
 *   - Useful tools and repositories
 *
 * Tracking these helps you:
 *   1. Build a searchable knowledge library
 *   2. Share resources with others
 *   3. Remember why something was useful
 *   4. Connect resources to projects/concepts
 *   5. Rate and prioritize the best content
 *
 * INTERVIEW VALUE:
 * ----------------
 * "How do you stay up-to-date with technology?"
 *
 * With this data, you can say:
 * "I maintain a curated resource library. For example, when learning
 * about React Server Components, I found these 5 key resources that
 * I've rated and annotated. The highest-rated one is..."
 *
 * SCHEMA DESIGN DECISIONS:
 * ------------------------
 *
 * 1. RESOURCE TYPE FIELD
 *    Categorizes resources for filtering:
 *    - docs: Official documentation
 *    - article: Blog posts, Medium articles
 *    - tutorial: Step-by-step guides
 *    - video: YouTube, conference talks
 *    - course: Udemy, Coursera, etc.
 *    - book: Physical or ebook
 *    - tool: Useful software/websites
 *    - repo: GitHub repositories
 *    - paper: Academic research
 *
 * 2. RATING FIELD
 *    1-5 star rating helps prioritize the best resources
 *    When recommending resources, show highest-rated first
 *
 * 3. PERSONAL NOTES
 *    Rich text for your takeaways and highlights
 *    What made this resource valuable?
 *
 * 4. RELATIONSHIPS
 *    - Tags: For topic-based filtering
 *    - Projects: Resources used for specific projects
 *    - Knowledge Nodes: Link to your own content about this topic
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // Get top-rated resources by type
 * *[_type == "resource" && rating >= 4] | order(rating desc) {
 *   title,
 *   url,
 *   resourceType,
 *   rating,
 *   summary
 * }
 *
 * // Find resources for a specific topic
 * *[_type == "resource" && references(*[_type == "tag" && name == "React"]._id)] {
 *   title,
 *   resourceType,
 *   rating,
 *   url
 * }
 *
 * // Get resources used for a project
 * *[_type == "resource" && references($projectId)] {
 *   title,
 *   resourceType,
 *   notes
 * }
 *
 * DATA STRUCTURE:
 * ---------------
 *
 * {
 *   _type: "resource",
 *   title: "React Server Components Deep Dive",
 *   slug: { current: "rsc-deep-dive" },
 *   url: "https://example.com/rsc-article",
 *   summary: "Best explanation of RSC architecture I've found",
 *   resourceType: "article",
 *   rating: 5,
 *   notes: [...portable text with highlights...],
 *   tags: [{ _ref: "tag-react" }, { _ref: "tag-rsc" }],
 *   relatedProjects: [{ _ref: "project-portfolio" }],
 *   relatedNodes: [{ _ref: "node-rsc-concepts" }],
 *   dateAdded: "2024-01-15"
 * }
 *
 * DISPLAY IDEAS:
 * --------------
 * - Resource library with filters by type/tag
 * - Star ratings for quick quality assessment
 * - "Recommended" section with 5-star resources
 * - Reading list / learning path view
 *
 * RELATED SCHEMAS:
 * ----------------
 * - tag: For categorization
 * - project: Link resources to projects
 * - knowledgeNode: Your own content about the topic
 * - citation: For academic papers (more formal)
 */
export const resource = defineType({
  name: "resource",
  title: "Resource / Reference",
  type: "document",
  icon: () => "📚",
  fields: [
    // ============================================
    // CORE IDENTIFICATION
    // ============================================

    /**
     * Resource Title
     * The name of the article, video, book, etc.
     */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The resource's title or name",
      validation: (Rule) => Rule.required(),
    }),

    /**
     * URL-friendly Slug
     * For linking and routing
     */
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    /**
     * Resource URL
     * Link to the actual resource
     */
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "Link to the resource",
      validation: (Rule) => Rule.required(),
    }),

    /**
     * Summary / Why Valuable
     * Quick description of why this resource is worth saving
     */
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Why is this resource valuable? What's the key insight?",
    }),

    // ============================================
    // CLASSIFICATION
    // ============================================

    /**
     * Resource Type
     *
     * What kind of resource is this?
     * Helps with filtering and display
     */
    defineField({
      name: "resourceType",
      title: "Type",
      type: "string",
      description: "What kind of resource is this?",
      options: {
        list: [
          { title: "Documentation", value: "docs" },
          { title: "Article", value: "article" },
          { title: "Tutorial", value: "tutorial" },
          { title: "Video", value: "video" },
          { title: "Course", value: "course" },
          { title: "Book", value: "book" },
          { title: "Tool", value: "tool" },
          { title: "Repository", value: "repo" },
          { title: "Research Paper", value: "paper" },
        ],
      },
    }),

    /**
     * Tags for Categorization
     * Link to reusable tag documents
     */
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description: "Topics this resource covers",
    }),

    // ============================================
    // RELATIONSHIPS
    // ============================================

    /**
     * Related Projects
     * Projects where you applied this resource's knowledge
     */
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      description: "Projects where you used this resource",
    }),

    /**
     * Related Knowledge Nodes
     * Your own content related to this resource's topic
     */
    defineField({
      name: "relatedNodes",
      title: "Related Knowledge Nodes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "knowledgeNode" }] }],
      description: "Your notes/content about this topic",
    }),

    // ============================================
    // PERSONAL ANNOTATIONS
    // ============================================

    /**
     * Personal Notes (Rich Text)
     *
     * Your takeaways, highlights, and key insights.
     * What did you learn from this resource?
     */
    defineField({
      name: "notes",
      title: "Personal Notes",
      type: "array",
      of: [{ type: "block" }],
      description: "Key takeaways or notes from this resource",
    }),

    /**
     * Rating (1-5 Stars)
     *
     * How useful was this resource?
     * 5 = Must-read, share with everyone
     * 4 = Very useful, would recommend
     * 3 = Good, worth the time
     * 2 = Okay, some useful parts
     * 1 = Not recommended
     */
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "How useful was this? (1-5 stars)",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),

    /**
     * Date Added
     * When you saved this resource
     */
    defineField({
      name: "dateAdded",
      title: "Date Added",
      type: "date",
      description: "When you discovered/saved this resource",
    }),
  ],

  // ============================================
  // PREVIEW CONFIGURATION
  // ============================================
  preview: {
    select: { title: "title", type: "resourceType", rating: "rating" },
    prepare({ title, type, rating }) {
      // Show star rating visually
      const stars = rating ? "⭐".repeat(rating) : "";
      return {
        title,
        subtitle: `${type || "resource"} ${stars}`,
      };
    },
  },
});

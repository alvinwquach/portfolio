import { defineField, defineType } from "sanity";

/**
 * Tag Schema
 * ==========
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema defines reusable tags (or labels) that can be attached to any
 * content in your portfolio—knowledge nodes, projects, citations, etc.
 *
 * Think of tags like hashtags on social media or labels in Gmail. They help:
 *   - Organize content into categories
 *   - Enable filtering on your website
 *   - Create connections between related content
 *   - Help visitors find what they're looking for
 *
 * WHY TAGS AS A SEPARATE DOCUMENT TYPE?
 * -------------------------------------
 * You might wonder: why not just use string arrays for tags?
 *
 * BAD APPROACH (string arrays):
 *   tags: ["react", "React", "ReactJS"]  // Inconsistent!
 *
 * GOOD APPROACH (reference documents):
 *   tags: [{ _ref: "tag-react-abc123" }]  // Always consistent
 *
 * Benefits of Tag documents:
 *   1. Consistency: "React" is always spelled the same way
 *   2. Metadata: Each tag can have a color, category, description
 *   3. Relationships: Can see all content with a specific tag
 *   4. UI: Autocomplete in Sanity Studio when adding tags
 *   5. Queries: Powerful GROQ queries across tagged content
 *
 * HOW TAGS CONNECT CONTENT:
 * -------------------------
 *
 *                          ┌─────────────────┐
 *                          │     TAG         │
 *                          │   "React"       │
 *                          │   #3B82F6       │
 *                          └────────┬────────┘
 *                                   │
 *          ┌────────────────────────┼────────────────────────┐
 *          │                        │                        │
 *          ▼                        ▼                        ▼
 *   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
 *   │   PROJECT   │         │  KNOWLEDGE  │         │  CITATION   │
 *   │  "Portfolio │         │    NODE     │         │  "React     │
 *   │   Website"  │         │  "React     │         │   Fiber"    │
 *   │             │         │   Hooks     │         │   paper     │
 *   │             │         │   Guide"    │         │             │
 *   └─────────────┘         └─────────────┘         └─────────────┘
 *
 * This allows visitors to click "React" and see:
 *   - All projects using React
 *   - All blog posts about React
 *   - All citations about React architecture
 *
 * FIELD EXPLANATIONS:
 * -------------------
 *
 * name: The display name of the tag
 *   - "React"
 *   - "TypeScript"
 *   - "System Design"
 *   - "Machine Learning"
 *
 * slug: URL-friendly version
 *   - Used for: /tags/react or /blog?tag=react
 *   - Auto-generated from name
 *   - Example: "machine-learning" from "Machine Learning"
 *
 * category: What kind of tag is this?
 *   - technology: Programming languages, frameworks, tools
 *     Examples: "React", "TypeScript", "PostgreSQL"
 *
 *   - concept: Technical concepts and patterns
 *     Examples: "Design Patterns", "Data Structures", "REST"
 *
 *   - project: Project-specific tags
 *     Examples: "Open Source", "Client Work", "Side Project"
 *
 *   - topic: General subject areas
 *     Examples: "Performance", "Security", "DevOps"
 *
 * color: Hex color for visual display
 *   - Makes tags visually distinctive
 *   - Example: "#3B82F6" (React blue)
 *   - Used in tag badges/pills on the website
 *
 * THE SLUG TYPE EXPLAINED:
 * ------------------------
 * A "slug" is a URL-friendly string. Sanity's slug type:
 *
 *   1. Auto-generates from source field (name in this case)
 *   2. Converts to lowercase
 *   3. Replaces spaces with hyphens
 *   4. Removes special characters
 *
 * Example:
 *   name: "Machine Learning & AI"
 *   slug: { current: "machine-learning-ai" }
 *
 * In GROQ, access with: tag.slug.current
 *
 * GROQ QUERY EXAMPLES:
 * --------------------
 *
 * // Get all tags
 * *[_type == "tag"] | order(name asc) {
 *   name,
 *   "slug": slug.current,
 *   category,
 *   color
 * }
 *
 * // Get tags by category
 * *[_type == "tag" && category == "technology"] | order(name asc) {
 *   name,
 *   color
 * }
 *
 * // Get all content with a specific tag
 * *[references(*[_type == "tag" && slug.current == "react"]._id)] {
 *   _type,
 *   title,
 *   "slug": slug.current
 * }
 *
 * // Get tags with content counts
 * *[_type == "tag"] {
 *   name,
 *   "slug": slug.current,
 *   "projectCount": count(*[_type == "project" && references(^._id)]),
 *   "nodeCount": count(*[_type == "knowledgeNode" && references(^._id)]),
 *   "citationCount": count(*[_type == "citation" && references(^._id)])
 * }
 *
 * // Get "related" tags (tags that appear alongside a given tag)
 * *[_type == "knowledgeNode" && references(*[_type == "tag" && slug.current == "react"]._id)] {
 *   "relatedTags": tags[]->name
 * }
 *
 * // Get popular tags (most frequently used)
 * // Note: This requires counting references, which is expensive
 * // Consider caching this query result
 *
 * INTERVIEW VALUE:
 * ----------------
 * A tagging system demonstrates:
 *   1. Information architecture thinking
 *   2. Understanding of database normalization
 *   3. UX consideration (findability)
 *   4. Content strategy awareness
 *   5. System design for relationships
 *
 * PSEUDOCODE FOR RENDERING TAGS:
 * ------------------------------
 *
 * function renderTagBadge(tag):
 *   // Use the tag's color or fall back to category-based color
 *   backgroundColor = tag.color || categoryColors[tag.category] || defaultColor
 *
 *   return (
 *     <Link href={`/tags/${tag.slug.current}`}>
 *       <Badge
 *         backgroundColor={backgroundColor}
 *         textColor={getContrastColor(backgroundColor)}
 *       >
 *         {tag.name}
 *       </Badge>
 *     </Link>
 *   )
 *
 * function renderTagCloud(tags, counts):
 *   // Sort by count for "cloud" effect
 *   sortedTags = tags.sortBy(t => counts[t._id]).reverse()
 *
 *   return (
 *     <TagCloud>
 *       for tag in sortedTags:
 *         // Size based on popularity
 *         fontSize = calculateFontSize(counts[tag._id], minCount, maxCount)
 *
 *         <Tag
 *           href={`/tags/${tag.slug.current}`}
 *           style={{ fontSize }}
 *           color={tag.color}
 *         >
 *           {tag.name} ({counts[tag._id]})
 *         </Tag>
 *     </TagCloud>
 *   )
 *
 * function renderFilterableTags(allTags, selectedTags, onToggle):
 *   return (
 *     <FilterBar>
 *       for tag in allTags:
 *         isSelected = selectedTags.includes(tag.slug.current)
 *
 *         <FilterButton
 *           active={isSelected}
 *           onClick={() => onToggle(tag.slug.current)}
 *           backgroundColor={isSelected ? tag.color : "transparent"}
 *         >
 *           {tag.name}
 *         </FilterButton>
 *     </FilterBar>
 *   )
 *
 * SUGGESTED INITIAL TAGS:
 * -----------------------
 * Technologies: React, TypeScript, Next.js, Node.js, Python, PostgreSQL
 * Concepts: REST API, GraphQL, Testing, Performance, Security, Accessibility
 * Project Types: Open Source, Client Work, Personal, Tutorial
 * Topics: Frontend, Backend, DevOps, Machine Learning, Mobile
 *
 * RELATED FILES:
 * --------------
 * - sanity/schemaTypes/knowledgeNode.ts: Uses tags for categorization
 * - sanity/schemaTypes/project.ts: Uses tags for tech stack
 * - sanity/schemaTypes/citation.ts: Uses tags for topic organization
 * - sanity/schemaTypes/experiment.ts: Uses tags for categorization
 *
 * DOCUMENTATION:
 * --------------
 * - Sanity Slug Type: https://www.sanity.io/docs/slug-type
 * - Sanity References: https://www.sanity.io/docs/reference-type
 * - GROQ References Query: https://www.sanity.io/docs/groq-reference#references
 */
export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: () => "🏷️",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Technology", value: "technology" },
          { title: "Concept", value: "concept" },
          { title: "Project", value: "project" },
          { title: "Topic", value: "topic" },
        ],
      },
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Hex color for display (e.g., #3B82F6)",
    }),
  ],
  preview: {
    select: { title: "name", category: "category" },
    prepare({ title, category }) {
      return { title, subtitle: category };
    },
  },
});

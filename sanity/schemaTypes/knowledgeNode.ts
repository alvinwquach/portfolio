import { defineField, defineType } from "sanity";

/**
 * Knowledge Node Schema
 * =====================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This is the CORE content type of your portfolio—a flexible schema that
 * represents any piece of knowledge you want to share or document.
 *
 * Think of it as a "smart blog post" that can be:
 *   - A tutorial you wrote
 *   - A bug you fixed (and how)
 *   - An architectural decision you made
 *   - A concept you learned
 *   - A feature you built
 *   - A data visualization
 *
 * THE "KNOWLEDGE NODE" CONCEPT:
 * -----------------------------
 * The name "Knowledge Node" comes from graph theory and knowledge management.
 * Each piece of knowledge is a "node" that can connect to other nodes.
 *
 * Traditional blog: Linear list of posts
 *   Post 1 → Post 2 → Post 3 → Post 4
 *
 * Knowledge Graph: Interconnected web of ideas
 *
 *       ┌──────────┐
 *       │ Tutorial │
 *       │  React   │
 *       │  Hooks   │
 *       └────┬─────┘
 *            │ related
 *   ┌────────┴────────┐
 *   ▼                 ▼
 * ┌──────────┐   ┌──────────┐
 * │   Bug    │───│ Decision │
 * │ useEffect│   │ Custom   │
 * │ Cleanup  │   │ Hooks    │
 * └────┬─────┘   └────┬─────┘
 *      │              │
 *      └──────┬───────┘
 *             ▼
 *       ┌──────────┐
 *       │ Concept  │
 *       │ React    │
 *       │ Lifecycle│
 *       └──────────┘
 *
 * WHY THIS MATTERS FOR INTERVIEWS:
 * --------------------------------
 * Interviewers love to ask:
 *   - "What bugs have you debugged?"
 *   - "Walk me through an architectural decision"
 *   - "How do you share knowledge with your team?"
 *   - "What's something complex you've learned recently?"
 *
 * Having documented knowledge nodes means you have SPECIFIC, DETAILED
 * examples ready for every behavioral question.
 *
 * NODE TYPES EXPLAINED:
 * ---------------------
 *
 * BUILD (🏗️)
 *   What: Features, implementations, shipped work
 *   Example: "Implemented real-time collaboration with WebSockets"
 *   Interview Use: "Tell me about a feature you shipped"
 *
 * BUG (🐛)
 *   What: Issues you encountered and how you fixed them
 *   Example: "Memory leak in React useEffect cleanup"
 *   Interview Use: "Tell me about a difficult bug you solved"
 *
 * DECISION (🤔)
 *   What: Architectural decisions with trade-offs
 *   Example: "Chose PostgreSQL over MongoDB for transactional consistency"
 *   Interview Use: "How do you make technical decisions?"
 *
 * CONCEPT (💡)
 *   What: Technical concepts, learnings, mental models
 *   Example: "Understanding React's reconciliation algorithm"
 *   Interview Use: "Explain [X concept] to me"
 *
 * TUTORIAL (📚)
 *   What: Teaching content, how-to guides
 *   Example: "Building a custom React hook for form validation"
 *   Interview Use: Shows communication skills + depth of understanding
 *
 * CHART (📊)
 *   What: Data visualizations with D3.js or Chart.js
 *   Example: "Performance metrics dashboard"
 *   Interview Use: Shows data visualization skills
 *
 * FIELD EXPLANATIONS:
 * -------------------
 *
 * CORE FIELDS:
 *
 * title: Short, descriptive name
 *   - Keep under 100 characters
 *   - Be specific: "React useEffect Cleanup Bug" not "A Bug I Fixed"
 *
 * slug: URL-friendly identifier
 *   - Auto-generated from title
 *   - Used for: /blog/react-useeffect-cleanup-bug
 *
 * summary: 1-2 sentence overview
 *   - Appears in listings and previews
 *   - Maximum 300 characters
 *   - This is your "hook" to get readers interested
 *
 * content: Main body (Portable Text)
 *   - Rich text with formatting
 *   - Code blocks with syntax highlighting
 *   - Images with captions
 *   - This is where the detailed explanation goes
 *
 * CLASSIFICATION FIELDS:
 *
 * nodeType: What kind of knowledge is this?
 *   - Determines how it's displayed
 *   - Helps with filtering and organization
 *
 * status: Draft or Published
 *   - Draft: Only visible in preview mode
 *   - Published: Visible to everyone
 *
 * tags: Categorization labels
 *   - Reference to Tag documents
 *   - Example: ["react", "performance", "hooks"]
 *
 * HIERARCHY FIELDS:
 *
 * depthLevel: For 3D visualization (1-3)
 *   - Level 1: Foundational concepts
 *   - Level 2: Applied knowledge
 *   - Level 3: Advanced/specialized
 *
 * importance: Priority rating (1-5)
 *   - 5: Core/essential knowledge
 *   - 1: Minor notes or references
 *   - Used for sorting and featuring
 *
 * RELATIONSHIP FIELDS:
 *
 * relatedNodes: Links to other knowledge
 *   - Creates the "knowledge graph"
 *   - Shows how concepts connect
 *
 * relatedProjects: Links to projects
 *   - "This bug was in this project"
 *   - "This decision was made for this project"
 *
 * CHART-SPECIFIC FIELDS:
 *
 * chartData: Only visible when nodeType === "chart"
 *   - chartType: bar, line, pie, scatter, d3-custom
 *   - data: JSON array of data points
 *   - options: Chart configuration
 *
 * codeSnippet: Optional code for demos
 *   - For charts: D3.js code
 *   - For tutorials: Implementation code
 *
 * METADATA FIELDS:
 *
 * publishedAt: When this was published
 *   - Used for sorting by date
 *   - Displayed on the page
 *
 * featured: Show on homepage?
 *   - Boolean flag
 *   - Highlights your best content
 *
 * PORTABLE TEXT EXPLAINED:
 * ------------------------
 * The "content" field uses Sanity's Portable Text format.
 * It's more flexible than plain HTML:
 *
 * Structure:
 *   [
 *     { _type: "block", style: "h2", children: [...] },
 *     { _type: "block", style: "normal", children: [...] },
 *     { _type: "code", language: "typescript", code: "..." },
 *     { _type: "image", asset: { _ref: "..." }, alt: "..." }
 *   ]
 *
 * Benefits:
 *   - Platform-agnostic (render to HTML, React, mobile, etc.)
 *   - Structured (can extract headings for TOC)
 *   - Extensible (add custom blocks like callouts)
 *
 * CONDITIONAL FIELDS (HIDDEN):
 * ----------------------------
 * The chartData field uses Sanity's conditional visibility:
 *
 *   hidden: ({ parent }) => parent?.nodeType !== "chart"
 *
 * This means:
 *   - When nodeType is "chart": chartData field is visible
 *   - When nodeType is anything else: chartData is hidden
 *
 * This keeps the editing interface clean—you only see
 * fields relevant to the type of content you're creating.
 *
 * GROQ QUERY EXAMPLES:
 * --------------------
 *
 * // Get all published knowledge nodes
 * *[_type == "knowledgeNode" && status == "published"] | order(publishedAt desc) {
 *   title,
 *   "slug": slug.current,
 *   summary,
 *   nodeType,
 *   publishedAt,
 *   "tags": tags[]->name
 * }
 *
 * // Get featured nodes for homepage
 * *[_type == "knowledgeNode" && featured == true && status == "published"] | order(importance desc) [0...3] {
 *   title,
 *   "slug": slug.current,
 *   summary,
 *   nodeType
 * }
 *
 * // Get nodes by type (e.g., all bugs)
 * *[_type == "knowledgeNode" && nodeType == "bug" && status == "published"] {
 *   title,
 *   summary,
 *   content,
 *   "relatedProject": relatedProjects[0]->title
 * }
 *
 * // Get a single node with all relationships
 * *[_type == "knowledgeNode" && slug.current == $slug][0] {
 *   title,
 *   summary,
 *   content,
 *   nodeType,
 *   publishedAt,
 *   importance,
 *   "tags": tags[]-> { name, "slug": slug.current, color },
 *   "relatedNodes": relatedNodes[]-> { title, "slug": slug.current, nodeType },
 *   "relatedProjects": relatedProjects[]-> { title, "slug": slug.current }
 * }
 *
 * // Get "graph" data for 3D visualization
 * *[_type == "knowledgeNode" && status == "published"] {
 *   _id,
 *   title,
 *   nodeType,
 *   depthLevel,
 *   importance,
 *   "connections": relatedNodes[]._ref
 * }
 *
 * // Get chart nodes with their data
 * *[_type == "knowledgeNode" && nodeType == "chart"] {
 *   title,
 *   "slug": slug.current,
 *   chartData
 * }
 *
 * INTERVIEW VALUE:
 * ----------------
 * Knowledge nodes demonstrate:
 *   1. Technical depth (detailed explanations)
 *   2. Communication skills (teaching ability)
 *   3. Problem-solving (bug documentation)
 *   4. Decision-making (architectural decisions)
 *   5. Continuous learning (concepts)
 *   6. Organization (structured knowledge base)
 *
 * PSEUDOCODE FOR RENDERING:
 * -------------------------
 *
 * function renderKnowledgeNode(node):
 *   typeEmoji = getEmojiForType(node.nodeType)
 *
 *   return (
 *     <Article>
 *       <Header>
 *         <TypeBadge>{typeEmoji} {node.nodeType}</TypeBadge>
 *         <Title>{node.title}</Title>
 *         <Meta>
 *           <Date>{formatDate(node.publishedAt)}</Date>
 *           <Importance>{"⭐".repeat(node.importance)}</Importance>
 *         </Meta>
 *       </Header>
 *
 *       <Summary>{node.summary}</Summary>
 *
 *       if node.tags:
 *         <TagList>
 *           for tag in node.tags:
 *             <Tag color={tag.color}>{tag.name}</Tag>
 *         </TagList>
 *
 *       <Content>
 *         <PortableText value={node.content} components={customComponents} />
 *       </Content>
 *
 *       if node.nodeType == "chart" and node.chartData:
 *         <ChartRenderer
 *           type={node.chartData.chartType}
 *           data={JSON.parse(node.chartData.data)}
 *           options={JSON.parse(node.chartData.options)}
 *         />
 *
 *       if node.relatedNodes.length > 0:
 *         <RelatedSection title="Related Knowledge">
 *           for related in node.relatedNodes:
 *             <RelatedCard node={related} />
 *         </RelatedSection>
 *
 *       if node.relatedProjects.length > 0:
 *         <RelatedSection title="Related Projects">
 *           for project in node.relatedProjects:
 *             <ProjectCard project={project} />
 *         </RelatedSection>
 *     </Article>
 *   )
 *
 * CUSTOM ORDERINGS EXPLAINED:
 * ---------------------------
 * The "orderings" array defines sorting options in Sanity Studio:
 *
 *   orderings: [
 *     { title: "Importance", by: [{ field: "importance", direction: "desc" }] },
 *     { title: "Recently Published", by: [{ field: "publishedAt", direction: "desc" }] },
 *     { title: "Node Type", by: [{ field: "nodeType", direction: "asc" }] }
 *   ]
 *
 * This lets content editors sort the list by:
 *   - Most important first (importance: 5 → 1)
 *   - Newest first (date descending)
 *   - Grouped by type (alphabetical)
 *
 * RELATED FILES:
 * --------------
 * - sanity/schemaTypes/tag.ts: Tags for categorization
 * - sanity/schemaTypes/project.ts: Projects these nodes relate to
 * - sanity/schemaTypes/citation.ts: Academic sources referenced
 * - components/ (future): React components for rendering
 *
 * DOCUMENTATION:
 * --------------
 * - Portable Text: https://www.sanity.io/docs/block-type
 * - Conditional Fields: https://www.sanity.io/docs/conditional-fields
 * - Custom Orderings: https://www.sanity.io/docs/sort-orders
 * - Code Block Plugin: https://www.sanity.io/plugins/code-input
 */
export const knowledgeNode = defineType({
  name: "knowledgeNode",
  title: "Knowledge Node",
  type: "document",
  fields: [
    // ============================================
    // CORE FIELDS
    // ============================================
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Short descriptive title for the node",
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly unique identifier",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      description: "1-2 sentence overview of the node",
      rows: 2,
      validation: (Rule) => Rule.required().max(300),
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "Main body text with rich formatting",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
          },
        },
        {
          type: "code",
          title: "Code Block",
          options: {
            language: "typescript",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "Python", value: "python" },
              { title: "SQL", value: "sql" },
              { title: "Bash", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "CSS", value: "css" },
              { title: "HTML", value: "html" },
            ],
            withFilename: true,
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),

    // ============================================
    // CLASSIFICATION
    // ============================================
    defineField({
      name: "nodeType",
      title: "Node Type",
      type: "string",
      description: "What kind of knowledge is this?",
      options: {
        list: [
          { title: "Build", value: "build" },
          { title: "Bug", value: "bug" },
          { title: "Decision", value: "decision" },
          { title: "Concept", value: "concept" },
          { title: "Tutorial", value: "tutorial" },
          { title: "Chart", value: "chart" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "tag" }],
        },
      ],
      description: "Tags for filtering and categorization",
    }),

    // ============================================
    // HIERARCHY & IMPORTANCE
    // ============================================
    defineField({
      name: "depthLevel",
      title: "Depth Level",
      type: "number",
      description: "Hierarchy level for 3D visualization (1-3)",
      validation: (Rule) => Rule.min(1).max(3).integer(),
      initialValue: 1,
    }),

    defineField({
      name: "importance",
      title: "Importance",
      type: "number",
      description: "Priority rating (1-5, where 5 is most important)",
      validation: (Rule) => Rule.min(1).max(5).integer(),
      initialValue: 3,
    }),

    // ============================================
    // RELATIONSHIPS
    // ============================================
    defineField({
      name: "relatedNodes",
      title: "Related Nodes",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "knowledgeNode" }],
        },
      ],
      description: "Links to other knowledge nodes",
    }),

    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      description: "Projects this knowledge relates to",
    }),

    // ============================================
    // CHART DATA (for nodeType === "chart")
    // ============================================
    defineField({
      name: "chartData",
      title: "Chart Data",
      type: "object",
      description: "Data for visualizations (only for chart nodes)",
      hidden: ({ parent }) => parent?.nodeType !== "chart",
      fields: [
        defineField({
          name: "chartType",
          title: "Chart Type",
          type: "string",
          options: {
            list: [
              { title: "Bar Chart", value: "bar" },
              { title: "Line Chart", value: "line" },
              { title: "Pie Chart", value: "pie" },
              { title: "Scatter Plot", value: "scatter" },
              { title: "D3 Custom", value: "d3-custom" },
            ],
          },
        }),
        defineField({
          name: "data",
          title: "Chart Data (JSON)",
          type: "text",
          description: "JSON array of data points",
          rows: 10,
        }),
        defineField({
          name: "options",
          title: "Chart Options (JSON)",
          type: "text",
          description: "Configuration for axes, colors, labels",
          rows: 5,
        }),
      ],
    }),

    defineField({
      name: "codeSnippet",
      title: "Code Snippet",
      type: "code",
      description: "Optional code for charts or demos",
      options: {
        language: "typescript",
        languageAlternatives: [
          { title: "TypeScript", value: "typescript" },
          { title: "JavaScript", value: "javascript" },
          { title: "Python", value: "python" },
          { title: "D3.js", value: "javascript" },
        ],
        withFilename: true,
      },
    }),

    // ============================================
    // METADATA
    // ============================================
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "When this node was published",
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage or featured section",
      initialValue: false,
    }),
  ],

  // Preview configuration for Sanity Studio
  preview: {
    select: {
      title: "title",
      nodeType: "nodeType",
      status: "status",
      importance: "importance",
    },
    prepare({ title, nodeType, status, importance }) {
      const typeEmoji: Record<string, string> = {
        build: "🏗️",
        bug: "🐛",
        decision: "🤔",
        concept: "💡",
        tutorial: "📚",
        chart: "📊",
      };
      return {
        title,
        subtitle: `${typeEmoji[nodeType] || "📝"} ${nodeType} • ${status} • ⭐${importance || 3}`,
      };
    },
  },

  // Default ordering
  orderings: [
    {
      title: "Importance",
      name: "importanceDesc",
      by: [{ field: "importance", direction: "desc" }],
    },
    {
      title: "Recently Published",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Node Type",
      name: "nodeTypeAsc",
      by: [{ field: "nodeType", direction: "asc" }],
    },
  ],
});

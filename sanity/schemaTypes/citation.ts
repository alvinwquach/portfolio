import { defineField, defineType } from "sanity";

/**
 * Citation Schema
 * ===============
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This schema defines how academic references and authoritative sources
 * are structured in your portfolio's content management system.
 *
 * Think of it like a digital bibliography or reference manager (like Zotero
 * or Mendeley) built directly into your portfolio.
 *
 * WHY TRACK CITATIONS?
 * --------------------
 * In software engineering interviews (especially at companies like Stanford),
 * demonstrating that you base decisions on research and authoritative sources
 * shows intellectual rigor.
 *
 * Examples of what to cite:
 *   - The original React Fiber architecture paper
 *   - Martin Fowler's "Patterns of Enterprise Application Architecture"
 *   - The CAP theorem RFC
 *   - Rich Harris's "Rethinking Reactivity" talk
 *   - Official TypeScript documentation for advanced patterns
 *
 * REAL-WORLD USE CASE:
 * --------------------
 * In an interview: "I chose this data structure because the original
 * B-tree paper by Bayer and McCreight showed O(log n) performance
 * for our access pattern."
 *
 * Having citations ready shows you don't just follow tutorials blindly—
 * you understand the foundational research.
 *
 * HOW CITATIONS RELATE TO OTHER CONTENT:
 * --------------------------------------
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │                       CITATION                              │
 * │  "Design Patterns" by Gang of Four (1994)                  │
 * └───────────────────────────┬─────────────────────────────────┘
 *                             │
 *         ┌───────────────────┼───────────────────┐
 *         │                   │                   │
 *         ▼                   ▼                   ▼
 *    ┌─────────┐       ┌───────────┐      ┌────────────────┐
 *    │ PROJECT │       │ KNOWLEDGE │      │      TAG       │
 *    │ Used    │       │   NODE    │      │ "design-       │
 *    │ Factory │       │ "Factory  │      │  patterns"     │
 *    │ Pattern │       │  Pattern  │      │                │
 *    └─────────┘       │ Explained"│      └────────────────┘
 *                      └───────────┘
 *
 * FIELD EXPLANATIONS:
 * -------------------
 *
 * title: The title of the paper, book, or resource
 *   - "Attention Is All You Need" (the transformer paper)
 *   - "Clean Code" (book)
 *   - "Web Content Accessibility Guidelines (WCAG)" (spec)
 *
 * slug: URL-friendly identifier
 *   - Used for: /citations/attention-is-all-you-need
 *   - Auto-generated from title but can be customized
 *
 * authors: Who wrote/created this resource
 *   - Array because many papers have multiple authors
 *   - Example: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."]
 *
 * year: Publication year
 *   - Helps with "et al. (2017)" style citations
 *   - Also useful for showing you follow recent research
 *
 * citationType: What kind of source is this?
 *   - paper: Academic/research paper (peer-reviewed)
 *   - book: Technical book
 *   - talk: Conference talk or presentation
 *   - blog: Blog post from authoritative source
 *   - docs: Official documentation
 *   - spec: RFC, W3C spec, or formal specification
 *
 * url: Link to the source
 *   - Direct link so you can reference it quickly
 *   - Example: https://arxiv.org/abs/1706.03762
 *
 * doi: Digital Object Identifier
 *   - Unique identifier for academic papers
 *   - Format: 10.1145/1327452.1327492
 *   - More permanent than URLs
 *
 * abstract: Summary of the source
 *   - Copy the abstract from papers
 *   - Or write your own summary for books/talks
 *
 * keyInsights: Main takeaways
 *   - What you learned from this source
 *   - What you'll mention in interviews
 *   - Example: ["Attention mechanisms eliminate need for recurrence",
 *               "Parallelization improves training speed"]
 *
 * relevance: How does this inform YOUR work?
 *   - Connect the citation to your projects
 *   - Example: "Used transformer architecture insights when
 *              implementing the search feature in my ML project"
 *
 * tags: Categorization
 *   - References to Tag documents
 *   - Example: ["machine-learning", "architecture", "nlp"]
 *
 * relatedProjects: Where you applied this knowledge
 *   - References to Project documents
 *   - Shows citations aren't just theoretical
 *
 * relatedNodes: Connected knowledge
 *   - References to KnowledgeNode documents
 *   - Links citation to your blog posts/tutorials about the topic
 *
 * GROQ QUERY EXAMPLES:
 * --------------------
 *
 * // Get all citations for a specific topic
 * *[_type == "citation" && "machine-learning" in tags[]->slug.current] {
 *   title,
 *   authors,
 *   year,
 *   keyInsights,
 *   "tagNames": tags[]->name
 * }
 *
 * // Get citations used in a specific project
 * *[_type == "citation" && references(*[_type == "project" && slug.current == "my-ai-project"]._id)] {
 *   title,
 *   url,
 *   relevance
 * }
 *
 * // Get recent papers (last 5 years)
 * *[_type == "citation" && citationType == "paper" && year >= 2020] | order(year desc) {
 *   title,
 *   authors,
 *   year,
 *   abstract
 * }
 *
 * // Get all citations with their related knowledge nodes
 * *[_type == "citation"] {
 *   title,
 *   citationType,
 *   "relatedContent": relatedNodes[]-> {
 *     title,
 *     nodeType,
 *     slug
 *   }
 * }
 *
 * INTERVIEW VALUE:
 * ----------------
 * Citations demonstrate:
 *   1. Research-backed decision making
 *   2. Intellectual curiosity
 *   3. Understanding of fundamentals, not just frameworks
 *   4. Academic rigor (important for Stanford!)
 *   5. Ability to read and synthesize technical papers
 *
 * PSEUDOCODE FOR RENDERING CITATIONS:
 * -----------------------------------
 *
 * function renderCitationCard(citation):
 *   format authors (first 3, then "et al.")
 *   format year in parentheses
 *   show type badge (Paper, Book, Talk, etc.)
 *
 *   return (
 *     <Card>
 *       <Title>{citation.title}</Title>
 *       <Authors>{formatAuthors(citation.authors)} ({citation.year})</Authors>
 *       <TypeBadge>{citation.citationType}</TypeBadge>
 *
 *       if citation.abstract:
 *         <Summary>{truncate(citation.abstract, 200)}</Summary>
 *
 *       if citation.keyInsights:
 *         <InsightsList>
 *           for insight in citation.keyInsights:
 *             <Insight>{insight}</Insight>
 *         </InsightsList>
 *
 *       <Links>
 *         if citation.url: <ExternalLink href={citation.url}>View Source</ExternalLink>
 *         if citation.doi: <DOILink doi={citation.doi}>DOI</DOILink>
 *       </Links>
 *     </Card>
 *   )
 *
 * RELATED FILES:
 * --------------
 * - sanity/schemaTypes/tag.ts: Tag documents for categorization
 * - sanity/schemaTypes/project.ts: Projects that use these citations
 * - sanity/schemaTypes/knowledgeNode.ts: Blog posts about cited topics
 *
 * DOCUMENTATION:
 * --------------
 * - Sanity Schema Types: https://www.sanity.io/docs/schema-types
 * - GROQ Reference: https://www.sanity.io/docs/groq-reference
 */
export const citation = defineType({
  name: "citation",
  title: "Citation",
  type: "document",
  icon: () => "📄",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "citationType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Research Paper", value: "paper" },
          { title: "Book", value: "book" },
          { title: "Conference Talk", value: "talk" },
          { title: "Blog Post", value: "blog" },
          { title: "Documentation", value: "docs" },
          { title: "RFC/Specification", value: "spec" },
        ],
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
    }),
    defineField({
      name: "abstract",
      title: "Abstract / Summary",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "keyInsights",
      title: "Key Insights",
      type: "array",
      of: [{ type: "string" }],
      description: "Main takeaways from this source",
    }),
    defineField({
      name: "relevance",
      title: "Relevance to My Work",
      type: "text",
      rows: 2,
      description: "How does this inform your projects?",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "relatedProjects",
      title: "Applied In Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    defineField({
      name: "relatedNodes",
      title: "Related Knowledge Nodes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "knowledgeNode" }] }],
    }),
  ],
  preview: {
    select: { title: "title", authors: "authors", year: "year", type: "citationType" },
    prepare({ title, authors, year, type }) {
      const authorStr = authors?.slice(0, 2).join(", ") || "Unknown";
      return {
        title,
        subtitle: `${authorStr} (${year || "n.d."}) • ${type || "source"}`,
      };
    },
  },
});

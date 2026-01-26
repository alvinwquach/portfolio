/**
 * Knowledge Node GraphQL Type Definition
 * ========================================
 * Blog posts, tutorials, bugs, decisions, concepts, and charts
 */

export const knowledgeNodeType = `#graphql
  """
  Knowledge node - blog post, tutorial, bug fix, etc.
  """
  type KnowledgeNode {
    _id: ID!
    title: String!
    slug: Slug!
    summary: String!
    content: PortableText
    nodeType: NodeType!
    status: PublishStatus
    tags: [Tag!]
    depthLevel: Int
    importance: Int
    relatedNodes: [KnowledgeNode!]
    relatedProjects: [Project!]
    chartData: ChartData
    codeSnippet: CodeBlock
    publishedAt: DateTime
    featured: Boolean
  }

  enum NodeType {
    build
    bug
    decision
    concept
    tutorial
    chart
    deep_dive
    lesson_learned
    tool_review
  }

  enum PublishStatus {
    draft
    published
  }

  """
  Chart configuration for visualization nodes
  """
  type ChartData {
    chartType: ChartType
    data: JSON
    options: JSON
  }

  enum ChartType {
    bar
    line
    pie
    scatter
    d3_custom
  }

  """
  Knowledge graph data for 3D visualization
  """
  type KnowledgeGraph {
    nodes: [KnowledgeGraphNode!]!
    edges: [KnowledgeGraphEdge!]!
  }

  type KnowledgeGraphNode {
    id: ID!
    title: String!
    nodeType: NodeType!
    depthLevel: Int
    importance: Int
    slug: String!
  }

  type KnowledgeGraphEdge {
    source: ID!
    target: ID!
  }
`;

/**
 * Tag GraphQL Type Definition
 * ============================
 * Reusable tags for categorization
 */

export const tagType = `#graphql
  """
  Tag for categorization and filtering
  """
  type Tag {
    _id: ID!
    name: String!
    slug: Slug!
    category: TagCategory
    color: String
  }

  enum TagCategory {
    technology
    concept
    project
    topic
  }
`;

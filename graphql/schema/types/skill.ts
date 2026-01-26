/**
 * Skill GraphQL Type Definition
 * ==============================
 * Technical skills that can be linked to projects
 */

export const skillType = `#graphql
  """
  Technical skill or technology
  """
  type Skill {
    _id: ID!
    name: String!
    category: String!
  }

  """
  Skills grouped by category for display
  """
  type SkillGroup {
    category: String!
    categoryLabel: String!
    skills: [Skill!]!
  }
`;

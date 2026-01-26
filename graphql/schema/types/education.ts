/**
 * Education GraphQL Type Definition
 * ===================================
 * Educational background
 */

export const educationType = `#graphql
  """
  Educational background entry
  """
  type Education {
    _id: ID!
    institution: String!
    degree: String!
    field: String
    graduationYear: Int
    description: String
    order: Int
  }
`;

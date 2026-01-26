/**
 * Testimonial GraphQL Type Definition
 * =====================================
 * Recommendations and testimonials from others
 */

export const testimonialType = `#graphql
  """
  Testimonial from client, colleague, or manager
  """
  type Testimonial {
    _id: ID!
    quote: String!
    author: String!
    role: String
    company: String
    relationship: RelationshipType
    project: Project
    image: Image
    linkedin: String
    featured: Boolean
  }

  enum RelationshipType {
    client
    manager
    colleague
    mentor
    other
  }
`;

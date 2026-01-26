/**
 * Contact GraphQL Type Definition
 * =================================
 * Contact form input and response
 */

export const contactType = `#graphql
  """
  Contact form input
  """
  input ContactInput {
    name: String!
    email: String!
    subject: String
    message: String!
  }

  """
  Contact form response
  """
  type ContactResponse {
    success: Boolean!
    message: String!
  }
`;

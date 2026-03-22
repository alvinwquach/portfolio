/**
 * Profile GraphQL Type Definition
 * ================================
 * Personal information for the portfolio
 */

export const profileType = `#graphql
  """
  Personal profile information
  """
  type Profile {
    _id: ID!
    name: String!
    headline: String
    bio: PortableText
    location: String
    availabilityStatus: AvailabilityStatus
    availabilityLabel: String
    openToRoles: [String!]
    email: String!
    linkedin: String
    github: String
    twitter: String
    resume: File
    image: Image
    whatIEnjoy: [String!]
    careerGoals: String
    whatImLookingFor: [String!]
    strengths: [String!]
    growthAreas: [String!]
    previousCareers: [PreviousCareer!]
    hobbiesAndInterests: [HobbyOrInterest!]
    country: String
    employmentTypes: [String!]
    seoDescription: String
    seoKeywords: [String!]
  }

  enum AvailabilityStatus {
    open
    freelance
    both
    unavailable
  }

  type PreviousCareer {
    title: String
    company: String
    description: String
    transferableSkills: [String!]
  }

  type HobbyOrInterest {
    name: String
    description: String
  }
`;

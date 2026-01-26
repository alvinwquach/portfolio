/**
 * Experience GraphQL Type Definition
 * ====================================
 * Work experience in STAR format for interview preparation
 */

export const experienceType = `#graphql
  """
  Work experience with STAR format
  """
  type Experience {
    _id: ID!
    company: String!
    role: String!
    location: String
    employmentType: EmploymentType
    startDate: String
    endDate: String
    isCurrent: Boolean

    # STAR Format
    situation: String
    tasks: [String!]
    actions: [String!]
    results: [String!]
    narrative: PortableText

    # Interview Prep
    tradeoffs: [Tradeoff!]
    technicalDecisions: [TechnicalDecision!]
    challenges: [Challenge!]
    lessonsLearned: [String!]

    # Tech Stack
    techStack: [Skill!]
    order: Int
  }

  enum EmploymentType {
    full_time
    part_time
    contract
    freelance
    internship
  }
`;

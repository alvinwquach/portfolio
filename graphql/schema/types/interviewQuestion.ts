/**
 * Interview Question GraphQL Types
 * =================================
 */

export const interviewQuestionType = `#graphql
  enum InterviewCategory {
    react
    nextjs
    frontend
    fullstack
    system_design
    performance
    seo
    accessibility
    cms
    analytics
    search
    forms
    platform
    debugging
    security
    testing
    code_quality
    practices
    scaling
    behavioral_collaboration
    behavioral_ambiguity
    behavioral_failure
    behavioral_prioritization
    behavioral_growth
    behavioral
    stanford
  }

  enum Difficulty {
    easy
    medium
    hard
  }

  type InterviewQuestion {
    _id: ID!
    question: String!
    category: String!
    tags: [String!]
    roleType: [String!]
    isStarred: Boolean
    lastPracticed: DateTime
    confidenceLevel: Int
    answer: PortableText
    keyPoints: [String!]
    projectReferences: [Project!]
    experienceReferences: [Experience!]
    followUpQuestions: [String!]
    redFlags: [String!]
    targetCompany: String
    difficulty: String
    order: Int
  }
`;

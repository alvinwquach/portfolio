/**
 * GraphQL Schema Composition
 * ==========================
 * Combines all type definitions and creates the executable schema
 */

import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '../resolvers';

// Type definitions
import { commonTypes } from './types/common';
import { profileType } from './types/profile';
import { projectType } from './types/project';
import { skillType } from './types/skill';
import { experienceType } from './types/experience';
import { educationType } from './types/education';
import { testimonialType } from './types/testimonial';
import { knowledgeNodeType } from './types/knowledgeNode';
import { tagType } from './types/tag';
import { contactType } from './types/contact';
import { interviewQuestionType } from './types/interviewQuestion';

// Query definitions
const queryType = `#graphql
  type Query {
    # Profile
    profile: Profile

    # Projects
    projects(featured: Boolean, limit: Int): [Project!]!
    project(slug: String!): Project

    # Skills
    skills(category: String): [Skill!]!
    skillGroups: [SkillGroup!]!

    # Experience
    experiences: [Experience!]!
    experience(id: ID!): Experience

    # Education
    educations: [Education!]!

    # Testimonials
    testimonials(featured: Boolean, limit: Int): [Testimonial!]!

    # Knowledge Nodes
    knowledgeNodes(
      nodeType: NodeType
      status: PublishStatus
      tagSlug: String
      featured: Boolean
      limit: Int
    ): [KnowledgeNode!]!
    knowledgeNode(slug: String!): KnowledgeNode
    knowledgeGraph: KnowledgeGraph!

    # Tags
    tags(category: TagCategory): [Tag!]!
    tag(slug: String!): Tag

    # Interview Questions
    interviewQuestions(
      category: String
      difficulty: String
      isStarred: Boolean
      targetCompany: String
      limit: Int
    ): [InterviewQuestion!]!
    interviewQuestion(id: ID!): InterviewQuestion
  }
`;

// Mutation definitions
const mutationType = `#graphql
  type Mutation {
    sendContactMessage(input: ContactInput!): ContactResponse!
  }
`;

// Combine all type definitions
const typeDefs = [
  commonTypes,
  profileType,
  projectType,
  skillType,
  experienceType,
  educationType,
  testimonialType,
  knowledgeNodeType,
  tagType,
  contactType,
  interviewQuestionType,
  queryType,
  mutationType,
];

// Create executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

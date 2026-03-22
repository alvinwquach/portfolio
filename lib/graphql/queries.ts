/**
 * GraphQL Query Functions
 * =======================
 * Typed query functions for fetching data from the GraphQL API
 *
 * These functions provide a clean interface for components to fetch data
 * with full TypeScript support and caching options.
 */

import { fetchGraphQL } from './client';

// Re-export all types from the canonical location
export type {
  Image,
  Slug,
  File,
  Profile,
  Skill,
  SkillGroup,
  Tradeoff,
  TechnicalDecision,
  Challenge,
  CodeHighlight,
  InterviewQuestion,
  RoadmapMilestone,
  RoadmapPhase,
  Project,
  Experience,
  Education,
  Testimonial,
  Tag,
  CodeBlock,
  ChartData,
  KnowledgeNode,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  KnowledgeGraph,
  LandingPageData,
} from '@/types/graphql';

import type {
  Profile,
  Skill,
  SkillGroup,
  Project,
  Experience,
  Education,
  Testimonial,
  KnowledgeNode,
  KnowledgeGraph,
  Tag,
  LandingPageData,
} from '@/types/graphql';

// ============================================
// Query Fragments
// ============================================

const IMAGE_FRAGMENT = `
  _id
  url
  alt
  hotspot {
    x
    y
    width
    height
  }
  dimensions {
    width
    height
    aspectRatio
  }
`;

const SKILL_FRAGMENT = `
  _id
  name
  category
`;

const PROJECT_CARD_FRAGMENT = `
  _id
  name
  slug { current }
  tagline
  projectType
  clientName
  clientIndustry
  situation
  results
  role
  teamSize
  duration
  techStack { ${SKILL_FRAGMENT} }
  image { ${IMAGE_FRAGMENT} }
  featured
  liveUrl
  githubUrl
`;

const PROJECT_FULL_FRAGMENT = `
  _id
  name
  slug { current }
  tagline
  projectType
  clientName
  clientIndustry
  clientTestimonial
  situation
  task
  actions
  results
  narrative
  interviewQuestions {
    question
    category
    situation
    task
    actions
    result
    keyTakeaway
  }
  tradeoffs {
    decision
    prosGained
    consAccepted
    whyWorthIt
  }
  technicalDecisions {
    question
    answer
  }
  challenges {
    problem
    approach
    solution
    lesson
  }
  lessonsLearned
  futureImprovements
  architectureNotes
  codeHighlights {
    title
    filePath
    explanation
  }
  role
  teamSize
  duration
  techStack { ${SKILL_FRAGMENT} }
  liveUrl
  githubUrl
  demoUrl
  image { ${IMAGE_FRAGMENT} }
  gallery { ${IMAGE_FRAGMENT} }
  roadmap {
    _key
    phase
    title
    description
    status
    milestones {
      _key
      title
      description
      status
      features
      techUsed { ${SKILL_FRAGMENT} }
    }
  }
  featured
  order
`;

// ============================================
// Query Functions
// ============================================

/**
 * Fetch the profile
 */
export async function getProfile(): Promise<Profile | null> {
  const data = await fetchGraphQL<{ profile: Profile | null }>(
    `query GetProfile {
      profile {
        _id
        name
        headline
        bio
        location
        availabilityStatus
        availabilityLabel
        openToRoles
        email
        linkedin
        github
        twitter
        resume { url filename size }
        image { ${IMAGE_FRAGMENT} }
        whatIEnjoy
        careerGoals
        whatImLookingFor
        strengths
        growthAreas
        previousCareers {
          title
          company
          description
          transferableSkills
        }
        hobbiesAndInterests {
          name
          description
        }
        country
        employmentTypes
        seoDescription
        seoKeywords
      }
    }`,
    {},
    { tags: ['profile'] }
  );
  return data.profile;
}

/**
 * Fetch all projects
 */
export async function getProjects(options?: {
  featured?: boolean;
  limit?: number;
}): Promise<Project[]> {
  const data = await fetchGraphQL<{ projects: Project[] }>(
    `query GetProjects($featured: Boolean, $limit: Int) {
      projects(featured: $featured, limit: $limit) {
        ${PROJECT_CARD_FRAGMENT}
      }
    }`,
    options,
    { tags: ['projects'] }
  );
  return data.projects;
}

/**
 * Fetch a single project by slug
 */
export async function getProject(slug: string): Promise<Project | null> {
  const data = await fetchGraphQL<{ project: Project | null }>(
    `query GetProject($slug: String!) {
      project(slug: $slug) {
        ${PROJECT_FULL_FRAGMENT}
      }
    }`,
    { slug },
    { tags: ['project', `project:${slug}`] }
  );
  return data.project;
}

/**
 * Fetch all skill groups
 */
export async function getSkillGroups(): Promise<SkillGroup[]> {
  const data = await fetchGraphQL<{ skillGroups: SkillGroup[] }>(
    `query GetSkillGroups {
      skillGroups {
        category
        categoryLabel
        skills { ${SKILL_FRAGMENT} }
      }
    }`,
    {},
    { tags: ['skills'] }
  );
  return data.skillGroups;
}

/**
 * Fetch all experiences
 */
export async function getExperiences(): Promise<Experience[]> {
  const data = await fetchGraphQL<{ experiences: Experience[] }>(
    `query GetExperiences {
      experiences {
        _id
        company
        role
        location
        employmentType
        startDate
        endDate
        isCurrent
        situation
        tasks
        actions
        results
        narrative
        tradeoffs {
          decision
          prosGained
          consAccepted
          whyWorthIt
        }
        technicalDecisions {
          question
          answer
        }
        challenges {
          problem
          approach
          solution
          lesson
        }
        lessonsLearned
        techStack { ${SKILL_FRAGMENT} }
        order
      }
    }`,
    {},
    { tags: ['experiences'] }
  );
  return data.experiences;
}

/**
 * Fetch all educations
 */
export async function getEducations(): Promise<Education[]> {
  const data = await fetchGraphQL<{ educations: Education[] }>(
    `query GetEducations {
      educations {
        _id
        institution
        degree
        field
        graduationYear
        description
        order
      }
    }`,
    {},
    { tags: ['educations'] }
  );
  return data.educations;
}

/**
 * Fetch testimonials
 */
export async function getTestimonials(options?: {
  featured?: boolean;
  limit?: number;
}): Promise<Testimonial[]> {
  const data = await fetchGraphQL<{ testimonials: Testimonial[] }>(
    `query GetTestimonials($featured: Boolean, $limit: Int) {
      testimonials(featured: $featured, limit: $limit) {
        _id
        quote
        author
        role
        company
        relationship
        project {
          _id
          name
          slug { current }
        }
        image { ${IMAGE_FRAGMENT} }
        linkedin
        featured
      }
    }`,
    options,
    { tags: ['testimonials'] }
  );
  return data.testimonials;
}

/**
 * Fetch knowledge nodes (blog posts)
 */
export async function getKnowledgeNodes(options?: {
  nodeType?: string;
  status?: string;
  tagSlug?: string;
  featured?: boolean;
  limit?: number;
}): Promise<KnowledgeNode[]> {
  const data = await fetchGraphQL<{ knowledgeNodes: KnowledgeNode[] }>(
    `query GetKnowledgeNodes(
      $nodeType: NodeType
      $status: PublishStatus
      $tagSlug: String
      $featured: Boolean
      $limit: Int
    ) {
      knowledgeNodes(
        nodeType: $nodeType
        status: $status
        tagSlug: $tagSlug
        featured: $featured
        limit: $limit
      ) {
        _id
        title
        slug { current }
        summary
        nodeType
        status
        tags {
          _id
          name
          slug { current }
          category
          color
        }
        depthLevel
        importance
        publishedAt
        featured
      }
    }`,
    options,
    { tags: ['knowledgeNodes'] }
  );
  return data.knowledgeNodes;
}

/**
 * Fetch a single knowledge node by slug
 */
export async function getKnowledgeNode(slug: string): Promise<KnowledgeNode | null> {
  const data = await fetchGraphQL<{ knowledgeNode: KnowledgeNode | null }>(
    `query GetKnowledgeNode($slug: String!) {
      knowledgeNode(slug: $slug) {
        _id
        title
        slug { current }
        summary
        content
        nodeType
        status
        tags {
          _id
          name
          slug { current }
          category
          color
        }
        depthLevel
        importance
        relatedNodes {
          _id
          title
          slug { current }
          nodeType
          summary
        }
        relatedProjects {
          _id
          name
          slug { current }
        }
        chartData {
          chartType
          data
          options
        }
        codeSnippet {
          language
          code
          filename
        }
        publishedAt
        featured
      }
    }`,
    { slug },
    { tags: ['knowledgeNode', `knowledgeNode:${slug}`] }
  );
  return data.knowledgeNode;
}

/**
 * Fetch knowledge graph data for 3D visualization
 */
export async function getKnowledgeGraph(): Promise<KnowledgeGraph> {
  const data = await fetchGraphQL<{ knowledgeGraph: KnowledgeGraph }>(
    `query GetKnowledgeGraph {
      knowledgeGraph {
        nodes {
          id
          title
          nodeType
          depthLevel
          importance
          slug
        }
        edges {
          source
          target
        }
      }
    }`,
    {},
    { tags: ['knowledgeGraph'] }
  );
  return data.knowledgeGraph;
}

/**
 * Fetch all tags
 */
export async function getTags(category?: string): Promise<Tag[]> {
  const data = await fetchGraphQL<{ tags: Tag[] }>(
    `query GetTags($category: TagCategory) {
      tags(category: $category) {
        _id
        name
        slug { current }
        category
        color
      }
    }`,
    { category },
    { tags: ['tags'] }
  );
  return data.tags;
}

/**
 * Send contact message
 */
export async function sendContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  const data = await fetchGraphQL<{
    sendContactMessage: { success: boolean; message: string }
  }>(
    `mutation SendContactMessage($input: ContactInput!) {
      sendContactMessage(input: $input) {
        success
        message
      }
    }`,
    { input }
  );
  return data.sendContactMessage;
}

/**
 * Fetch all data needed for the landing page in a single query
 */
export async function getLandingPageData(): Promise<LandingPageData> {
  const data = await fetchGraphQL<{
    profile: Profile | null;
    projects: Project[];
    testimonials: Testimonial[];
  }>(
    `query GetLandingPageData {
      profile {
        _id
        name
        headline
        bio
        location
        availabilityStatus
        openToRoles
        email
        linkedin
        github
        twitter
        resume { url filename size }
        image { ${IMAGE_FRAGMENT} }
        whatIEnjoy
        whatImLookingFor
        careerGoals
        strengths
        previousCareers {
          title
          company
          description
          transferableSkills
        }
        hobbiesAndInterests {
          name
          description
        }
      }
      projects(featured: true, limit: 5) {
        ${PROJECT_CARD_FRAGMENT}
      }
      testimonials(featured: true, limit: 3) {
        _id
        quote
        author
        role
        company
        relationship
        image { ${IMAGE_FRAGMENT} }
        linkedin
      }
    }`,
    {},
    { tags: ['landing'] }
  );

  return {
    profile: data.profile,
    featuredProjects: data.projects,
    testimonials: data.testimonials,
  };
}

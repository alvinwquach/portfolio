/**
 * GraphQL Query Functions
 * =======================
 * Typed query functions for fetching data from the GraphQL API
 *
 * These functions provide a clean interface for components to fetch data
 * with full TypeScript support and caching options.
 */

import { fetchGraphQL } from './client';

// ============================================
// Type Definitions
// ============================================

export interface Image {
  _id?: string;
  url?: string;
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

export interface Slug {
  current: string;
}

export interface File {
  url?: string;
  filename?: string;
  size?: number;
}

export interface Profile {
  _id: string;
  name: string;
  headline?: string;
  bio?: any[];
  location?: string;
  availabilityStatus?: 'open' | 'freelance' | 'both' | 'unavailable';
  openToRoles?: string[];
  email: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  resume?: File;
  image?: Image;
  whatIEnjoy?: string[];
  careerGoals?: string;
  whatImLookingFor?: string[];
  strengths?: string[];
  growthAreas?: string[];
  previousCareers?: {
    title?: string;
    company?: string;
    description?: string;
    transferableSkills?: string[];
  }[];
  hobbiesAndInterests?: {
    name?: string;
    description?: string;
  }[];
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
}

export interface SkillGroup {
  category: string;
  categoryLabel: string;
  skills: Skill[];
}

export interface Tradeoff {
  decision?: string;
  prosGained?: string[];
  consAccepted?: string[];
  whyWorthIt?: string;
}

export interface TechnicalDecision {
  question?: string;
  answer?: string;
}

export interface Challenge {
  problem?: string;
  approach?: string;
  solution?: string;
  lesson?: string;
}

export interface CodeHighlight {
  title?: string;
  filePath?: string;
  explanation?: string;
}

export interface InterviewQuestion {
  question: string;
  category?: string;
  situation?: string;
  task?: string;
  actions?: string[];
  result?: string;
  keyTakeaway?: string;
}

export interface RoadmapMilestone {
  _key?: string;
  title: string;
  description?: string;
  status?: 'completed' | 'in-progress' | 'planned';
  features?: string[];
  techUsed?: Skill[];
}

export interface RoadmapPhase {
  _key?: string;
  phase: 'mvp' | 'stretch' | 'future';
  title?: string;
  description?: string;
  status?: 'completed' | 'in-progress' | 'planned';
  milestones?: RoadmapMilestone[];
}

export interface Project {
  _id: string;
  name: string;
  slug: Slug;
  tagline?: string;
  projectType?: 'personal' | 'freelance' | 'opensource' | 'work';
  clientName?: string;
  clientIndustry?: string;
  clientTestimonial?: string;
  situation?: string;
  task?: string;
  actions?: string[];
  results?: string[];
  narrative?: any[];
  interviewQuestions?: InterviewQuestion[];
  tradeoffs?: Tradeoff[];
  technicalDecisions?: TechnicalDecision[];
  challenges?: Challenge[];
  lessonsLearned?: string[];
  futureImprovements?: string[];
  architectureNotes?: any[];
  codeHighlights?: CodeHighlight[];
  role?: string;
  teamSize?: number;
  duration?: string;
  techStack?: Skill[];
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: Image;
  gallery?: Image[];
  roadmap?: RoadmapPhase[];
  featured?: boolean;
  order?: number;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  situation?: string;
  tasks?: string[];
  actions?: string[];
  results?: string[];
  narrative?: any[];
  tradeoffs?: Tradeoff[];
  technicalDecisions?: TechnicalDecision[];
  challenges?: Challenge[];
  lessonsLearned?: string[];
  techStack?: Skill[];
  order?: number;
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  field?: string;
  graduationYear?: number;
  description?: string;
  order?: number;
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  relationship?: string;
  project?: Pick<Project, '_id' | 'name' | 'slug'>;
  image?: Image;
  linkedin?: string;
  featured?: boolean;
}

export interface Tag {
  _id: string;
  name: string;
  slug: Slug;
  category?: string;
  color?: string;
}

export interface CodeBlock {
  language?: string;
  code?: string;
  filename?: string;
}

export interface ChartData {
  chartType?: string;
  data?: any;
  options?: any;
}

export interface KnowledgeNode {
  _id: string;
  title: string;
  slug: Slug;
  summary: string;
  content?: any[];
  nodeType: 'build' | 'bug' | 'decision' | 'concept' | 'tutorial' | 'chart' | 'deep_dive' | 'lesson_learned' | 'tool_review';
  status?: 'draft' | 'published';
  tags?: Tag[];
  depthLevel?: number;
  importance?: number;
  relatedNodes?: Pick<KnowledgeNode, '_id' | 'title' | 'slug' | 'nodeType' | 'summary'>[];
  relatedProjects?: Pick<Project, '_id' | 'name' | 'slug'>[];
  chartData?: ChartData;
  codeSnippet?: CodeBlock;
  publishedAt?: string;
  featured?: boolean;
}

export interface KnowledgeGraphNode {
  id: string;
  title: string;
  nodeType: string;
  depthLevel?: number;
  importance?: number;
  slug: string;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

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

// ============================================
// Landing Page Data
// ============================================

export interface LandingPageData {
  profile: Profile | null;
  featuredProjects: Project[];
  testimonials: Testimonial[];
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
      projects(featured: true, limit: 4) {
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

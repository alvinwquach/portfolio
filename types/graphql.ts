/**
 * GraphQL Type Definitions
 * ========================
 * Shared types used across the portfolio application.
 * These types mirror the GraphQL schema and are used by
 * query functions and components alike.
 */

// ============================================
// Primitive / Shared Types
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

// ============================================
// Domain Types
// ============================================

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
// Composite / Page-level Types
// ============================================

export interface LandingPageData {
  profile: Profile | null;
  featuredProjects: Project[];
  testimonials: Testimonial[];
}

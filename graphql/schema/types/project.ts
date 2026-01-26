/**
 * Project GraphQL Type Definition
 * ================================
 * Portfolio projects with STAR format for interview preparation
 */

export const projectType = `#graphql
  """
  Portfolio project showcasing work with STAR format
  """
  type Project {
    _id: ID!
    name: String!
    slug: Slug!
    tagline: String

    # Project Type & Client Info (for freelance work)
    projectType: String
    clientName: String
    clientIndustry: String
    clientTestimonial: String

    # STAR Format Fields
    situation: String
    task: String
    actions: [String!]
    results: [String!]

    # Narrative & Storytelling
    narrative: PortableText

    # Interview Preparation
    interviewQuestions: [InterviewQuestion!]
    tradeoffs: [Tradeoff!]
    technicalDecisions: [TechnicalDecision!]
    challenges: [Challenge!]
    lessonsLearned: [String!]
    futureImprovements: [String!]
    architectureNotes: PortableText
    codeHighlights: [CodeHighlight!]

    # Project Metadata
    role: String
    teamSize: Int
    duration: String
    techStack: [Skill!]

    # Links
    liveUrl: String
    githubUrl: String
    demoUrl: String

    # Images
    image: Image
    gallery: [Image!]

    # Roadmap (MVP + Stretch)
    roadmap: [RoadmapPhase!]

    # Display Controls
    featured: Boolean
    order: Int
  }

  """
  Trade-off decision with pros and cons
  """
  type Tradeoff {
    decision: String
    prosGained: [String!]
    consAccepted: [String!]
    whyWorthIt: String
  }

  """
  Technical decision Q&A for interview prep
  """
  type TechnicalDecision {
    question: String
    answer: String
  }

  """
  Challenge faced and how it was solved
  """
  type Challenge {
    problem: String
    approach: String
    solution: String
    lesson: String
  }

  """
  Code snippet highlight for walkthroughs
  """
  type CodeHighlight {
    title: String
    filePath: String
    explanation: String
  }

  """
  Interview question answered in STAR format
  """
  type InterviewQuestion {
    question: String!
    category: String
    situation: String
    task: String
    actions: [String!]
    result: String
    keyTakeaway: String
  }

  """
  Roadmap phase (MVP, Stretch, Future)
  """
  type RoadmapPhase {
    _key: String
    phase: String!
    title: String
    description: String
    status: String
    milestones: [RoadmapMilestone!]
  }

  """
  Individual milestone within a roadmap phase
  """
  type RoadmapMilestone {
    _key: String
    title: String!
    description: String
    status: String
    features: [String!]
    techUsed: [Skill!]
  }
`;

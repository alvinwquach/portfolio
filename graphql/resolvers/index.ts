/**
 * GraphQL Resolvers
 * =================
 * Connects GraphQL queries to Sanity CMS via GROQ
 */

import { clientWithoutCdn as client } from '@/sanity/lib/client';
import { GraphQLError } from 'graphql';
import { Resend } from 'resend';

// Lazy initialize Resend for contact form (avoids build-time errors when API key is missing)
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Skill category label mapping
const SKILL_CATEGORY_LABELS: Record<string, string> = {
  databases: 'Databases & Storage',
  frontend: 'Frontend',
  backend: 'Backend & APIs',
  'data-ml': 'Data & Machine Learning',
  testing: 'Testing & QA',
  'project-tools': 'Project & Workflow Tools',
  analytics: 'Analytics, Monitoring & Integrations',
  cms: 'CMS',
  communication: 'Communication & Documentation',
  product: 'Product & Strategy',
  community: 'Community & Advocacy',
};

// Helper to build image object from Sanity asset
function buildImage(image: any) {
  if (!image?.asset) return null;
  return {
    _id: image.asset._id,
    url: image.asset.url,
    alt: image.alt,
    hotspot: image.hotspot,
    dimensions: image.asset.metadata?.dimensions,
  };
}

// Helper to build file object from Sanity asset
function buildFile(file: any) {
  if (!file?.asset) return null;
  return {
    url: file.asset.url,
    filename: file.asset.originalFilename,
    size: file.asset.size,
  };
}

// Helper to extract plain strings from Sanity array items
// Sanity arrays can contain either plain strings or objects with character indices and _key
function extractStrings(arr: any[]): string[] {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.map(item => {
    // If it's already a string, return it
    if (typeof item === 'string') return item;
    // If it's an object with character indices (0, 1, 2...), reconstruct the string
    if (typeof item === 'object' && item !== null) {
      // Check if it has numeric keys (character-indexed object)
      const keys = Object.keys(item).filter(k => !isNaN(parseInt(k)));
      if (keys.length > 0) {
        // Sort keys numerically and join characters
        return keys
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(k => item[k])
          .join('');
      }
    }
    return String(item);
  });
}

export const resolvers = {
  // Custom scalars
  PortableText: {
    serialize: (value: any) => value,
    parseValue: (value: any) => value,
    parseLiteral: (ast: any) => ast.value,
  },
  JSON: {
    serialize: (value: any) => value,
    parseValue: (value: any) => value,
    parseLiteral: (ast: any) => {
      try {
        return JSON.parse(ast.value);
      } catch {
        return ast.value;
      }
    },
  },
  DateTime: {
    serialize: (value: any) => value,
    parseValue: (value: any) => value,
    parseLiteral: (ast: any) => ast.value,
  },

  Query: {
    // Profile
    profile: async () => {
      const result = await client.fetch(`
        *[_type == "profile"][0] {
          _id,
          name,
          headline,
          tagline,
          bio,
          location,
          availabilityStatus,
          availabilityLabel,
          openToRoles,
          email,
          linkedin,
          github,
          twitter,
          resume { asset-> { url, originalFilename, size } },
          image { asset-> { _id, url, metadata { dimensions } }, alt, hotspot },
          whatIEnjoy,
          careerGoals,
          whatImLookingFor,
          strengths,
          growthAreas,
          previousCareers,
          hobbiesAndInterests,
          country,
          employmentTypes,
          seoDescription,
          seoKeywords
        }
      `);
      if (!result) return null;
      return {
        ...result,
        image: buildImage(result.image),
        resume: buildFile(result.resume),
      };
    },

    // Projects
    projects: async (_: any, args: { featured?: boolean; limit?: number }) => {
      const conditions = ['_type == "project"'];
      if (args.featured !== undefined) {
        conditions.push(`featured == ${args.featured}`);
      }

      const limitClause = args.limit ? `[0...${args.limit}]` : '';

      const results = await client.fetch(`
        *[${conditions.join(' && ')}] | order(order asc, _createdAt desc) ${limitClause} {
          _id,
          name,
          "slug": { "current": slug.current },
          tagline,
          projectType,
          clientName,
          clientIndustry,
          clientTestimonial,
          situation,
          task,
          actions,
          results,
          narrative,
          interviewQuestions,
          tradeoffs,
          technicalDecisions,
          challenges,
          lessonsLearned,
          futureImprovements,
          architectureNotes,
          codeHighlights,
          role,
          teamSize,
          duration,
          techStack[]-> { _id, name, category },
          liveUrl,
          githubUrl,
          demoUrl,
          image { asset-> { _id, url, metadata { dimensions } }, alt, hotspot },
          gallery[] { asset-> { _id, url, metadata { dimensions } }, alt, hotspot },
          roadmap[] {
            _key,
            phase,
            title,
            description,
            status,
            milestones[] {
              _key,
              title,
              description,
              status,
              features,
              techUsed[]-> { _id, name, category }
            }
          },
          featured,
          order
        }
      `);

      return results.map((project: any) => ({
        ...project,
        actions: extractStrings(project.actions),
        results: extractStrings(project.results),
        lessonsLearned: extractStrings(project.lessonsLearned),
        futureImprovements: extractStrings(project.futureImprovements),
        interviewQuestions: project.interviewQuestions?.map((q: any) => ({
          ...q,
          actions: extractStrings(q.actions),
        })),
        image: buildImage(project.image),
        gallery: project.gallery?.map(buildImage).filter(Boolean),
        roadmap: project.roadmap?.map((phase: any) => ({
          ...phase,
          milestones: phase.milestones?.map((m: any) => ({
            ...m,
            features: extractStrings(m.features),
          })),
        })),
      }));
    },

    project: async (_: any, args: { slug: string }) => {
      const result = await client.fetch(`
        *[_type == "project" && slug.current == $slug][0] {
          _id,
          name,
          "slug": { "current": slug.current },
          tagline,
          projectType,
          clientName,
          clientIndustry,
          clientTestimonial,
          situation,
          task,
          actions,
          results,
          narrative,
          interviewQuestions,
          tradeoffs,
          technicalDecisions,
          challenges,
          lessonsLearned,
          futureImprovements,
          architectureNotes,
          codeHighlights,
          role,
          teamSize,
          duration,
          techStack[]-> { _id, name, category },
          liveUrl,
          githubUrl,
          demoUrl,
          image { asset-> { _id, url, metadata { dimensions } }, alt, hotspot },
          gallery[] { asset-> { _id, url, metadata { dimensions } }, alt, hotspot },
          roadmap[] {
            _key,
            phase,
            title,
            description,
            status,
            milestones[] {
              _key,
              title,
              description,
              status,
              features,
              techUsed[]-> { _id, name, category }
            }
          },
          featured,
          order
        }
      `, { slug: args.slug });

      if (!result) return null;
      return {
        ...result,
        actions: extractStrings(result.actions),
        results: extractStrings(result.results),
        lessonsLearned: extractStrings(result.lessonsLearned),
        futureImprovements: extractStrings(result.futureImprovements),
        interviewQuestions: result.interviewQuestions?.map((q: any) => ({
          ...q,
          actions: extractStrings(q.actions),
        })),
        image: buildImage(result.image),
        gallery: result.gallery?.map(buildImage).filter(Boolean),
        roadmap: result.roadmap?.map((phase: any) => ({
          ...phase,
          milestones: phase.milestones?.map((m: any) => ({
            ...m,
            features: extractStrings(m.features),
          })),
        })),
      };
    },

    // Skills
    skills: async (_: any, args: { category?: string }) => {
      const conditions = ['_type == "skill"'];
      if (args.category) {
        conditions.push(`category == $category`);
      }

      return client.fetch(`
        *[${conditions.join(' && ')}] | order(name asc) {
          _id,
          name,
          category
        }
      `, { category: args.category });
    },

    skillGroups: async () => {
      const skills = await client.fetch(`
        *[_type == "skill"] | order(name asc) {
          _id,
          name,
          category
        }
      `);

      // Group skills by category
      const groups: Record<string, any[]> = {};
      for (const skill of skills) {
        if (!skill.category) continue;
        if (!groups[skill.category]) {
          groups[skill.category] = [];
        }
        groups[skill.category].push(skill);
      }

      return Object.entries(groups).map(([category, categorySkills]) => ({
        category,
        categoryLabel: SKILL_CATEGORY_LABELS[category] || category,
        skills: categorySkills,
      }));
    },

    // Experience
    experiences: async () => {
      const results = await client.fetch(`
        *[_type == "experience"] | order(order asc, _createdAt desc) {
          _id,
          company,
          role,
          location,
          employmentType,
          startDate,
          endDate,
          isCurrent,
          situation,
          tasks,
          actions,
          results,
          narrative,
          tradeoffs,
          technicalDecisions,
          challenges,
          lessonsLearned,
          techStack[]-> { _id, name, category },
          order
        }
      `);

      return results.map((exp: any) => ({
        ...exp,
        tasks: extractStrings(exp.tasks),
        actions: extractStrings(exp.actions),
        results: extractStrings(exp.results),
        lessonsLearned: extractStrings(exp.lessonsLearned),
        techStack: (exp.techStack || []).filter(Boolean),
      }));
    },

    experience: async (_: any, args: { id: string }) => {
      const result = await client.fetch(`
        *[_type == "experience" && _id == $id][0] {
          _id,
          company,
          role,
          location,
          employmentType,
          startDate,
          endDate,
          isCurrent,
          situation,
          tasks,
          actions,
          results,
          narrative,
          tradeoffs,
          technicalDecisions,
          challenges,
          lessonsLearned,
          techStack[]-> { _id, name, category },
          order
        }
      `, { id: args.id });
      if (!result) return null;
      return {
        ...result,
        tasks: extractStrings(result.tasks),
        actions: extractStrings(result.actions),
        results: extractStrings(result.results),
        lessonsLearned: extractStrings(result.lessonsLearned),
        techStack: (result.techStack || []).filter(Boolean),
      };
    },

    // Education
    educations: async () => {
      return client.fetch(`
        *[_type == "education"] | order(order asc, graduationYear desc) {
          _id,
          institution,
          degree,
          field,
          graduationYear,
          description,
          order
        }
      `);
    },

    // Testimonials
    testimonials: async (_: any, args: { featured?: boolean; limit?: number }) => {
      const conditions = ['_type == "testimonial"'];
      if (args.featured !== undefined) {
        conditions.push(`featured == ${args.featured}`);
      }

      const limitClause = args.limit ? `[0...${args.limit}]` : '';

      const results = await client.fetch(`
        *[${conditions.join(' && ')}] | order(_createdAt desc) ${limitClause} {
          _id,
          quote,
          author,
          role,
          company,
          relationship,
          project-> {
            _id,
            name,
            "slug": { "current": slug.current }
          },
          image { asset-> { _id, url, metadata { dimensions } }, alt, hotspot },
          linkedin,
          featured
        }
      `);

      return results.map((testimonial: any) => ({
        ...testimonial,
        image: buildImage(testimonial.image),
      }));
    },

    // Knowledge Nodes
    knowledgeNodes: async (_: any, args: {
      nodeType?: string;
      status?: string;
      tagSlug?: string;
      featured?: boolean;
      limit?: number;
    }) => {
      const conditions = ['_type == "knowledgeNode"'];

      if (args.nodeType) {
        conditions.push(`nodeType == $nodeType`);
      }
      if (args.status) {
        conditions.push(`status == $status`);
      }
      if (args.featured !== undefined) {
        conditions.push(`featured == ${args.featured}`);
      }
      if (args.tagSlug) {
        conditions.push(`$tagSlug in tags[]->slug.current`);
      }

      const limitClause = args.limit ? `[0...${args.limit}]` : '';

      const results = await client.fetch(`
        *[${conditions.join(' && ')}] | order(publishedAt desc, importance desc) ${limitClause} {
          _id,
          title,
          "slug": { "current": slug.current },
          summary,
          content,
          nodeType,
          status,
          "tags": tags[]->{ _id, name, "slug": { "current": slug.current }, category, color }[defined(_id) && defined(slug.current)],
          depthLevel,
          importance,
          relatedNodes[]-> {
            _id,
            title,
            "slug": { "current": slug.current },
            nodeType,
            summary
          },
          relatedProjects[]-> {
            _id,
            name,
            "slug": { "current": slug.current }
          },
          chartData,
          codeSnippet,
          publishedAt,
          featured
        }
      `, {
        nodeType: args.nodeType,
        status: args.status,
        tagSlug: args.tagSlug,
      });

      return results.map((node: any) => ({
        ...node,
        tags: (node.tags ?? []).filter((tag: any) => tag?._id && tag?.slug?.current),
      }));
    },

    knowledgeNode: async (_: any, args: { slug: string }) => {
      const node = await client.fetch(`
        *[_type == "knowledgeNode" && slug.current == $slug][0] {
          _id,
          title,
          "slug": { "current": slug.current },
          summary,
          content,
          nodeType,
          status,
          "tags": tags[]->{ _id, name, "slug": { "current": slug.current }, category, color }[defined(_id) && defined(slug.current)],
          depthLevel,
          importance,
          relatedNodes[]-> {
            _id,
            title,
            "slug": { "current": slug.current },
            nodeType,
            summary
          },
          relatedProjects[]-> {
            _id,
            name,
            "slug": { "current": slug.current }
          },
          chartData,
          codeSnippet,
          publishedAt,
          featured
        }
      `, { slug: args.slug });
      return node ? { ...node, tags: (node.tags ?? []).filter((tag: any) => tag?._id && tag?.slug?.current) } : null;
    },

    knowledgeGraph: async () => {
      const nodes = await client.fetch(`
        *[_type == "knowledgeNode" && status == "published"] {
          "id": _id,
          title,
          nodeType,
          depthLevel,
          importance,
          "slug": slug.current,
          "connections": relatedNodes[]._ref
        }
      `);

      // Build edges from connections
      const edges: { source: string; target: string }[] = [];
      const nodeIds = new Set(nodes.map((n: any) => n.id));

      for (const node of nodes) {
        if (node.connections) {
          for (const targetId of node.connections) {
            // Only include edges where both nodes exist
            if (nodeIds.has(targetId)) {
              edges.push({
                source: node.id,
                target: targetId,
              });
            }
          }
        }
      }

      return {
        nodes: nodes.map((n: any) => ({
          id: n.id,
          title: n.title,
          nodeType: n.nodeType,
          depthLevel: n.depthLevel,
          importance: n.importance,
          slug: n.slug,
        })),
        edges,
      };
    },

    // Tags
    tags: async (_: any, args: { category?: string }) => {
      const conditions = ['_type == "tag"'];
      if (args.category) {
        conditions.push(`category == $category`);
      }

      return client.fetch(`
        *[${conditions.join(' && ')}] | order(name asc) {
          _id,
          name,
          "slug": { "current": slug.current },
          category,
          color
        }
      `, { category: args.category });
    },

    tag: async (_: any, args: { slug: string }) => {
      return client.fetch(`
        *[_type == "tag" && slug.current == $slug][0] {
          _id,
          name,
          "slug": { "current": slug.current },
          category,
          color
        }
      `, { slug: args.slug });
    },

    // Interview Questions
    interviewQuestions: async (_: any, args: {
      category?: string;
      difficulty?: string;
      isStarred?: boolean;
      targetCompany?: string;
      limit?: number;
    }) => {
      const conditions = ['_type == "interviewQuestion"'];

      if (args.category) {
        conditions.push(`category == $category`);
      }
      if (args.difficulty) {
        conditions.push(`difficulty == $difficulty`);
      }
      if (args.isStarred !== undefined) {
        conditions.push(`isStarred == ${args.isStarred}`);
      }
      if (args.targetCompany) {
        conditions.push(`targetCompany == $targetCompany`);
      }

      const limitClause = args.limit ? `[0...${args.limit}]` : '';

      const results = await client.fetch(`
        *[${conditions.join(' && ')}] | order(order asc, _createdAt desc) ${limitClause} {
          _id,
          question,
          category,
          tags,
          roleType,
          isStarred,
          lastPracticed,
          confidenceLevel,
          answer,
          keyPoints,
          projectReferences[]-> {
            _id,
            name,
            "slug": { "current": slug.current },
            tagline
          },
          experienceReferences[]-> {
            _id,
            company,
            role
          },
          followUpQuestions,
          redFlags,
          targetCompany,
          difficulty,
          order
        }
      `, {
        category: args.category,
        difficulty: args.difficulty,
        targetCompany: args.targetCompany,
      });

      return results.map((q: any) => ({
        ...q,
        keyPoints: extractStrings(q.keyPoints),
        followUpQuestions: extractStrings(q.followUpQuestions),
        redFlags: extractStrings(q.redFlags),
        tags: extractStrings(q.tags),
        roleType: extractStrings(q.roleType),
        // Filter out null project/experience references (deleted documents)
        projectReferences: (q.projectReferences || []).filter(Boolean),
        experienceReferences: (q.experienceReferences || []).filter(Boolean),
      }));
    },

    interviewQuestion: async (_: any, args: { id: string }) => {
      const result = await client.fetch(`
        *[_type == "interviewQuestion" && _id == $id][0] {
          _id,
          question,
          category,
          tags,
          roleType,
          isStarred,
          lastPracticed,
          confidenceLevel,
          answer,
          keyPoints,
          projectReferences[]-> {
            _id,
            name,
            "slug": { "current": slug.current },
            tagline
          },
          experienceReferences[]-> {
            _id,
            company,
            role
          },
          followUpQuestions,
          redFlags,
          targetCompany,
          difficulty,
          order
        }
      `, { id: args.id });

      if (!result) return null;
      return {
        ...result,
        keyPoints: extractStrings(result.keyPoints),
        followUpQuestions: extractStrings(result.followUpQuestions),
        redFlags: extractStrings(result.redFlags),
        tags: extractStrings(result.tags),
        roleType: extractStrings(result.roleType),
        // Filter out null project/experience references (deleted documents)
        projectReferences: (result.projectReferences || []).filter(Boolean),
        experienceReferences: (result.experienceReferences || []).filter(Boolean),
      };
    },
  },

  Mutation: {
    sendContactMessage: async (_: any, args: { input: {
      name: string;
      email: string;
      subject?: string;
      message: string;
    }}) => {
      const { name, email, subject, message } = args.input;

      // Validate inputs
      if (!name || !email || !message) {
        throw new GraphQLError('Name, email, and message are required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new GraphQLError('Invalid email format', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      try {
        // Get recipient email from Sanity profile
        const profile = await client.fetch(`
          *[_type == "profile"][0] { email }
        `);

        const recipientEmail = profile?.email || process.env.CONTACT_EMAIL;

        if (!recipientEmail) {
          throw new Error('No recipient email configured');
        }

        // Send email via Resend
        await getResend().emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: subject || `New contact from ${name}`,
          text: `
Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ''}

Message:
${message}
          `.trim(),
          replyTo: email,
        });

        return {
          success: true,
          message: 'Message sent successfully!',
        };
      } catch (error) {
        console.error('Error sending contact message:', error);
        throw new GraphQLError('Failed to send message. Please try again later.', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
};

/**
 * Blog Post Seed Script
 * =====================
 * Creates knowledge nodes (blog posts) in Sanity from July 12, 2025 onwards.
 * Run with: npx tsx scripts/seed-blog-posts.ts
 *
 * Prerequisites:
 * - SANITY_API_TOKEN with write access in .env.local
 * - Tags must exist in Sanity first (run seed-tags.ts first if needed)
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  nodeType: 'build' | 'bug' | 'decision' | 'concept' | 'tutorial' | 'chart';
  content: any[];
  tags: string[]; // tag names to look up
  importance: number;
  featured?: boolean;
}

// Helper to create portable text blocks
function createBlock(text: string, style: string = 'normal'): any {
  return {
    _type: 'block',
    _key: Math.random().toString(36).substring(7),
    style,
    children: [{ _type: 'span', _key: Math.random().toString(36).substring(7), text }],
  };
}

function createCodeBlock(code: string, language: string = 'typescript', filename?: string): any {
  return {
    _type: 'code',
    _key: Math.random().toString(36).substring(7),
    language,
    code,
    filename,
  };
}

// Blog posts based on actual portfolio projects and technologies
const blogPosts: BlogPost[] = [
  // July 2025
  {
    title: 'Why I Chose Next.js App Router Over Pages Router',
    slug: 'nextjs-app-router-vs-pages-router',
    summary: 'A deep dive into the architectural decisions behind migrating to App Router, the tradeoffs involved, and lessons learned.',
    nodeType: 'decision',
    importance: 5,
    featured: true,
    tags: ['Next.js', 'React', 'Architecture'],
    content: [
      createBlock('Why I Chose Next.js App Router Over Pages Router', 'h2'),
      createBlock('When Next.js 13 introduced the App Router, I faced a decision: stick with the battle-tested Pages Router or embrace the new paradigm. Here\'s my analysis.'),
      createBlock('The Core Tradeoff', 'h3'),
      createBlock('Pages Router gives you simplicity and predictability. App Router gives you React Server Components, nested layouts, and streaming. The question isn\'t which is "better"—it\'s which tradeoffs align with your project.'),
      createBlock('What I Gained', 'h3'),
      createBlock('1. Server Components by default - no more getServerSideProps boilerplate'),
      createBlock('2. Nested layouts that persist across navigation'),
      createBlock('3. Streaming with Suspense for better perceived performance'),
      createBlock('4. Colocation of data fetching with components'),
      createBlock('What I Accepted', 'h3'),
      createBlock('1. Steeper learning curve for the team'),
      createBlock('2. Some third-party libraries needed updates'),
      createBlock('3. Mental model shift from "pages" to "segments"'),
      createBlock('The Decision Framework', 'h3'),
      createBlock('I use a simple heuristic: if your app has complex nested layouts or needs fine-grained loading states, App Router wins. For simple CRUD apps, Pages Router is still excellent.'),
    ],
  },
  {
    title: 'React Server Components: The Mental Model That Finally Clicked',
    slug: 'react-server-components-mental-model',
    summary: 'After months of confusion, here\'s the mental model for RSC that made everything clear.',
    nodeType: 'concept',
    importance: 5,
    featured: true,
    tags: ['React', 'Next.js', 'Server Components'],
    content: [
      createBlock('React Server Components: The Mental Model That Finally Clicked', 'h2'),
      createBlock('I struggled with RSC for months. Then I realized I was thinking about it wrong.'),
      createBlock('The Wrong Mental Model', 'h3'),
      createBlock('I kept thinking: "Server Components are like SSR but different." This led to endless confusion about hydration, client boundaries, and data flow.'),
      createBlock('The Right Mental Model', 'h3'),
      createBlock('Server Components are a new primitive. They\'re not "SSR components"—they\'re components that only exist on the server. They never hydrate because they were never meant to run on the client.'),
      createCodeBlock(`// This component ONLY runs on the server
// It can directly access databases, file systems, etc.
async function ServerComponent() {
  const data = await db.query('SELECT * FROM users');
  return <div>{data.map(u => <p key={u.id}>{u.name}</p>)}</div>;
}

// This component runs on both server (initial) and client
'use client';
function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`, 'tsx', 'components/example.tsx'),
      createBlock('The Key Insight', 'h3'),
      createBlock('Think of the "use client" directive as drawing a line. Everything above the line stays on the server. Everything below the line gets shipped to the browser.'),
    ],
  },
  {
    title: 'Building a GraphQL API Over Sanity CMS',
    slug: 'graphql-api-over-sanity-cms',
    summary: 'How I built a type-safe GraphQL layer on top of Sanity\'s GROQ queries for better developer experience.',
    nodeType: 'build',
    importance: 4,
    tags: ['GraphQL', 'Sanity', 'TypeScript', 'API Design'],
    content: [
      createBlock('Building a GraphQL API Over Sanity CMS', 'h2'),
      createBlock('Sanity\'s GROQ is powerful, but I wanted GraphQL\'s type safety and tooling. Here\'s how I built a translation layer.'),
      createBlock('Why Not Use Sanity\'s Native GraphQL?', 'h3'),
      createBlock('Sanity offers a GraphQL API, but it auto-generates types from your schema. I wanted custom resolvers, computed fields, and the ability to aggregate data from multiple sources.'),
      createBlock('The Architecture', 'h3'),
      createCodeBlock(`// GraphQL schema definition
const typeDefs = \`
  type Project {
    _id: ID!
    name: String!
    slug: Slug!
    techStack: [Skill!]!
    # Computed field - doesn't exist in Sanity
    relatedPosts: [KnowledgeNode!]!
  }
\`;

// Resolver that queries Sanity
const resolvers = {
  Project: {
    relatedPosts: async (parent) => {
      return sanityClient.fetch(
        \`*[_type == "knowledgeNode" && references($id)]\`,
        { id: parent._id }
      );
    },
  },
};`, 'typescript', 'graphql/schema.ts'),
      createBlock('Benefits of This Approach', 'h3'),
      createBlock('1. Full control over the API shape'),
      createBlock('2. Computed fields and aggregations'),
      createBlock('3. Type generation with GraphQL Code Generator'),
      createBlock('4. Single endpoint for multiple data sources'),
    ],
  },
  {
    title: 'Sanity Schema Design: Lessons from Building a Portfolio CMS',
    slug: 'sanity-schema-design-patterns',
    summary: 'Patterns I\'ve learned for designing Sanity schemas that scale and remain maintainable.',
    nodeType: 'tutorial',
    importance: 4,
    tags: ['Sanity', 'CMS', 'Schema Design'],
    content: [
      createBlock('Sanity Schema Design: Lessons from Building a Portfolio CMS', 'h2'),
      createBlock('After building several Sanity projects, these patterns consistently produce maintainable schemas.'),
      createBlock('Pattern 1: Use Objects for Repeated Structures', 'h3'),
      createCodeBlock(`// Instead of repeating fields across schemas
const tradeoff = {
  type: 'object',
  name: 'tradeoff',
  fields: [
    { name: 'decision', type: 'string' },
    { name: 'prosGained', type: 'array', of: [{ type: 'string' }] },
    { name: 'consAccepted', type: 'array', of: [{ type: 'string' }] },
    { name: 'whyWorthIt', type: 'text' },
  ],
};

// Reuse across project, experience, etc.
{ name: 'tradeoffs', type: 'array', of: [{ type: 'tradeoff' }] }`, 'typescript', 'schemas/tradeoff.ts'),
      createBlock('Pattern 2: Conditional Field Visibility', 'h3'),
      createBlock('Use the hidden property to show fields only when relevant. This keeps the editing interface clean.'),
      createBlock('Pattern 3: Rich Previews', 'h3'),
      createBlock('Invest time in preview configurations. When you have 100+ documents, good previews make content management bearable.'),
    ],
  },
  {
    title: 'TypeScript Generics for GraphQL Operations',
    slug: 'typescript-generics-graphql',
    summary: 'How to build type-safe GraphQL fetching utilities with TypeScript generics.',
    nodeType: 'tutorial',
    importance: 4,
    tags: ['TypeScript', 'GraphQL', 'Type Safety'],
    content: [
      createBlock('TypeScript Generics for GraphQL Operations', 'h2'),
      createBlock('Generic types make GraphQL operations type-safe without manual type annotations.'),
      createBlock('The Problem', 'h3'),
      createBlock('Every GraphQL query returns a different shape. Without generics, you\'re either using `any` or writing types for every query.'),
      createBlock('The Solution', 'h3'),
      createCodeBlock(`async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { tags?: string[] }
): Promise<T> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: options?.tags ? { tags: options.tags } : undefined,
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data as T;
}

// Usage - fully typed!
const data = await fetchGraphQL<{ projects: Project[] }>(\`
  query { projects { _id name } }
\`);
// data.projects is Project[]`, 'typescript', 'lib/graphql/client.ts'),
    ],
  },
  {
    title: 'WebSocket Reconnection: Handling Network Instability',
    slug: 'websocket-reconnection-patterns',
    summary: 'Patterns for building resilient WebSocket connections that handle network drops gracefully.',
    nodeType: 'bug',
    importance: 4,
    tags: ['WebSocket', 'Real-time', 'Error Handling'],
    content: [
      createBlock('WebSocket Reconnection: Handling Network Instability', 'h2'),
      createBlock('Building Hoop Almanac\'s real-time draft system taught me hard lessons about WebSocket reliability.'),
      createBlock('The Bug', 'h3'),
      createBlock('Users on mobile networks would disconnect frequently. Our naive reconnection logic created cascading failures—duplicate events, out-of-sync state, and confused users.'),
      createBlock('The Solution: Exponential Backoff with Jitter', 'h3'),
      createCodeBlock(`class ResilientWebSocket {
  private retryCount = 0;
  private maxRetries = 10;

  private getBackoffDelay(): number {
    // Exponential backoff: 1s, 2s, 4s, 8s...
    const exponential = Math.pow(2, this.retryCount) * 1000;
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    // Cap at 30 seconds
    return Math.min(exponential + jitter, 30000);
  }

  private reconnect() {
    if (this.retryCount >= this.maxRetries) {
      this.onMaxRetriesReached();
      return;
    }

    const delay = this.getBackoffDelay();
    this.retryCount++;

    setTimeout(() => {
      this.connect();
    }, delay);
  }
}`, 'typescript', 'lib/websocket.ts'),
      createBlock('Key Insight', 'h3'),
      createBlock('The jitter is crucial. Without it, all disconnected clients reconnect simultaneously, overwhelming the server.'),
    ],
  },
  {
    title: 'Optimistic UI Updates in Real-time Applications',
    slug: 'optimistic-ui-updates-realtime',
    summary: 'How to make real-time apps feel instant with optimistic updates while handling conflicts.',
    nodeType: 'concept',
    importance: 4,
    tags: ['React', 'UX', 'Real-time', 'State Management'],
    content: [
      createBlock('Optimistic UI Updates in Real-time Applications', 'h2'),
      createBlock('Users expect instant feedback. Here\'s how to deliver it while keeping data consistent.'),
      createBlock('The Principle', 'h3'),
      createBlock('Update the UI immediately as if the operation succeeded. If it fails, roll back. This makes apps feel 10x faster.'),
      createBlock('Implementation Pattern', 'h3'),
      createCodeBlock(`function useDraftPick() {
  const [picks, setPicks] = useState<Pick[]>([]);

  const makePick = async (player: Player) => {
    // 1. Store previous state for rollback
    const previousPicks = [...picks];

    // 2. Optimistically update UI
    const optimisticPick = {
      id: 'temp-' + Date.now(),
      player,
      pending: true
    };
    setPicks(prev => [...prev, optimisticPick]);

    try {
      // 3. Send to server
      const confirmedPick = await api.makePick(player.id);

      // 4. Replace optimistic with confirmed
      setPicks(prev =>
        prev.map(p => p.id === optimisticPick.id ? confirmedPick : p)
      );
    } catch (error) {
      // 5. Rollback on failure
      setPicks(previousPicks);
      toast.error('Pick failed. Please try again.');
    }
  };

  return { picks, makePick };
}`, 'typescript', 'hooks/useDraftPick.ts'),
    ],
  },
  {
    title: 'D3.js Force-Directed Graphs in React',
    slug: 'd3-force-directed-graphs-react',
    summary: 'Integrating D3\'s force simulation with React\'s component model for interactive graph visualizations.',
    nodeType: 'tutorial',
    importance: 4,
    featured: true,
    tags: ['D3.js', 'React', 'Data Visualization'],
    content: [
      createBlock('D3.js Force-Directed Graphs in React', 'h2'),
      createBlock('D3 and React both want to control the DOM. Here\'s how to make them work together.'),
      createBlock('The Challenge', 'h3'),
      createBlock('D3\'s force simulation updates node positions every tick. React wants to own the DOM. Fighting between them causes performance issues.'),
      createBlock('The Solution: Let D3 Calculate, Let React Render', 'h3'),
      createCodeBlock(`function ForceGraph({ nodes, links }) {
  const [positions, setPositions] = useState<Map<string, {x: number, y: number}>>(new Map());

  useEffect(() => {
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
      // Update React state with new positions
      const newPositions = new Map();
      nodes.forEach(node => {
        newPositions.set(node.id, { x: node.x, y: node.y });
      });
      setPositions(newPositions);
    });

    return () => simulation.stop();
  }, [nodes, links]);

  // React renders based on positions state
  return (
    <svg>
      {nodes.map(node => {
        const pos = positions.get(node.id);
        return pos ? (
          <circle key={node.id} cx={pos.x} cy={pos.y} r={5} />
        ) : null;
      })}
    </svg>
  );
}`, 'tsx', 'components/ForceGraph.tsx'),
    ],
  },
  {
    title: 'Tina CMS vs Sanity: When to Choose Each',
    slug: 'tina-cms-vs-sanity-comparison',
    summary: 'A practical comparison based on building production sites with both headless CMS platforms.',
    nodeType: 'decision',
    importance: 4,
    tags: ['Tina CMS', 'Sanity', 'CMS', 'Headless CMS'],
    content: [
      createBlock('Tina CMS vs Sanity: When to Choose Each', 'h2'),
      createBlock('I\'ve built production sites with both. Here\'s when I reach for each.'),
      createBlock('Tina CMS Strengths', 'h3'),
      createBlock('1. Visual editing - edit content directly on the page'),
      createBlock('2. Git-backed - content lives in your repo'),
      createBlock('3. No query language to learn - uses its own abstraction'),
      createBlock('4. Great for developers who want simplicity'),
      createBlock('When building Kevin T Lam\'s portfolio, I chose Tina because the client needed to edit content visually without learning GROQ. The Git-backed approach also meant simpler deployment.'),
      createBlock('Sanity Strengths', 'h3'),
      createBlock('1. GROQ is incredibly powerful for complex queries'),
      createBlock('2. Real-time collaboration out of the box'),
      createBlock('3. Image pipeline with automatic optimization'),
      createBlock('4. Structured content for maximum flexibility'),
      createBlock('Decision Framework', 'h3'),
      createBlock('Choose Tina when: client needs visual editing, simpler content model, Git-based workflow preferred.'),
      createBlock('Choose Sanity when: complex content relationships, real-time collaboration needed, advanced querying required.'),
    ],
  },
  {
    title: 'GSAP ScrollTrigger with React: Performance Patterns',
    slug: 'gsap-scrolltrigger-react-performance',
    summary: 'How to use GSAP ScrollTrigger in React without causing memory leaks or janky animations.',
    nodeType: 'tutorial',
    importance: 3,
    tags: ['GSAP', 'React', 'Animation', 'Performance'],
    content: [
      createBlock('GSAP ScrollTrigger with React: Performance Patterns', 'h2'),
      createBlock('GSAP is powerful but doesn\'t automatically clean up in React. Here\'s how to avoid common pitfalls.'),
      createBlock('The Memory Leak Problem', 'h3'),
      createBlock('ScrollTrigger instances persist even after components unmount. Without cleanup, you\'ll have dozens of zombie triggers eating memory.'),
      createBlock('The Solution: Proper Cleanup', 'h3'),
      createCodeBlock(`function AnimatedSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.animate-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
      });
    }, sectionRef); // Scope to ref

    // Critical: cleanup on unmount
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      <div className="animate-item">Item 1</div>
      <div className="animate-item">Item 2</div>
    </section>
  );
}`, 'tsx', 'components/AnimatedSection.tsx'),
      createBlock('Key Insight', 'h3'),
      createBlock('gsap.context() is your friend. It scopes all animations and ScrollTriggers, making cleanup a single call.'),
    ],
  },
  {
    title: 'Three.js in Next.js: SSR Challenges and Solutions',
    slug: 'threejs-nextjs-ssr-solutions',
    summary: 'How to use Three.js and React Three Fiber in Next.js without SSR errors.',
    nodeType: 'bug',
    importance: 4,
    tags: ['Three.js', 'Next.js', 'React Three Fiber', 'SSR'],
    content: [
      createBlock('Three.js in Next.js: SSR Challenges and Solutions', 'h2'),
      createBlock('Three.js assumes a browser environment. Next.js renders on the server. Here\'s how to bridge the gap.'),
      createBlock('The Error', 'h3'),
      createCodeBlock(`ReferenceError: window is not defined
// or
ReferenceError: document is not defined`, 'bash'),
      createBlock('Solution 1: Dynamic Import with ssr: false', 'h3'),
      createCodeBlock(`// This is the most reliable approach
const DJScene = dynamic(
  () => import('@/components/three/DJScene3D').then(mod => mod.DJScene3D),
  {
    ssr: false,
    loading: () => <div className="h-[500px] bg-muted animate-pulse" />
  }
);`, 'tsx', 'components/LazyScene.tsx'),
      createBlock('Solution 2: Client Component Boundary', 'h3'),
      createBlock('Mark the entire Three.js tree as a client component with "use client" at the top. The component won\'t render on the server at all.'),
      createBlock('Which to Choose?', 'h3'),
      createBlock('Dynamic import when: you want code splitting and loading states.'),
      createBlock('"use client" when: the component is always needed and you want simpler code.'),
    ],
  },
  {
    title: 'PostgreSQL vs Redis: Choosing the Right Data Store',
    slug: 'postgresql-vs-redis-data-store',
    summary: 'When to use PostgreSQL, when to use Redis, and when to use both together.',
    nodeType: 'decision',
    importance: 4,
    tags: ['PostgreSQL', 'Redis', 'Database', 'Architecture'],
    content: [
      createBlock('PostgreSQL vs Redis: Choosing the Right Data Store', 'h2'),
      createBlock('They solve different problems. Here\'s my decision framework.'),
      createBlock('PostgreSQL Excels At', 'h3'),
      createBlock('1. ACID transactions - when data consistency is critical'),
      createBlock('2. Complex queries with JOINs'),
      createBlock('3. Long-term storage'),
      createBlock('4. Relational data with foreign keys'),
      createBlock('Redis Excels At', 'h3'),
      createBlock('1. Caching frequently accessed data'),
      createBlock('2. Session storage'),
      createBlock('3. Real-time leaderboards and counters'),
      createBlock('4. Pub/sub for real-time features'),
      createBlock('The Hoop Almanac Architecture', 'h3'),
      createBlock('We use both: PostgreSQL stores the canonical draft state. Redis caches active drafts and handles pub/sub for real-time updates. On reconnect, we reconcile Redis state with PostgreSQL.'),
    ],
  },
  {
    title: 'Prisma ORM: Tips After 2 Years of Production Use',
    slug: 'prisma-orm-production-tips',
    summary: 'Practical lessons from using Prisma in production applications.',
    nodeType: 'concept',
    importance: 3,
    tags: ['Prisma', 'Database', 'TypeScript', 'ORM'],
    content: [
      createBlock('Prisma ORM: Tips After 2 Years of Production Use', 'h2'),
      createBlock('Prisma has become my default ORM. Here\'s what I\'ve learned.'),
      createBlock('Tip 1: Use Select to Reduce Payload', 'h3'),
      createCodeBlock(`// Bad: fetches all columns
const users = await prisma.user.findMany();

// Good: fetches only what you need
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});`, 'typescript'),
      createBlock('Tip 2: Batch Operations with Transactions', 'h3'),
      createCodeBlock(`// Atomic: all succeed or all fail
await prisma.$transaction([
  prisma.user.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } }),
  prisma.user.update({ where: { id: 2 }, data: { balance: { increment: 100 } } }),
]);`, 'typescript'),
      createBlock('Tip 3: Use Raw Queries Sparingly', 'h3'),
      createBlock('Prisma\'s query builder handles 95% of cases. For complex aggregations, $queryRaw is there, but you lose type safety.'),
    ],
  },
  {
    title: 'OpenAI API Integration: Rate Limits and Fallbacks',
    slug: 'openai-api-rate-limits-fallbacks',
    summary: 'Building resilient AI features that gracefully handle API limits and failures.',
    nodeType: 'build',
    importance: 4,
    tags: ['OpenAI', 'AI', 'API Design', 'Error Handling'],
    content: [
      createBlock('OpenAI API Integration: Rate Limits and Fallbacks', 'h2'),
      createBlock('AI APIs fail. Rate limits hit. Here\'s how to build features that degrade gracefully.'),
      createBlock('The Problem', 'h3'),
      createBlock('OpenAI has rate limits on tokens per minute and requests per minute. Hit them, and your feature breaks for all users.'),
      createBlock('Solution: Request Queue with Backoff', 'h3'),
      createCodeBlock(`class AIRequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing = false;
  private rateLimitDelay = 0;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error: any) {
          if (error.status === 429) {
            // Rate limited - increase delay
            this.rateLimitDelay = Math.min(this.rateLimitDelay + 5000, 60000);
            // Re-queue the request
            this.queue.unshift(async () => {
              const result = await request();
              resolve(result);
            });
          } else {
            reject(error);
          }
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      await request();
      await sleep(this.rateLimitDelay);
    }

    this.processing = false;
  }
}`, 'typescript', 'lib/ai-queue.ts'),
      createBlock('Fallback Strategy', 'h3'),
      createBlock('When AI fails, show cached results or a graceful message. Never let an AI failure break core functionality.'),
    ],
  },
  {
    title: 'Tailwind CSS: Organizing Styles at Scale',
    slug: 'tailwind-css-organizing-styles-scale',
    summary: 'Patterns for keeping Tailwind codebases maintainable as they grow.',
    nodeType: 'concept',
    importance: 3,
    tags: ['Tailwind CSS', 'CSS', 'Architecture'],
    content: [
      createBlock('Tailwind CSS: Organizing Styles at Scale', 'h2'),
      createBlock('Tailwind is great until your className strings become unreadable. Here\'s how I keep things organized.'),
      createBlock('Pattern 1: cn() Utility for Conditional Classes', 'h3'),
      createCodeBlock(`import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<button className={cn(
  'px-4 py-2 rounded',
  variant === 'primary' && 'bg-blue-500 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800',
  disabled && 'opacity-50 cursor-not-allowed'
)} />`, 'typescript', 'lib/utils.ts'),
      createBlock('Pattern 2: Component Variants with CVA', 'h3'),
      createBlock('For components with many variants, use class-variance-authority (cva) to define all states in one place.'),
      createBlock('Pattern 3: Extract Repeated Patterns', 'h3'),
      createBlock('If you\'re copying the same 10 classes everywhere, create a component or add it to your theme.'),
    ],
  },
  {
    title: 'Image Optimization: Next.js Image vs Sanity CDN',
    slug: 'image-optimization-nextjs-sanity',
    summary: 'Comparing image optimization strategies and when to use each approach.',
    nodeType: 'decision',
    importance: 3,
    tags: ['Next.js', 'Sanity', 'Performance', 'Images'],
    content: [
      createBlock('Image Optimization: Next.js Image vs Sanity CDN', 'h2'),
      createBlock('Both offer image optimization. Here\'s when to use each.'),
      createBlock('Next.js Image Component', 'h3'),
      createBlock('Pros: Automatic lazy loading, responsive sizes, format conversion (WebP/AVIF)'),
      createBlock('Cons: Requires width/height or fill, can be tricky with dynamic images'),
      createBlock('Sanity Image Pipeline', 'h3'),
      createBlock('Pros: URL-based transformations, hotspot/crop from CMS, no build step'),
      createBlock('Cons: Additional CDN requests, separate from your app\'s optimization'),
      createBlock('My Approach', 'h3'),
      createBlock('Use Sanity\'s pipeline for CMS images (leverage hotspot data). Use Next.js Image for static assets and when you need fine control over loading behavior.'),
      createCodeBlock(`// Sanity image with hotspot-aware URL
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImage) {
  return builder.image(source);
}

// Usage
<img src={urlFor(image).width(800).height(600).fit('crop').url()} />`, 'typescript'),
    ],
  },
  {
    title: 'Error Boundaries in React: Patterns for Production',
    slug: 'react-error-boundaries-production',
    summary: 'Implementing error boundaries that provide good UX and useful debugging info.',
    nodeType: 'tutorial',
    importance: 3,
    tags: ['React', 'Error Handling', 'UX'],
    content: [
      createBlock('Error Boundaries in React: Patterns for Production', 'h2'),
      createBlock('Error boundaries catch rendering errors. Here\'s how to make them useful.'),
      createBlock('Basic Error Boundary', 'h3'),
      createCodeBlock(`class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorUI error={this.state.error} />;
    }
    return this.props.children;
  }
}`, 'tsx', 'components/ErrorBoundary.tsx'),
      createBlock('Granular Boundaries', 'h3'),
      createBlock('Don\'t wrap your entire app in one boundary. Wrap features individually so one broken component doesn\'t take down everything.'),
      createBlock('Reset Capability', 'h3'),
      createBlock('Give users a way to retry. Pass a resetError function that clears the error state.'),
    ],
  },
  // More posts for variety and depth
  {
    title: 'GraphQL Query Complexity Analysis',
    slug: 'graphql-query-complexity-analysis',
    summary: 'How SculptQL analyzes query complexity to prevent performance problems before they happen.',
    nodeType: 'build',
    importance: 4,
    tags: ['GraphQL', 'Performance', 'SculptQL'],
    content: [
      createBlock('GraphQL Query Complexity Analysis', 'h2'),
      createBlock('GraphQL\'s flexibility is a double-edged sword. Clients can request deeply nested data that kills your server.'),
      createBlock('The Problem', 'h3'),
      createCodeBlock(`# This innocent-looking query could fetch millions of rows
query DeepNested {
  users(first: 100) {
    posts(first: 100) {
      comments(first: 100) {
        author {
          posts(first: 100) {
            # N+1 explosion
          }
        }
      }
    }
  }
}`, 'graphql'),
      createBlock('Complexity Calculation', 'h3'),
      createBlock('We assign costs to fields and multiply by list sizes. The query above might have complexity 100 * 100 * 100 * 100 = 100,000,000.'),
      createBlock('Setting Limits', 'h3'),
      createBlock('SculptQL visualizes this complexity before execution, helping developers understand the cost of their queries and refactor before production.'),
    ],
  },
  {
    title: 'Building Accessible UI Components with Radix',
    slug: 'accessible-ui-components-radix',
    summary: 'Using Radix UI primitives to build accessible components without reinventing the wheel.',
    nodeType: 'tutorial',
    importance: 3,
    tags: ['Accessibility', 'React', 'Radix UI', 'UI Components'],
    content: [
      createBlock('Building Accessible UI Components with Radix', 'h2'),
      createBlock('Accessibility is hard to get right. Radix UI provides unstyled primitives that handle the hard parts.'),
      createBlock('Why Radix?', 'h3'),
      createBlock('1. Keyboard navigation built-in'),
      createBlock('2. Screen reader support'),
      createBlock('3. Focus management'),
      createBlock('4. ARIA attributes handled'),
      createBlock('Example: Accessible Dialog', 'h3'),
      createCodeBlock(`import * as Dialog from '@radix-ui/react-dialog';

function Modal({ children, trigger }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded">
          <Dialog.Title>Modal Title</Dialog.Title>
          <Dialog.Description>Description for screen readers</Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <button>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`, 'tsx', 'components/Modal.tsx'),
      createBlock('The pattern: Radix handles behavior, you handle styling. Tailwind + Radix is a powerful combination.'),
    ],
  },
  {
    title: 'Streaming HTML with React Suspense',
    slug: 'streaming-html-react-suspense',
    summary: 'Using Suspense boundaries to stream HTML and improve perceived performance.',
    nodeType: 'concept',
    importance: 4,
    tags: ['React', 'Suspense', 'Performance', 'Next.js'],
    content: [
      createBlock('Streaming HTML with React Suspense', 'h2'),
      createBlock('Suspense isn\'t just for loading spinners. It enables streaming, fundamentally changing how pages load.'),
      createBlock('How Streaming Works', 'h3'),
      createBlock('Without streaming: Server waits for all data, then sends complete HTML.'),
      createBlock('With streaming: Server sends HTML as it\'s ready, filling in Suspense boundaries as data resolves.'),
      createBlock('Implementation', 'h3'),
      createCodeBlock(`// layout.tsx - shell loads immediately
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <Suspense fallback={<PageSkeleton />}>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}

// page.tsx - slow data doesn't block shell
async function SlowComponent() {
  const data = await slowQuery(); // 3 seconds
  return <DataDisplay data={data} />;
}

export default function Page() {
  return (
    <div>
      <FastComponent />
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}`, 'tsx', 'app/page.tsx'),
      createBlock('The user sees the page shell immediately, with slow components streaming in as they\'re ready.'),
    ],
  },
  {
    title: 'Form Validation: React Hook Form vs Formik',
    slug: 'react-hook-form-vs-formik',
    summary: 'A practical comparison of the two most popular React form libraries.',
    nodeType: 'decision',
    importance: 3,
    tags: ['React', 'Forms', 'React Hook Form'],
    content: [
      createBlock('Form Validation: React Hook Form vs Formik', 'h2'),
      createBlock('I\'ve used both extensively. Here\'s when to choose each.'),
      createBlock('React Hook Form', 'h3'),
      createBlock('Pros: Uncontrolled inputs (better performance), smaller bundle, excellent TypeScript support'),
      createBlock('Cons: Steeper learning curve, different mental model'),
      createBlock('Formik', 'h3'),
      createBlock('Pros: Simpler API, controlled inputs, great documentation'),
      createBlock('Cons: Re-renders on every keystroke, larger bundle'),
      createBlock('My Recommendation', 'h3'),
      createBlock('Use React Hook Form for new projects. The performance benefits matter at scale, and Zod integration makes validation elegant.'),
      createCodeBlock(`const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}`, 'tsx'),
    ],
  },
  {
    title: 'Content Security Policy for Modern Web Apps',
    slug: 'content-security-policy-modern-web',
    summary: 'Implementing CSP headers to protect against XSS and other injection attacks.',
    nodeType: 'tutorial',
    importance: 3,
    tags: ['Security', 'CSP', 'Next.js'],
    content: [
      createBlock('Content Security Policy for Modern Web Apps', 'h2'),
      createBlock('CSP is your defense against XSS. Here\'s how to implement it without breaking your app.'),
      createBlock('Basic CSP in Next.js', 'h3'),
      createCodeBlock(`// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Needed for Next.js
      "style-src 'self' 'unsafe-inline'", // Needed for Tailwind
      "img-src 'self' blob: data: https://cdn.sanity.io",
      "font-src 'self'",
      "connect-src 'self' https://api.sanity.io wss:",
    ].join('; '),
  },
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};`, 'javascript', 'next.config.js'),
      createBlock('The Tradeoff', 'h3'),
      createBlock('\'unsafe-inline\' and \'unsafe-eval\' weaken CSP but are needed for many frameworks. Use nonces for stricter policies.'),
    ],
  },
  {
    title: 'Incremental Static Regeneration Explained',
    slug: 'incremental-static-regeneration-explained',
    summary: 'Understanding ISR: the best of static and dynamic rendering.',
    nodeType: 'concept',
    importance: 4,
    tags: ['Next.js', 'ISR', 'Performance', 'Caching'],
    content: [
      createBlock('Incremental Static Regeneration Explained', 'h2'),
      createBlock('ISR gives you static site speed with dynamic content freshness.'),
      createBlock('How It Works', 'h3'),
      createBlock('1. First request: serves cached static page'),
      createBlock('2. Background: regenerates the page'),
      createBlock('3. Next request: serves newly generated page'),
      createBlock('Implementation', 'h3'),
      createCodeBlock(`// App Router
export const revalidate = 60; // Revalidate every 60 seconds

async function Page() {
  const data = await fetch('...'); // Cached for 60s
  return <div>{data}</div>;
}

// Or on-demand revalidation
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { tag } = await request.json();
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}`, 'typescript'),
      createBlock('When to Use ISR', 'h3'),
      createBlock('Perfect for: blog posts, product pages, marketing sites. Content that changes but not in real-time.'),
      createBlock('Not for: user-specific data, real-time dashboards, frequently changing data.'),
    ],
  },
];

// Generate dates from July 12, 2025 onwards, every other day
function generateDates(count: number): string[] {
  const startDate = new Date('2025-07-12');
  const dates: string[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 2)); // Every other day
    dates.push(date.toISOString());
  }

  return dates;
}

async function seedBlogPosts() {
  console.log('🌱 Starting blog post seeding...\n');

  // First, fetch all tags to get their IDs
  const existingTags = await client.fetch<{ _id: string; name: string }[]>(
    `*[_type == "tag"] { _id, name }`
  );

  const tagMap = new Map(existingTags.map(t => [t.name, t._id]));
  console.log(`Found ${tagMap.size} existing tags\n`);

  // Generate dates
  const dates = generateDates(blogPosts.length);

  // Create documents
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    const publishedAt = dates[i];

    // Map tag names to references
    const tagRefs = post.tags
      .map(tagName => tagMap.get(tagName))
      .filter(Boolean)
      .map(id => ({ _type: 'reference', _ref: id, _key: Math.random().toString(36).substring(7) }));

    const doc = {
      _type: 'knowledgeNode',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      summary: post.summary,
      nodeType: post.nodeType,
      status: 'published',
      content: post.content,
      tags: tagRefs,
      importance: post.importance,
      depthLevel: 2,
      featured: post.featured || false,
      publishedAt,
    };

    try {
      // Check if post already exists
      const existing = await client.fetch(
        `*[_type == "knowledgeNode" && slug.current == $slug][0]`,
        { slug: post.slug }
      );

      if (existing) {
        console.log(`⏭️  Skipping "${post.title}" (already exists)`);
        continue;
      }

      await client.create(doc);
      console.log(`✅ Created: ${post.title} (${new Date(publishedAt).toLocaleDateString()})`);
    } catch (error) {
      console.error(`❌ Failed to create "${post.title}":`, error);
    }
  }

  console.log('\n✨ Blog post seeding complete!');
}

// Run the script
seedBlogPosts().catch(console.error);

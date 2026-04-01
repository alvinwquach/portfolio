/**
 * Tag Seed Script
 * ================
 * Creates tags for blog posts in Sanity.
 * Run with: npx tsx scripts/seed-tags.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' }); // fallback

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

interface Tag {
  name: string;
  category: string;
  color: string;
}

const tags: Tag[] = [
  // Frameworks & Libraries
  { name: 'Next.js', category: 'framework', color: '#000000' },
  { name: 'React', category: 'framework', color: '#61DAFB' },
  { name: 'React Three Fiber', category: 'framework', color: '#ff6f61' },
  { name: 'Three.js', category: 'library', color: '#000000' },
  { name: 'GSAP', category: 'library', color: '#88CE02' },
  { name: 'D3.js', category: 'library', color: '#F9A03C' },
  { name: 'Radix UI', category: 'library', color: '#161618' },
  { name: 'Framer Motion', category: 'library', color: '#0055FF' },

  // Languages & Type Systems
  { name: 'TypeScript', category: 'language', color: '#3178C6' },
  { name: 'JavaScript', category: 'language', color: '#F7DF1E' },
  { name: 'GraphQL', category: 'language', color: '#E10098' },
  { name: 'SQL', category: 'language', color: '#336791' },

  // CMS & Content
  { name: 'Sanity', category: 'cms', color: '#F03E2F' },
  { name: 'Headless CMS', category: 'concept', color: '#6366F1' },
  { name: 'CMS', category: 'concept', color: '#6366F1' },
  { name: 'Schema Design', category: 'concept', color: '#8B5CF6' },

  // Databases
  { name: 'PostgreSQL', category: 'database', color: '#336791' },
  { name: 'Redis', category: 'database', color: '#DC382D' },
  { name: 'Prisma', category: 'orm', color: '#2D3748' },
  { name: 'Database', category: 'concept', color: '#336791' },
  { name: 'ORM', category: 'concept', color: '#2D3748' },

  // AI & APIs
  { name: 'OpenAI', category: 'api', color: '#412991' },
  { name: 'AI', category: 'concept', color: '#412991' },
  { name: 'API Design', category: 'concept', color: '#10B981' },

  // Architecture & Patterns
  { name: 'Architecture', category: 'concept', color: '#6366F1' },
  { name: 'Server Components', category: 'concept', color: '#61DAFB' },
  { name: 'SSR', category: 'concept', color: '#000000' },
  { name: 'ISR', category: 'concept', color: '#000000' },
  { name: 'Caching', category: 'concept', color: '#F59E0B' },
  { name: 'State Management', category: 'concept', color: '#764ABC' },

  // Performance & Optimization
  { name: 'Performance', category: 'concept', color: '#22C55E' },
  { name: 'Images', category: 'concept', color: '#3B82F6' },
  { name: 'Animation', category: 'concept', color: '#EC4899' },

  // Real-time & Communication
  { name: 'WebSocket', category: 'technology', color: '#010101' },
  { name: 'Real-time', category: 'concept', color: '#EF4444' },

  // Quality & Best Practices
  { name: 'Type Safety', category: 'concept', color: '#3178C6' },
  { name: 'Error Handling', category: 'concept', color: '#EF4444' },
  { name: 'Security', category: 'concept', color: '#DC2626' },
  { name: 'CSP', category: 'concept', color: '#DC2626' },
  { name: 'Accessibility', category: 'concept', color: '#059669' },
  { name: 'UX', category: 'concept', color: '#8B5CF6' },

  // Styling
  { name: 'Tailwind CSS', category: 'styling', color: '#06B6D4' },
  { name: 'CSS', category: 'styling', color: '#1572B6' },

  // Data Visualization
  { name: 'Data Visualization', category: 'concept', color: '#F9A03C' },

  // Projects
  { name: 'SculptQL', category: 'project', color: '#8B5CF6' },
  { name: 'Hoop Almanac', category: 'project', color: '#F97316' },
  { name: 'OpportuniQ', category: 'project', color: '#3B82F6' },

  // Forms
  { name: 'Forms', category: 'concept', color: '#10B981' },
  { name: 'React Hook Form', category: 'library', color: '#EC5990' },
  { name: 'Suspense', category: 'concept', color: '#61DAFB' },
  { name: 'UI Components', category: 'concept', color: '#8B5CF6' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seedTags() {
  console.log('🏷️  Starting tag seeding...\n');

  for (const tag of tags) {
    const doc = {
      _type: 'tag',
      name: tag.name,
      slug: { _type: 'slug', current: slugify(tag.name) },
      category: tag.category,
      color: tag.color,
    };

    try {
      // Check if tag already exists
      const existing = await client.fetch(
        `*[_type == "tag" && name == $name][0]`,
        { name: tag.name }
      );

      if (existing) {
        console.log(`⏭️  Skipping "${tag.name}" (already exists)`);
        continue;
      }

      await client.create(doc);
      console.log(`✅ Created tag: ${tag.name}`);
    } catch (error) {
      console.error(`❌ Failed to create "${tag.name}":`, error);
    }
  }

  console.log('\n✨ Tag seeding complete!');
}

seedTags().catch(console.error);

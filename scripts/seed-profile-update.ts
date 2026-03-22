/**
 * Profile Update Seed Script
 * ==========================
 * Patches the existing profile document with corrected hobbies and
 * previousCareers. Does NOT touch any other profile fields.
 *
 * Run with: npx tsx scripts/seed-profile-update.ts
 *
 * Prerequisites:
 * - SANITY_WRITE_TOKEN with Editor/Administrator access in .env
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

// ─── Hobbies & Interests ────────────────────────────────────────────────────

const hobbiesAndInterests = [
  {
    _key: 'djing',
    name: 'DJing',
    description:
      'Mixing and curating music across hip-hop, R&B, and electronic genres. DJing sharpens the same skills as engineering: reading the room, sequencing decisions, and iterating in real time.',
  },
  {
    _key: 'basketball',
    name: 'Basketball',
    description:
      'Playing pickup basketball regularly. Team sport instincts — communication, spatial awareness, adapting mid-game — translate directly to collaborative engineering work.',
  },
  {
    _key: 'sneakers',
    name: 'Sneakers',
    description:
      'Collecting and appreciating sneaker culture and design. An eye for craft, colorway, and limited releases — the intersection of art, commerce, and community.',
  },
  {
    _key: 'gaming',
    name: 'Gaming',
    description:
      'Playing games across multiple platforms with a focus on competitive and narrative-driven titles. Gaming builds systems thinking, pattern recognition, and persistence.',
  },
];

// ─── Previous Careers ────────────────────────────────────────────────────────

const previousCareers = [
  {
    _key: 'safeway',
    title: 'Courtesy Clerk / Cashier',
    company: 'Safeway',
    description:
      'First job out of high school. Handled customer transactions, stocked shelves, and maintained store operations during peak hours. Built a strong work ethic and customer service fundamentals.',
    transferableSkills: [
      'Customer service',
      'Reliability under pressure',
      'Team coordination',
      'Attention to detail',
    ],
  },
  {
    _key: 'tintri',
    title: 'Developer Community Manager',
    company: 'Tintri',
    description:
      'Managed and grew the developer community on existing advocacy platforms (forums, Slack, social channels). Produced technical content, ran community programs, and served as the bridge between engineering and external developers.',
    transferableSkills: [
      'Technical communication',
      'Community platform management',
      'Developer empathy',
      'Content creation',
      'Cross-functional collaboration',
    ],
  },
  {
    _key: 'ellie-mae',
    title: 'Developer Community Manager',
    company: 'Ellie Mae',
    description:
      'Managed developer relations and community engagement on existing platforms for a mortgage-tech API ecosystem. Supported partner developers, maintained documentation, and tracked adoption metrics.',
    transferableSkills: [
      'API documentation',
      'Developer onboarding',
      'Partner communication',
      'Analytics and reporting',
      'Stakeholder management',
    ],
  },
  {
    _key: 'spartronics',
    title: 'Operations Associate',
    company: 'Spartronics',
    description:
      'Supported manufacturing operations and process coordination at an electronics contract manufacturer. Tracked production workflows, identified bottlenecks, and supported quality assurance processes.',
    transferableSkills: [
      'Process documentation',
      'Workflow optimization',
      'Quality assurance mindset',
      'Cross-team coordination',
      'Systematic problem solving',
    ],
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function seedProfileUpdate() {
  console.log('👤 Starting profile update seed...\n');

  const existing = await client.fetch(
    `*[_type == "profile"][0]{ _id, name }`
  );

  if (!existing) {
    console.error('❌ No profile document found. Run seed-profile.ts first.');
    process.exit(1);
  }

  console.log(`Found profile: "${existing.name}" (${existing._id})`);
  console.log(`Patching hobbiesAndInterests (${hobbiesAndInterests.length} entries)...`);
  console.log(`Patching previousCareers (${previousCareers.length} entries)...`);

  await client
    .patch(existing._id)
    .set({ hobbiesAndInterests, previousCareers })
    .commit();

  console.log('\n✅ Patched hobbiesAndInterests and previousCareers.');
  console.log('\nHobbies set:');
  hobbiesAndInterests.forEach((h) => console.log(`  - ${h.name}`));
  console.log('\nPrevious careers set:');
  previousCareers.forEach((c) => console.log(`  - ${c.title} @ ${c.company}`));

  console.log('\n✨ Profile update complete!');
}

seedProfileUpdate().catch(console.error);

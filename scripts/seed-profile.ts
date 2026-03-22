/**
 * Profile Seed Script
 * ===================
 * Creates or patches the profile document in Sanity.
 *
 * - If a profile exists: patches headline and tagline only (preserves all other fields).
 * - If no profile exists: creates a full default profile.
 *
 * Run with: npx tsx scripts/seed-profile.ts
 *
 * Prerequisites:
 * - SANITY_API_TOKEN with write access in .env.local
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

const PROFILE_DATA = {
  _type: 'profile',
  name: 'Alvin Quach',
  headline: 'Full Stack Developer',
  tagline: 'Turning ideas into products people use',
  location: 'San Francisco Bay Area',
  availabilityStatus: 'open',
  availabilityLabel: 'Open to Full-Time & Contract Roles',
  openToRoles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
  whatIEnjoy: [
    'Building real-time systems',
    'Developer tooling',
    'Data visualization',
    'AI-powered features',
  ],
  strengths: ['Problem Solving', 'System Design', 'Clean Code'],
  growthAreas: ['ML/AI integration', 'DevOps & infrastructure'],
  country: 'US',
  employmentTypes: ['FULL_TIME', 'CONTRACT'],
};

async function seedProfile() {
  console.log('👤 Starting profile seed...\n');

  const existing = await client.fetch(`*[_type == "profile"][0]{ _id, headline, tagline }`);

  if (existing) {
    console.log(`Found existing profile (${existing._id})`);
    console.log(`  headline: "${existing.headline}" → "${PROFILE_DATA.headline}"`);
    console.log(`  tagline:  "${existing.tagline ?? '(none)'}" → "${PROFILE_DATA.tagline}"`);

    await client
      .patch(existing._id)
      .set({
        headline: PROFILE_DATA.headline,
        tagline: PROFILE_DATA.tagline,
      })
      .commit();

    console.log('\n✅ Patched headline and tagline.');
  } else {
    console.log('No existing profile found. Creating...');
    const created = await client.create(PROFILE_DATA);
    console.log(`\n✅ Created profile (${created._id}).`);
    console.log('⚠️  Remember to fill in email, linkedin, github, resume, and image in Sanity Studio.');
  }

  console.log('\n✨ Profile seed complete!');
}

seedProfile().catch(console.error);

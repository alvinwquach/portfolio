/**
 * Education Seed Script
 * =====================
 * Creates or updates education entries in Sanity.
 * Matches on institution name — skips if already exists, creates if not.
 *
 * Run with: npx tsx scripts/seed-education.ts
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

interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
  description: string;
  order: number;
}

const educationEntries: EducationEntry[] = [
  {
    institution: 'Juno College of Technology',
    degree: 'Certificate in Web Development',
    field: 'Web Development Immersive',
    graduationYear: 2021,
    description:
      'Intensive full-stack web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and REST APIs. Built and shipped multiple projects across front-end and back-end stacks.',
    order: 1,
  },
  {
    institution: 'University of California, Davis',
    degree: 'Bachelor of Science',
    field: 'Managerial Economics',
    graduationYear: 2014,
    description:
      'Studied the application of microeconomic theory to management decisions, including data analysis, market strategy, and organizational behavior.',
    order: 2,
  },
];

async function seedEducation() {
  console.log('🎓 Starting education seed...\n');

  for (const entry of educationEntries) {
    const existing = await client.fetch(
      `*[_type == "education" && institution == $institution][0]{ _id, institution, degree }`,
      { institution: entry.institution }
    );

    if (existing) {
      console.log(`⏭️  Skipping "${entry.institution}" (already exists as ${existing._id})`);
      continue;
    }

    const doc = {
      _type: 'education',
      institution: entry.institution,
      degree: entry.degree,
      field: entry.field,
      graduationYear: entry.graduationYear,
      description: entry.description,
      order: entry.order,
    };

    try {
      const created = await client.create(doc);
      console.log(`✅ Created: "${entry.institution}" — ${entry.degree} (${entry.graduationYear}) [${created._id}]`);
    } catch (error) {
      console.error(`❌ Failed to create "${entry.institution}":`, error);
    }
  }

  console.log('\n✨ Education seed complete!');
}

seedEducation().catch(console.error);

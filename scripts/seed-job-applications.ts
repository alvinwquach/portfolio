/**
 * Job Application Seed Script
 * ============================
 * Populates the jobApplication schema with real + fictional data.
 * Run with: npx tsx scripts/seed-job-applications.ts
 *
 * Requires SANITY_WRITE_TOKEN (Editor role) in .env.local
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

interface InterviewDate {
  _type: 'object';
  _key: string;
  date: string;
  type: string;
  notes?: string;
  interviewer?: string;
}

interface Contact {
  _type: 'object';
  _key: string;
  name: string;
  role?: string;
  email?: string;
  linkedin?: string;
}

interface JobApplicationDoc {
  _type: 'jobApplication';
  company: string;
  role: string;
  status: string;
  dateApplied: string;
  jobUrl?: string;
  salaryRange?: { min?: number; max?: number; currency: string };
  referral?: boolean;
  source?: string;
  notes?: string;
  nextStep?: string;
  nextStepDate?: string;
  interviewDates?: InterviewDate[];
  contacts?: Contact[];
  rejectionReason?: string;
  compensation?: { baseSalary?: number; equity?: string; bonus?: string; notes?: string };
  order?: number;
}

let keyCounter = 0;
function key() {
  return `k${++keyCounter}`;
}

const applications: Omit<JobApplicationDoc, '_type'>[] = [
  // ─── Real entries ───────────────────────────────────────────

  {
    company: 'Bobyard',
    role: 'Full Stack Engineer',
    status: 'technical',
    dateApplied: '2026-03-20',
    source: 'company-site',
    jobUrl: 'https://jobs.ashbyhq.com/bobyard/0792852e-bb07-4ce0-a61e-fc1db2de0f6f',
    salaryRange: { min: 140000, max: 180000, currency: 'USD' },

    referral: false,
    nextStep: 'Awaiting next round',
    interviewDates: [
      {
        _type: 'object',
        _key: key(),
        date: '2026-03-28T10:00:00Z',
        type: 'take-home',
        notes: 'Comment system — Django + React + PostgreSQL',
      },
      {
        _type: 'object',
        _key: key(),
        date: '2026-04-01T23:00:00Z',
        type: 'technical',
        notes: 'Live coding follow-up — sorted comments walkthrough with Adam Austad',
        interviewer: 'Adam Austad',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'Adam Austad',
        role: 'Recruiter',
        linkedin: 'https://www.linkedin.com/in/adamaustad',
      },
    ],
  },

  {
    company: 'Mercator Intelligence',
    role: 'Founding Full-Stack Engineer',
    status: 'ghosted',
    dateApplied: '2026-02-20',
    source: 'company-site',
    jobUrl: 'https://jobs.ashbyhq.com/mercatorintelligence',
    salaryRange: { min: 150000, max: 190000, currency: 'USD' },

    referral: false,
    notes: 'Supply chain AI startup. 2 founders from Google (Gemini, TF, Google X). Had 2 rounds with Megha (CEO) — went well. No response after round 2.',
    interviewDates: [
      {
        _type: 'object',
        _key: key(),
        date: '2026-02-24T18:00:00Z',
        type: 'phone-screen',
        notes: 'Intro call with Grace',
        interviewer: 'Grace',
      },
      {
        _type: 'object',
        _key: key(),
        date: '2026-02-26T18:00:00Z',
        type: 'behavioral',
        notes: 'Product-sense round with Megha Malpani (CEO)',
        interviewer: 'Megha Malpani',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'Megha Malpani',
        role: 'Co-Founder & CEO',
        email: 'megha@mercatorintelligence.com',
      },
      {
        _type: 'object',
        _key: key(),
        name: 'Grace',
        role: 'Co-Founder & CTO',
      },
    ],
  },

  {
    company: 'Passage Health',
    role: 'Senior Software Engineer',
    status: 'phone-screen',
    dateApplied: '2026-03-10',
    source: 'company-site',
    jobUrl: 'https://job-boards.greenhouse.io/applytopassagehealth/jobs/5822409004',
    salaryRange: { min: 150000, max: 180000, currency: 'USD' },

    referral: false,
    notes: 'ABA therapy platform. Series A, ~19 employees, ~150 practices. Stack: TS, React, React Native, PostgreSQL, AWS.',
    nextStep: 'Schedule phone screen with Tasha Azor',
    interviewDates: [
      {
        _type: 'object',
        _key: key(),
        date: '2026-03-17T17:00:00Z',
        type: 'phone-screen',
        notes: '15-min recruiter screen with Tasha Azor',
        interviewer: 'Tasha Azor',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'Tasha Azor',
        role: 'Recruitment',
        email: 'tazor@passagehealth.com',
      },
    ],
  },

  {
    company: 'Verneek AI',
    role: 'Frontend Engineer',
    status: 'phone-screen',
    dateApplied: '2026-03-14',
    source: 'company-site',

    referral: false,
    notes: 'AI decision assistant (Quin). ~11 person deep-tech startup, NVIDIA partnered, $4.5M pre-seed.',
    interviewDates: [
      {
        _type: 'object',
        _key: key(),
        date: '2026-03-16T18:00:00Z',
        type: 'phone-screen',
        notes: '15-30 min intro with Sampada Bhujel — resume review + possible coding exercise',
        interviewer: 'Sampada Bhujel',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'Sampada Bhujel',
        email: 'sampadab@verneek.com',
      },
    ],
  },

  // ─── Fictional entries ──────────────────────────────────────

  {
    company: 'Stripe',
    role: 'Software Engineer, Dashboard',
    status: 'saved',
    dateApplied: '2026-03-28',
    source: 'company-site',
    salaryRange: { min: 185000, max: 250000, currency: 'USD' },

    referral: false,
    notes: 'Dashboard team — React + TypeScript. Strong interest but haven\'t applied yet.',
  },

  {
    company: 'Notion',
    role: 'Frontend Engineer',
    status: 'saved',
    dateApplied: '2026-03-30',
    source: 'linkedin',
    salaryRange: { min: 170000, max: 230000, currency: 'USD' },

    referral: false,
    notes: 'Block editor team. Would be incredible DX work.',
  },

  {
    company: 'Figma',
    role: 'Software Engineer, Platform',
    status: 'applied',
    dateApplied: '2026-03-22',
    source: 'company-site',
    salaryRange: { min: 180000, max: 240000, currency: 'USD' },

    referral: false,
    notes: 'Platform team — API and plugin architecture. Applied via careers page.',
  },

  {
    company: 'Linear',
    role: 'Full Stack Engineer',
    status: 'applied',
    dateApplied: '2026-03-25',
    source: 'company-site',
    salaryRange: { min: 175000, max: 225000, currency: 'USD' },

    referral: true,
    notes: 'Referred by college friend on the eng team. Small team, high bar.',
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'James Park',
        role: 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/jamespark',
      },
    ],
  },

  {
    company: 'Plaid',
    role: 'Software Engineer, Connectivity',
    status: 'rejected',
    dateApplied: '2026-02-15',
    source: 'linkedin',
    salaryRange: { min: 160000, max: 210000, currency: 'USD' },

    referral: false,
    rejectionReason: 'after-technical',
    notes: 'Failed the system design round. Feedback: needed stronger distributed systems depth.',
    interviewDates: [
      {
        _type: 'object',
        _key: key(),
        date: '2026-02-22T18:00:00Z',
        type: 'phone-screen',
        notes: 'Recruiter screen — 30 min',
        interviewer: 'Sarah Kim',
      },
      {
        _type: 'object',
        _key: key(),
        date: '2026-03-01T17:00:00Z',
        type: 'technical',
        notes: 'Coding round — graph traversal + API design',
        interviewer: 'Marcus Liu',
      },
      {
        _type: 'object',
        _key: key(),
        date: '2026-03-05T18:00:00Z',
        type: 'system-design',
        notes: 'System design — bank connection pipeline. Weak on consistency guarantees.',
        interviewer: 'Derek Huang',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'Sarah Kim',
        role: 'Technical Recruiter',
        email: 'sarah@plaid.com',
      },
    ],
  },

  {
    company: 'Vercel',
    role: 'Software Engineer, DX',
    status: 'offer',
    dateApplied: '2026-02-10',
    source: 'referral',
    salaryRange: { min: 190000, max: 240000, currency: 'USD' },

    referral: true,
    notes: 'DX team — improving developer experience for Next.js and Vercel platform.',
    compensation: {
      baseSalary: 210000,
      equity: '0.05% over 4 years',
      bonus: '$15K signing',
      notes: 'Remote-first, unlimited PTO',
    },
    interviewDates: [
      {
        _type: 'object',
        _key: key(),
        date: '2026-02-14T18:00:00Z',
        type: 'phone-screen',
        notes: 'Recruiter intro + team overview',
        interviewer: 'Lisa Chen',
      },
      {
        _type: 'object',
        _key: key(),
        date: '2026-02-20T17:00:00Z',
        type: 'technical',
        notes: 'Live coding — build a CLI tool for project scaffolding',
        interviewer: 'Shu Ding',
      },
      {
        _type: 'object',
        _key: key(),
        date: '2026-02-25T18:00:00Z',
        type: 'system-design',
        notes: 'Design a build cache invalidation system',
        interviewer: 'Jared Palmer',
      },
      {
        _type: 'object',
        _key: key(),
        date: '2026-03-01T18:00:00Z',
        type: 'final-round',
        notes: 'Culture fit + team lead conversation',
        interviewer: 'Guillermo Rauch',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'Lisa Chen',
        role: 'Recruiting Lead',
        email: 'lisa@vercel.com',
      },
    ],
  },

  {
    company: 'Retool',
    role: 'Frontend Engineer',
    status: 'withdrawn',
    dateApplied: '2026-02-28',
    source: 'angellist',
    salaryRange: { min: 165000, max: 210000, currency: 'USD' },

    referral: false,
    notes: 'Withdrew after receiving Vercel offer. Interesting product but lower excitement.',
    interviewDates: [
      {
        _type: 'object',
        _key: key(),
        date: '2026-03-05T18:00:00Z',
        type: 'phone-screen',
        notes: 'Recruiter call — 20 min',
        interviewer: 'Amy Patel',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: key(),
        name: 'Amy Patel',
        role: 'Talent Acquisition',
        email: 'amy@retool.com',
      },
    ],
  },
];

async function seed() {
  console.log('💼 Starting job application seeding...\n');

  // Check for existing documents
  const existing = await client.fetch<{ company: string }[]>(
    `*[_type == "jobApplication"]{ company }`,
  );
  const existingCompanies = new Set(existing.map((e) => e.company));

  let created = 0;
  let skipped = 0;

  for (const app of applications) {
    if (existingCompanies.has(app.company)) {
      console.log(`⏭️  Skipping "${app.company}" (already exists)`);
      skipped++;
      continue;
    }

    try {
      await client.create({ _type: 'jobApplication', ...app });
      console.log(`✅ Created: ${app.company} — ${app.role} (${app.status})`);
      created++;
    } catch (error) {
      console.error(`❌ Failed to create "${app.company}":`, error);
    }
  }

  console.log(`\n✨ Seeding complete! Created ${created}, skipped ${skipped}.`);
}

seed().catch(console.error);

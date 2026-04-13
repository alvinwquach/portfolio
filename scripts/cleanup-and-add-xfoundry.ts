/**
 * One-off script: remove fictional seed data + add xFoundry application.
 * Run with: npx tsx scripts/cleanup-and-add-xfoundry.ts
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })
config({ path: '.env' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const FICTIONAL_COMPANIES = [
  'Stripe',
  'Notion',
  'Figma',
  'Linear',
  'Plaid',
  'Vercel',
  'Retool',
]

async function run() {
  // ── 1. Delete fictional applications ────────────────────────
  console.log('🗑️  Deleting fictional applications...\n')

  const toDelete = await client.fetch<{ _id: string; company: string }[]>(
    `*[_type == "jobApplication" && company in $companies]{ _id, company }`,
    { companies: FICTIONAL_COMPANIES },
  )

  if (toDelete.length === 0) {
    console.log('  No fictional applications found — already clean.\n')
  } else {
    const tx = client.transaction()
    for (const doc of toDelete) {
      tx.delete(doc._id)
      console.log(`  ✕ ${doc.company} (${doc._id})`)
    }
    await tx.commit()
    console.log(`\n  Deleted ${toDelete.length} documents.\n`)
  }

  // ── 2. Create xFoundry application ─────────────────────────
  console.log('➕ Creating xFoundry application...\n')

  const existing = await client.fetch<number>(
    `count(*[_type == "jobApplication" && company == "xFoundry"])`,
  )

  if (existing > 0) {
    console.log('  xFoundry already exists — skipping.\n')
    return
  }

  await client.create({
    _type: 'jobApplication',
    company: 'xFoundry',
    role: 'Full-Stack Software Engineer - Backend Focus',
    status: 'phone-screen',
    dateApplied: '2026-04-12',
    source: 'company-site',
    referral: false,
    nextStep: 'Intro interview with Alex Onufrak',
    nextStepDate: '2026-04-13',
    interviewDates: [
      {
        _type: 'object',
        _key: 'xf1',
        // 12:30 PM PDT = 19:30 UTC
        date: '2026-04-13T19:30:00Z',
        type: 'phone-screen',
        notes: '30-min intro Zoom call with Alex Onufrak, Head of Technology',
        interviewer: 'Alex Onufrak',
      },
    ],
    contacts: [
      {
        _type: 'object',
        _key: 'xf2',
        name: 'Fiorella Nava',
        role: 'Community Engagement Manager',
      },
      {
        _type: 'object',
        _key: 'xf3',
        name: 'Alex Onufrak',
        role: 'Head of Technology',
      },
    ],
  })

  console.log('  ✅ Created: xFoundry — Full-Stack Software Engineer - Backend Focus\n')
  console.log('✨ Done!')
}

run().catch(console.error)

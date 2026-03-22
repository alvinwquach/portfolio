/**
 * Experience Date Diagnostic Script
 * ===================================
 * Finds experience and freelance/client project entries in Sanity
 * that have missing, empty, or unparseable date fields.
 *
 * This is READ-ONLY — it does not modify any documents.
 * Use its output to identify which entries need date fixes in Sanity Studio.
 *
 * Run with: npx tsx scripts/seed-experience-fix-dates.ts
 *
 * Prerequisites:
 * - SANITY_WRITE_TOKEN (or SANITY_VIEWER_TOKEN) in .env
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' }); // fallback

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_VIEWER_TOKEN,
  useCdn: false,
});

// ─── Date parsing (mirrors the frontend logic) ────────────────────────────────

/**
 * Returns true if the string is a parseable date (e.g. "Aug 2022", "2022-08").
 * Returns false for null, undefined, empty string, or unparseable values.
 */
function isValidDateString(value: string | null | undefined): boolean {
  if (!value || value.trim() === '') return false;
  const parsed = new Date(value);
  return !isNaN(parsed.getTime());
}

function diagnose(
  label: string,
  entry: {
    _id: string;
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    employmentType?: string;
  }
): string[] {
  const issues: string[] = [];
  const name = `${entry.role ?? '(no role)'} @ ${entry.company ?? '(no company)'}`;

  if (!isValidDateString(entry.startDate)) {
    issues.push(
      `  [${label}] ${name} (${entry._id})\n` +
      `    startDate: ${JSON.stringify(entry.startDate)} → INVALID or missing`
    );
  }

  if (!entry.isCurrent && !isValidDateString(entry.endDate)) {
    issues.push(
      `  [${label}] ${name} (${entry._id})\n` +
      `    endDate:   ${JSON.stringify(entry.endDate)} → INVALID or missing (isCurrent=false)`
    );
  }

  return issues;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function diagnoseExperienceDates() {
  console.log('🔍 Experience Date Diagnostic\n');
  console.log('Fetching all experience documents...\n');

  const experiences = await client.fetch(`
    *[_type == "experience"] | order(order asc, _createdAt desc) {
      _id,
      company,
      role,
      startDate,
      endDate,
      isCurrent,
      employmentType
    }
  `);

  console.log(`Found ${experiences.length} experience document(s).\n`);

  const allIssues: string[] = [];

  for (const exp of experiences) {
    const label = exp.employmentType === 'freelance' ? 'FREELANCE' : 'EXPERIENCE';
    const issues = diagnose(label, exp);
    allIssues.push(...issues);
  }

  if (allIssues.length === 0) {
    console.log('✅ All experience entries have valid date fields.\n');
  } else {
    console.log(`⚠️  Found ${allIssues.length} date issue(s):\n`);
    allIssues.forEach((issue) => console.log(issue));
    console.log('\n─── Summary ─────────────────────────────────────────────');
    console.log(`Total issues: ${allIssues.length}`);
    console.log('Fix these in Sanity Studio (https://sanity.io/manage) or patch via a seed script.');
  }

  console.log('\n─── All entries ──────────────────────────────────────────');
  experiences.forEach((exp: any) => {
    const startOk = isValidDateString(exp.startDate) ? '✅' : '❌';
    const endLabel = exp.isCurrent ? '(current)' : isValidDateString(exp.endDate) ? '✅' : '❌';
    console.log(
      `  ${startOk} ${exp.role ?? '?'} @ ${exp.company ?? '?'} | ` +
      `start: ${exp.startDate ?? 'null'} | ` +
      `end: ${exp.isCurrent ? 'present' : (exp.endDate ?? 'null')} ${endLabel}`
    );
  });

  console.log('\n✨ Diagnostic complete!');
}

diagnoseExperienceDates().catch(console.error);

/**
 * Seed Test Booking — Creates a confirmed booking in Sanity for testing
 * =====================================================================
 *
 * WHAT THIS DOES:
 *   1. Creates a schedulingConfig singleton (if it doesn't exist)
 *   2. Creates a confirmed bookingRequest with valid tokens
 *   3. Prints the reschedule URL so you can test /reschedule/[token]
 *
 * RUN:  npx tsx scripts/seed-test-booking.ts
 *
 * PREREQUISITES:
 *   - SANITY_WRITE_TOKEN in .env or .env.local
 *   - SCHEDULING_TOKEN_SECRET in .env or .env.local
 *     (generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
 */

import { createClient } from '@sanity/client'
import { SignJWT } from 'jose'
import { createHash } from 'crypto'
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

const SECRET = process.env.SCHEDULING_TOKEN_SECRET
if (!SECRET) {
  console.error('❌ Missing SCHEDULING_TOKEN_SECRET. Add it to .env.local:')
  console.error('   SCHEDULING_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))
  process.exit(1)
}

const secretBytes = new TextEncoder().encode(SECRET)

async function signToken(payload: Record<string, unknown>, expiresIn: string): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretBytes)
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

async function main() {
  console.log('🔧 Seeding scheduling test data...\n')

  // ── Step 1: Ensure schedulingConfig exists ─────────────
  const existingConfig = await client.fetch(`*[_type == "schedulingConfig"][0]._id`)
  if (!existingConfig) {
    console.log('📋 Creating schedulingConfig singleton...')
    await client.createOrReplace({
      _id: 'schedulingConfig',
      _type: 'schedulingConfig',
      isAcceptingBookings: true,
      weeklySchedule: [
        { _type: 'daySchedule', _key: 'sun', day: 0, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'mon', day: 1, enabled: true, startHour: 10, startMinute: 0, endHour: 14, endMinute: 0 },
        { _type: 'daySchedule', _key: 'tue', day: 2, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'wed', day: 3, enabled: true, startHour: 9, startMinute: 0, endHour: 12, endMinute: 0 },
        { _type: 'daySchedule', _key: 'thu', day: 4, enabled: true, startHour: 13, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'fri', day: 5, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'sat', day: 6, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
      ],
      dateOverrides: [],
      bufferMinutes: 15,
      maxPerDay: 3,
      maxPerWeek: 8,
      slotDurationMinutes: 30,
      advanceBookingDays: 14,
      minimumNoticeHours: 24,
      meetingDescription: 'A casual video call to discuss engineering, projects, or opportunities. I review every request personally and confirm within 24 hours.',
      whatWeCanDiscuss: [
        'Career opportunities & roles',
        'Technical architecture & challenges',
        'Open source collaboration',
        'Project feedback & code review',
        'Mentorship & career advice',
      ],
    })
    console.log('   ✅ Config created\n')
  } else {
    console.log('📋 schedulingConfig already exists, skipping\n')
  }

  // ── Step 2: Create a test booking ──────────────────────
  // Set the slot to 3 days from now at 2pm Pacific (= 9pm or 10pm UTC depending on DST)
  const slotDate = new Date()
  slotDate.setDate(slotDate.getDate() + 3)
  slotDate.setUTCHours(21, 0, 0, 0) // ~2pm Pacific

  // Generate cancel and reschedule tokens
  const cancelJWT = await signToken({ type: 'cancel', bookingId: 'temp' }, '7d')
  const rescheduleJWT = await signToken({ type: 'reschedule', bookingId: 'temp' }, '7d')

  console.log('📝 Creating test booking...')
  const booking = await client.create({
    _type: 'bookingRequest',
    status: 'confirmed',
    requesterName: 'Test User',
    requesterEmail: 'alvinwquach@gmail.com',
    requesterCompany: 'Test Corp',
    requesterRole: 'Software Engineer',
    topic: 'Testing the scheduling system end-to-end. This is a seeded test booking to verify the reschedule flow and email templates work correctly.',
    requestedSlot: slotDate.toISOString(),
    durationMinutes: 30,
    timezone: 'America/Los_Angeles',
    isPrivateLink: false,
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
    cancelToken: hashToken(cancelJWT),
    rescheduleToken: hashToken(rescheduleJWT),
  })

  // Now re-sign tokens with the real booking ID
  const realCancelJWT = await signToken({ type: 'cancel', bookingId: booking._id }, '7d')
  const realRescheduleJWT = await signToken({ type: 'reschedule', bookingId: booking._id }, '7d')

  await client.patch(booking._id).set({
    cancelToken: hashToken(realCancelJWT),
    rescheduleToken: hashToken(realRescheduleJWT),
  }).commit()

  console.log(`   ✅ Booking created: ${booking._id}\n`)

  // ── Print test URLs ────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  console.log('═══════════════════════════════════════════')
  console.log('  TEST URLS')
  console.log('═══════════════════════════════════════════')
  console.log()
  console.log('📅 Reschedule page:')
  console.log(`   ${baseUrl}/reschedule/${realRescheduleJWT}`)
  console.log()
  console.log('❌ Cancel (POST to this with { token }):')
  console.log(`   Token: ${realCancelJWT.substring(0, 40)}...`)
  console.log()
  console.log('📋 Booking details:')
  console.log(`   ID: ${booking._id}`)
  console.log(`   Slot: ${slotDate.toISOString()}`)
  console.log(`   Status: confirmed`)
  console.log(`   Email: alvinwquach@gmail.com`)
  console.log()
  console.log('🔗 View in Sanity Studio:')
  console.log(`   https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/desk/scheduling;${booking._id}`)
  console.log()
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1) })

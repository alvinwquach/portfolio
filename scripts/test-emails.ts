/**
 * Test Email Templates — Sends all 7 scheduling emails to your inbox
 * ===================================================================
 *
 * WHAT THIS DOES:
 *   Sends each email template to alvinwquach@gmail.com so you can
 *   preview them in a real email client (Gmail, Apple Mail, etc.).
 *
 * RUN:  npx tsx scripts/test-emails.ts
 *
 * PREREQUISITES:
 *   - RESEND_API_KEY in .env or .env.local
 *     (get one at https://resend.com/api-keys)
 *
 * NOTE: If you're on Resend's free tier, you can only send to your
 * own verified email. The "from" address must use @resend.dev or
 * a verified domain.
 */

import { Resend } from 'resend'
import { render } from '@react-email/render'
import { config } from 'dotenv'

// React Email templates
import VerifyEmail from '../emails/VerifyEmail'
import ConfirmationEmail from '../emails/ConfirmationEmail'
import NewRequestNotification from '../emails/NewRequestNotification'
import RejectionEmail from '../emails/RejectionEmail'
import CancellationConfirmation from '../emails/CancellationConfirmation'
import RescheduleNotification from '../emails/RescheduleNotification'
import RescheduleConfirmation from '../emails/RescheduleConfirmation'

config({ path: '.env.local' })
config({ path: '.env' })

const resend = new Resend(process.env.RESEND_API_KEY)

if (!process.env.RESEND_API_KEY) {
  console.error('❌ Missing RESEND_API_KEY. Add it to .env.local')
  console.error('   Get one at: https://resend.com/api-keys')
  process.exit(1)
}

const TO = 'alvinwquach@gmail.com'
// Resend free tier requires sending from @resend.dev
const FROM = 'Alvin Quach Test <onboarding@resend.dev>'

const BASE_URL = 'http://localhost:3000'

async function sendTemplate(name: string, subject: string, element: React.ReactElement) {
  try {
    const html = await render(element)
    const result = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[TEST] ${subject}`,
      html,
    })
    console.log(`  ✅ ${name} — sent (${(result as { data?: { id: string } }).data?.id || 'ok'})`)
  } catch (err) {
    console.log(`  ❌ ${name} — failed: ${err instanceof Error ? err.message : err}`)
  }
}

async function main() {
  console.log('📧 Sending all 7 email templates to', TO)
  console.log('   From:', FROM)
  console.log()

  // Small delay between sends to avoid rate limiting
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

  // 1. Verify Email
  await sendTemplate(
    'VerifyEmail',
    'Verify your meeting request — alvinquach.dev',
    VerifyEmail({ name: 'Alvin', verifyUrl: `${BASE_URL}/api/schedule/verify?token=test-jwt-token` })
  )
  await delay(500)

  // 2. New Request Notification (sent to you)
  await sendTemplate(
    'NewRequestNotification',
    'New meeting request: Jane Smith from Acme Corp',
    NewRequestNotification({
      name: 'Jane Smith',
      email: 'jane@acme.com',
      company: 'Acme Corp',
      role: 'VP Engineering',
      topic: 'Would love to discuss a potential engineering role on your team. I have 5 years of React/Next.js experience.',
      formattedSlot: 'Friday, April 3, 2026 at 2:00 PM',
      isPrivateLink: false,
      studioUrl: 'https://bl7owm8r.sanity.studio/desk/scheduling',
    })
  )
  await delay(500)

  // 3. Confirmation Email
  await sendTemplate(
    'ConfirmationEmail',
    'Meeting confirmed — Apr 3 with Alvin Quach',
    ConfirmationEmail({
      name: 'Alvin',
      formattedDate: 'Friday, April 3, 2026 at 2:00 PM PDT',
      durationMinutes: 30,
      meetLink: 'https://meet.google.com/abc-defg-hij',
      icsUrl: `${BASE_URL}/api/schedule/ical/test-booking-id`,
      rescheduleUrl: `${BASE_URL}/reschedule/test-reschedule-token`,
      cancelUrl: `${BASE_URL}/schedule/cancel/test-cancel-token`,
    })
  )
  await delay(500)

  // 4. Rejection Email
  await sendTemplate(
    'RejectionEmail',
    'Re: Your meeting request — alvinquach.dev',
    RejectionEmail({
      name: 'Alvin',
      rejectionReason: 'My schedule is fully booked for the next few weeks.',
    })
  )
  await delay(500)

  // 5. Rejection Email (no reason)
  await sendTemplate(
    'RejectionEmail (no reason)',
    'Re: Your meeting request — alvinquach.dev',
    RejectionEmail({ name: 'Alvin' })
  )
  await delay(500)

  // 6. Cancellation Confirmation
  await sendTemplate(
    'CancellationConfirmation',
    'Meeting cancelled — April 3',
    CancellationConfirmation({
      formattedDate: 'Friday, April 3, 2026 at 2:00 PM PDT',
      scheduleUrl: `${BASE_URL}/schedule`,
    })
  )
  await delay(500)

  // 7. Reschedule Notification (sent to you)
  await sendTemplate(
    'RescheduleNotification',
    'Jane Smith requested to reschedule',
    RescheduleNotification({
      name: 'Jane Smith',
      oldSlot: 'Friday, April 3, 2026 at 2:00 PM PDT',
      newSlot: 'Monday, April 6, 2026 at 10:00 AM PDT',
      topic: 'Engineering role discussion',
      studioUrl: 'https://bl7owm8r.sanity.studio/desk/scheduling',
    })
  )
  await delay(500)

  // 8. Reschedule Confirmation
  await sendTemplate(
    'RescheduleConfirmation',
    'Reschedule confirmed — Apr 6 with Alvin Quach',
    RescheduleConfirmation({
      name: 'Alvin',
      newFormattedDate: 'Monday, April 6, 2026 at 10:00 AM PDT',
      previousFormattedDate: 'Friday, April 3, 2026 at 2:00 PM PDT',
      durationMinutes: 30,
      meetLink: 'https://meet.google.com/abc-defg-hij',
      icsUrl: `${BASE_URL}/api/schedule/ical/test-booking-id`,
      rescheduleUrl: `${BASE_URL}/reschedule/test-reschedule-token`,
      cancelUrl: `${BASE_URL}/schedule/cancel/test-cancel-token`,
    })
  )

  console.log()
  console.log('✅ Done! Check your inbox at', TO)
  console.log('   (Subject lines are prefixed with [TEST])')
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1) })

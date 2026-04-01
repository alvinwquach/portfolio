/**
 * Preview Email Templates — Renders all templates to HTML files
 * ==============================================================
 *
 * Opens each email template in your browser so you can preview
 * the design without needing a Resend API key.
 *
 * RUN:  npx tsx scripts/preview-emails.ts
 *
 * OUTPUT: Creates HTML files in /tmp/email-previews/ and opens them.
 */

import { render } from '@react-email/render'
import { writeFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'

import VerifyEmail from '../emails/VerifyEmail'
import ConfirmationEmail from '../emails/ConfirmationEmail'
import NewRequestNotification from '../emails/NewRequestNotification'
import RejectionEmail from '../emails/RejectionEmail'
import CancellationConfirmation from '../emails/CancellationConfirmation'
import RescheduleNotification from '../emails/RescheduleNotification'
import RescheduleConfirmation from '../emails/RescheduleConfirmation'
import RequestReceivedEmail from '../emails/RequestReceivedEmail'

const OUT_DIR = '/tmp/email-previews'
const BASE_URL = 'http://localhost:3000'

interface Template {
  name: string
  element: React.ReactElement
}

const templates: Template[] = [
  {
    name: '1-verify-email',
    element: VerifyEmail({
      name: 'Alvin',
      verifyUrl: `${BASE_URL}/api/schedule/verify?token=test-jwt-token`,
    }),
  },
  {
    name: '2-request-received',
    element: RequestReceivedEmail({
      name: 'Jane',
      formattedSlot: 'Friday, April 3, 2026 at 2:00 PM PDT',
      durationLabel: '30 min',
      topic: 'Would love to discuss a potential engineering role. I have 5 years of React/Next.js experience and am looking to join a product-focused team.',
    }),
  },
  {
    name: '3-new-request-notification',
    element: NewRequestNotification({
      name: 'Jane Smith',
      email: 'jane@acme.com',
      company: 'Acme Corp',
      role: 'VP Engineering',
      topic: 'Would love to discuss a potential engineering role. I have 5 years of React/Next.js experience and am looking to join a product-focused team.',
      formattedSlot: 'Friday, April 3, 2026 at 2:00 PM',
      isPrivateLink: false,
      studioUrl: 'https://bl7owm8r.sanity.studio/desk/scheduling',
    }),
  },
  {
    name: '4-confirmation-email',
    element: ConfirmationEmail({
      name: 'Jane',
      formattedDate: 'Friday, April 3, 2026 at 2:00 PM PDT',
      durationMinutes: 30,
      meetLink: 'https://meet.google.com/abc-defg-hij',
      icsUrl: `${BASE_URL}/api/schedule/ical/test-booking-id`,
      rescheduleUrl: `${BASE_URL}/reschedule/test-reschedule-token`,
      cancelUrl: `${BASE_URL}/schedule/cancel/test-cancel-token`,
    }),
  },
  {
    name: '5-rejection-with-reason',
    element: RejectionEmail({
      name: 'Jane',
      rejectionReason: 'My schedule is fully booked for the next few weeks.',
    }),
  },
  {
    name: '6-rejection-no-reason',
    element: RejectionEmail({
      name: 'Jane',
    }),
  },
  {
    name: '7-cancellation-confirmation',
    element: CancellationConfirmation({
      formattedDate: 'Friday, April 3, 2026 at 2:00 PM PDT',
      scheduleUrl: `${BASE_URL}/schedule`,
    }),
  },
  {
    name: '8-reschedule-notification',
    element: RescheduleNotification({
      name: 'Jane Smith',
      oldSlot: 'Friday, April 3, 2026 at 2:00 PM PDT',
      newSlot: 'Monday, April 6, 2026 at 10:00 AM PDT',
      topic: 'Engineering role discussion',
      studioUrl: 'https://bl7owm8r.sanity.studio/desk/scheduling',
    }),
  },
  {
    name: '9-reschedule-confirmation',
    element: RescheduleConfirmation({
      name: 'Jane',
      newFormattedDate: 'Monday, April 6, 2026 at 10:00 AM PDT',
      previousFormattedDate: 'Friday, April 3, 2026 at 2:00 PM PDT',
      durationMinutes: 30,
      meetLink: 'https://meet.google.com/abc-defg-hij',
      icsUrl: `${BASE_URL}/api/schedule/ical/test-booking-id`,
      rescheduleUrl: `${BASE_URL}/reschedule/test-reschedule-token`,
      cancelUrl: `${BASE_URL}/schedule/cancel/test-cancel-token`,
    }),
  },
]

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  console.log('📧 Rendering email templates to HTML...\n')

  const indexLinks: string[] = []

  for (const { name, element } of templates) {
    const html = await render(element)
    const filePath = `${OUT_DIR}/${name}.html`
    writeFileSync(filePath, html)
    console.log(`  ✅ ${name}.html`)
    indexLinks.push(`<li style="margin:8px 0"><a href="${name}.html" style="color:#3b82f6;font-size:16px">${name}</a></li>`)
  }

  // Create an index page that links to all templates
  const indexHtml = `<!DOCTYPE html>
<html><head><title>Email Template Previews</title></head>
<body style="background:#0a0b0f;color:#f1f5f9;font-family:system-ui;padding:40px">
<h1 style="font-size:24px;margin-bottom:24px">Email Template Previews</h1>
<p style="color:#94a3b8;margin-bottom:24px">Click each to preview. These are the actual HTML that gets sent via Resend.</p>
<ul style="list-style:none;padding:0">${indexLinks.join('\n')}</ul>
</body></html>`

  writeFileSync(`${OUT_DIR}/index.html`, indexHtml)

  console.log(`\n📂 Files saved to: ${OUT_DIR}/`)
  console.log('🌐 Opening in browser...\n')

  // Open the index page in default browser
  execSync(`open ${OUT_DIR}/index.html`)
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1) })

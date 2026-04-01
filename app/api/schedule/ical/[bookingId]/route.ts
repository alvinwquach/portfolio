/**
 * GET /api/schedule/ical/[bookingId] — Download .ics Calendar File
 * ================================================================
 *
 * WHAT IS AN .ICS FILE?
 * ---------------------
 * An .ics (iCalendar) file is a universal calendar format supported by:
 *   - Apple Calendar
 *   - Microsoft Outlook
 *   - Google Calendar (via import)
 *   - Thunderbird
 *   - Every calendar app ever
 *
 * When the user clicks "Add to Calendar" in the confirmation email,
 * this route generates a .ics file and downloads it to their device.
 * Opening the file automatically prompts their calendar app to add the event.
 *
 * THE ICS FORMAT:
 * ---------------
 * An .ics file is plain text with a specific structure:
 *
 *   BEGIN:VCALENDAR          ← Start of calendar file
 *   VERSION:2.0              ← iCalendar version
 *   BEGIN:VEVENT             ← Start of event
 *   DTSTART:20260401T160000Z ← Start time in UTC (YYYYMMDDTHHMMSSZ)
 *   DTEND:20260401T163000Z   ← End time in UTC
 *   SUMMARY:Meeting Title    ← Event title
 *   DESCRIPTION:Topic        ← Event description
 *   LOCATION:https://meet... ← Google Meet link
 *   END:VEVENT               ← End of event
 *   END:VCALENDAR            ← End of calendar file
 *
 * WHY NO AUTH?
 * The bookingId in the URL is a Sanity document ID (like "abc123xyz").
 * It's not sensitive information — you can't DO anything with it
 * (no cancel, no reschedule). You can only get the meeting details,
 * which the person already has from the confirmation email.
 *
 * REQUEST:
 *   GET /api/schedule/ical/abc123xyz
 *
 * RESPONSE:
 *   Content-Type: text/calendar
 *   Content-Disposition: attachment; filename="meeting.ics"
 *   Body: iCalendar file content
 */

import { NextResponse } from 'next/server'
import { getBookingById } from '@/lib/scheduling/sanity-scheduling'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params

    // ── Fetch booking from Sanity ────────────────────────
    const booking = await getBookingById(bookingId)

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // ── Build the .ics file content ──────────────────────
    // ICS dates use a compact format: YYYYMMDDTHHMMSSZ
    // The "Z" suffix means UTC (no timezone offset).
    const startDate = new Date(booking.requestedSlot)
    const endDate = new Date(
      startDate.getTime() + booking.durationMinutes * 60 * 1000
    )

    // Format Date → ICS timestamp (e.g., "20260401T160000Z")
    const formatIcsDate = (date: Date): string =>
      date
        .toISOString()
        .replace(/[-:]/g, '')  // Remove dashes and colons
        .replace(/\.\d{3}/, '') // Remove milliseconds

    // Escape special characters in ICS text fields
    // Commas, semicolons, and backslashes need escaping
    const escapeIcs = (text: string): string =>
      text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')

    // Build the VEVENT content
    // Each line is a "property:value" pair
    // UID is required to be globally unique (use bookingId + domain)
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//alvinquach.dev//Scheduling//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${bookingId}@alvinquach.dev`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${escapeIcs(`Meeting with Alvin Quach`)}`,
      `DESCRIPTION:${escapeIcs(booking.topic)}`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n') // ICS uses CRLF line endings (Windows-style)

    // ── Return with correct headers ──────────────────────
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        // text/calendar tells the browser this is a calendar file
        'Content-Type': 'text/calendar; charset=utf-8',
        // attachment; filename=... triggers a download instead of displaying
        'Content-Disposition': 'attachment; filename="meeting.ics"',
      },
    })
  } catch (error) {
    console.error('[api/schedule/ical] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate calendar file' },
      { status: 500 }
    )
  }
}

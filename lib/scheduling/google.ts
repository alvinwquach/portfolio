/**
 * Google Calendar Integration
 * ===========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file handles all communication with the Google Calendar API.
 * It provides three main functions:
 *
 *   1. getFreeBusy()          — Check when Alvin is busy
 *   2. createCalendarEvent()  — Create a meeting with Google Meet
 *   3. deleteCalendarEvent()  — Delete an event (on cancellation)
 *
 * HOW GOOGLE CALENDAR API WORKS:
 * ------------------------------
 * Google Calendar uses OAuth2 for authentication. Instead of a simple
 * API key, we use a 4-part credential system:
 *
 *   CLIENT_ID     — Identifies our app to Google ("I am alvinquach.dev")
 *   CLIENT_SECRET — Proves our app's identity (like a password)
 *   REFRESH_TOKEN — A long-lived token that lets us get new access tokens
 *   ACCESS_TOKEN  — A short-lived token (1 hour) for actual API calls
 *
 * The flow:
 *   1. On first setup, Alvin goes through Google's OAuth consent screen
 *   2. He grants calendar access and gets a refresh_token
 *   3. We store the refresh_token in env vars
 *   4. At runtime, we exchange refresh_token for a fresh access_token
 *   5. Use the access_token for API calls
 *   6. When it expires, googleapis library auto-refreshes it
 *
 * WHY FREEBUSY INSTEAD OF LISTING EVENTS?
 * ----------------------------------------
 * The FreeBusy endpoint only returns busy/free times, NOT event details.
 * This is better because:
 *   - It's a privacy-safe read (visitors don't see meeting titles)
 *   - It's faster (less data transferred)
 *   - It works across multiple calendars
 *   - It has more generous rate limits
 *
 * CACHING:
 * --------
 * We cache FreeBusy results in memory for 5 minutes. This prevents
 * hammering Google's API when multiple users load the schedule page
 * simultaneously. The cache is a simple Map that lives in the
 * serverless function's memory (cleared on cold start).
 *
 * GRACEFUL DEGRADATION:
 * ---------------------
 * If Google Calendar API fails (rate limit, auth error, network issue),
 * we return an empty busy array instead of crashing. This means:
 *   - The schedule page still loads
 *   - All slots show as available (may cause conflicts)
 *   - A warning is logged for debugging
 *   - The API response includes a warning flag
 */

import { google } from 'googleapis'
import type { BookingRequest, BusyPeriod } from '@/types/scheduling'

// ═══════════════════════════════════════════
// OAUTH2 CLIENT SETUP
// ═══════════════════════════════════════════

/**
 * Create and configure the Google OAuth2 client.
 *
 * WHY A FUNCTION?
 * Same reason as getSecret() in tokens.ts — env vars might not be
 * available at module load time. Lazy initialization on first call.
 *
 * WHAT IS OAuth2Client?
 * It's the googleapis library's class that handles:
 *   - Storing credentials (client ID, secret, tokens)
 *   - Automatically refreshing expired access tokens
 *   - Adding auth headers to API requests
 *
 * PSEUDOCODE:
 *   function getOAuth2Client():
 *     create OAuth2 client with client ID and secret
 *     set the refresh token (so it can auto-get access tokens)
 *     return the configured client
 */
function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  // setCredentials tells the client: "Here's a refresh token.
  // Use it to get access tokens automatically when needed."
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })

  return oauth2Client
}

// ═══════════════════════════════════════════
// IN-MEMORY CACHE
// ═══════════════════════════════════════════

/**
 * Simple in-memory cache for FreeBusy results.
 *
 * WHY NOT REDIS OR A REAL CACHE?
 * The spec says "no additional persistence layer." Plus, this is a
 * portfolio site with low traffic — a simple Map is fine.
 *
 * HOW IT WORKS:
 * - Key: "freebusy:{startISO}:{endISO}" (unique per date range)
 * - Value: { data: BusyPeriod[], timestamp: number }
 * - On read: if timestamp is older than 5 minutes, discard and re-fetch
 *
 * CAVEAT:
 * This cache lives in the serverless function's memory. On Vercel,
 * each cold start gets a fresh cache. This is fine — it just means
 * the first request after a cold start will hit Google's API.
 */
const cache = new Map<string, { data: BusyPeriod[]; timestamp: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes in milliseconds

// ═══════════════════════════════════════════
// FREEBUSY
// ═══════════════════════════════════════════

/**
 * Get Alvin's busy times from Google Calendar.
 *
 * HOW THE FREEBUSY API WORKS:
 *   POST https://www.googleapis.com/calendar/v3/freeBusy
 *   Body: {
 *     timeMin: "2026-03-30T00:00:00Z",  // Start of range
 *     timeMax: "2026-04-06T00:00:00Z",  // End of range
 *     items: [{ id: "calendar@gmail.com" }]  // Which calendars
 *   }
 *
 *   Response: {
 *     calendars: {
 *       "calendar@gmail.com": {
 *         busy: [
 *           { start: "2026-03-31T14:00:00Z", end: "2026-03-31T15:00:00Z" },
 *           { start: "2026-04-01T10:00:00Z", end: "2026-04-01T11:00:00Z" },
 *         ]
 *       }
 *     }
 *   }
 *
 * We extract the busy array and return it.
 *
 * @param startDate - Start of the date range to check
 * @param endDate - End of the date range to check
 * @returns Array of busy periods, or empty array on error
 */
export async function getFreeBusy(
  startDate: Date,
  endDate: Date
): Promise<BusyPeriod[]> {
  // PSEUDOCODE:
  // 1. Build a cache key from the date range
  // 2. Check if we have a valid (< 5 min old) cached result
  // 3. If yes, return cached data
  // 4. If no, call Google Calendar FreeBusy API
  // 5. Extract busy periods from the response
  // 6. Store in cache
  // 7. Return busy periods
  // 8. On ANY error: log it, return empty array (graceful degradation)

  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) {
    console.warn('[scheduling/google] GOOGLE_CALENDAR_ID not set, returning empty busy periods')
    return []
  }

  // ── Step 1: Build cache key ────────────────────────────
  const cacheKey = `freebusy:${startDate.toISOString()}:${endDate.toISOString()}`

  // ── Step 2: Check cache ────────────────────────────────
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    // ── Step 3: Call Google Calendar API ──────────────────
    const auth = getOAuth2Client()
    const calendar = google.calendar({ version: 'v3', auth })

    const response = await calendar.freebusy.query({
      requestBody: {
        // timeMin/timeMax define the date range to check
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        // items: which calendars to check (just Alvin's)
        items: [{ id: calendarId }],
      },
    })

    // ── Step 4: Extract busy periods ─────────────────────
    // The response nests busy periods under calendars[calendarId].busy
    // We need to safely navigate this structure (it might be missing)
    const busyPeriods: BusyPeriod[] =
      response.data.calendars?.[calendarId]?.busy?.map((period) => ({
        start: period.start || '',
        end: period.end || '',
      })) || []

    // ── Step 5: Cache the result ─────────────────────────
    cache.set(cacheKey, { data: busyPeriods, timestamp: Date.now() })

    return busyPeriods
  } catch (error) {
    // ── Step 6: Graceful degradation ─────────────────────
    // Log the error but don't crash. The calendar will show all
    // slots as available, which is better than showing nothing.
    console.error('[scheduling/google] FreeBusy API error:', error)
    return []
  }
}

// ═══════════════════════════════════════════
// CREATE CALENDAR EVENT
// ═══════════════════════════════════════════

/**
 * Create a Google Calendar event with Google Meet.
 *
 * WHEN IS THIS CALLED?
 * After Alvin confirms a booking in Sanity Studio, the webhook handler
 * calls this to create the calendar event and get a Google Meet link.
 *
 * WHAT THIS CREATES:
 *   - A calendar event on Alvin's calendar
 *   - A Google Meet video conference link
 *   - Sends a calendar invite to the requester's email
 *
 * @param booking - The confirmed booking document from Sanity
 * @param meetLink - Whether to attach a Google Meet link (always true for now)
 * @returns { eventId, meetLink } for storage in Sanity
 */
export async function createCalendarEvent(
  booking: BookingRequest,
  meetLink: boolean = true
): Promise<{ eventId: string; meetLink: string }> {
  // PSEUDOCODE:
  // 1. Calculate event end time (start + durationMinutes)
  // 2. Build the event object:
  //    - Title: "Meeting with [name]"
  //    - Description: the topic they submitted
  //    - Start/end times in UTC
  //    - Attendees: requester's email (sends them an invite)
  //    - Conference data: Google Meet link (if meetLink=true)
  // 3. Insert the event via Calendar API
  // 4. Extract the event ID and Meet link from the response
  // 5. Return both

  const auth = getOAuth2Client()
  const calendar = google.calendar({ version: 'v3', auth })

  // Calculate end time by adding duration to start time
  const startTime = new Date(booking.requestedSlot)
  const endTime = new Date(
    startTime.getTime() + booking.durationMinutes * 60 * 1000
  )

  // Build the event object
  // conferenceDataVersion: 1 tells the API we want to create a Meet link
  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    conferenceDataVersion: meetLink ? 1 : 0,
    sendUpdates: 'all', // Send calendar invite emails to attendees
    requestBody: {
      summary: `Meeting with ${booking.requesterName}`,
      description: [
        `Topic: ${booking.topic}`,
        '',
        booking.requesterCompany
          ? `Company: ${booking.requesterCompany}`
          : '',
        booking.requesterRole ? `Role: ${booking.requesterRole}` : '',
        '',
        `Booked via alvinquach.dev/schedule`,
      ]
        .filter(Boolean)
        .join('\n'),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [{ email: booking.requesterEmail }],
      // conferenceData creates the Google Meet link
      ...(meetLink && {
        conferenceData: {
          createRequest: {
            // requestId must be unique per event — use booking ID
            requestId: `meet-${booking._id}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }),
    },
  })

  // Extract the Google Meet link from the conference data
  // The API returns the Meet link in entryPoints[0].uri
  const meetUri =
    event.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === 'video'
    )?.uri || ''

  return {
    eventId: event.data.id || '',
    meetLink: meetUri,
  }
}

// ═══════════════════════════════════════════
// DELETE CALENDAR EVENT
// ═══════════════════════════════════════════

/**
 * Delete a Google Calendar event.
 *
 * WHEN IS THIS CALLED?
 * 1. When a user cancels a confirmed booking
 * 2. When a user reschedules (old event deleted, new one created on re-approval)
 *
 * GRACEFUL HANDLING:
 * If the event doesn't exist (already deleted manually, etc.),
 * we catch the 404 and don't throw. This prevents the cancellation
 * flow from failing just because the calendar event was already gone.
 *
 * @param eventId - The Google Calendar event ID stored in Sanity
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  // PSEUDOCODE:
  // try:
  //   delete the event from Google Calendar
  //   send cancellation emails to attendees
  // catch:
  //   if 404 (event not found): that's fine, already deleted
  //   if other error: log it but don't throw (graceful degradation)

  if (!eventId) return

  try {
    const auth = getOAuth2Client()
    const calendar = google.calendar({ version: 'v3', auth })

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
      sendUpdates: 'all', // Notify attendees of cancellation
    })
  } catch (error: unknown) {
    // 410 Gone or 404 Not Found = event already deleted, that's fine
    const status = (error as { code?: number })?.code
    if (status === 404 || status === 410) {
      console.warn(`[scheduling/google] Event ${eventId} already deleted`)
      return
    }
    // Any other error: log but don't throw
    console.error('[scheduling/google] Failed to delete event:', error)
  }
}

/**
 * Sanity Scheduling Client Functions
 * ===================================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This is the "data access layer" for the scheduling system.
 * Every function that reads from or writes to Sanity lives here.
 *
 * WHY A SEPARATE FILE FROM sanity/lib/client.ts?
 * -----------------------------------------------
 * The main Sanity client (sanity/lib/client.ts) uses a read-only viewer
 * token suitable for fetching portfolio content. The scheduling system
 * needs WRITE access (creating bookings, updating statuses, etc.), so
 * it uses its own client configured with SANITY_API_TOKEN (write token).
 *
 * ARCHITECTURE:
 * -------------
 *   API Route → calls function from this file → uses GROQ query from groq-queries.ts
 *                                              → uses writeClient to mutate Sanity
 *
 * SEPARATION OF CONCERNS:
 *   - groq-queries.ts: WHAT to query (the GROQ strings)
 *   - This file: HOW to query (client setup, parameter passing, error handling)
 *   - API routes: WHEN to query (request handling, business logic)
 *
 * WRITE CLIENT vs READ CLIENT:
 * ----------------------------
 * Read client (portfolio):  token = SANITY_VIEWER_TOKEN, useCdn = true
 * Write client (scheduling): token = SANITY_API_TOKEN, useCdn = false
 *
 * Why useCdn: false for writes?
 *   - CDN caches responses for ~60 seconds
 *   - After writing a document, we need to read it back immediately
 *   - CDN would return stale data → useCdn: false bypasses the cache
 *
 * MUTATION METHODS:
 * -----------------
 * Sanity mutations are how you create/update/delete documents.
 *
 * client.create(document)     — Create a new document
 * client.patch(id)            — Start building an update
 *   .set({ field: value })    — Set fields to new values
 *   .commit()                 — Execute the patch
 * client.delete(id)           — Delete a document
 *
 * Patches are atomic — either all fields update or none do.
 */

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import {
  SCHEDULING_CONFIG_QUERY,
  PENDING_SLOTS_FOR_DATE_QUERY,
  BOOKING_BY_TOKEN_HASH_QUERY,
  BOOKING_BY_CANCEL_TOKEN_QUERY,
  BOOKING_BY_RESCHEDULE_TOKEN_QUERY,
  BOOKING_BY_ID_QUERY,
  TOKEN_BY_HASH_QUERY,
  CONFIRMED_COUNT_FOR_DAY_QUERY,
  PENDING_APPROVAL_COUNT_TODAY_QUERY,
  RECENT_REQUESTS_BY_IP_QUERY,
} from './groq-queries'
import type {
  BookingRequest,
  BookingStatus,
  SchedulingConfig,
  SchedulingToken,
} from '@/types/scheduling'

// ═══════════════════════════════════════════
// WRITE CLIENT
// ═══════════════════════════════════════════

/**
 * Sanity client with write access for scheduling operations.
 *
 * WHY A SEPARATE CLIENT?
 * The portfolio's read client uses SANITY_VIEWER_TOKEN (read-only).
 * Scheduling needs to CREATE and UPDATE documents, which requires
 * SANITY_API_TOKEN (write access).
 *
 * SECURITY:
 * This token is NEVER exposed to the browser. It's only used in:
 *   - API routes (server-side)
 *   - Webhook handlers (server-side)
 *
 * useCdn: false because we need fresh reads after writes.
 */
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always fresh data (no CDN caching)
  token: process.env.SANITY_API_TOKEN,
})

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════

/**
 * Fetch the scheduling config singleton.
 *
 * Returns the single schedulingConfig document that controls
 * all scheduling behavior (business hours, limits, etc.)
 *
 * If no config document exists yet, returns sensible defaults.
 */
export async function getSchedulingConfig(): Promise<SchedulingConfig> {
  // PSEUDOCODE:
  // query Sanity for the schedulingConfig singleton
  // if not found (hasn't been created in Studio yet):
  //   return default config values
  // else:
  //   return the config document

  const config = await writeClient.fetch<SchedulingConfig | null>(
    SCHEDULING_CONFIG_QUERY
  )

  // If no config exists yet, return defaults so the system still works
  // before Alvin creates the config document in Studio.
  if (!config) {
    return {
      _id: 'schedulingConfig',
      _type: 'schedulingConfig',
      isAcceptingBookings: true,
      weeklySchedule: [
        { day: 0, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { day: 1, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { day: 2, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { day: 3, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { day: 4, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { day: 5, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { day: 6, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
      ],
      dateOverrides: [],
      bufferMinutes: 15,
      maxPerDay: 3,
      maxPerWeek: 8,
      slotDurationMinutes: 30,
      advanceBookingDays: 14,
      minimumNoticeHours: 24,
      whatWeCanDiscuss: [
        'Career opportunities & roles',
        'Technical architecture & challenges',
        'Open source collaboration',
      ],
      meetingDescription:
        'A casual 30-minute video call to discuss engineering, projects, or opportunities.',
    }
  }

  return config
}

// ═══════════════════════════════════════════
// SLOT QUERIES
// ═══════════════════════════════════════════

/**
 * Get all pending and confirmed slot times for a date range.
 *
 * Returns an array of UTC ISO strings representing times that are
 * already booked (either pending approval or confirmed).
 *
 * @param startDate - Start of range
 * @param endDate   - End of range
 * @returns Array of UTC ISO strings (e.g., ["2026-04-01T09:00:00.000Z", ...])
 */
export async function getPendingAndConfirmedSlotsForRange(
  startDate: Date,
  endDate: Date
): Promise<string[]> {
  // PSEUDOCODE:
  // query Sanity with the date range parameters
  // return the array of requestedSlot strings
  // if query returns null (no matching documents), return empty array

  const slots = await writeClient.fetch<string[]>(
    PENDING_SLOTS_FOR_DATE_QUERY,
    {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }
  )

  return slots || []
}

// ═══════════════════════════════════════════
// BOOKING CRUD
// ═══════════════════════════════════════════

/**
 * Create a new booking request document in Sanity.
 *
 * WHAT client.create DOES:
 *   1. Generates a unique _id for the document
 *   2. Sends the document to Sanity's Content Lake
 *   3. Returns the created document (with _id populated)
 *
 * The _type field tells Sanity which schema to use for validation.
 *
 * @param data - All booking fields EXCEPT _id (Sanity generates it)
 * @returns The generated Sanity document _id
 */
export async function createBookingRequest(
  data: Omit<BookingRequest, '_id' | '_type'>
): Promise<string> {
  // PSEUDOCODE:
  // create a new document in Sanity with:
  //   _type = "bookingRequest" (so Sanity knows which schema to use)
  //   ...all the fields from data
  // return the auto-generated _id

  const result = await writeClient.create({
    _type: 'bookingRequest' as const,
    ...data,
  })

  return result._id
}

/**
 * Update a booking's status and optionally set additional fields.
 *
 * HOW SANITY PATCHES WORK:
 *   client.patch(documentId)     — Target a specific document
 *     .set({ key: value, ... })  — Set one or more fields
 *     .commit()                  — Execute the update atomically
 *
 * This is like SQL: UPDATE bookingRequest SET status='confirmed' WHERE _id='...'
 *
 * @param id     - The Sanity document _id
 * @param status - The new status value
 * @param extra  - Additional fields to set (e.g., approvedAt, gcalEventId)
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  extra?: Partial<BookingRequest>
): Promise<void> {
  // PSEUDOCODE:
  // start a patch on the document with given _id
  // set the status field to the new status
  // if extra fields provided, set those too
  // commit the patch (atomic update)

  await writeClient
    .patch(id)
    .set({ status, ...extra })
    .commit()
}

// ═══════════════════════════════════════════
// BOOKING LOOKUPS
// ═══════════════════════════════════════════

/**
 * Find a booking by its verification token hash.
 * Used when the user clicks the email verification link.
 */
export async function getBookingByVerificationHash(
  hash: string
): Promise<BookingRequest | null> {
  return writeClient.fetch<BookingRequest | null>(
    BOOKING_BY_TOKEN_HASH_QUERY,
    { hash }
  )
}

/**
 * Find a booking by its cancel token hash.
 * Used when the user clicks the cancel link in confirmation email.
 */
export async function getBookingByCancelHash(
  hash: string
): Promise<BookingRequest | null> {
  return writeClient.fetch<BookingRequest | null>(
    BOOKING_BY_CANCEL_TOKEN_QUERY,
    { hash }
  )
}

/**
 * Find a booking by its reschedule token hash.
 * Used when the user clicks the reschedule link in confirmation email.
 */
export async function getBookingByRescheduleHash(
  hash: string
): Promise<BookingRequest | null> {
  return writeClient.fetch<BookingRequest | null>(
    BOOKING_BY_RESCHEDULE_TOKEN_QUERY,
    { hash }
  )
}

/**
 * Fetch a full booking by its Sanity document _id.
 * Used when we already have the _id (e.g., from a JWT payload).
 */
export async function getBookingById(
  id: string
): Promise<BookingRequest | null> {
  return writeClient.fetch<BookingRequest | null>(BOOKING_BY_ID_QUERY, { id })
}

// ═══════════════════════════════════════════
// TOKEN OPERATIONS
// ═══════════════════════════════════════════

/**
 * Find a scheduling token (private link) by its hash.
 * Used when someone visits /schedule/[token].
 */
export async function getTokenByHash(
  hash: string
): Promise<SchedulingToken | null> {
  return writeClient.fetch<SchedulingToken | null>(TOKEN_BY_HASH_QUERY, {
    hash,
  })
}

/**
 * Mark a scheduling token as used after a booking is made.
 *
 * Sets isUsed=true, records usedAt timestamp, and links to the booking.
 *
 * @param id        - The schedulingToken document _id
 * @param bookingId - The bookingRequest document _id
 */
export async function markTokenUsed(
  id: string,
  bookingId: string
): Promise<void> {
  // PSEUDOCODE:
  // patch the schedulingToken document:
  //   set isUsed to true
  //   set usedAt to current UTC time
  //   set bookingRef to reference the booking document
  // commit the patch

  await writeClient
    .patch(id)
    .set({
      isUsed: true,
      usedAt: new Date().toISOString(),
      // Sanity references use { _type: 'reference', _ref: documentId }
      bookingRef: { _type: 'reference', _ref: bookingId },
    })
    .commit()
}

/**
 * Store the Google Calendar event ID on a booking.
 * Called after createCalendarEvent() succeeds.
 */
export async function storeGcalEventId(
  bookingId: string,
  eventId: string
): Promise<void> {
  await writeClient.patch(bookingId).set({ gcalEventId: eventId }).commit()
}

// ═══════════════════════════════════════════
// COUNTING QUERIES
// ═══════════════════════════════════════════

/**
 * Count confirmed bookings for a specific day.
 * Used to enforce maxPerDay limit.
 *
 * @param date - The day to count (only the date portion matters)
 * @returns Number of confirmed bookings on that day
 */
export async function getConfirmedCountForDay(date: Date): Promise<number> {
  // PSEUDOCODE:
  // build dayStart = date at 00:00:00 UTC
  // build dayEnd = date at 23:59:59 UTC
  // query Sanity for count of confirmed bookings in that range
  // return the count

  const dateStr = date.toISOString().split('T')[0]
  const dayStart = `${dateStr}T00:00:00Z`
  const dayEnd = `${dateStr}T23:59:59Z`

  const count = await writeClient.fetch<number>(
    CONFIRMED_COUNT_FOR_DAY_QUERY,
    { dayStart, dayEnd }
  )

  return count || 0
}

/**
 * Count pending-approval requests today.
 * Used for admin dashboard / monitoring.
 */
export async function getPendingApprovalCount(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const count = await writeClient.fetch<number>(
    PENDING_APPROVAL_COUNT_TODAY_QUERY,
    { today }
  )
  return count || 0
}

/**
 * Count recent requests from the same IP hash (for rate limiting).
 *
 * @param ipHash - SHA-256 hash of the requester's IP
 * @returns Number of requests from this IP in the last hour
 */
export async function getRecentRequestCountByIp(
  ipHash: string
): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const count = await writeClient.fetch<number>(
    RECENT_REQUESTS_BY_IP_QUERY,
    { ipHash, oneHourAgo }
  )
  return count || 0
}

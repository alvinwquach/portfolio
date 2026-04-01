/**
 * GROQ Queries — All Sanity Queries for the Scheduling System
 * ============================================================
 *
 * WHAT IS GROQ?
 * -------------
 * GROQ (Graph-Relational Object Queries) is Sanity's query language.
 * It's similar to GraphQL in purpose but different in syntax.
 *
 * Basic GROQ syntax:
 *   *[filter]{ projection }
 *
 *   * = "all documents"
 *   [filter] = conditions to match (like SQL WHERE)
 *   { projection } = which fields to return (like SQL SELECT)
 *
 * EXAMPLES:
 *   *[_type == "bookingRequest"]                         → All booking requests
 *   *[_type == "bookingRequest" && status == "confirmed"] → Only confirmed ones
 *   *[_type == "bookingRequest"][0]                       → First result only
 *   *[_type == "bookingRequest"]{ requesterName, topic }  → Only name and topic
 *
 * WHY ALL QUERIES IN ONE FILE?
 * ----------------------------
 * The spec requires: "No inline GROQ anywhere else in the codebase."
 *
 * Benefits:
 *   1. Single source of truth — change a query here, all consumers update
 *   2. Easy to review all data access patterns in one place
 *   3. Can unit test that queries are valid GROQ syntax
 *   4. Prevents query duplication across API routes
 *
 * HOW TO USE THESE:
 * -----------------
 *   import { SCHEDULING_CONFIG_QUERY } from '@/lib/scheduling/groq-queries'
 *   import { client } from '@/sanity/lib/client'
 *
 *   const config = await client.fetch(SCHEDULING_CONFIG_QUERY)
 *
 * PARAMETERIZED QUERIES:
 * ----------------------
 * Some queries use $paramName syntax for dynamic values.
 * Pass params as the second argument to client.fetch():
 *
 *   const bookings = await client.fetch(
 *     PENDING_SLOTS_FOR_DATE_QUERY,
 *     { startDate: '2026-04-01', endDate: '2026-04-07' }
 *   )
 *
 * WHY PARAMETERS INSTEAD OF STRING INTERPOLATION?
 * ------------------------------------------------
 * NEVER do this:
 *   `*[_type == "bookingRequest" && _id == "${userInput}"]`
 *
 * This is a GROQ injection vulnerability (like SQL injection).
 * Always use $params — Sanity sanitizes them automatically.
 */

// ═══════════════════════════════════════════
// CONFIG QUERY
// ═══════════════════════════════════════════

/**
 * Fetch the singleton scheduling config document.
 *
 * GROQ BREAKDOWN:
 *   *[_type == "schedulingConfig"]  → Find documents of this type
 *   [0]                             → Get the first (and only) result
 *   { ... }                         → Return all fields we need
 *
 * WHY [0]?
 * schedulingConfig is a singleton — there's only one document.
 * [0] returns just that document instead of an array of length 1.
 * Without [0], you'd get [{ isAcceptingBookings: true, ... }] (array)
 * With [0], you get { isAcceptingBookings: true, ... } (object)
 */
export const SCHEDULING_CONFIG_QUERY = /* groq */ `
  *[_type == "schedulingConfig"][0]{
    _id,
    isAcceptingBookings,
    weeklySchedule[]{ day, enabled, startHour, startMinute, endHour, endMinute },
    dateOverrides[]{ date, enabled, startHour, startMinute, endHour, endMinute, reason },
    bufferMinutes,
    maxPerDay,
    maxPerWeek,
    slotDurationMinutes,
    advanceBookingDays,
    minimumNoticeHours,
    whatWeCanDiscuss,
    meetingDescription
  }
`

// ═══════════════════════════════════════════
// SLOT / AVAILABILITY QUERIES
// ═══════════════════════════════════════════

/**
 * Fetch all pending and confirmed slot times for a date range.
 *
 * WHAT THIS RETURNS:
 * An array of requestedSlot strings (UTC ISO) for bookings that are
 * either pending_approval or confirmed within the given date range.
 *
 * WHY WE NEED THIS:
 * When generating available slots for the calendar, we need to know
 * which times are already taken (pending or confirmed). We then mark
 * those slots as unavailable or pending in the calendar UI.
 *
 * GROQ BREAKDOWN:
 *   status in ["pending_approval", "confirmed"]  → Only active bookings
 *   requestedSlot >= $startDate                  → Within our date range
 *   requestedSlot <= $endDate                    → (inclusive both ends)
 *   .requestedSlot                               → Return just the slot strings
 *
 * The trailing .requestedSlot is a "projection shorthand" — instead of
 * returning full documents, it returns just the requestedSlot field values.
 * Result: ["2026-04-01T09:00:00Z", "2026-04-01T10:30:00Z", ...]
 *
 * PARAMS: { startDate: string, endDate: string }
 */
export const PENDING_SLOTS_FOR_DATE_QUERY = /* groq */ `
  *[
    _type == "bookingRequest"
    && status in ["pending_approval", "confirmed"]
    && requestedSlot >= $startDate
    && requestedSlot <= $endDate
  ].requestedSlot
`

/**
 * All non-cancelled bookings for a date range (for conflict detection).
 *
 * Similar to above but returns full booking documents, not just slot strings.
 * Used during the booking submission flow to do thorough conflict checking.
 *
 * PARAMS: { startDate: string, endDate: string }
 */
export const ACTIVE_BOOKINGS_FOR_WEEK_QUERY = /* groq */ `
  *[
    _type == "bookingRequest"
    && status in ["pending_verification", "pending_approval", "confirmed"]
    && requestedSlot >= $startDate
    && requestedSlot <= $endDate
  ]{
    _id,
    status,
    requestedSlot,
    durationMinutes,
    requesterName
  }
`

// ═══════════════════════════════════════════
// BOOKING LOOKUP QUERIES
// ═══════════════════════════════════════════

/**
 * Find a booking by its verification token hash.
 *
 * WHEN IS THIS USED?
 * When the user clicks the verification link in their email:
 *   1. We extract the raw JWT from the URL
 *   2. Hash it with SHA-256
 *   3. Look up the booking with this query
 *   4. If found, update status to pending_approval
 *
 * PARAMS: { hash: string }
 */
export const BOOKING_BY_TOKEN_HASH_QUERY = /* groq */ `
  *[
    _type == "bookingRequest"
    && verificationTokenHash == $hash
  ][0]{
    _id,
    status,
    requesterName,
    requesterEmail,
    requestedSlot,
    topic,
    timezone,
    durationMinutes,
    isPrivateLink,
    privateLinkRef,
    verificationTokenExpiry
  }
`

/**
 * Find a booking by its cancel token hash.
 * PARAMS: { hash: string }
 */
export const BOOKING_BY_CANCEL_TOKEN_QUERY = /* groq */ `
  *[
    _type == "bookingRequest"
    && cancelToken == $hash
  ][0]{
    _id,
    status,
    requesterName,
    requesterEmail,
    requestedSlot,
    topic,
    timezone,
    durationMinutes,
    gcalEventId,
    cancelledAt
  }
`

/**
 * Find a booking by its reschedule token hash.
 * PARAMS: { hash: string }
 */
export const BOOKING_BY_RESCHEDULE_TOKEN_QUERY = /* groq */ `
  *[
    _type == "bookingRequest"
    && rescheduleToken == $hash
  ][0]{
    _id,
    status,
    requesterName,
    requesterEmail,
    requesterCompany,
    requestedSlot,
    topic,
    timezone,
    durationMinutes,
    gcalEventId,
    previousSlot,
    rescheduledAt
  }
`

/**
 * Fetch a full booking by its Sanity document _id.
 *
 * WHY A SEPARATE QUERY?
 * Sometimes we already have the _id (e.g., from a JWT payload) and
 * just need to fetch the full document. This is more efficient than
 * filtering by a token hash.
 *
 * PARAMS: { id: string }
 */
export const BOOKING_BY_ID_QUERY = /* groq */ `
  *[
    _type == "bookingRequest"
    && _id == $id
  ][0]{
    _id,
    status,
    requesterName,
    requesterEmail,
    requesterCompany,
    requesterRole,
    requestedSlot,
    topic,
    timezone,
    durationMinutes,
    gcalEventId,
    isPrivateLink,
    approvedAt,
    rejectedAt,
    cancelledAt,
    rescheduledAt,
    previousSlot,
    rejectionReason,
    createdAt
  }
`

// ═══════════════════════════════════════════
// SCHEDULING TOKEN LOOKUP
// ═══════════════════════════════════════════

/**
 * Find a scheduling token (private link) by its hash.
 *
 * WHEN IS THIS USED?
 * When someone visits /schedule/[token]:
 *   1. Verify the JWT
 *   2. Hash it
 *   3. Look up the schedulingToken with this query
 *   4. If found and valid, show personalized scheduling page
 *
 * PARAMS: { hash: string }
 */
export const TOKEN_BY_HASH_QUERY = /* groq */ `
  *[
    _type == "schedulingToken"
    && tokenHash == $hash
  ][0]{
    _id,
    tokenHash,
    recipientName,
    recipientEmail,
    recipientCompany,
    recipientRole,
    personalNote,
    expiresAt,
    isUsed,
    isRevoked,
    usedAt,
    createdAt,
    bookingRef
  }
`

// ═══════════════════════════════════════════
// COUNTING / LIMIT QUERIES
// ═══════════════════════════════════════════

/**
 * Count pending-approval requests today.
 *
 * GROQ BREAKDOWN:
 *   count(...)  → Returns a number, not documents
 *   dateTime(now()) → Sanity's built-in "current time" function
 *
 * WHY dateTime() instead of passing a param?
 * We could pass $today as a param, but Sanity's now() is more reliable
 * because it uses the server's clock, not the client's.
 *
 * NOTE: We still pass $today as a param for the date comparison because
 * GROQ's now() returns a full timestamp, and we need just the date part.
 *
 * PARAMS: { today: string } (YYYY-MM-DD format)
 */
export const PENDING_APPROVAL_COUNT_TODAY_QUERY = /* groq */ `
  count(
    *[
      _type == "bookingRequest"
      && status == "pending_approval"
      && requestedSlot >= $today + "T00:00:00Z"
      && requestedSlot <= $today + "T23:59:59Z"
    ]
  )
`

/**
 * Count confirmed bookings for a specific day.
 *
 * Used to enforce the maxPerDay limit. Before confirming a new booking,
 * we check: "Are there already maxPerDay confirmed bookings on this date?"
 *
 * PARAMS: { dayStart: string, dayEnd: string } (UTC ISO strings)
 */
export const CONFIRMED_COUNT_FOR_DAY_QUERY = /* groq */ `
  count(
    *[
      _type == "bookingRequest"
      && status == "confirmed"
      && requestedSlot >= $dayStart
      && requestedSlot <= $dayEnd
    ]
  )
`

/**
 * Count confirmed bookings this week.
 *
 * Used to enforce the maxPerWeek limit.
 *
 * PARAMS: { weekStart: string, weekEnd: string } (UTC ISO strings)
 */
export const CONFIRMED_COUNT_THIS_WEEK_QUERY = /* groq */ `
  count(
    *[
      _type == "bookingRequest"
      && status == "confirmed"
      && requestedSlot >= $weekStart
      && requestedSlot <= $weekEnd
    ]
  )
`

// ═══════════════════════════════════════════
// RATE LIMITING QUERY
// ═══════════════════════════════════════════

/**
 * Count recent requests from the same IP hash.
 *
 * RATE LIMITING STRATEGY:
 * We hash the user's IP and count how many bookingRequest documents
 * have the same hash within the last hour. If > 3, reject the request.
 *
 * WHY IP HASHING?
 * We don't want to store raw IP addresses (privacy concern).
 * SHA-256 of the IP lets us count requests without knowing the actual IP.
 *
 * PARAMS: { ipHash: string, oneHourAgo: string } (UTC ISO)
 */
export const RECENT_REQUESTS_BY_IP_QUERY = /* groq */ `
  count(
    *[
      _type == "bookingRequest"
      && ipHash == $ipHash
      && createdAt >= $oneHourAgo
    ]
  )
`

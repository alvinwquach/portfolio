/**
 * Scheduling System Types
 * =======================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file defines TypeScript types for every data shape in the scheduling
 * system. Every function, API route, and component imports types from here.
 *
 * WHY A SINGLE FILE?
 * ------------------
 * Keeping all scheduling types in one place means:
 *   1. No circular imports (types don't import from implementation files)
 *   2. Easy to see the entire data model at a glance
 *   3. Changes to a shape propagate to all consumers via TypeScript errors
 *   4. API routes and components share the same contract
 *
 * HOW THESE MAP TO SANITY SCHEMAS:
 * --------------------------------
 * Types like BookingRequest and SchedulingConfig mirror the Sanity schema
 * definitions. But they're NOT auto-generated — we maintain them manually.
 *
 * Why manual instead of auto-generated?
 *   - Sanity schemas define CMS structure (validation, UI, options)
 *   - These types define runtime shapes (what the code works with)
 *   - They overlap but aren't identical (e.g., Sanity adds _id, _rev, _type)
 *
 * NAMING CONVENTIONS:
 * -------------------
 * - PascalCase for types/interfaces: BookingRequest, TimeSlot
 * - SCREAMING_SNAKE for constants: BOOKING_STATUSES
 * - camelCase for fields: requestedSlot, requesterName
 * - Suffix "Payload" for JWT contents: VerificationTokenPayload
 * - Suffix "Response" for external API shapes: RecaptchaVerifyResponse
 * - Suffix "Data" for form/request bodies: BookingFormData
 */

// ═══════════════════════════════════════════
// BOOKING STATUS
// ═══════════════════════════════════════════

/**
 * BookingStatus — Union type of all possible booking states.
 *
 * WHY A UNION TYPE?
 * -----------------
 * Instead of `status: string` (which allows any string), a union type
 * restricts the value to only these specific strings. If you typo
 * 'confirmmed', TypeScript catches it at compile time.
 *
 * THE STATE MACHINE:
 * ------------------
 * pending_verification → pending_approval → confirmed → cancelled
 *                                        → rejected
 *                                        → rescheduled (→ back to pending_approval)
 *
 * Each transition triggers different side effects (emails, calendar events).
 */
export type BookingStatus =
  | 'pending_verification'  // User submitted form, email not yet verified
  | 'pending_approval'      // Email verified, waiting for Alvin's review
  | 'confirmed'             // Alvin approved — calendar event created
  | 'rejected'              // Alvin declined — rejection email sent
  | 'cancelled'             // User cancelled after confirmation
  | 'rescheduled'           // User requested a new time

// ═══════════════════════════════════════════
// SANITY DOCUMENT TYPES
// ═══════════════════════════════════════════

/**
 * BookingRequest — Mirrors the Sanity bookingRequest schema.
 *
 * This is the core document. Every meeting request creates one.
 * Fields match the Sanity schema exactly, plus Sanity's built-in fields
 * (_id, _type, _rev, _createdAt, _updatedAt).
 */
export interface BookingRequest {
  // ── Sanity built-in fields ──────────────────────────────
  // Every Sanity document has these automatically.
  _id: string                      // Unique document ID (auto-generated)
  _type: 'bookingRequest'          // Document type (matches schema name)
  _rev?: string                    // Revision ID (changes on every edit)
  _createdAt?: string              // Auto-set by Sanity (UTC ISO)
  _updatedAt?: string              // Auto-set by Sanity (UTC ISO)

  // ── Custom fields ───────────────────────────────────────
  status: BookingStatus
  requesterName: string
  requesterEmail: string
  requesterCompany?: string         // Optional — not everyone has a company
  requesterRole?: string            // Optional — role/title
  topic: string                     // What they want to discuss (20-500 chars)
  requestedSlot: string             // UTC ISO string of the meeting time
  durationMinutes: number           // Meeting length (default 30)
  timezone: string                  // IANA timezone (e.g., "America/New_York")

  // ── Token hashes (never raw JWTs) ──────────────────────
  verificationTokenHash?: string    // SHA-256 of verification JWT
  verificationTokenExpiry?: string  // When verification link expires
  cancelToken?: string              // SHA-256 of cancel JWT
  rescheduleToken?: string          // SHA-256 of reschedule JWT

  // ── Lifecycle timestamps ────────────────────────────────
  rejectionReason?: string          // Why it was rejected (shown to user)
  gcalEventId?: string              // Google Calendar event ID (set on confirm)
  approvedAt?: string               // When Alvin approved
  rejectedAt?: string               // When Alvin rejected
  cancelledAt?: string              // When user cancelled
  rescheduledAt?: string            // When user rescheduled
  previousSlot?: string             // Original slot before reschedule

  // ── Metadata ────────────────────────────────────────────
  isPrivateLink: boolean            // Whether booked via private link
  privateLinkRef?: { _ref: string } // Reference to schedulingToken doc
  createdAt?: string                // When request was created
  ipHash?: string                   // SHA-256 of requester's IP (rate limiting)
}

/**
 * SchedulingToken — Mirrors the Sanity schedulingToken schema.
 *
 * Represents a private scheduling link created by Alvin.
 */
export interface SchedulingToken {
  _id: string
  _type: 'schedulingToken'
  _rev?: string
  _createdAt?: string
  _updatedAt?: string

  tokenHash: string                 // SHA-256 of the JWT (for lookups)
  recipientName: string
  recipientEmail: string
  recipientCompany?: string
  recipientRole?: string
  personalNote?: string             // Custom note shown to recipient
  expiresAt: string                 // When the link stops working
  usedAt?: string                   // When it was used to book
  isUsed: boolean                   // Whether a booking was made
  isRevoked: boolean                // Whether manually revoked
  revokedAt?: string
  createdAt?: string
  bookingRef?: { _ref: string }     // Reference to the booking it created
}

/**
 * SchedulingConfig — Mirrors the Sanity schedulingConfig singleton.
 *
 * Controls all scheduling behavior. Only one document exists with
 * _id = 'schedulingConfig'.
 */
/**
 * DaySchedule — Availability for one day of the week.
 * Part of the weeklySchedule array in SchedulingConfig.
 */
export interface DaySchedule {
  day: number           // 0=Sun, 1=Mon, ..., 6=Sat
  enabled: boolean      // Whether meetings happen this day
  startHour: number     // First available hour (0-23)
  startMinute: number   // 0, 15, 30, or 45
  endHour: number       // Last slot end hour (0-23)
  endMinute: number     // 0, 15, 30, or 45
}

/**
 * DateOverride — Exception to the weekly schedule for a specific date.
 * "April 10: off" or "April 15: only 2pm-4pm"
 */
export interface DateOverride {
  date: string          // YYYY-MM-DD
  enabled: boolean      // false = day blocked entirely
  startHour?: number
  startMinute?: number
  endHour?: number
  endMinute?: number
  reason?: string       // Internal note
}

export interface SchedulingConfig {
  _id: string
  _type: 'schedulingConfig'

  isAcceptingBookings: boolean      // Master kill switch
  weeklySchedule: DaySchedule[]    // Per-day availability (7 entries)
  dateOverrides?: DateOverride[]   // Exceptions for specific dates
  bufferMinutes: number             // Padding between meetings
  maxPerDay: number                 // Max confirmed per day
  maxPerWeek: number                // Max confirmed per week
  slotDurationMinutes: number       // Spacing between start times
  advanceBookingDays: number        // How far ahead calendar shows
  minimumNoticeHours: number        // Min hours before a bookable slot
  whatWeCanDiscuss: string[]        // Sidebar bullet points
  meetingDescription: string        // Sidebar description text
}

// ═══════════════════════════════════════════
// CALENDAR / SLOT TYPES
// ═══════════════════════════════════════════

/**
 * TimeSlot — A single bookable time block in the calendar.
 *
 * Generated by the slot generation logic in lib/scheduling/slots.ts.
 * The WeekCalendar component renders these as clickable blocks.
 */
export interface TimeSlot {
  start: string                     // UTC ISO string — slot start time
  end: string                       // UTC ISO string — slot end time
  available: boolean                // Can this slot be booked?
  isPending?: boolean               // Does it have a pending request?
}

/**
 * WeekDay — One column in the weekly calendar grid.
 *
 * The calendar shows 7 days (Mon–Sun). Each WeekDay has:
 *   - Date info for the column header
 *   - Array of TimeSlots for that day's available times
 */
export interface WeekDay {
  date: string                      // YYYY-MM-DD format
  slots: TimeSlot[]                 // All slots for this day
  dayName: string                   // "Mon", "Tue", etc.
  dayNumber: number                 // 1-31 (day of month)
  isToday: boolean                  // Whether this is today's date
}

// ═══════════════════════════════════════════
// FORM DATA TYPES
// ═══════════════════════════════════════════

/**
 * BookingFormData — Shape of the data submitted by the booking form.
 *
 * This is what the frontend sends to POST /api/schedule/request.
 * It's a subset of BookingRequest — the server adds the rest
 * (status, timestamps, token hashes, etc.).
 */
export interface BookingFormData {
  requesterName: string
  requesterEmail: string
  requesterCompany?: string
  requesterRole?: string
  topic: string
  requestedSlot: string             // UTC ISO string of selected slot
  timezone: string                  // Auto-detected IANA timezone
  recaptchaToken: string            // reCAPTCHA v3 token for bot detection
  privateLinkToken?: string         // Raw JWT if booking via private link
}

/**
 * RescheduleFormData — Shape of the reschedule request body.
 *
 * Sent to POST /api/schedule/reschedule.
 * Simpler than BookingFormData because we already have the user's info.
 */
export interface RescheduleFormData {
  rescheduleToken: string           // Raw JWT from the confirmation email
  newSlot: string                   // UTC ISO string of the new slot
  timezone: string                  // User's current timezone
}

// ═══════════════════════════════════════════
// JWT PAYLOAD TYPES
// ═══════════════════════════════════════════
// These define what's INSIDE each JWT. When we sign a token,
// we put this data in the payload. When we verify, we get it back.

/**
 * VerificationTokenPayload — Inside the email verification JWT.
 *
 * When a user clicks "Verify Email" in their inbox, this is the
 * data we extract from the JWT in the URL.
 */
export interface VerificationTokenPayload {
  type: 'verification'
  bookingId: string                 // Which booking this verifies
  email: string                     // The email address being verified
  iat: number                       // Issued-at timestamp (seconds)
  exp: number                       // Expiry timestamp (seconds)
}

/**
 * ActionTokenPayload — Inside cancel and reschedule JWTs.
 *
 * Both cancel and reschedule links use the same JWT structure,
 * differentiated by the `type` field.
 */
export interface ActionTokenPayload {
  type: 'cancel' | 'reschedule'     // Which action this token authorizes
  bookingId: string                 // Which booking to act on
  tokenHash: string                 // Hash stored in Sanity (for lookup)
  iat: number
  exp: number
}

/**
 * PrivateLinkTokenPayload — Inside private scheduling link JWTs.
 *
 * Contains the schedulingToken document ID so we can look up
 * the recipient's pre-fill data in Sanity.
 */
export interface PrivateLinkTokenPayload {
  type: 'private_link'
  tokenId: string                   // Sanity _id of schedulingToken doc
  iat: number
  exp: number
}

// ═══════════════════════════════════════════
// EXTERNAL API RESPONSE TYPES
// ═══════════════════════════════════════════

/**
 * RecaptchaVerifyResponse — Google's reCAPTCHA v3 verify response.
 *
 * When we POST to Google's siteverify endpoint, this is what we get back.
 * The `score` (0.0 to 1.0) indicates how likely the user is human.
 * We reject requests with score < 0.5.
 */
export interface RecaptchaVerifyResponse {
  success: boolean                  // Whether the token was valid
  score: number                     // 0.0 (bot) to 1.0 (human)
  action: string                    // The action name we passed (e.g., 'schedule_request')
  challenge_ts: string              // Timestamp of the challenge
  hostname: string                  // Hostname where the challenge was solved
  'error-codes'?: string[]          // Error codes if verification failed
}

/**
 * GoogleFreeBusyResponse — Google Calendar FreeBusy API response.
 *
 * The freebusy endpoint returns when Alvin is busy. We use this
 * to remove those times from the available slots.
 */
export interface GoogleFreeBusyResponse {
  kind: string
  timeMin: string
  timeMax: string
  calendars: {
    [calendarId: string]: {
      busy: BusyPeriod[]
      errors?: Array<{ domain: string; reason: string }>
    }
  }
}

/**
 * BusyPeriod — A single block of time when Alvin is busy.
 *
 * Returned by Google Calendar's freebusy API.
 * Any slot that overlaps a BusyPeriod (including buffer) is unavailable.
 */
export interface BusyPeriod {
  start: string                     // UTC ISO string
  end: string                       // UTC ISO string
}

// ═══════════════════════════════════════════
// API RESPONSE WRAPPER
// ═══════════════════════════════════════════

/**
 * ApiResponse<T> — Standard wrapper for all API responses.
 *
 * WHY A WRAPPER?
 * Every API route returns the same shape. This lets the frontend
 * always check `response.success` before accessing `response.data`.
 *
 * USAGE:
 *   // In an API route:
 *   return NextResponse.json<ApiResponse<WeekDay[]>>({
 *     success: true,
 *     data: weekDays,
 *   })
 *
 *   // On the frontend:
 *   const res = await fetch('/api/schedule/slots?weekStart=2026-03-30')
 *   const json: ApiResponse<WeekDay[]> = await res.json()
 *   if (json.success) {
 *     setWeekData(json.data)
 *   } else {
 *     showError(json.error)
 *   }
 *
 * The `code` field is a machine-readable error code (e.g., 'SLOT_UNAVAILABLE')
 * that the frontend maps to user-friendly messages.
 */
export interface ApiResponse<T = undefined> {
  success: boolean
  data?: T
  error?: string                    // Human-readable error message
  code?: string                     // Machine-readable error code
  warning?: string                  // Non-fatal warning (e.g., Google Calendar failed)
}

// ═══════════════════════════════════════════
// WEBHOOK TYPES
// ═══════════════════════════════════════════

/**
 * WebhookPayload — Shape of Sanity webhook POST body.
 *
 * When a document changes in Sanity, the webhook sends this payload
 * to /api/schedule/webhook. We use it to trigger side effects
 * (emails, calendar events) based on status transitions.
 *
 * IMPORTANT: The webhook fires for ALL document types, not just
 * bookingRequest. We filter by _type in the handler and ignore
 * everything else.
 */
export interface WebhookPayload {
  _id: string
  _type: string
  _rev: string
  // "delta" contains the before/after state for changed fields.
  // We use this to detect status transitions (e.g., pending → confirmed).
  delta?: {
    before?: Partial<BookingRequest>
    after?: Partial<BookingRequest>
  }
  // Flattened current state of the document
  [key: string]: unknown
}

// ═══════════════════════════════════════════
// EMAIL TYPES
// ═══════════════════════════════════════════

/**
 * EmailRecipient — Shape used by the email sending functions.
 *
 * Resend's API expects { name, email } for recipients.
 */
export interface EmailRecipient {
  name: string
  email: string
}

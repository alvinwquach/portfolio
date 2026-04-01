/**
 * Booking Request Schema — Sanity Document Type
 * ==============================================
 *
 * WHAT IS THIS?
 * -------------
 * This defines the shape of a "booking request" document in Sanity.
 * Every time someone requests a meeting through the /schedule page,
 * a new bookingRequest document is created in Sanity.
 *
 * Think of it like a database table definition, but for Sanity's
 * document store. Each field here becomes:
 *   1. A column in the "database" (Sanity Content Lake)
 *   2. A form field in Sanity Studio (the CMS admin panel)
 *   3. A queryable property via GROQ
 *
 * WHY SANITY AND NOT A DATABASE?
 * ------------------------------
 * This portfolio has NO traditional database (no Postgres, no MongoDB).
 * Sanity is the ONLY persistence layer. This is an architectural
 * constraint of the project — everything lives in Sanity.
 *
 * THE BOOKING LIFECYCLE:
 * ----------------------
 * A booking goes through these states (tracked by the `status` field):
 *
 *   1. pending_verification → User submitted form, email not yet verified
 *   2. pending_approval     → Email verified, waiting for Alvin to review
 *   3. confirmed            → Alvin approved it in Sanity Studio
 *   4. rejected             → Alvin declined it
 *   5. cancelled            → User cancelled after confirmation
 *   6. rescheduled          → User requested a different time
 *
 * Each transition triggers different actions (emails, calendar events, etc.)
 * via the webhook handler at /api/schedule/webhook.
 *
 * SECURITY DESIGN:
 * ----------------
 * - Tokens (verification, cancel, reschedule) are stored as SHA-256 HASHES
 *   in Sanity, never as raw JWTs. This means even if someone gained read
 *   access to Sanity, they couldn't impersonate actions.
 * - The raw JWT is only sent via email to the requester
 * - IP addresses are also hashed for abuse detection without storing PII
 *
 * HOW SANITY SCHEMAS WORK:
 * ------------------------
 * defineType() takes a config object:
 *   - name: Internal ID (used in GROQ queries: *[_type == "bookingRequest"])
 *   - title: Human-readable name in Sanity Studio
 *   - type: "document" means it's a top-level content type (has its own list)
 *   - fields: Array of field definitions (like columns in a table)
 *   - preview: How to display this doc in Studio's document list
 *   - orderings: Sort options for the document list
 *
 * Each field has:
 *   - name: JavaScript property name (camelCase)
 *   - title: Label shown in the Studio form
 *   - type: Data type (string, number, boolean, datetime, reference, etc.)
 *   - validation: Rules to enforce data integrity
 *   - options: UI customization (list choices, layout, etc.)
 *   - readOnly: If true, field can't be edited in Studio
 *   - hidden: If true, field isn't shown in the Studio form
 */

import { defineType, defineField } from 'sanity'

/**
 * All possible booking statuses.
 * Exported so other files can reference the same list
 * (e.g., the status badge component, the types file).
 */
export const BOOKING_STATUSES = [
  { title: 'Pending Verification', value: 'pending_verification' },
  { title: 'Pending Approval', value: 'pending_approval' },
  { title: 'Confirmed', value: 'confirmed' },
  { title: 'Rejected', value: 'rejected' },
  { title: 'Cancelled', value: 'cancelled' },
  { title: 'Rescheduled', value: 'rescheduled' },
] as const

export const bookingRequest = defineType({
  // ── Identity ──────────────────────────────────────────────
  // "name" is the _type value in Sanity. When you query:
  //   *[_type == "bookingRequest"]
  // ...Sanity looks for documents with this name.
  name: 'bookingRequest',
  title: 'Booking Request',
  type: 'document',

  // ── Fields ────────────────────────────────────────────────
  // Each defineField creates one property on the document.
  // Order here = order in the Sanity Studio form.
  fields: [
    // ─── STATUS ─────────────────────────────────────────────
    // The current state of this booking request.
    // This is the most important field — it drives the entire
    // booking lifecycle. When Alvin changes this in Studio,
    // the Sanity webhook fires and triggers emails/calendar events.
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      // "options.list" turns the text input into a dropdown select
      // in Sanity Studio. Each item has a display title and stored value.
      options: {
        list: [...BOOKING_STATUSES],
        layout: 'radio', // Show as radio buttons instead of dropdown
      },
      // initialValue: What this field defaults to when creating a new document.
      // New bookings always start as pending_verification because the
      // user hasn't clicked the email verification link yet.
      initialValue: 'pending_verification',
      validation: (Rule) => Rule.required(),
    }),

    // ─── REQUESTER INFO ─────────────────────────────────────
    // These fields capture who is requesting the meeting.
    // They're filled in from the booking form on /schedule.
    defineField({
      name: 'requesterName',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),

    defineField({
      name: 'requesterEmail',
      title: 'Email',
      type: 'string',
      // Sanity's email() validation checks format (has @, domain, etc.)
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: 'requesterCompany',
      title: 'Company',
      type: 'string',
    }),

    defineField({
      name: 'requesterRole',
      title: 'Role / Title',
      type: 'string',
    }),

    // ─── MEETING DETAILS ────────────────────────────────────
    defineField({
      name: 'topic',
      title: 'What they want to discuss',
      type: 'text', // "text" = multi-line textarea (vs. "string" = single line)
      validation: (Rule) => Rule.required().min(20).max(500),
    }),

    defineField({
      // The specific time slot the user selected from the calendar.
      // Stored as UTC ISO string (e.g., "2026-04-01T16:00:00.000Z").
      // All times are stored in UTC and displayed in the user's timezone.
      name: 'requestedSlot',
      title: 'Requested Slot',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'durationMinutes',
      title: 'Duration (minutes)',
      type: 'number',
      initialValue: 30,
      validation: (Rule) => Rule.required().min(15).max(120),
    }),

    defineField({
      // IANA timezone string (e.g., "America/Los_Angeles", "Europe/London").
      // Detected automatically on the client via Intl.DateTimeFormat.
      // Stored so we can format times in the user's timezone in emails.
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ─── TOKEN HASHES ───────────────────────────────────────
    // SECURITY: We store SHA-256 hashes of JWTs, not the raw tokens.
    // The raw JWT is only sent to the user's email.
    // When the user clicks a link, we:
    //   1. Receive the raw JWT in the URL
    //   2. Hash it with SHA-256
    //   3. Look up the booking by matching the hash
    // This way, even if Sanity data leaks, tokens can't be forged.
    defineField({
      name: 'verificationTokenHash',
      title: 'Verification Token Hash',
      type: 'string',
      // readOnly: Can't be edited in Studio (set programmatically)
      readOnly: true,
      // hidden: Don't clutter the Studio form with internal fields
      hidden: true,
    }),

    defineField({
      name: 'verificationTokenExpiry',
      title: 'Verification Token Expiry',
      type: 'datetime',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'cancelToken',
      title: 'Cancel Token Hash',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'rescheduleToken',
      title: 'Reschedule Token Hash',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    // ─── LIFECYCLE TIMESTAMPS ───────────────────────────────
    // Each status transition gets its own timestamp so we can
    // track exactly when each state change happened.
    defineField({
      name: 'rejectionReason',
      title: 'Rejection Reason',
      type: 'text',
      description: 'Optional reason shown to the requester when rejected',
    }),

    defineField({
      name: 'gcalEventId',
      title: 'Google Calendar Event ID',
      type: 'string',
      readOnly: true,
      hidden: true,
      description: 'Set after Google Calendar event is created on confirmation',
    }),

    defineField({
      name: 'approvedAt',
      title: 'Approved At',
      type: 'datetime',
      readOnly: true,
    }),

    defineField({
      name: 'rejectedAt',
      title: 'Rejected At',
      type: 'datetime',
      readOnly: true,
    }),

    defineField({
      name: 'cancelledAt',
      title: 'Cancelled At',
      type: 'datetime',
      readOnly: true,
    }),

    defineField({
      name: 'rescheduledAt',
      title: 'Rescheduled At',
      type: 'datetime',
      readOnly: true,
    }),

    defineField({
      // When a meeting is rescheduled, we store the original time here
      // so we can show "Changed from X to Y" in notifications.
      name: 'previousSlot',
      title: 'Previous Slot',
      type: 'datetime',
      readOnly: true,
      description: 'The original slot before rescheduling',
    }),

    // ─── PRIVATE LINK ───────────────────────────────────────
    // Private links let Alvin send a personalized scheduling link
    // to specific people (e.g., recruiters). When someone books via
    // a private link, isPrivateLink is true and privateLinkRef points
    // to the schedulingToken document that was used.
    defineField({
      name: 'isPrivateLink',
      title: 'Booked via Private Link',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
    }),

    defineField({
      // "reference" is Sanity's foreign key. It points to another document.
      // `to: [{ type: 'schedulingToken' }]` means it can only reference
      // documents of type schedulingToken.
      name: 'privateLinkRef',
      title: 'Private Link Reference',
      type: 'reference',
      to: [{ type: 'schedulingToken' }],
      readOnly: true,
      hidden: true,
    }),

    // ─── METADATA ───────────────────────────────────────────
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),

    defineField({
      // SHA-256 hash of the requester's IP address.
      // Used for rate limiting (max 3 requests per IP per hour).
      // We hash the IP so we're not storing PII.
      name: 'ipHash',
      title: 'IP Hash',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],

  // ── Preview ─────────────────────────────────────────────
  // How this document appears in Sanity Studio's document list.
  // Instead of showing a generic "bookingRequest", we show the
  // requester's name and email so Alvin can quickly identify requests.
  preview: {
    select: {
      title: 'requesterName',
      subtitle: 'requesterEmail',
      status: 'status',
      slot: 'requestedSlot',
    },
    prepare({ title, subtitle, status, slot }) {
      // Format the slot date for the list preview
      const date = slot
        ? new Date(slot).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        : 'No slot'

      // Map status to emoji for quick visual scanning in the list
      const statusEmoji: Record<string, string> = {
        pending_verification: '📧',
        pending_approval: '⏳',
        confirmed: '✅',
        rejected: '❌',
        cancelled: '🚫',
        rescheduled: '🔄',
      }

      return {
        title: `${statusEmoji[status] || '❓'} ${title || 'Unknown'}`,
        subtitle: `${subtitle} — ${date}`,
      }
    },
  },

  // ── Orderings ───────────────────────────────────────────
  // Sort options in Studio's document list dropdown.
  // Default: newest first (most useful for reviewing new requests).
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Slot Date',
      name: 'requestedSlotAsc',
      by: [{ field: 'requestedSlot', direction: 'asc' }],
    },
  ],
})

# alvinquach.dev — Scheduling System

## Stack
- Next.js 14 App Router, TypeScript, TailwindCSS
- Sanity v3 as CMS and state machine (no traditional database)
- GROQ for all Sanity queries (NOT GraphQL — GraphQL is read-only 
  in Sanity and used only on the Hoparc project, not here)
- Sanity client for all mutations
- Resend + React Email for all transactional email
- Google Calendar API (freebusy endpoint) for real-time availability
- reCAPTCHA v3 (invisible) for bot protection
- jose library for JWT signing/verification
- Vercel for deployment, Next.js API routes as serverless functions
- Vitest for unit and integration tests
- Playwright for E2E tests

## Architecture constraint — CRITICAL
There is NO traditional database and NO user auth system.
Sanity is the ONLY persistence layer for all booking state.
All booking documents, tokens, config, and status live in Sanity.
Every architectural decision must work within this constraint.
Never suggest adding a database, Redis, or any other persistence layer.

## Color system — use these CSS variables everywhere
Primary accent: #3b82f6 (electric blue)
Secondary accent: #8b5cf6 (violet)  
Success/live: #22c55e (green)
Warning/dev: #f59e0b (amber)
Error/reject: #ef4444 (red)
Background primary: #07090d
Background secondary: #0d1117
Background tertiary: #161b22
Border default: rgba(48, 54, 61, 0.7)
Text primary: #f1f5f9
Text secondary: #94a3b8
Text muted: #475569

In Tailwind config, extend colors with these as custom values.
In CSS, define as --color-accent, --color-accent-secondary etc.
Apply blue to: nav active states, CTAs, selected slots, 
  active sidebar items, links, focus rings
Apply violet to: featured badges, category labels, 
  interview prep hard difficulty, private link indicators
Never use teal — that's Kevin's color.

## Layout system — CRITICAL for this branch
The schedule and reschedule pages get their OWN layout.
They must NOT use the portfolio's standard sidebar layout.
Create app/(schedule)/layout.tsx separate from app/(portfolio)/layout.tsx
The schedule layout is full-viewport, no sidebar, minimal nav:
  - Sticky top bar: AQ logo left, "alvinquach.dev" in mono, 
    "← Back to portfolio" link right
  - No footer
  - Full height: calc(100vh - topbar height)
  - Two-column inside: sidebar panel left (fixed width 280px), 
    calendar/content right (flex 1)
  - On mobile: stacked, sidebar collapses to top

## Schedule page layout — mirrors Kevin's design exactly
Reference: Kevin's schedule page uses this structure:
  LEFT PANEL (280px, fixed):
    - Avatar + name
    - Page title ("Request a Meeting")
    - Duration + Google Meet badge
    - Description copy
    - "What we can discuss" bullet list
    - Divider
    - "Request-based booking" info item with icon
    - "Day-by-day availability" info item with icon  
    - "Instant calendar invite" info item with icon
  RIGHT PANEL (flex 1):
    - Week range header ("Mar 30 — Apr 5, 2026") with prev/next arrows
    - "Times in [user timezone]" subtitle
    - 7-column week grid (Mon–Sun)
    - Each column: day label + date number
    - Today's date highlighted with filled circle (blue)
    - Available time slots as clickable colored blocks inside columns
    - Empty columns show nothing (no slots available)
    - Bottom: "Available" + "Selected" legend with color swatches
    - Selected slot: darker filled block
    - "Continue" button appears bottom right after slot selection
    - Clicking "Continue" slides in the booking form 
      (same panel, no page navigation)

## Reschedule page layout
Separate page at app/(schedule)/reschedule/[token]/page.tsx
Same outer layout as schedule page (minimal nav, two-column)
LEFT PANEL:
  - "Reschedule Meeting" title
  - Current booking details card:
    - Original slot (in user timezone)
    - Topic they submitted
    - Status badge
  - Warning copy: "Selecting a new time will cancel your 
    current slot and require my re-approval"
RIGHT PANEL:
  - Same week-view calendar as schedule page
  - But header says "Select a new time"
  - On slot selection: confirmation step before submitting
    showing old slot → new slot with "Confirm Reschedule" button

## File structure for this branch
app/(schedule)/
  layout.tsx                    ← schedule-only layout
  schedule/
    page.tsx                    ← public schedule page
    pending/page.tsx            ← post-verification landing
    confirmed/page.tsx          ← post-confirmation deep link
    [token]/page.tsx            ← private link entry point
  reschedule/
    [token]/page.tsx            ← reschedule page

app/api/schedule/
  slots/route.ts                ← GET available slots
  request/route.ts              ← POST new booking request
  verify/route.ts               ← GET email verification
  cancel/route.ts               ← POST cancellation
  reschedule/route.ts           ← POST reschedule request
  webhook/route.ts              ← POST Sanity webhook handler

sanity/schemas/scheduling/
  bookingRequest.ts
  schedulingToken.ts
  schedulingConfig.ts

components/schedule/
  WeekCalendar.tsx              ← main calendar grid component
  SlotBlock.tsx                 ← individual time slot block
  BookingForm.tsx               ← slides in after slot selection
  RescheduleForm.tsx            ← confirm reschedule step
  ScheduleSidebar.tsx           ← left panel (shared)
  RescheduleSidebar.tsx         ← left panel for reschedule
  AvailabilityLegend.tsx        ← "Available / Selected" legend
  StatusBadge.tsx               ← booking status indicator

emails/
  VerifyEmail.tsx
  NewRequestNotification.tsx
  ConfirmationEmail.tsx
  RejectionEmail.tsx
  CancellationConfirmation.tsx
  RescheduleNotification.tsx
  RescheduleConfirmation.tsx    ← sent when reschedule approved

lib/scheduling/
  slots.ts                      ← slot generation logic
  tokens.ts                     ← JWT sign/verify
  google.ts                     ← Google Calendar API
  groq-queries.ts               ← all GROQ query strings
  sanity-scheduling.ts          ← Sanity client functions

types/scheduling.ts
tests/
  unit/scheduling/              ← Vitest unit tests
  integration/scheduling/       ← Vitest integration tests  
  e2e/scheduling/               ← Playwright E2E tests

## Environment variables
GOOGLE_CALENDAR_ID
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
RECAPTCHA_SECRET_KEY
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
SANITY_WEBHOOK_SECRET
RESEND_API_KEY
NEXT_PUBLIC_BASE_URL
SCHEDULING_TOKEN_SECRET
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN

## Code standards
- All times stored and passed as UTC ISO strings internally
- All times displayed in user's local timezone via Intl.DateTimeFormat
- User timezone auto-detected client-side, sent with form submission
- All JWTs signed with jose library using SCHEDULING_TOKEN_SECRET
- Verify reCAPTCHA v3 server-side before any Sanity write
- Verify Sanity webhook HMAC signature before processing
- All GROQ queries in lib/scheduling/groq-queries.ts (never inline)
- All API routes return ApiResponse<T> typed wrapper
- No any types — strict TypeScript throughout
- Every function in lib/scheduling/ must have a unit test
- Every API route must have an integration test
- Critical user flows must have E2E tests
```

---

**The Full Prompt**
```
Read CLAUDE.md completely before writing a single line of code.
Understand the stack, constraints, color system, and layout 
requirements fully. This is the feat/scheduling branch of 
alvinquach.dev — a Next.js 14 portfolio using Sanity as the 
sole persistence layer with no traditional database.

Build the complete scheduling and rescheduling system end to end.
Complete each phase fully before starting the next.
No TODOs, no placeholder implementations, no skipped edge cases.

═══════════════════════════════════════════
PHASE 1 — TAILWIND + CSS VARIABLES
═══════════════════════════════════════════

1. Extend tailwind.config.ts with the custom color palette 
   from CLAUDE.md. Add custom colors under extend.colors:
   accent: '#3b82f6'
   accent-secondary: '#8b5cf6'
   (and all others from the color system)

2. Add to globals.css:
   All color values as CSS custom properties (--color-accent etc)
   These must match the Tailwind values exactly.

3. Add to globals.css:
   .slot-available — styles for available time slot blocks
   .slot-selected — styles for selected slot
   .slot-disabled — styles for unavailable/past slots
   .slot-pending — styles for pending-approval slots (dimmed)
   All using the color system from CLAUDE.md.

═══════════════════════════════════════════
PHASE 2 — SANITY SCHEMAS
═══════════════════════════════════════════

Create sanity/schemas/scheduling/bookingRequest.ts:
Fields:
  _id (auto)
  status: string enum with options:
    pending_verification | pending_approval | confirmed | 
    rejected | cancelled | rescheduled
  requesterName: string (required)
  requesterEmail: string (required, email validation)
  requesterCompany: string
  requesterRole: string
  topic: text (required, what they want to discuss)
  requestedSlot: string (UTC ISO — required)
  durationMinutes: number (default 30)
  timezone: string (IANA timezone, detected client-side)
  verificationTokenHash: string (hashed, not raw JWT)
  verificationTokenExpiry: string (UTC ISO)
  cancelToken: string (hashed)
  rescheduleToken: string (hashed)
  rejectionReason: string (optional, set on rejection)
  gcalEventId: string (set after Google Calendar event created)
  approvedAt: string (UTC ISO)
  rejectedAt: string (UTC ISO)
  cancelledAt: string (UTC ISO)
  rescheduledAt: string (UTC ISO)
  previousSlot: string (UTC ISO, set when rescheduled)
  isPrivateLink: boolean (default false)
  privateLinkRef: reference to schedulingToken
  createdAt: string (UTC ISO, set on create)
  ipHash: string (hashed requester IP for abuse detection)

Custom validation: verificationTokenExpiry must be future date 
on create. requestedSlot must be future date.

Custom input component for status field showing colored badge.

Create sanity/schemas/scheduling/schedulingToken.ts:
Fields:
  _id (auto)
  tokenHash: string (hashed UUID, used for lookup)
  recipientName: string (required)
  recipientEmail: string (required)
  recipientCompany: string
  recipientRole: string
  personalNote: string (optional note shown on private page)
  expiresAt: string (UTC ISO, required)
  usedAt: string (UTC ISO, set when booking submitted)
  isUsed: boolean (default false)
  isRevoked: boolean (default false)
  revokedAt: string (UTC ISO)
  createdAt: string (UTC ISO)
  bookingRef: reference to bookingRequest (set after use)

Create sanity/schemas/scheduling/schedulingConfig.ts (singleton):
Fields:
  _id: 'schedulingConfig' (fixed ID, singleton)
  isAcceptingBookings: boolean (kill switch, default true)
  bufferMinutes: number (default 15)
  maxPerDay: number (default 3)
  maxPerWeek: number (default 8)
  earliestHour: number (0-23, default 9)
  latestHour: number (0-23, default 17)
  availableDays: array of numbers (0=Sun, 6=Sat, default [1,2,3,4,5])
  slotDurationMinutes: number (default 30)
  advanceBookingDays: number (how far out to show, default 14)
  minimumNoticeHours: number (min notice required, default 24)
  whatWeCanDiscuss: array of strings (shown in sidebar)
  meetingDescription: string (shown in sidebar)

Register all three in sanity/schemas/index.ts.
Add scheduling to the schema array without breaking existing schemas.

Create a custom Sanity desk structure in 
sanity/desk-structure.ts that adds a "Scheduling" top-level
section with child lists:
  - Pending Approval (GROQ filter: status == "pending_approval")
  - Confirmed (GROQ filter: status == "confirmed")
  - All Requests
  - Private Links (schedulingToken documents)
  - Config (singleton schedulingConfig)

═══════════════════════════════════════════
PHASE 3 — TYPES
═══════════════════════════════════════════

Create types/scheduling.ts with strict TypeScript types for:

BookingStatus — union of all status strings
BookingRequest — mirrors Sanity schema exactly
SchedulingToken — mirrors Sanity schema
SchedulingConfig — mirrors Sanity schema
TimeSlot — { start: string; end: string; available: boolean; 
             isPending?: boolean }
WeekDay — { date: string; slots: TimeSlot[]; dayName: string;
            dayNumber: number; isToday: boolean }
BookingFormData — form submission shape
RescheduleFormData — { rescheduleToken: string; newSlot: string;
                       timezone: string }
VerificationTokenPayload — JWT payload for email verify
ActionTokenPayload — JWT payload for cancel/reschedule tokens
  { type: 'cancel' | 'reschedule'; bookingId: string; 
    tokenHash: string; iat: number; exp: number }
PrivateLinkTokenPayload — JWT payload for private links
RecaptchaVerifyResponse — Google's response shape
GoogleFreeBusyResponse — Google Calendar API response shape
BusyPeriod — { start: string; end: string }
ApiResponse<T> — { success: boolean; data?: T; error?: string; 
                   code?: string }
WebhookPayload — Sanity webhook body shape
EmailRecipient — { name: string; email: string }

═══════════════════════════════════════════
PHASE 4 — GROQ QUERIES
═══════════════════════════════════════════

Create lib/scheduling/groq-queries.ts with named exports for 
every GROQ query string used in the system. No inline GROQ 
anywhere else in the codebase — all queries import from here.

Queries needed:
  SCHEDULING_CONFIG_QUERY — fetch singleton config
  PENDING_SLOTS_FOR_DATE_QUERY — fetch all pending+confirmed 
    requestedSlot values for a given date range
  BOOKING_BY_TOKEN_HASH_QUERY — find booking by verificationTokenHash
  BOOKING_BY_CANCEL_TOKEN_QUERY — find booking by cancelToken hash
  BOOKING_BY_RESCHEDULE_TOKEN_QUERY — find by rescheduleToken hash
  BOOKING_BY_ID_QUERY — fetch full booking by _id
  TOKEN_BY_HASH_QUERY — find schedulingToken by tokenHash
  PENDING_APPROVAL_COUNT_TODAY_QUERY — count pending today
  CONFIRMED_COUNT_THIS_WEEK_QUERY — count confirmed this week
  ACTIVE_BOOKINGS_FOR_WEEK_QUERY — all non-cancelled bookings 
    for a date range (for conflict detection)

Each query must be typed so the return shape is known.
Export a QueryResult type mapping for each query.

═══════════════════════════════════════════
PHASE 5 — UTILITIES
═══════════════════════════════════════════

Create lib/scheduling/tokens.ts:
  Use jose library (not jsonwebtoken — jose works in Edge Runtime).
  
  signToken(payload: object, expiresIn: string): Promise<string>
    Signs JWT with HS256 using SCHEDULING_TOKEN_SECRET
  
  verifyToken<T>(token: string): Promise<T | null>
    Verifies JWT, returns payload or null (never throws)
  
  hashToken(token: string): string
    SHA-256 hash of token using Node crypto
    Use this before storing tokens in Sanity
    Raw JWTs never stored — only hashes
  
  generatePrivateLinkJWT(tokenId: string): Promise<string>
    Signs a private link payload with 7-day expiry
  
  generateVerificationJWT(bookingId: string, email: string): 
    Promise<{ token: string; hash: string }>
    Returns both raw JWT (for email) and hash (for Sanity)
  
  generateActionJWT(type: 'cancel'|'reschedule', 
    bookingId: string): Promise<{ token: string; hash: string }>
    7-day expiry, returns token and hash

Create lib/scheduling/google.ts:
  Setup OAuth2 client using environment variables.
  Refresh access token automatically using stored refresh token.
  
  getFreeBusy(startDate: Date, endDate: Date): Promise<BusyPeriod[]>
    Calls Google Calendar freebusy API
    Returns array of busy periods for GOOGLE_CALENDAR_ID
    Caches result in memory for 5 minutes (simple Map cache)
    On error: logs error and returns empty array 
      (graceful degradation — don't break slot display)
  
  createCalendarEvent(booking: BookingRequest, meetLink: boolean):
    Promise<{ eventId: string; meetLink: string }>
    Creates Google Calendar event with Google Meet
    Adds requester as attendee (sends them a calendar invite)
    Returns eventId for storing in Sanity and Meet link
  
  deleteCalendarEvent(eventId: string): Promise<void>
    Deletes event, used on cancellation
    Gracefully handles already-deleted events

Create lib/scheduling/slots.ts:
  generateWeekSlots(
    weekStart: Date,
    config: SchedulingConfig,
    busyPeriods: BusyPeriod[],
    pendingSlots: string[]
  ): WeekDay[]
    
    For each day in the week:
      Skip if day not in config.availableDays
      Skip if day is in the past
      Generate slots from earliestHour to latestHour 
        in slotDurationMinutes increments
      For each slot:
        Mark unavailable if: overlaps any busyPeriod (with buffer)
        Mark unavailable if: in the past
        Mark unavailable if: within minimumNoticeHours of now
        Mark isPending if: matches a pendingSlots entry
        Mark unavailable if: would exceed maxPerDay confirmed count
    
    Return WeekDay[] with all slots populated
  
  isSlotAvailable(
    slotStart: Date,
    slotEnd: Date,
    busyPeriods: BusyPeriod[],
    bufferMinutes: number
  ): boolean
    Check slot does not overlap any busy period 
    Apply buffer before AND after each busy period
  
  getWeekStart(date: Date): Date
    Returns Monday of the week containing date
  
  formatSlotForDisplay(utcIso: string, timezone: string): string
    Format slot for human display in given timezone
  
  getSlotsForDate(weekDays: WeekDay[], date: string): TimeSlot[]
    Helper to extract slots for a specific date from WeekDay[]

Create lib/scheduling/sanity-scheduling.ts:
  All functions use Sanity client with SANITY_API_TOKEN.
  
  getSchedulingConfig(): Promise<SchedulingConfig>
  
  getPendingAndConfirmedSlotsForRange(
    startDate: Date, 
    endDate: Date
  ): Promise<string[]>
    Returns array of requestedSlot UTC ISO strings
  
  createBookingRequest(data: Omit<BookingRequest, '_id'>): 
    Promise<string>
    Returns new document _id
  
  updateBookingStatus(
    id: string, 
    status: BookingStatus,
    extra?: Partial<BookingRequest>
  ): Promise<void>
  
  getBookingByVerificationHash(hash: string): 
    Promise<BookingRequest | null>
  
  getBookingByCancelHash(hash: string): 
    Promise<BookingRequest | null>
  
  getBookingByRescheduleHash(hash: string): 
    Promise<BookingRequest | null>
  
  getBookingById(id: string): Promise<BookingRequest | null>
  
  getTokenByHash(hash: string): Promise<SchedulingToken | null>
  
  markTokenUsed(id: string, bookingId: string): Promise<void>
  
  storeGcalEventId(bookingId: string, eventId: string): 
    Promise<void>
  
  getConfirmedCountForDay(date: Date): Promise<number>
  
  getPendingApprovalCount(): Promise<number>

═══════════════════════════════════════════
PHASE 6 — API ROUTES
═══════════════════════════════════════════

Create app/api/schedule/slots/route.ts — GET handler:
  Query params: weekStart=YYYY-MM-DD (Monday of desired week)
  
  Validation:
    weekStart must be valid date
    weekStart must not be more than advanceBookingDays in future
    weekStart must be a Monday (or adjust to Monday)
  
  Logic:
    Fetch schedulingConfig from Sanity
    If !isAcceptingBookings return 503 with message
    Calculate weekEnd (Sunday)
    Call getFreeBusy(weekStart, weekEnd) in parallel with
    getPendingAndConfirmedSlotsForRange(weekStart, weekEnd)
    Call generateWeekSlots with all data
    Return WeekDay[] 
  
  Cache: Cache-Control: public, s-maxage=60, 
    stale-while-revalidate=300
  
  Error handling: if Google Calendar fails, return slots 
    based only on Sanity data with a warning flag in response

Create app/api/schedule/request/route.ts — POST handler:
  Body: BookingFormData + recaptchaToken + optional privateLinkToken
  
  Step 1: Rate limiting
    Check ipHash against recent requests in Sanity
    Reject if same IP submitted more than 3 requests in 1 hour
  
  Step 2: reCAPTCHA verification
    POST to Google reCAPTCHA verify endpoint
    Reject if score < 0.5 or action doesn't match
    Reject with 400 if verification fails
  
  Step 3: Private link validation (if privateLinkToken provided)
    Verify JWT signature
    Look up schedulingToken in Sanity by tokenHash
    Reject if: not found, expired, already used, revoked
    Extract pre-fill data from token
  
  Step 4: Slot availability re-verification
    Re-fetch freebusy and Sanity pending slots
    Confirm requested slot is still available
    This is the second check — first was client-side display
    Reject with 409 Conflict if slot no longer available
  
  Step 5: Check daily limit
    Count confirmed bookings for requested date
    Reject if at maxPerDay limit
  
  Step 6: Generate verification token
    Call generateVerificationJWT(tempId, email)
    Store hash, not raw token
  
  Step 7: Write to Sanity
    Create bookingRequest with status: pending_verification
    Store verificationTokenHash and verificationTokenExpiry
    Store ipHash (SHA-256 of X-Forwarded-For)
    If privateLinkToken: store privateLinkRef
  
  Step 8: Send verification email
    Use Resend to send VerifyEmail template
    Verification link: BASE_URL/api/schedule/verify?token=JWT
    Do not await — fire and forget, return 200 immediately
  
  Return: { success: true, message: "Check your email" }
  
  Error cases to handle explicitly:
    - Invalid recaptcha: 400 with code RECAPTCHA_FAILED
    - Slot unavailable: 409 with code SLOT_UNAVAILABLE  
    - Daily limit reached: 409 with code DAILY_LIMIT_REACHED
    - Invalid private link: 400 with code INVALID_PRIVATE_LINK
    - Expired private link: 400 with code EXPIRED_PRIVATE_LINK
    - Already used private link: 400 with code USED_PRIVATE_LINK
    - Rate limited: 429 with code RATE_LIMITED
    - Sanity write failure: 500 with code STORAGE_ERROR

Create app/api/schedule/verify/route.ts — GET handler:
  Query param: token=JWT
  
  Step 1: Verify JWT signature and expiry
    Return redirect to /schedule/error?code=INVALID_TOKEN if bad
    Return redirect to /schedule/error?code=EXPIRED_TOKEN if expired
  
  Step 2: Hash the token, look up bookingRequest in Sanity
    Return redirect to /schedule/error?code=NOT_FOUND if missing
  
  Step 3: Check current status
    If already pending_approval or confirmed: 
      redirect to /schedule/pending (idempotent — already verified)
    If status is anything else invalid: 
      redirect to /schedule/error?code=INVALID_STATE
  
  Step 4: Update status to pending_approval in Sanity
    This triggers the Sanity webhook which notifies me
  
  Step 5: If booking has privateLinkRef, mark token as used
  
  Step 6: Redirect to /schedule/pending
    The Sanity webhook (Phase 7) handles sending me the notification

Create app/api/schedule/cancel/route.ts — POST handler:
  Body: { token: string }
  
  Verify JWT, extract bookingId and hash
  Look up booking by cancelToken hash in Sanity
  
  Edge cases:
    - Token not found: 404
    - Token expired: 400 with code EXPIRED_TOKEN
    - Booking already cancelled: 400 with code ALREADY_CANCELLED
    - Booking not confirmed: 400 with code NOT_CONFIRMED 
      (can only cancel confirmed bookings)
  
  If booking has gcalEventId: call deleteCalendarEvent 
    (catch errors gracefully — don't fail if gcal delete fails)
  
  Update Sanity status to cancelled, set cancelledAt
  
  Send CancellationConfirmation email via Resend to requester
  Send copy to my email (BCC or separate send)
  
  Return: { success: true }

Create app/api/schedule/reschedule/route.ts — POST handler:
  Body: RescheduleFormData 
    { rescheduleToken: string; newSlot: string; timezone: string }
  
  Verify JWT, extract bookingId and hash
  Look up booking by rescheduleToken hash in Sanity
  
  Edge cases:
    - Token not found: 404
    - Token expired: 400 with code EXPIRED_TOKEN
    - Booking not confirmed: 400 with code NOT_CONFIRMED
    - Booking already cancelled: 400 with code ALREADY_CANCELLED
    - New slot same as current slot: 400 with code SAME_SLOT
    - New slot in the past: 400 with code PAST_SLOT
  
  Validate new slot availability (full check same as request route):
    - reCAPTCHA NOT required for reschedule (they're verified)
    - Google freebusy check
    - Sanity pending/confirmed check
    - Daily limit check
    - Minimum notice check
  
  If unavailable: 409 with code SLOT_UNAVAILABLE
  
  Update Sanity booking:
    status: pending_approval
    previousSlot: current requestedSlot
    requestedSlot: newSlot
    rescheduledAt: now
    Generate new cancelToken and rescheduleToken hashes
    Store new hashes, invalidate old ones
  
  If booking had gcalEventId: delete old calendar event
    (new one created when re-approved)
  
  Send RescheduleNotification email to me with:
    - Requester details
    - Old slot
    - New requested slot
    - Deep link to Sanity Studio document
  
  Return: { success: true, message: "Reschedule request submitted" }

Create app/api/schedule/webhook/route.ts — POST handler:
  
  Step 1: Verify Sanity HMAC-SHA256 signature
    Read raw body as Buffer before parsing
    Compute HMAC using SANITY_WEBHOOK_SECRET
    Compare with sanity-webhook-signature header
    Return 401 if mismatch — do not process
  
  Step 2: Parse webhook payload
    Extract _type, _id, status, and previous status
    Only process bookingRequest documents
    Return 200 for all other document types (don't fail)
  
  Step 3: Route by status transition
    
    pending_approval (new — just verified):
      Send NewRequestNotification email to me:
        - All requester details
        - Requested slot formatted in my timezone (PST)
        - Topic
        - Deep link directly to Sanity Studio document
        - (No approve/reject buttons in email — I do it in Studio)
    
    confirmed (I approved in Studio):
      Fetch full booking document from Sanity
      Create Google Calendar event with Meet link
        attendees: [requester email]
        title: "Meeting with [name]"
        description: topic
      Store gcalEventId in Sanity
      Generate new signed cancel and reschedule JWTs
      Store new token hashes in Sanity
      Send ConfirmationEmail to requester:
        - Meeting details in their timezone
        - Google Meet link
        - Add to calendar links (Google, Apple .ics, Outlook .ics)
        - Cancel link: BASE_URL/schedule/cancel/[token]
        - Reschedule link: BASE_URL/schedule/reschedule/[token]
      Handle Google Calendar failure gracefully:
        If event creation fails, still send confirmation email
        Note in email that calendar invite will follow separately
        Alert me via email of the gcal failure
    
    rejected (I rejected in Studio):
      Send RejectionEmail to requester:
        - Polite, warm tone
        - Include rejectionReason if set in Sanity
        - Invite to connect on LinkedIn or email instead
    
  Step 4: Always return 200 to Sanity
    Process failures should not return non-200 to Sanity
    Log errors but acknowledge receipt
    Use a try/catch around all processing logic

═══════════════════════════════════════════
PHASE 7 — LAYOUT AND PAGES
═══════════════════════════════════════════

Create app/(schedule)/layout.tsx:
  Minimal layout — no portfolio sidebar, no footer
  Full-height viewport
  Top bar (48px height):
    Left: AQ badge + "alvinquach.dev" in IBM Plex Mono
    Right: "← Back to portfolio" link → href="/"
    Border bottom, background bg-primary with backdrop blur
  Body: children fill remaining height (calc(100vh - 48px))
  Import IBM Plex Mono and Syne fonts same as portfolio
  Apply color CSS variables from globals.css

Create app/(schedule)/schedule/page.tsx:
  Server component — fetch schedulingConfig at build/request time
  If !isAcceptingBookings: show a polite "not currently accepting" 
    state in the right panel
  Pass config to client components as props
  
  Two-column layout (as specified in CLAUDE.md):
    Left: <ScheduleSidebar config={config} />
    Right: <WeekCalendar /> with booking form slide-in

Create components/schedule/ScheduleSidebar.tsx:
  Client component
  Props: config: SchedulingConfig
  
  Render exactly:
    AQ avatar (28px, blue background)
    "Alvin Quach" name
    "Request a Meeting" title (larger, bold)
    Duration row: clock icon + "30–60 min" + video icon + "Google Meet"
    Description: config.meetingDescription
    "WHAT WE CAN DISCUSS" label (mono, uppercase, muted)
    Bullet list: config.whatWeCanDiscuss items (cyan dot bullets)
    Divider
    Three info rows (icon + title + description):
      Shield icon: "Request-based booking" — 
        "You submit a request, I review before confirming"
      Calendar icon: "Day-by-day availability" — 
        "Slots vary week to week based on when I'm free"  
      Video icon: "Instant calendar invite" —
        "A Meet link and calendar invite sent on approval"

Create components/schedule/WeekCalendar.tsx:
  Client component — this is the main interactive component
  
  State:
    currentWeekStart: Date (Monday)
    selectedSlot: TimeSlot | null
    weekData: WeekDay[] | null
    isLoading: boolean
    showBookingForm: boolean
    userTimezone: string (detected via Intl.DateTimeFormat)
  
  On mount:
    Detect user timezone
    Set currentWeekStart to next Monday if today is weekend,
      else to this Monday
    Fetch /api/schedule/slots?weekStart=YYYY-MM-DD
  
  On week navigation (prev/next arrows):
    Prevent navigating before current week
    Prevent navigating beyond advanceBookingDays
    Fetch new week data
    Clear selectedSlot
  
  Layout of right panel:
    Header row:
      "[Month Day] — [Month Day, Year]" range (bold, large)
      "Times in [timezone]" (mono, muted, small)
      Prev arrow (disabled if at current week)
      Next arrow (disabled if at max week)
    
    7-column grid (Mon–Sun):
      Each column header: day abbreviation + date number
      Today's date: filled blue circle behind the number
      Past days: slightly muted
      
      Within each column: TimeSlot blocks
        Available slot: .slot-available class
          Shows formatted time (e.g., "9:00 AM")
          Click handler: setSelectedSlot(slot)
        Selected slot: .slot-selected class
          Shows formatted time + checkmark
        Disabled/past: .slot-disabled class (no click)
        Pending: .slot-pending class (slightly different shade)
        Empty day: nothing shown (no placeholder)
    
    Bottom of grid:
      Left: <AvailabilityLegend />
      Right: "Continue →" button (appears when slot selected)
        Blue background, white text
        onClick: setShowBookingForm(true)
    
    Below grid OR slide-in panel (use CSS transition):
      When showBookingForm is true:
        Slide up/in <BookingForm selectedSlot={selectedSlot} 
          timezone={userTimezone} />

Create components/schedule/BookingForm.tsx:
  Props: selectedSlot: TimeSlot; timezone: string; 
    privateLinkData?: Partial<BookingFormData>
  
  Fields:
    Selected slot display (read-only, formatted, with edit/change link)
    Full name (required, pre-filled if privateLinkData)
    Email (required, pre-filled if privateLinkData)
    Company (optional, pre-filled if privateLinkData)
    Role/title (optional)
    What would you like to discuss? (textarea, required, 
      min 20 chars, max 500 chars, character counter shown)
    Hidden: timezone, requestedSlot, recaptchaToken
  
  On submit:
    Load reCAPTCHA v3 if not already loaded
    Execute reCAPTCHA with action 'schedule_request'
    POST to /api/schedule/request
    Show loading state (disable button, show spinner)
    
    On success: 
      Show inline success state:
        Green checkmark icon
        "Request submitted! Check your email to verify."
        "I'll review and respond within 24 hours."
    
    On error:
      SLOT_UNAVAILABLE: "That slot was just taken. 
        Please select another time." + reset to calendar
      RATE_LIMITED: "Too many requests. Please try again later."
      RECAPTCHA_FAILED: "Verification failed. Please try again."
      DAILY_LIMIT_REACHED: "No more slots available that day."
      Default: "Something went wrong. Please email me directly."
      All errors shown inline, never alert()

Create app/(schedule)/schedule/[token]/page.tsx:
  Server component
  Params: token (private link JWT)
  
  Verify token on server side (use verifyToken from tokens.ts)
  If invalid/expired: render error state with message
  
  Fetch schedulingToken from Sanity using token hash
  If not found/revoked/used: render appropriate error state
  
  Render same two-column layout as public schedule page
  Pass pre-fill data to BookingForm via ScheduleSidebar:
    Add personalized greeting to sidebar:
    "Hi [recipientName]" above the title
    If personalNote set: show it below the description
  
  Pass privateLinkToken (raw JWT) down to BookingForm
  BookingForm sends it with the request for server-side validation

Create app/(schedule)/reschedule/[token]/page.tsx:
  Client component (needs timezone detection)
  Params: token (reschedule JWT from confirmation email)
  
  On mount:
    Detect user timezone
    Verify token client-side first (for fast error display)
    Fetch current booking details from a new API route:
      GET /api/schedule/booking?token=[rescheduleToken]
      Returns: { booking: BookingRequest } or error
  
  States to handle:
    Loading: show skeleton
    Invalid token: "This reschedule link is invalid or expired."
      + "Request a new one by emailing me at [email]"
    Already rescheduled: "You've already rescheduled this meeting."
    Booking cancelled: "This meeting has been cancelled."
    Booking not confirmed: "This meeting hasn't been confirmed yet."
    Valid: show reschedule UI
  
  Valid state layout (two-column, same outer layout):
    LEFT PANEL — <RescheduleSidebar>:
      "Reschedule Meeting" title
      Current booking card:
        Blue left border accent
        "Current meeting" label (mono, muted)
        Formatted date/time in user timezone
        Topic (truncated to 2 lines)
        "Confirmed" green badge
      Warning notice:
        Amber left border
        "Selecting a new time requires my re-approval.
         Your current slot will be held until I respond."
    
    RIGHT PANEL — modified WeekCalendar:
      Header: "Select a new time"
      "Times in [timezone]" subtitle
      Same week navigation and slot grid
      When slot selected: show confirmation step:
        "You're changing from:" [old slot formatted]
        "To:" [new slot formatted]  
        "Confirm Reschedule" button (blue)
        "← Keep current meeting" link
      
      On confirm:
        POST to /api/schedule/reschedule
        Show loading state
        
        On success:
          Show success state:
            "Reschedule requested!"
            "I'll review and confirm the new time within 24 hours."
            "Your current meeting remains until I respond."
        
        On error:
          SLOT_UNAVAILABLE: "That slot was just taken. Choose another."
          EXPIRED_TOKEN: "This link has expired."
          SAME_SLOT: "That's the same time as your current meeting."
          Default: "Something went wrong. Email me directly."

Add these new API routes:

app/api/schedule/booking/route.ts — GET handler:
  Query param: token (reschedule JWT)
  Verify JWT, look up booking by rescheduleToken hash
  Return safe subset of booking data (no internal hashes):
    { id, status, requestedSlot, topic, timezone, 
      requesterName, durationMinutes }
  This is used by the reschedule page to show current booking details

Create static pages:
  app/(schedule)/schedule/pending/page.tsx:
    "Check your email"
    "We sent a verification link to your email address."
    "Click the link to submit your request."
    "Didn't receive it? Check your spam folder."
    Link back to portfolio
  
  app/(schedule)/schedule/confirmed/page.tsx:
    Static landing — actual confirmation details come via email
    "Meeting requested — you'll hear back within 24 hours"
    Link back to portfolio
  
  app/(schedule)/schedule/error/page.tsx:
    Query param: code
    Show appropriate human-readable message per error code:
      INVALID_TOKEN: "This link is invalid."
      EXPIRED_TOKEN: "This link has expired."
      NOT_FOUND: "We couldn't find this request."
      INVALID_STATE: "This request is no longer active."
    All: offer to email me directly
    Link back to portfolio

Create components/schedule/AvailabilityLegend.tsx:
  Simple component showing color swatches + labels:
  Blue swatch: "Available"
  Darker blue swatch: "Selected"
  Keep it small and low-contrast — not a focal point

═══════════════════════════════════════════
PHASE 8 — EMAIL TEMPLATES
═══════════════════════════════════════════

All templates use React Email components.
All use the same design system colors as the portfolio.
All are mobile-responsive.
All include plain-text fallback via React Email's Text component.

Create emails/VerifyEmail.tsx:
  To: requester
  Subject: "Verify your meeting request — alvinquach.dev"
  
  Header: AQ monogram in blue square
  Body:
    "Hi [name],"
    "You requested a meeting with Alvin Quach."
    "Click below to verify your email and submit your request."
    "This link expires in 1 hour."
  CTA Button: "Verify Email Address"
    href: BASE_URL/api/schedule/verify?token=[JWT]
    Style: blue background, white text, rounded
  Footer: "If you didn't request this, ignore this email."

Create emails/NewRequestNotification.tsx:
  To: my email (alvinwquach@gmail.com)
  Subject: "New meeting request: [name] from [company]"
  
  Header: "New Meeting Request" 
  Details table:
    Name, Email, Company, Role, Topic
    Requested slot: formatted in America/Los_Angeles timezone
    Submitted: timestamp
    Type: Private Link or Public
  CTA: "Review in Sanity Studio"
    href: deep link to Sanity Studio document
    (https://[project].sanity.studio/desk/scheduling;[doc-id])

Create emails/ConfirmationEmail.tsx:
  To: requester
  Subject: "Meeting confirmed — [formatted date] with Alvin Quach"
  
  Header: "Your meeting is confirmed ✓"
  Meeting details card (blue left border):
    Date and time in THEIR timezone
    Duration
    Format: Google Meet (with Meet link as clickable URL)
  
  Add to calendar section:
    "Add to calendar:" 
    Three links: Google Calendar | Apple Calendar | Outlook
    Google: generate Google Calendar URL with event details
    Apple/Outlook: link to BASE_URL/api/schedule/ical/[bookingId]
      (you'll need a new route that generates .ics file)
  
  Action links (small, at bottom):
    "Need to reschedule? [Request a new time]"
      href: BASE_URL/schedule/reschedule/[rescheduleToken]
    "Can't make it? [Cancel this meeting]"
      href: BASE_URL/schedule/cancel/[cancelToken]
    Note: "These links expire in 7 days."
  
  Footer: "Looking forward to it. — Alvin"

Create emails/RejectionEmail.tsx:
  To: requester
  Subject: "Re: Your meeting request — alvinquach.dev"
  
  Warm, not cold. No template-feeling language.
  Body:
    "Hi [name],"
    "Thanks for reaching out — I appreciate you taking the time."
    If rejectionReason: "I'm going to pass for now: [reason]"
    Else: "Unfortunately I'm not able to connect at this time."
    "Feel free to reach out directly at [email] or on LinkedIn."
  No CTA button — just links in text.

Create emails/CancellationConfirmation.tsx:
  To: requester (BCC to me)
  Subject: "Meeting cancelled — [original date]"
  
  Simple confirmation.
  "Your meeting scheduled for [date] has been cancelled."
  "If you'd like to find another time, you're welcome to 
   submit a new request at alvinquach.dev/schedule"
  Link back to schedule page.

Create emails/RescheduleNotification.tsx:
  To: my email
  Subject: "[name] requested to reschedule"
  
  Details:
    Name, original slot, new requested slot (both in PST)
    Topic
  CTA: "Review in Sanity Studio" → deep link

Create emails/RescheduleConfirmation.tsx:
  To: requester
  Subject: "Reschedule confirmed — [new date] with Alvin Quach"
  
  Same structure as ConfirmationEmail but:
    Header: "Reschedule confirmed ✓"  
    Meeting details show the NEW slot
    Include fresh cancel and reschedule links with new tokens
    Small note: "Previous slot: [old date]" in muted text

Create app/api/schedule/ical/[bookingId]/route.ts:
  GET handler — no auth needed (bookingId is not sensitive, 
  it's just a Sanity document ID)
  
  Fetch booking from Sanity
  Generate .ics file content with correct VEVENT format:
    DTSTART, DTEND in UTC
    SUMMARY: Meeting with Alvin Quach
    DESCRIPTION: [topic]
    LOCATION: [Google Meet link]
  Return with headers:
    Content-Type: text/calendar
    Content-Disposition: attachment; filename="meeting.ics"

═══════════════════════════════════════════
PHASE 9 — TESTS
═══════════════════════════════════════════

UNIT TESTS (Vitest) in tests/unit/scheduling/:

tokens.test.ts:
  - signToken creates valid JWT with correct expiry
  - verifyToken returns payload for valid token
  - verifyToken returns null for expired token
  - verifyToken returns null for tampered token
  - verifyToken returns null for wrong secret
  - hashToken produces consistent SHA-256 output
  - hashToken output is not reversible (not equal to input)
  - generateVerificationJWT returns token and hash
  - generateActionJWT cancel type encodes correctly
  - generateActionJWT reschedule type encodes correctly

slots.test.ts:
  - generateWeekSlots returns 7 WeekDay objects
  - Slots before earliestHour are not generated
  - Slots after latestHour are not generated
  - Past slots are marked unavailable
  - Slots within minimumNoticeHours are marked unavailable
  - Slots overlapping busy periods are marked unavailable
  - Buffer before busy period is applied correctly
  - Buffer after busy period is applied correctly
  - maxPerDay limit excludes dates at limit
  - Days not in availableDays return empty slot arrays
  - Pending slots are marked isPending: true
  - Confirmed slots are marked unavailable
  - Slot duration creates correct number of slots per day
  - isSlotAvailable returns false for exact overlap
  - isSlotAvailable returns false for partial overlap
  - isSlotAvailable returns true when no overlap
  - isSlotAvailable applies buffer correctly

groq-queries.test.ts:
  - Each query string is a non-empty string
  - Each query contains expected GROQ syntax markers
  - No query contains hardcoded document IDs

INTEGRATION TESTS (Vitest) in tests/integration/scheduling/:
  Use msw (Mock Service Worker) to mock external APIs.
  Use Sanity client in test mode or mock the client.

api-slots.test.ts:
  - Returns 200 with WeekDay[] for valid weekStart
  - Returns 503 when isAcceptingBookings is false
  - Returns 400 for invalid date format
  - Returns 400 for past date
  - Correctly excludes Google Calendar busy periods
  - Correctly excludes Sanity pending slots
  - Returns slots with buffer applied
  - Handles Google Calendar API failure gracefully

api-request.test.ts:
  - Returns 200 for valid submission
  - Returns 400 for failed reCAPTCHA
  - Returns 409 for unavailable slot
  - Returns 409 for daily limit reached
  - Returns 429 for rate limited IP
  - Returns 400 for invalid private link token
  - Returns 400 for expired private link token
  - Returns 400 for used private link token
  - Creates Sanity document on success
  - Sends verification email on success
  - Stores hashed token not raw JWT

api-verify.test.ts:
  - Redirects to /schedule/pending on success
  - Redirects to error page for invalid token
  - Redirects to error page for expired token
  - Handles already-verified bookings idempotently
  - Updates status to pending_approval
  - Marks private link token as used

api-cancel.test.ts:
  - Returns 200 for valid cancellation
  - Returns 404 for unknown token
  - Returns 400 for expired token
  - Returns 400 for already cancelled booking
  - Returns 400 for non-confirmed booking
  - Deletes Google Calendar event
  - Handles gcal delete failure gracefully
  - Sends cancellation email

api-reschedule.test.ts:
  - Returns 200 for valid reschedule request
  - Returns 400 for expired token
  - Returns 409 for unavailable new slot
  - Returns 400 for same slot as current
  - Returns 400 for past slot
  - Returns 400 for non-confirmed booking
  - Invalidates old tokens, generates new ones
  - Deletes old gcal event
  - Sends reschedule notification email
  - Stores previousSlot

api-webhook.test.ts:
  - Returns 401 for invalid HMAC signature
  - Returns 200 for non-bookingRequest documents
  - Creates gcal event on confirmed transition
  - Sends confirmation email on confirmed transition
  - Sends rejection email on rejected transition
  - Sends notification email on pending_approval transition
  - Handles gcal event creation failure gracefully
  - Always returns 200 to Sanity regardless of processing errors

E2E TESTS (Playwright) in tests/e2e/scheduling/:

schedule-flow.spec.ts — Happy path:
  1. Navigate to /schedule
  2. Verify page loads with sidebar and calendar
  3. Navigate to next week
  4. Click an available slot
  5. Verify slot highlights and Continue button appears
  6. Click Continue
  7. Verify booking form slides in
  8. Fill in all form fields
  9. Submit form (mock reCAPTCHA in test environment)
  10. Verify success message appears
  11. Verify no page navigation occurred

schedule-slot-unavailable.spec.ts:
  Mock API to return 409 SLOT_UNAVAILABLE on form submit
  Verify error message shown
  Verify calendar resets for new selection

schedule-reschedule-flow.spec.ts:
  1. Navigate to /schedule/reschedule/[valid-test-token]
  2. Verify current booking details shown in sidebar
  3. Verify warning notice shown
  4. Select a new slot
  5. Verify confirmation step appears showing old → new slot
  6. Click "Keep current meeting" — verify confirmation step hides
  7. Select slot again
  8. Click "Confirm Reschedule"
  9. Verify success message

schedule-reschedule-invalid-token.spec.ts:
  Navigate to /schedule/reschedule/[invalid-token]
  Verify error state shown with appropriate message
  Verify no calendar is shown

schedule-private-link.spec.ts:
  Navigate to /schedule/[valid-private-token]
  Verify personalized greeting shown
  Verify form pre-fills with token recipient data
  Complete full booking flow

schedule-no-availability.spec.ts:
  Mock API to return empty slots for all days
  Verify week shows no slot blocks
  Verify empty state message shown

═══════════════════════════════════════════
PHASE 10 — ENVIRONMENT + DOCS
═══════════════════════════════════════════

Create .env.local.example with every variable and a comment 
explaining exactly how to obtain it, including URLs to the 
relevant console/dashboard.

Create docs/scheduling-system.md:
  Architecture overview with diagram (ASCII is fine)
  Why Sanity instead of a database (explain the constraint)
  Race condition analysis and why the approval gate resolves it
  How slot locking works (second verification on submit)
  How tokens work (sign → hash → store hash → verify on use)
  GROQ vs GraphQL decision rationale
  How to generate a private link (step by step)
  How to update scheduling config in Sanity Studio
  How to handle a double-booking edge case
  Sanity webhook setup guide (step by step with screenshots guide)
  Google Calendar OAuth setup guide
  reCAPTCHA setup guide
  Local development with ngrok guide
  How to run tests

═══════════════════════════════════════════
COMPLETION CHECKLIST
═══════════════════════════════════════════

After all phases are done:
1. Run: tsc --noEmit — fix all TypeScript errors, no any types
2. Run: npx vitest run — all unit and integration tests pass
3. Run: npx playwright test — all E2E tests pass
4. Run: npm run build — production build succeeds with no errors
5. Run dev server, navigate to /schedule manually, verify:
   - Page loads without console errors
   - Calendar grid renders correctly
   - Week navigation works
   - Slot selection works
   - Form slides in correctly
   - Form submits (will fail at reCAPTCHA/Sanity without 
     real env vars, but no unhandled errors)
6. Navigate to /schedule/reschedule/invalid-token manually:
   Verify error state shows correctly, no crashes
7. Write final summary comment at top of 
   docs/scheduling-system.md confirming all checks passed
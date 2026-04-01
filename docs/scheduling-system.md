# Scheduling System — Architecture & Operations Guide

## Architecture Overview

```
                          ┌─────────────┐
                          │  Visitor's   │
                          │  Browser     │
                          └──────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │             │
              ┌─────▼───┐ ┌─────▼───┐  ┌──────▼────┐
              │/schedule │ │/reschedule│ │ /schedule/ │
              │  page    │ │  /[token]│  │  [token]   │
              │ (public) │ │ (action) │  │ (private)  │
              └─────┬────┘ └─────┬────┘  └──────┬─────┘
                    │            │              │
              ┌─────▼────────────▼──────────────▼────┐
              │         Next.js API Routes           │
              │  /api/schedule/{slots,request,verify, │
              │   cancel,reschedule,webhook,booking}  │
              └──┬────────────┬───────────────┬──────┘
                 │            │               │
         ┌───────▼──┐  ┌─────▼─────┐  ┌──────▼─────┐
         │  Sanity   │  │  Google   │  │   Resend   │
         │ (state +  │  │ Calendar  │  │  (email)   │
         │  config)  │  │ (freebusy │  │            │
         │           │  │  + events)│  │            │
         └───────────┘  └───────────┘  └────────────┘
```

## Why Sanity Instead of a Database

This portfolio has **no traditional database** — Sanity is the sole persistence layer. This is an architectural constraint, not a compromise. Sanity provides:
- Document storage with rich querying (GROQ)
- Real-time webhooks for status transitions
- Built-in admin UI (Sanity Studio) for manual approval/rejection
- No additional infrastructure to manage

## The Booking Lifecycle (State Machine)

```
  [User submits form]
         │
         ▼
  pending_verification ──[clicks email link]──▶ pending_approval
                                                      │
                                        ┌─────────────┼─────────────┐
                                        │             │             │
                                        ▼             ▼             ▼
                                   confirmed      rejected     (no action)
                                        │
                              ┌─────────┼─────────┐
                              │                   │
                              ▼                   ▼
                          cancelled          rescheduled
                                                  │
                                                  ▼
                                          pending_approval (again)
```

## Race Condition Analysis

**Problem:** Two people could try to book the same slot simultaneously.

**Solution:** Two-phase verification.
1. **Phase 1 (client-side):** Calendar shows real-time availability from Sanity + Google Calendar
2. **Phase 2 (server-side):** On form submit, `/api/schedule/request` re-verifies the slot's availability by re-fetching from both Sanity and Google Calendar before writing.

The approval gate adds a third layer: even if two requests land on the same slot, Alvin manually reviews each one and can reject duplicates.

## Token Security Model

```
  Generate JWT ──▶ Hash with SHA-256 ──▶ Store HASH in Sanity
       │                                         │
       ▼                                         │
  Send raw JWT via email                         │
       │                                         │
       ▼                                         │
  User clicks link with raw JWT                  │
       │                                         │
       ▼                                         │
  Server receives raw JWT                        │
       │                                         │
       ├──▶ Verify signature (proves we created it)
       │                                         │
       ├──▶ Hash the JWT again ──▶ Compare with stored hash
       │                                         │
       └──▶ If match: process the action         │
```

**Why hash before storing?** Even if Sanity data is leaked, attackers can't forge tokens — they only have hashes, not raw JWTs.

## How to Generate a Private Link

1. Open Sanity Studio → Scheduling → Private Links → Create
2. Fill in: recipient name, email, company, optional personal note
3. Set expiry date (default: 7 days from now)
4. Save the document
5. Run: `node -e "const {generatePrivateLinkJWT}=require('./lib/scheduling/tokens'); generatePrivateLinkJWT('DOC_ID_HERE').then(console.log)"`
6. Send the URL: `https://alvinquach.dev/schedule/{jwt}`

## How to Update Scheduling Config

1. Open Sanity Studio → Scheduling → Config
2. Edit any field (business hours, limits, description, etc.)
3. Changes take effect immediately (no deploy needed)
4. To disable all bookings: toggle "Accepting Bookings" to off

## Sanity Webhook Setup

1. Go to: https://sanity.io/manage → Your Project → API → Webhooks
2. Click "Create Webhook"
3. Settings:
   - Name: "Scheduling Status Changes"
   - URL: `https://alvinquach.dev/api/schedule/webhook`
   - Trigger on: Create, Update
   - Filter: `_type == "bookingRequest"`
   - Projection: `{_id, _type, status, requesterName, requesterEmail, requesterCompany, topic, requestedSlot, timezone, durationMinutes, isPrivateLink, rejectionReason, gcalEventId}`
   - Secret: Generate and store in SANITY_WEBHOOK_SECRET env var
4. Save

## Google Calendar OAuth Setup

1. Google Cloud Console → Create Project
2. Enable "Google Calendar API"
3. Create OAuth 2.0 Credentials (Web Application)
4. Use OAuth Playground (https://developers.google.com/oauthplayground):
   - Select "Google Calendar API v3" scope
   - Exchange authorization code for refresh token
   - Store refresh token in GOOGLE_REFRESH_TOKEN

## reCAPTCHA v3 Setup

1. Go to: https://www.google.com/recaptcha/admin
2. Register new site, choose v3
3. Add domains: `localhost`, `alvinquach.dev`
4. Store Site Key in NEXT_PUBLIC_RECAPTCHA_SITE_KEY
5. Store Secret Key in RECAPTCHA_SECRET_KEY

## Running Tests

```bash
# Unit + Integration tests (Vitest)
npx vitest run

# Only unit tests
npx vitest run tests/unit/

# E2E tests (Playwright)
npx playwright test tests/e2e/scheduling/

# Watch mode (re-runs on file changes)
npx vitest
```

## Local Development with ngrok

Sanity webhooks need a public URL. For local development:

```bash
# Start the dev server
npm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Use the ngrok URL for the webhook URL in Sanity
# e.g., https://abc123.ngrok.io/api/schedule/webhook
```

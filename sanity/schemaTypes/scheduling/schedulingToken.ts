/**
 * Scheduling Token Schema — Sanity Document Type
 * ================================================
 *
 * WHAT IS THIS?
 * -------------
 * A "scheduling token" represents a private scheduling link that Alvin
 * can generate and send to specific people. Instead of using the public
 * /schedule page, the recipient gets a personalized URL like:
 *
 *   https://alvinquach.dev/schedule/abc123-def456-ghi789
 *
 * When they visit that URL:
 *   1. The JWT in the URL is verified
 *   2. Their name/email/company are pre-filled in the booking form
 *   3. A personalized greeting is shown ("Hi Sarah!")
 *   4. The token is marked as "used" after they submit
 *
 * WHY PRIVATE LINKS?
 * ------------------
 * Sometimes Alvin wants to give a specific recruiter or collaborator
 * a scheduling link without making the public page available to everyone.
 * The token also lets him track who booked via which link.
 *
 * TOKEN SECURITY:
 * ---------------
 * Same pattern as bookingRequest tokens:
 *   1. Generate a UUID + sign it as JWT
 *   2. Store SHA-256 hash of the JWT in Sanity (tokenHash field)
 *   3. Send raw JWT to recipient
 *   4. On visit: hash the URL token → look up by hash in Sanity
 *
 * LIFECYCLE:
 * ----------
 *   Created → Active (can be used) → Used (booking submitted)
 *   Created → Active → Revoked (Alvin manually revoked it)
 *   Created → Active → Expired (past expiresAt date)
 */

import { defineType, defineField } from 'sanity'

export const schedulingToken = defineType({
  name: 'schedulingToken',
  title: 'Private Scheduling Link',
  type: 'document',

  fields: [
    // ─── TOKEN HASH ─────────────────────────────────────────
    // SHA-256 hash of the JWT. Used for lookups when someone visits
    // the private link URL. We never store the raw JWT.
    defineField({
      name: 'tokenHash',
      title: 'Token Hash',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),

    // ─── RECIPIENT INFO ─────────────────────────────────────
    // Who this link is for. These values pre-fill the booking form
    // so the recipient doesn't have to type their info again.
    defineField({
      name: 'recipientName',
      title: 'Recipient Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'recipientEmail',
      title: 'Recipient Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: 'recipientCompany',
      title: 'Recipient Company',
      type: 'string',
    }),

    defineField({
      name: 'recipientRole',
      title: 'Recipient Role',
      type: 'string',
    }),

    // ─── PERSONALIZATION ────────────────────────────────────
    // Optional note shown on the private scheduling page.
    // Example: "Great chatting at React Conf! Here's my scheduling link."
    defineField({
      name: 'personalNote',
      title: 'Personal Note',
      type: 'text',
      description: 'Optional note shown to the recipient on the scheduling page',
    }),

    // ─── TOKEN LIFECYCLE ────────────────────────────────────
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'When this link stops working (typically 7 days after creation)',
    }),

    defineField({
      name: 'usedAt',
      title: 'Used At',
      type: 'datetime',
      readOnly: true,
      description: 'When the recipient submitted a booking using this link',
    }),

    defineField({
      name: 'isUsed',
      title: 'Has Been Used',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
    }),

    defineField({
      name: 'isRevoked',
      title: 'Revoked',
      type: 'boolean',
      initialValue: false,
      description: 'Manually revoke this link so it can no longer be used',
    }),

    defineField({
      name: 'revokedAt',
      title: 'Revoked At',
      type: 'datetime',
      readOnly: true,
    }),

    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),

    // ─── BOOKING REFERENCE ──────────────────────────────────
    // After the recipient books a meeting, this reference points
    // to the bookingRequest document they created. This creates a
    // two-way link: booking → token (via privateLinkRef) and
    // token → booking (via bookingRef).
    defineField({
      name: 'bookingRef',
      title: 'Booking Reference',
      type: 'reference',
      to: [{ type: 'bookingRequest' }],
      readOnly: true,
      description: 'The booking created using this private link',
    }),
  ],

  // ── Preview ─────────────────────────────────────────────
  preview: {
    select: {
      name: 'recipientName',
      email: 'recipientEmail',
      company: 'recipientCompany',
      isUsed: 'isUsed',
      isRevoked: 'isRevoked',
      expiresAt: 'expiresAt',
    },
    prepare({ name, email, company, isUsed, isRevoked, expiresAt }) {
      // Show status at a glance in the document list
      const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false
      const statusIcon = isRevoked ? '🚫' : isUsed ? '✅' : isExpired ? '⏰' : '🔗'
      const companyLabel = company ? ` (${company})` : ''

      return {
        title: `${statusIcon} ${name}${companyLabel}`,
        subtitle: email,
      }
    },
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})

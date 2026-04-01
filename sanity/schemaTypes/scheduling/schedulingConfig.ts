/**
 * Scheduling Config Schema — Singleton with Per-Day Availability
 * ==============================================================
 *
 * KEY CONCEPT: Three-layer availability
 *
 *   Layer 1: weeklySchedule (this config)
 *     → Your DEFAULT hours per day of the week
 *     → "Monday: 10am-2pm, Tuesday: 9am-5pm, Wednesday: off"
 *
 *   Layer 2: dateOverrides (this config)
 *     → Exceptions to the weekly schedule for specific dates
 *     → "April 10: unavailable, April 15: only 2pm-4pm"
 *
 *   Layer 3: Google Calendar freebusy (runtime)
 *     → Removes times you're actually busy from meetings/events
 *     → "Tuesday 10-11am busy" → removes that slot
 *
 *   RESULT: Visitors see times where ALL THREE layers agree you're free.
 */

import { defineType, defineField } from 'sanity'

/** Day names for display in Studio */
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const schedulingConfig = defineType({
  name: 'schedulingConfig',
  title: 'Scheduling Config',
  type: 'document',

  // Group fields into tabs for cleaner Studio UI
  groups: [
    { name: 'availability', title: 'Availability', default: true },
    { name: 'settings', title: 'Settings' },
    { name: 'content', title: 'Page Content' },
  ],

  fields: [
    // ─── KILL SWITCH ────────────────────────────────────────
    defineField({
      name: 'isAcceptingBookings',
      title: 'Accepting Bookings',
      type: 'boolean',
      initialValue: true,
      description: 'Master switch — when off, no new bookings can be made',
      validation: (Rule) => Rule.required(),
      group: 'settings',
    }),

    // ─── WEEKLY SCHEDULE (per-day availability) ─────────────
    // Each item represents one day of the week with its own hours.
    // In Sanity Studio this renders as a list of 7 items,
    // each with enabled/disabled toggle and start/end hours.
    defineField({
      name: 'weeklySchedule',
      title: 'Weekly Schedule',
      description: 'Set your available hours for each day of the week. Times are in your local timezone (Pacific).',
      type: 'array',
      group: 'availability',
      of: [
        {
          type: 'object',
          name: 'daySchedule',
          title: 'Day Schedule',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'number',
              description: '0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat',
              validation: (Rule) => Rule.required().min(0).max(6),
            }),
            defineField({
              name: 'enabled',
              title: 'Available',
              type: 'boolean',
              initialValue: true,
              description: 'Whether you take meetings on this day',
            }),
            defineField({
              name: 'startHour',
              title: 'Start Hour',
              type: 'number',
              initialValue: 9,
              description: 'First available hour (0-23)',
              validation: (Rule) => Rule.min(0).max(23),
            }),
            defineField({
              name: 'startMinute',
              title: 'Start Minute',
              type: 'number',
              initialValue: 0,
              description: '0, 15, 30, or 45',
              validation: (Rule) => Rule.min(0).max(45),
            }),
            defineField({
              name: 'endHour',
              title: 'End Hour',
              type: 'number',
              initialValue: 17,
              description: 'Last slot must end by this hour (0-23)',
              validation: (Rule) => Rule.min(0).max(23),
            }),
            defineField({
              name: 'endMinute',
              title: 'End Minute',
              type: 'number',
              initialValue: 0,
              description: '0, 15, 30, or 45',
              validation: (Rule) => Rule.min(0).max(45),
            }),
          ],
          preview: {
            select: { day: 'day', enabled: 'enabled', startHour: 'startHour', startMinute: 'startMinute', endHour: 'endHour', endMinute: 'endMinute' },
            prepare({ day, enabled, startHour, startMinute, endHour, endMinute }) {
              const dayName = DAY_NAMES[day ?? 0]
              if (!enabled) return { title: `${dayName} — OFF` }
              const fmt = (h: number, m: number) => {
                const period = h >= 12 ? 'PM' : 'AM'
                const hour = h % 12 || 12
                return m > 0 ? `${hour}:${String(m).padStart(2, '0')} ${period}` : `${hour} ${period}`
              }
              return { title: `${dayName} — ${fmt(startHour ?? 9, startMinute ?? 0)} to ${fmt(endHour ?? 17, endMinute ?? 0)}` }
            },
          },
        },
      ],
      // Default: Mon-Fri 9am-5pm, Sat-Sun off
      initialValue: [
        { _type: 'daySchedule', _key: 'sun', day: 0, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'mon', day: 1, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'tue', day: 2, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'wed', day: 3, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'thu', day: 4, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'fri', day: 5, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
        { _type: 'daySchedule', _key: 'sat', day: 6, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
      ],
    }),

    // ─── DATE OVERRIDES ─────────────────────────────────────
    // Exceptions to the weekly schedule for specific dates.
    // "April 10: off" or "April 15: only 2pm-4pm"
    defineField({
      name: 'dateOverrides',
      title: 'Date Overrides',
      description: 'Override availability for specific dates (vacation days, special hours, etc.)',
      type: 'array',
      group: 'availability',
      of: [
        {
          type: 'object',
          name: 'dateOverride',
          title: 'Date Override',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'date',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'enabled',
              title: 'Available',
              type: 'boolean',
              initialValue: false,
              description: 'Toggle off to block this day entirely',
            }),
            defineField({
              name: 'startHour',
              title: 'Start Hour',
              type: 'number',
              description: 'Override start hour (if available)',
              validation: (Rule) => Rule.min(0).max(23),
            }),
            defineField({
              name: 'startMinute',
              title: 'Start Minute',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.min(0).max(45),
            }),
            defineField({
              name: 'endHour',
              title: 'End Hour',
              type: 'number',
              description: 'Override end hour (if available)',
              validation: (Rule) => Rule.min(0).max(23),
            }),
            defineField({
              name: 'endMinute',
              title: 'End Minute',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.min(0).max(45),
            }),
            defineField({
              name: 'reason',
              title: 'Reason',
              type: 'string',
              description: 'Internal note (e.g., "Vacation", "Doctor appointment")',
            }),
          ],
          preview: {
            select: { date: 'date', enabled: 'enabled', reason: 'reason', startHour: 'startHour', endHour: 'endHour' },
            prepare({ date, enabled, reason, startHour, endHour }) {
              if (!enabled) return { title: `${date} — BLOCKED${reason ? ` (${reason})` : ''}` }
              return { title: `${date} — ${startHour ?? '?'}:00 to ${endHour ?? '?'}:00${reason ? ` (${reason})` : ''}` }
            },
          },
        },
      ],
    }),

    // ─── SLOT CONFIGURATION ─────────────────────────────────
    defineField({
      name: 'slotDurationMinutes',
      title: 'Slot Duration (minutes)',
      type: 'number',
      initialValue: 30,
      description: 'Spacing between available start times in the calendar',
      validation: (Rule) => Rule.required().min(15).max(120),
      group: 'settings',
    }),

    defineField({
      name: 'bufferMinutes',
      title: 'Buffer Between Meetings (minutes)',
      type: 'number',
      initialValue: 15,
      description: 'Padding before and after busy periods',
      validation: (Rule) => Rule.required().min(0).max(60),
      group: 'settings',
    }),

    defineField({
      name: 'maxPerDay',
      title: 'Max Bookings Per Day',
      type: 'number',
      initialValue: 3,
      description: 'Maximum confirmed meetings in a single day',
      validation: (Rule) => Rule.required().min(1).max(10),
      group: 'settings',
    }),

    defineField({
      name: 'maxPerWeek',
      title: 'Max Bookings Per Week',
      type: 'number',
      initialValue: 8,
      description: 'Maximum confirmed meetings in a single week',
      validation: (Rule) => Rule.required().min(1).max(25),
      group: 'settings',
    }),

    defineField({
      name: 'advanceBookingDays',
      title: 'Advance Booking Days',
      type: 'number',
      initialValue: 14,
      description: 'How many days into the future to show slots',
      validation: (Rule) => Rule.required().min(7).max(60),
      group: 'settings',
    }),

    defineField({
      name: 'minimumNoticeHours',
      title: 'Minimum Notice (hours)',
      type: 'number',
      initialValue: 24,
      description: 'Minimum hours before a slot can be booked',
      validation: (Rule) => Rule.required().min(1).max(168),
      group: 'settings',
    }),

    // ─── SIDEBAR CONTENT ────────────────────────────────────
    defineField({
      name: 'meetingDescription',
      title: 'Meeting Description',
      type: 'text',
      description: 'Description shown below the meeting title in the sidebar',
      initialValue: 'A casual video call to discuss engineering, projects, or opportunities. I review every request personally and confirm within 24 hours.',
      group: 'content',
    }),

    defineField({
      name: 'whatWeCanDiscuss',
      title: 'What We Can Discuss',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points shown in the scheduling sidebar',
      initialValue: [
        'Career opportunities & roles',
        'Technical architecture & challenges',
        'Open source collaboration',
        'Project feedback & code review',
        'Mentorship & career advice',
      ],
      group: 'content',
    }),
  ],

  preview: {
    select: { accepting: 'isAcceptingBookings' },
    prepare({ accepting }) {
      return {
        title: 'Scheduling Config',
        subtitle: accepting ? '✅ Accepting bookings' : '❌ Not accepting bookings',
      }
    },
  },
})

'use server'

import { createClient } from 'next-sanity'
import { google } from 'googleapis'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { revalidatePath } from 'next/cache'

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

export async function moveApplication(
  id: string,
  newStatus: string,
  orderedIds: string[],
) {
  const transaction = writeClient.transaction()

  transaction.patch(id, (p) => p.set({ status: newStatus }))

  for (let i = 0; i < orderedIds.length; i++) {
    transaction.patch(orderedIds[i], (p) => p.set({ order: i }))
  }

  await transaction.commit()
  revalidatePath('/tracker')
}

export async function reorderApplications(orderedIds: string[]) {
  const transaction = writeClient.transaction()

  for (let i = 0; i < orderedIds.length; i++) {
    transaction.patch(orderedIds[i], (p) => p.set({ order: i }))
  }

  await transaction.commit()
  revalidatePath('/tracker')
}

// ── Create new application ───────────────────────────────────

export interface CreateApplicationInput {
  company: string
  role: string
  jobUrl?: string
  status?: string
  source?: string
  salaryMin?: number
  salaryMax?: number
  notes?: string
}

export async function createApplication(input: CreateApplicationInput) {
  const doc = {
    _type: 'jobApplication' as const,
    company: input.company,
    role: input.role,
    jobUrl: input.jobUrl || undefined,
    status: input.status || 'saved',
    dateApplied: new Date().toISOString().split('T')[0],
    source: input.source || undefined,
    salaryRange:
      input.salaryMin || input.salaryMax
        ? {
            min: input.salaryMin || undefined,
            max: input.salaryMax || undefined,
            currency: 'USD',
          }
        : undefined,
    notes: input.notes || undefined,
  }

  const result = await writeClient.create(doc)
  revalidatePath('/tracker')
  return { id: result._id }
}

// ── Google Calendar sync for interviews ──────────────────────

function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

interface InterviewDate {
  _key: string
  date: string
  type: string
  notes?: string
  interviewer?: string
  gcalEventId?: string
}

export async function syncInterviewsToCalendar(applicationId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) {
    return { synced: 0, error: 'GOOGLE_CALENDAR_ID not configured' }
  }

  // Fetch current application data
  const app = await writeClient.fetch<{
    company: string
    role: string
    interviewDates?: InterviewDate[]
  }>(`*[_id == $id][0]{ company, role, interviewDates }`, { id: applicationId })

  if (!app?.interviewDates?.length) {
    return { synced: 0 }
  }

  const calendar = getCalendarClient()
  let synced = 0

  for (const interview of app.interviewDates) {
    if (interview.gcalEventId || !interview.date) continue

    const startTime = new Date(interview.date)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour default

    const typeLabel = interview.type
      ? interview.type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Interview'

    try {
      const event = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: `${typeLabel} — ${app.company}`,
          description: [
            `Role: ${app.role}`,
            interview.interviewer ? `Interviewer: ${interview.interviewer}` : '',
            interview.notes || '',
          ]
            .filter(Boolean)
            .join('\n'),
          start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
          end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 30 },
              { method: 'popup', minutes: 1440 }, // 24 hours
            ],
          },
        },
      })

      // Store gcalEventId back in Sanity
      const eventId = event.data.id
      if (eventId) {
        await writeClient
          .patch(applicationId)
          .set({ [`interviewDates[_key=="${interview._key}"].gcalEventId`]: eventId })
          .commit()
        synced++
      }
    } catch (err) {
      console.error(`Failed to create calendar event for ${app.company} ${typeLabel}:`, err)
    }
  }

  revalidatePath('/tracker')
  return { synced }
}

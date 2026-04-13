'use server'

import { cookies } from 'next/headers'

export async function verifyTrackerPassword(password: string) {
  const correct = process.env.TRACKER_PASSWORD
  if (!correct) {
    throw new Error('TRACKER_PASSWORD environment variable is not set')
  }

  if (password !== correct) {
    return { success: false as const }
  }

  const cookieStore = await cookies()
  cookieStore.set('tracker_auth', correct, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/tracker',
  })

  return { success: true as const }
}

export async function isTrackerAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('tracker_auth')?.value
  return token === process.env.TRACKER_PASSWORD
}

export async function trackerLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('tracker_auth')
}

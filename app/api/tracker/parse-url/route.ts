import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseJobUrl } from '@/lib/tracker/parse-job-url'

export async function POST(request: NextRequest) {
  // Verify tracker auth
  const cookieStore = await cookies()
  const token = cookieStore.get('tracker_auth')?.value
  if (token !== process.env.TRACKER_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const url = body.url as string

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    new URL(url) // validate URL
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const parsed = await parseJobUrl(url)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Failed to parse job URL:', err)
    return NextResponse.json(
      { error: 'Failed to fetch job posting', jobUrl: url },
      { status: 502 },
    )
  }
}

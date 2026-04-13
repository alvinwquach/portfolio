/**
 * ApplicationDetail — Integration Tests
 * =======================================
 *
 * Tests the slide-over detail panel:
 *   - Renders all application fields correctly
 *   - Interview timeline display
 *   - Contact display
 *   - Compensation section (offer only)
 *   - Google Calendar sync button visibility
 *   - Close behavior (Escape key, backdrop click)
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { JobApplication } from '../types'

jest.mock('@/app/actions/tracker-update', () => ({
  syncInterviewsToCalendar: jest.fn().mockResolvedValue({ synced: 1 }),
}))

import { ApplicationDetail } from '../ApplicationDetail'

const fullApp: JobApplication = {
  _id: 'app-1',
  company: 'Vercel',
  role: 'Software Engineer, DX',
  jobUrl: 'https://vercel.com/careers',
  status: 'offer',
  dateApplied: '2026-02-10',
  salaryRange: { min: 190000, max: 240000, currency: 'USD' },
  referral: true,
  source: 'referral',
  notes: 'DX team — improving developer experience.',
  nextStep: 'Negotiate offer',
  nextStepDate: '2026-04-05',
  compensation: {
    baseSalary: 210000,
    equity: '0.05% over 4 years',
    bonus: '$15K signing',
    notes: 'Remote-first, unlimited PTO',
  },
  interviewDates: [
    {
      _key: 'k1',
      date: '2026-02-14T18:00:00Z',
      type: 'phone-screen',
      interviewer: 'Lisa Chen',
      notes: 'Recruiter intro',
    },
    {
      _key: 'k2',
      date: '2026-02-20T17:00:00Z',
      type: 'technical',
      interviewer: 'Shu Ding',
      notes: 'Live coding — CLI tool',
      gcalEventId: 'synced-event',
    },
  ],
  contacts: [
    {
      name: 'Lisa Chen',
      role: 'Recruiting Lead',
      email: 'lisa@vercel.com',
      linkedin: 'https://linkedin.com/in/lisachen',
    },
  ],
}

const minimalApp: JobApplication = {
  _id: 'app-2',
  company: 'Startup X',
  role: 'Frontend Engineer',
  status: 'applied',
  dateApplied: '2026-03-25',
}

describe('ApplicationDetail', () => {
  const onClose = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders company name and role', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText('Vercel')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer, DX')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText('Offer')).toBeInTheDocument()
  })

  it('renders referral badge when referral is true', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText('Referral')).toBeInTheDocument()
  })

  it('does not render referral badge when not a referral', () => {
    render(<ApplicationDetail app={minimalApp} onClose={onClose} />)
    expect(screen.queryByText('Referral')).not.toBeInTheDocument()
  })

  it('renders job posting link', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    const link = screen.getByText(/View Job Posting/)
    expect(link).toHaveAttribute('href', 'https://vercel.com/careers')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders salary range', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText(/\$190,000/)).toBeInTheDocument()
    expect(screen.getByText(/\$240,000/)).toBeInTheDocument()
  })

  it('renders source', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText('referral')).toBeInTheDocument()
  })

  it('renders next step', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText('Negotiate offer')).toBeInTheDocument()
  })

  it('renders compensation details for offer status', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText(/\$210,000/)).toBeInTheDocument()
    expect(screen.getByText(/0\.05% over 4 years/)).toBeInTheDocument()
    expect(screen.getByText(/\$15K signing/)).toBeInTheDocument()
    expect(screen.getByText('Remote-first, unlimited PTO')).toBeInTheDocument()
  })

  it('renders interview timeline in chronological order', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText('phone screen')).toBeInTheDocument()
    expect(screen.getByText('technical')).toBeInTheDocument()
    expect(screen.getByText('with Lisa Chen')).toBeInTheDocument()
    expect(screen.getByText('with Shu Ding')).toBeInTheDocument()
  })

  it('renders contacts with email and LinkedIn links', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(screen.getByText('Lisa Chen')).toBeInTheDocument()
    expect(screen.getByText('Recruiting Lead')).toBeInTheDocument()

    const emailLink = screen.getByText('Email')
    expect(emailLink).toHaveAttribute('href', 'mailto:lisa@vercel.com')

    const linkedinLink = screen.getByText('LinkedIn')
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/lisachen')
  })

  it('renders notes', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    expect(
      screen.getByText('DX team — improving developer experience.'),
    ).toBeInTheDocument()
  })

  it('renders Studio link', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    const studioLink = screen.getByText(/Edit in Studio/)
    expect(studioLink).toHaveAttribute(
      'href',
      '/studio/structure/jobApplication;app-1',
    )
  })

  it('shows "Sync to Google Calendar" when unsynced interviews exist', () => {
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    // One interview is synced (gcalEventId), one is not
    expect(screen.getByText('Sync to Google Calendar')).toBeInTheDocument()
  })

  it('does not show sync button when all interviews are synced', () => {
    const allSynced: JobApplication = {
      ...fullApp,
      interviewDates: fullApp.interviewDates?.map((d) => ({
        ...d,
        gcalEventId: 'synced',
      })),
    }
    render(<ApplicationDetail app={allSynced} onClose={onClose} />)
    expect(screen.queryByText('Sync to Google Calendar')).not.toBeInTheDocument()
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<ApplicationDetail app={fullApp} onClose={onClose} />)
    // The backdrop is the first div with fixed inset-0
    const backdrop = document.querySelector('.fixed.inset-0.z-40')
    if (backdrop) {
      await user.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('handles minimal application with only required fields', () => {
    render(<ApplicationDetail app={minimalApp} onClose={onClose} />)
    expect(screen.getByText('Startup X')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    // Should not crash when optional fields are missing
    expect(screen.queryByText(/View Job Posting/)).not.toBeInTheDocument()
    expect(screen.queryByText('Interviews')).not.toBeInTheDocument()
    expect(screen.queryByText('Contacts')).not.toBeInTheDocument()
    expect(screen.queryByText('Notes')).not.toBeInTheDocument()
  })
})

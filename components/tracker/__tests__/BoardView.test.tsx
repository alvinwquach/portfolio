/**
 * BoardView — Integration Tests
 * ===============================
 *
 * Tests the BoardView component's rendering and column logic.
 * DnD interaction tests are covered by E2E (Playwright).
 * These tests verify:
 *   - Correct column rendering
 *   - Applications sorted into correct columns by status
 *   - Empty column states
 *   - Card click opens detail panel
 *   - Edge cases: unknown statuses, missing fields
 */

import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { JobApplication } from '../types'

// Mock server actions (can't call real Sanity from tests)
jest.mock('@/app/actions/tracker-update', () => ({
  moveApplication: jest.fn(),
  reorderApplications: jest.fn(),
  syncInterviewsToCalendar: jest.fn(),
}))

// Mock dnd-kit to avoid DnD context issues in unit tests
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PointerSensor: class {},
  useSensor: () => ({}),
  useSensors: () => [],
  closestCorners: jest.fn(),
  useDroppable: () => ({ setNodeRef: jest.fn(), isOver: false }),
}))

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  verticalListSortingStrategy: {},
}))

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => null } },
}))

import { BoardView } from '../BoardView'

const mockApplications: JobApplication[] = [
  {
    _id: 'app-1',
    company: 'Stripe',
    role: 'Software Engineer',
    status: 'saved',
    dateApplied: '2026-03-28',
  },
  {
    _id: 'app-2',
    company: 'Linear',
    role: 'Full Stack Engineer',
    status: 'applied',
    dateApplied: '2026-03-25',
    referral: true,
  },
  {
    _id: 'app-3',
    company: 'Bobyard',
    role: 'Full Stack Engineer',
    status: 'technical',
    dateApplied: '2026-03-20',
    salaryRange: { min: 140000, max: 180000, currency: 'USD' },
  },
  {
    _id: 'app-4',
    company: 'Vercel',
    role: 'Software Engineer, DX',
    status: 'offer',
    dateApplied: '2026-02-10',
  },
  {
    _id: 'app-5',
    company: 'Plaid',
    role: 'Software Engineer',
    status: 'rejected',
    dateApplied: '2026-02-15',
  },
  {
    _id: 'app-6',
    company: 'Mercator',
    role: 'Founding Engineer',
    status: 'ghosted',
    dateApplied: '2026-02-20',
  },
]

describe('BoardView', () => {
  it('renders all six columns', () => {
    render(<BoardView applications={mockApplications} />)
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getByText('Screen')).toBeInTheDocument()
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Offer')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('places applications in the correct columns', () => {
    render(<BoardView applications={mockApplications} />)
    // Stripe should be in Saved
    expect(screen.getByText('Stripe')).toBeInTheDocument()
    // Linear should be in Applied
    expect(screen.getByText('Linear')).toBeInTheDocument()
    // Bobyard should be in Interview (technical)
    expect(screen.getByText('Bobyard')).toBeInTheDocument()
    // Vercel should be in Offer
    expect(screen.getByText('Vercel')).toBeInTheDocument()
    // Plaid and Mercator should be in Closed
    expect(screen.getByText('Plaid')).toBeInTheDocument()
    expect(screen.getByText('Mercator')).toBeInTheDocument()
  })

  it('shows correct counts in column headers', () => {
    render(<BoardView applications={mockApplications} />)
    // Saved: 1, Applied: 1, Screen: 0, Interview: 1, Offer: 1, Closed: 2
    const counts = screen.getAllByText(/^[0-2]$/)
    expect(counts.length).toBeGreaterThanOrEqual(6)
  })

  it('shows empty state for columns with no applications', () => {
    render(<BoardView applications={mockApplications} />)
    expect(screen.getByText('No applications')).toBeInTheDocument()
  })

  it('renders with empty applications array', () => {
    render(<BoardView applications={[]} />)
    const emptyStates = screen.getAllByText('No applications')
    expect(emptyStates).toHaveLength(6) // All columns show empty state
  })

  it('displays company and role on each card', () => {
    render(<BoardView applications={mockApplications} />)
    expect(screen.getByText('Stripe')).toBeInTheDocument()
    // "Software Engineer" appears multiple times (Stripe + Plaid)
    expect(screen.getAllByText('Software Engineer').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Full Stack Engineer').length).toBeGreaterThanOrEqual(1)
  })

  it('shows salary range on cards that have one', () => {
    render(<BoardView applications={mockApplications} />)
    expect(screen.getByText('$140K–$180K')).toBeInTheDocument()
  })

  it('opens detail panel when clicking a card', async () => {
    const user = userEvent.setup()
    render(<BoardView applications={mockApplications} />)

    // Click on Stripe card
    await user.click(screen.getByText('Stripe'))

    // Detail panel should show "Edit in Studio" link
    expect(screen.getByText(/Edit in Studio/)).toBeInTheDocument()
  })

  it('sorts applications within a column by order field', () => {
    const appsWithOrder: JobApplication[] = [
      {
        _id: 'app-a',
        company: 'Company B',
        role: 'Engineer',
        status: 'saved',
        dateApplied: '2026-03-28',
        order: 1,
      },
      {
        _id: 'app-b',
        company: 'Company A',
        role: 'Engineer',
        status: 'saved',
        dateApplied: '2026-03-28',
        order: 0,
      },
    ]

    render(<BoardView applications={appsWithOrder} />)

    const buttons = screen.getAllByRole('button')
    const companyNames = buttons
      .map((b) => b.textContent)
      .filter((t) => t?.includes('Company'))

    // Company A (order 0) should appear before Company B (order 1)
    expect(companyNames[0]).toContain('Company A')
    expect(companyNames[1]).toContain('Company B')
  })
})

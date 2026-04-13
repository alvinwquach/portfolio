/**
 * TrackerAuthGate — Integration Tests
 * =====================================
 *
 * Tests the password gate component:
 *   - Shows children when already authenticated
 *   - Shows password form when not authenticated
 *   - Handles correct/incorrect password submission
 *   - Disables submit button when password is empty
 *   - Shows error message for wrong password
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockVerify = jest.fn()

jest.mock('@/app/actions/tracker-auth', () => ({
  verifyTrackerPassword: (...args: unknown[]) => mockVerify(...args),
}))

import { TrackerAuthGate } from '../TrackerAuthGate'

describe('TrackerAuthGate', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children when isAuthenticated is true', () => {
    render(
      <TrackerAuthGate isAuthenticated={true}>
        <div data-testid="protected-content">Tracker Content</div>
      </TrackerAuthGate>,
    )
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument()
  })

  it('shows password form when isAuthenticated is false', () => {
    render(
      <TrackerAuthGate isAuthenticated={false}>
        <div data-testid="protected-content">Tracker Content</div>
      </TrackerAuthGate>,
    )
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('Enter')).toBeInTheDocument()
  })

  it('disables submit button when password is empty', () => {
    render(
      <TrackerAuthGate isAuthenticated={false}>
        <div>Content</div>
      </TrackerAuthGate>,
    )
    const button = screen.getByText('Enter')
    expect(button).toBeDisabled()
  })

  it('enables submit button when password is entered', async () => {
    const user = userEvent.setup()
    render(
      <TrackerAuthGate isAuthenticated={false}>
        <div>Content</div>
      </TrackerAuthGate>,
    )
    const input = screen.getByPlaceholderText('Password')
    await user.type(input, 'my-password')
    expect(screen.getByText('Enter')).toBeEnabled()
  })

  it('shows children after successful password submission', async () => {
    mockVerify.mockResolvedValue({ success: true })
    const user = userEvent.setup()

    render(
      <TrackerAuthGate isAuthenticated={false}>
        <div data-testid="protected-content">Tracker Content</div>
      </TrackerAuthGate>,
    )

    const input = screen.getByPlaceholderText('Password')
    await user.type(input, 'correct-password')
    await user.click(screen.getByText('Enter'))

    expect(await screen.findByTestId('protected-content')).toBeInTheDocument()
    expect(mockVerify).toHaveBeenCalledWith('correct-password')
  })

  it('shows error message for incorrect password', async () => {
    mockVerify.mockResolvedValue({ success: false })
    const user = userEvent.setup()

    render(
      <TrackerAuthGate isAuthenticated={false}>
        <div>Content</div>
      </TrackerAuthGate>,
    )

    const input = screen.getByPlaceholderText('Password')
    await user.type(input, 'wrong-password')
    await user.click(screen.getByText('Enter'))

    expect(await screen.findByText('Incorrect password')).toBeInTheDocument()
  })

  it('clears password field after failed attempt', async () => {
    mockVerify.mockResolvedValue({ success: false })
    const user = userEvent.setup()

    render(
      <TrackerAuthGate isAuthenticated={false}>
        <div>Content</div>
      </TrackerAuthGate>,
    )

    const input = screen.getByPlaceholderText('Password') as HTMLInputElement
    await user.type(input, 'wrong-password')
    await user.click(screen.getByText('Enter'))

    await screen.findByText('Incorrect password')
    expect(input.value).toBe('')
  })

  it('shows loading state during password verification', async () => {
    // Make verify hang to observe loading state
    let resolveVerify: (v: { success: boolean }) => void
    mockVerify.mockImplementation(
      () => new Promise((resolve) => { resolveVerify = resolve }),
    )
    const user = userEvent.setup()

    render(
      <TrackerAuthGate isAuthenticated={false}>
        <div>Content</div>
      </TrackerAuthGate>,
    )

    const input = screen.getByPlaceholderText('Password')
    await user.type(input, 'password')
    await user.click(screen.getByText('Enter'))

    expect(screen.getByText('Checking...')).toBeInTheDocument()

    // Resolve the promise
    resolveVerify!({ success: true })
  })
})

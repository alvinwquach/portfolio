/**
 * Schedule Flow — E2E Tests
 * =========================
 *
 * WHAT ARE E2E TESTS?
 * End-to-end (E2E) tests simulate a real user interacting with the
 * application in a real browser. Unlike unit tests (which test functions),
 * E2E tests navigate pages, click buttons, fill forms, and verify
 * what the user actually sees.
 *
 * HOW PLAYWRIGHT WORKS:
 * Playwright launches a real browser (Chromium, Firefox, or WebKit),
 * navigates to your running app, and executes test steps.
 *
 * MOCKING IN E2E:
 * We mock the API responses using Playwright's page.route() to intercept
 * network requests. This means we don't need a real Sanity instance or
 * Google Calendar connection — we control what the API returns.
 *
 * HOW TO RUN:
 *   npx playwright test tests/e2e/scheduling/
 */

import { test, expect } from '@playwright/test'
import type { WeekDay, ApiResponse } from '@/types/scheduling'

/**
 * Mock week data — a typical week with some available slots.
 *
 * This is what the /api/schedule/slots endpoint would return.
 * We generate realistic-looking data for Tuesday and Wednesday
 * with a few available slots.
 */
function createMockWeekData(): WeekDay[] {
  return [
    { date: '2030-01-07', dayName: 'Mon', dayNumber: 7, isToday: false, slots: [
      { start: '2030-01-07T09:00:00.000Z', end: '2030-01-07T09:30:00.000Z', available: true },
      { start: '2030-01-07T09:30:00.000Z', end: '2030-01-07T10:00:00.000Z', available: true },
      { start: '2030-01-07T10:00:00.000Z', end: '2030-01-07T10:30:00.000Z', available: false },
    ]},
    { date: '2030-01-08', dayName: 'Tue', dayNumber: 8, isToday: false, slots: [
      { start: '2030-01-08T14:00:00.000Z', end: '2030-01-08T14:30:00.000Z', available: true },
      { start: '2030-01-08T15:00:00.000Z', end: '2030-01-08T15:30:00.000Z', available: true },
    ]},
    { date: '2030-01-09', dayName: 'Wed', dayNumber: 9, isToday: false, slots: [
      { start: '2030-01-09T11:00:00.000Z', end: '2030-01-09T11:30:00.000Z', available: true },
    ]},
    { date: '2030-01-10', dayName: 'Thu', dayNumber: 10, isToday: false, slots: [] },
    { date: '2030-01-11', dayName: 'Fri', dayNumber: 11, isToday: false, slots: [] },
    { date: '2030-01-12', dayName: 'Sat', dayNumber: 12, isToday: false, slots: [] },
    { date: '2030-01-13', dayName: 'Sun', dayNumber: 13, isToday: false, slots: [] },
  ]
}

test.describe('Schedule Page — Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    // ── Mock the slots API ───────────────────────────────
    // Intercept all requests to /api/schedule/slots and return mock data
    await page.route('**/api/schedule/slots*', async (route) => {
      const response: ApiResponse<WeekDay[]> = {
        success: true,
        data: createMockWeekData(),
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      })
    })
  })

  test('page loads with sidebar and calendar', async ({ page }) => {
    await page.goto('/schedule')

    // Verify sidebar content is visible
    await expect(page.getByText('Request a Meeting')).toBeVisible()
    await expect(page.getByText('Alvin Quach')).toBeVisible()

    // Verify calendar grid is visible (day headers)
    await expect(page.getByText('Mon')).toBeVisible()
    await expect(page.getByText('Tue')).toBeVisible()
  })

  test('clicking a slot highlights it and shows Continue button', async ({ page }) => {
    await page.goto('/schedule')

    // Wait for slots to load
    await page.waitForSelector('.slot-available')

    // Click the first available slot
    const firstSlot = page.locator('.slot-available').first()
    await firstSlot.click()

    // Verify it becomes selected
    await expect(page.locator('.slot-selected')).toBeVisible()

    // Verify Continue button appears
    await expect(page.getByText('Continue')).toBeVisible()
  })

  test('clicking Continue shows the booking form', async ({ page }) => {
    await page.goto('/schedule')
    await page.waitForSelector('.slot-available')

    // Select a slot
    await page.locator('.slot-available').first().click()

    // Click Continue
    await page.getByText('Continue').click()

    // Verify form fields are visible
    await expect(page.getByPlaceholder('Jane Smith')).toBeVisible()
    await expect(page.getByPlaceholder('jane@company.com')).toBeVisible()
    await expect(page.getByText('What would you like to discuss?')).toBeVisible()
  })

  test('form submission shows success message', async ({ page }) => {
    // Mock the request API to return success
    await page.route('**/api/schedule/request', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    await page.goto('/schedule')
    await page.waitForSelector('.slot-available')

    // Select slot and continue
    await page.locator('.slot-available').first().click()
    await page.getByText('Continue').click()

    // Fill in the form
    await page.getByPlaceholder('Jane Smith').fill('Test User')
    await page.getByPlaceholder('jane@company.com').fill('test@example.com')
    await page.getByPlaceholder("I'd like to discuss...").fill('This is a test booking request for E2E testing purposes.')

    // Submit
    await page.getByText('Submit Request').click()

    // Verify success message
    await expect(page.getByText('Request submitted!')).toBeVisible()
    await expect(page.getByText('Check your email')).toBeVisible()
  })
})

test.describe('Schedule Page — Error States', () => {
  test('shows error when slot becomes unavailable', async ({ page }) => {
    // Mock slots API
    await page.route('**/api/schedule/slots*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: createMockWeekData() }),
      })
    })

    // Mock request API to return slot unavailable
    await page.route('**/api/schedule/request', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Slot unavailable',
          code: 'SLOT_UNAVAILABLE',
        }),
      })
    })

    await page.goto('/schedule')
    await page.waitForSelector('.slot-available')

    // Select, continue, fill form, submit
    await page.locator('.slot-available').first().click()
    await page.getByText('Continue').click()
    await page.getByPlaceholder('Jane Smith').fill('Test User')
    await page.getByPlaceholder('jane@company.com').fill('test@example.com')
    await page.getByPlaceholder("I'd like to discuss...").fill('Testing the unavailable slot error message display.')
    await page.getByText('Submit Request').click()

    // Verify error message
    await expect(page.getByText('just taken')).toBeVisible()
  })
})

test.describe('Schedule Page — No Availability', () => {
  test('shows empty state when no slots available', async ({ page }) => {
    // Mock with empty slots
    const emptyWeek: WeekDay[] = Array.from({ length: 7 }, (_, i) => ({
      date: `2030-01-0${7 + i}`,
      dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      dayNumber: 7 + i,
      isToday: false,
      slots: [],
    }))

    await page.route('**/api/schedule/slots*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: emptyWeek }),
      })
    })

    await page.goto('/schedule')

    // Should show empty state message
    await expect(page.getByText('No available slots')).toBeVisible()
  })
})

test.describe('Error Page', () => {
  test('shows correct message for INVALID_TOKEN', async ({ page }) => {
    await page.goto('/schedule/error?code=INVALID_TOKEN')
    await expect(page.getByText('invalid')).toBeVisible()
  })

  test('shows correct message for EXPIRED_TOKEN', async ({ page }) => {
    await page.goto('/schedule/error?code=EXPIRED_TOKEN')
    await expect(page.getByText('expired')).toBeVisible()
  })

  test('offers email contact for all errors', async ({ page }) => {
    await page.goto('/schedule/error?code=NOT_FOUND')
    await expect(page.getByText('Email me directly')).toBeVisible()
  })
})

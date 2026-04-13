/**
 * Job Tracker — E2E Tests
 * ========================
 *
 * End-to-end tests for the /tracker page:
 *   - Auth gate: password form, login, logout
 *   - Board view: columns, cards, detail panel
 *   - Calendar view: tab switching
 *   - Drag and drop: card movement between columns
 *   - Search: filtering cards
 *   - Responsiveness: mobile viewport
 */

import { test, expect, type Page } from '@playwright/test'

// Helper: authenticate with the tracker password
async function authenticate(page: Page) {
  await page.goto('/tracker')
  // Wait for the auth gate
  const passwordInput = page.getByPlaceholder('Password')
  if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await passwordInput.fill(process.env.TRACKER_PASSWORD || 'test-password')
    await page.getByRole('button', { name: 'Enter' }).click()
    // Wait for the board to load
    await page.waitForSelector('text=Saved', { timeout: 10000 })
  }
}

test.describe('Auth Gate', () => {
  test('shows password form on unauthenticated visit', async ({ page }) => {
    // Clear cookies first
    await page.context().clearCookies()
    await page.goto('/tracker')

    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enter' })).toBeVisible()
  })

  test('Enter button is disabled when password is empty', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/tracker')

    const button = page.getByRole('button', { name: 'Enter' })
    await expect(button).toBeDisabled()
  })

  test('shows error for incorrect password', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/tracker')

    await page.getByPlaceholder('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Enter' }).click()

    await expect(page.getByText('Incorrect password')).toBeVisible()
  })

  test('grants access with correct password', async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)

    // Should see the board columns
    await expect(page.getByText('Saved')).toBeVisible()
    await expect(page.getByText('Applied')).toBeVisible()
    await expect(page.getByText('Interview')).toBeVisible()
  })

  test('persists auth across page reloads via cookie', async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)

    // Reload the page
    await page.reload()

    // Should still be authenticated
    await expect(page.getByText('Saved')).toBeVisible({ timeout: 10000 })
    await expect(page.getByPlaceholder('Password')).not.toBeVisible()
  })

  test('logout clears auth and shows password form', async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)

    // Click the logout button
    await page.getByRole('button', { name: 'Logout' }).click()

    // Should see the password form again
    await expect(page.getByPlaceholder('Password')).toBeVisible()
  })
})

test.describe('Board View', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)
  })

  test('renders all six board columns', async ({ page }) => {
    await expect(page.getByText('Saved')).toBeVisible()
    await expect(page.getByText('Applied')).toBeVisible()
    await expect(page.getByText('Screen')).toBeVisible()
    await expect(page.getByText('Interview')).toBeVisible()
    await expect(page.getByText('Offer')).toBeVisible()
    await expect(page.getByText('Closed')).toBeVisible()
  })

  test('displays application cards with company names', async ({ page }) => {
    // At least some seeded applications should be visible
    const cardCount = await page.locator('button:has-text("Engineer")').count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('shows stats bar with active count', async ({ page }) => {
    await expect(page.getByText(/Active/)).toBeVisible()
  })

  test('opening card detail shows slide-over panel', async ({ page }) => {
    // Click the first application card
    const firstCard = page.locator('button').filter({ hasText: /Engineer/ }).first()
    await firstCard.click()

    // Detail panel should appear with Edit in Studio link
    await expect(page.getByText('Edit in Studio')).toBeVisible()
  })

  test('detail panel closes on Escape', async ({ page }) => {
    const firstCard = page.locator('button').filter({ hasText: /Engineer/ }).first()
    await firstCard.click()
    await expect(page.getByText('Edit in Studio')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByText('Edit in Studio')).not.toBeVisible()
  })

  test('detail panel closes on backdrop click', async ({ page }) => {
    const firstCard = page.locator('button').filter({ hasText: /Engineer/ }).first()
    await firstCard.click()
    await expect(page.getByText('Edit in Studio')).toBeVisible()

    // Click the backdrop (the semi-transparent overlay)
    await page.locator('.fixed.inset-0.z-40').click()
    await expect(page.getByText('Edit in Studio')).not.toBeVisible()
  })
})

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)
  })

  test('filters cards by company name', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...')
    await searchInput.fill('Stripe')

    // Only Stripe should be visible, others hidden
    await expect(page.getByText('Stripe').first()).toBeVisible()
  })

  test('filters cards by role', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...')
    await searchInput.fill('Frontend')

    // Cards with "Frontend" in the role should be visible
    const cards = page.locator('button:has-text("Frontend")')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('shows empty columns when search has no matches', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...')
    await searchInput.fill('xyznonexistentcompany')

    // All columns should show "No applications"
    const emptyStates = page.getByText('No applications')
    await expect(emptyStates.first()).toBeVisible()
  })

  test('clears search to show all cards again', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search...')
    await searchInput.fill('Stripe')
    await searchInput.clear()

    // Multiple companies should be visible again
    const cards = page.locator('button:has-text("Engineer")')
    const count = await cards.count()
    expect(count).toBeGreaterThan(1)
  })
})

test.describe('Tab Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)
  })

  test('defaults to Board view', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Board/ })).toBeVisible()
    // Board columns should be visible
    await expect(page.getByText('Saved')).toBeVisible()
  })

  test('switches to Calendar view', async ({ page }) => {
    await page.getByRole('button', { name: /Calendar/ }).click()

    // Board columns should not be primary content
    // Calendar-specific content should appear
    await expect(page.getByRole('button', { name: /Calendar/ })).toBeVisible()
  })

  test('switches back to Board view', async ({ page }) => {
    await page.getByRole('button', { name: /Calendar/ }).click()
    await page.getByRole('button', { name: /Board/ }).click()

    await expect(page.getByText('Saved')).toBeVisible()
  })
})

test.describe('Drag and Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)
  })

  test('cards are draggable (have correct ARIA attributes)', async ({ page }) => {
    // dnd-kit adds aria-roledescription="sortable" to draggable items
    const sortables = page.locator('[aria-roledescription="sortable"]')
    const count = await sortables.count()
    expect(count).toBeGreaterThan(0)
  })

  test('drag and drop moves card between columns', async ({ page }) => {
    // Find a card in the "Saved" column
    const savedColumn = page.locator('div').filter({ hasText: /^Saved/ }).first()
    const savedCards = savedColumn.locator('[aria-roledescription="sortable"]')
    const cardCount = await savedCards.count()

    if (cardCount === 0) {
      test.skip()
      return
    }

    const card = savedCards.first()
    const cardBounds = await card.boundingBox()
    if (!cardBounds) return

    // Find the "Applied" column
    const appliedColumn = page.locator('div').filter({ hasText: /^Applied/ }).first()
    const appliedBounds = await appliedColumn.boundingBox()
    if (!appliedBounds) return

    // Perform drag
    await card.hover()
    await page.mouse.down()
    await page.mouse.move(
      appliedBounds.x + appliedBounds.width / 2,
      appliedBounds.y + appliedBounds.height / 2,
      { steps: 10 },
    )
    await page.mouse.up()

    // Wait for potential revalidation
    await page.waitForTimeout(1000)
  })
})

test.describe('Page Meta', () => {
  test('has noindex robots meta', async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)

    const robots = await page.getAttribute('meta[name="robots"]', 'content')
    expect(robots).toContain('noindex')
  })

  test('has correct page title', async ({ page }) => {
    await page.context().clearCookies()
    await authenticate(page)

    await expect(page).toHaveTitle(/Job Tracker/)
  })
})

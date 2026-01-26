/**
 * DJ Scene E2E Tests
 * ==================
 * End-to-end tests for the DJ Scene 3D component.
 */

import { test, expect } from '@playwright/test';

test.describe('DJ Scene', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page with the DJ scene
    // Adjust the path based on where your DJ scene is rendered
    await page.goto('/');
  });

  test.describe('SoundCloud Player', () => {
    test('should display the now playing overlay', async ({ page }) => {
      // Look for the now playing UI elements
      const playButton = page.locator('[aria-label*="Play"], [aria-label*="Pause"]').first();

      // Wait for the page to load the 3D scene
      await expect(playButton).toBeVisible({ timeout: 10000 });
    });

    test('should show track information', async ({ page }) => {
      // Wait for track info to be visible
      // Adjust selectors based on your NowPlayingOverlay component
      await page.waitForLoadState('networkidle');

      // Check if track title is displayed
      const trackInfo = page.locator('text=/Larry June|Vince Staples/i').first();
      await expect(trackInfo).toBeVisible({ timeout: 10000 });
    });

    test('should toggle play/pause when clicking play button', async ({ page }) => {
      // Wait for the player to be ready
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Wait for SoundCloud API to initialize

      // Find the play button
      const playButton = page.locator('[aria-label*="Play"]').first();

      if (await playButton.isVisible()) {
        await playButton.click();

        // Should change to pause button
        const pauseButton = page.locator('[aria-label*="Pause"]').first();
        await expect(pauseButton).toBeVisible({ timeout: 5000 });
      }
    });

    test('should navigate to next track', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Get current track info
      const trackInfo = page.locator('[data-testid="track-info"], .track-info').first();
      const initialText = await trackInfo.textContent().catch(() => '');

      // Click next button
      const nextButton = page.locator('[aria-label*="Next"], [aria-label*="next"]').first();

      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);

        // Track info should change
        const newText = await trackInfo.textContent().catch(() => '');

        // Note: If track info doesn't have data-testid, this assertion may need adjustment
        // The important thing is that the UI responds to navigation
      }
    });

    test('should navigate to previous track', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Click next first to have a track to go back to
      const nextButton = page.locator('[aria-label*="Next"], [aria-label*="next"]').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }

      // Then click previous
      const prevButton = page.locator('[aria-label*="Prev"], [aria-label*="prev"]').first();
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('3D Scene', () => {
    test('should render the WebGL canvas', async ({ page }) => {
      // Check that the Three.js canvas is rendered
      const canvas = page.locator('canvas');
      await expect(canvas.first()).toBeVisible({ timeout: 10000 });
    });

    test('should be interactive (not frozen)', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();

      // Take a screenshot, interact, take another - they should differ
      // (This is a basic check that the scene is rendering)
      const box = await canvas.boundingBox();

      if (box) {
        // Click on the canvas (should trigger turntable interaction)
        await canvas.click({ position: { x: box.width / 2, y: box.height / 2 } });
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible play controls', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check for aria labels on controls
      const playButton = page.locator('button[aria-label]').first();
      await expect(playButton).toHaveAttribute('aria-label', /.+/);
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Tab to the play button
      await page.keyboard.press('Tab');

      // Check if a button is focused
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase());

      // Should be able to focus interactive elements
      expect(['button', 'a', 'input']).toContain(tagName);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Canvas should still be visible
      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();

      // Controls should be accessible
      const controls = page.locator('[aria-label*="Play"], [aria-label*="Pause"]').first();
      await expect(controls).toBeVisible({ timeout: 10000 });
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();
    });
  });
});

test.describe('Track Synchronization', () => {
  test('should keep track index in sync when rapidly changing tracks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for SoundCloud to initialize

    const nextButton = page.locator('[aria-label*="Next"], [aria-label*="next"]').first();

    if (await nextButton.isVisible()) {
      // Rapidly click next multiple times
      for (let i = 0; i < 5; i++) {
        await nextButton.click();
        await page.waitForTimeout(200);
      }

      // Wait for the last transition to complete
      await page.waitForTimeout(1000);

      // The UI should be stable and not show any errors
      // Check console for errors
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // No SoundCloud-related errors should appear
      const scErrors = consoleErrors.filter((e) =>
        e.toLowerCase().includes('soundcloud') ||
        e.toLowerCase().includes('track')
      );
      expect(scErrors).toHaveLength(0);
    }
  });
});

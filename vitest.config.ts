/**
 * Vitest Configuration
 * ====================
 *
 * WHAT IS VITEST?
 * Vitest is a test runner (like Jest) that's built for Vite-based projects.
 * We use it alongside Jest (which handles the existing portfolio tests)
 * specifically for the scheduling system tests.
 *
 * WHY VITEST ALONGSIDE JEST?
 * The portfolio already uses Jest for its existing tests.
 * The scheduling system spec requires Vitest.
 * Rather than migrating all existing tests, we add Vitest for new tests.
 *
 * HOW TO RUN:
 *   npx vitest run                    — Run all Vitest tests once
 *   npx vitest                        — Watch mode (re-run on file changes)
 *   npx vitest run tests/unit/        — Run only unit tests
 *   npx vitest run tests/integration/ — Run only integration tests
 */

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Where Vitest looks for test files
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    // Environment: jsdom for React components, node for pure logic
    environment: 'node',
    // Setup files that run before each test file
    globals: true,
  },
  resolve: {
    // Path aliases — must match tsconfig.json paths
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})

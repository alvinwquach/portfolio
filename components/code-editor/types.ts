/**
 * Code Editor Types
 * =================
 * Shared TypeScript types for the code editor component family.
 *
 * Why centralize types?
 * ---------------------
 * 1. Single source of truth - change once, update everywhere
 * 2. Better IDE support - autocomplete works across all components
 * 3. Easier refactoring - TypeScript catches breaking changes
 * 4. Documentation - types serve as contracts between components
 *
 * Design Decision: Union Types vs Enums
 * -------------------------------------
 * We use string literal unions ("typescript" | "python") instead of enums because:
 * - Smaller bundle size (enums generate extra JS code)
 * - Better type inference in switch statements
 * - Easier to use with object literals
 * - More idiomatic in modern TypeScript
 *
 * When to use enums instead:
 * - Need reverse mapping (Enum[0] → "value")
 * - Need to iterate over all values
 * - Values need to be computed at runtime
 */

/**
 * Supported programming languages for code display.
 * Add new languages here when expanding language support.
 */
export type Language = 'typescript' | 'python';

/**
 * Available file tabs in the editor.
 * Each tab represents a different aspect of the developer profile.
 */
export type TabName = 'developer' | 'skills' | 'career';

/**
 * Bottom panel tabs for additional context.
 */
export type PanelTab = 'output' | 'terminal' | 'problems';

/**
 * Configuration for a single file tab.
 * Used to render tab buttons and file tree items.
 */
export interface TabConfig {
  /** Unique identifier matching TabName */
  id: TabName;
  /** Display label for the tab */
  label: string;
  /** Icon color when using TypeScript */
  tsColor: string;
  /** Icon color when using Python */
  pyColor: string;
  /** Active tab indicator color */
  activeColor: string;
}

/**
 * Props passed to code content generator functions.
 * Keeps generator functions pure and testable.
 */
export interface CodeGeneratorProps {
  name: string;
  role: string;
  location: string;
  skills: string[];
  openToRoles: string[];
  strengths: string[];
  previousCareers?: Array<{
    title?: string;
    skills?: string[];
  }>;
  totalSkillCount: number;
}

/**
 * Predefined tab configurations.
 * Centralized here to avoid magic strings scattered across components.
 *
 * Pattern: Configuration Objects
 * ------------------------------
 * Instead of hardcoding values in JSX, we extract them into config objects.
 * Benefits:
 * - Easy to add/remove tabs without touching render logic
 * - Can be imported in tests for consistency
 * - Enables data-driven rendering with .map()
 */
// MODIFIED(feat/design-system): Late Night Session palette
export const TAB_CONFIGS: TabConfig[] = [
  {
    id: 'developer',
    label: 'Developer',
    tsColor: 'text-info',
    pyColor: 'text-warning',
    activeColor: 'border-t-success',
  },
  {
    id: 'skills',
    label: 'skills',
    tsColor: 'text-accent-warm',
    pyColor: 'text-warning',
    activeColor: 'border-t-accent-warm',
  },
  {
    id: 'career',
    label: 'career',
    tsColor: 'text-accent',
    pyColor: 'text-warning',
    activeColor: 'border-t-accent',
  },
];

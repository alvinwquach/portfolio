/**
 * Code Generators Index
 * =====================
 * Barrel file that re-exports all code generators.
 *
 * What is a barrel file?
 * ----------------------
 * A barrel is an index file that re-exports modules from a directory.
 * It provides a cleaner import API for consumers.
 *
 * Without barrel:
 *   import { generateDeveloperCode } from './code-generators/developer';
 *   import { generateSkillsCode } from './code-generators/skills';
 *   import { generateCareerCode } from './code-generators/career';
 *
 * With barrel:
 *   import { generateDeveloperCode, generateSkillsCode, generateCareerCode } from './code-generators';
 *
 * Trade-offs:
 * - Pro: Cleaner imports, easier refactoring
 * - Con: Can hurt tree-shaking if not careful (import what you use)
 * - Con: Circular dependency risk (we avoid by keeping generators pure)
 */

export { generateDeveloperCode } from './developer';
export { generateSkillsCode } from './skills';
export { generateCareerCode } from './career';

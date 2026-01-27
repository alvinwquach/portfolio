/**
 * Skills Code Generator
 * =====================
 * Generates the skills module code for both TypeScript and Python.
 *
 * This module demonstrates:
 * - Data structure choices (Object vs Map vs Array vs Set)
 * - Type inference with 'as const'
 * - Generic functions with constraints
 * - Time complexity considerations (O(1) vs O(n))
 *
 * Educational Focus
 * -----------------
 * The comments teach developers to think about:
 * 1. Which data structure fits the use case
 * 2. How to derive types from values (DRY principle)
 * 3. Performance implications of different approaches
 */

import type { Language } from '../types';

interface SkillGroup {
  category: string;
  skills: Array<{ name: string }>;
}

/**
 * Generates skills module code with educational comments.
 *
 * @param skillGroups - Optional skill data from CMS
 * @param lang - Target programming language
 * @returns Generated code string
 */
export function generateSkillsCode(skillGroups: SkillGroup[] | undefined, lang: Language): string {
  if (lang === 'python') {
    return generatePythonCode(skillGroups);
  }
  return generateTypeScriptCode(skillGroups);
}

function generatePythonCode(skillGroups?: SkillGroup[]): string {
  if (!skillGroups || skillGroups.length === 0) {
    return `"""
Technical Skills Module
=======================
Demonstrates Python data structures and type annotations.
"""
from typing import Dict, List, Set

# Type alias for readability
# Dict[K, V] = dictionary with key type K and value type V
SkillsMap = Dict[str, List[str]]


"""
Data Structure Choice: dict vs list vs set
------------------------------------------
We use a dict here because:
- Need O(1) lookup by category name
- Categories are unique keys
- Order preserved in Python 3.7+

When to use list:
- Order matters and you need index access
- Duplicates are allowed
- You'll iterate more than lookup

When to use set:
- Only care about membership (is X in collection?)
- Need O(1) lookup without key-value pairs
- Duplicates should be eliminated
"""
skills: SkillsMap = {
    "frontend": ["React", "Next.js", "TypeScript", "Tailwind"],
    "backend": ["Node.js", "GraphQL", "PostgreSQL"],
    "tools": ["Git", "Docker", "Vercel"],
}


def get_categories() -> List[str]:
    """
    Return all skill category names.

    list(dict.keys()) converts dict_keys view to a list.
    In most cases you can iterate dict.keys() directly.
    """
    return list(skills.keys())


def has_skill(skill: str) -> bool:
    """
    Check if a skill exists in any category.

    Time complexity: O(n) where n = total skills
    For frequent lookups, convert to set first:

        all_skills: Set[str] = set()
        for category in skills.values():
            all_skills.update(category)
        # Now lookups are O(1): skill in all_skills

    The 'any()' function short-circuits on first True.
    """
    return any(skill in category for category in skills.values())


# Alternative: precompute set for O(1) lookups
all_skills: Set[str] = {
    skill
    for category in skills.values()
    for skill in category
}`;
  }

  const totalSkills = skillGroups.reduce((a, g) => a + g.skills.length, 0);
  const categoriesStr = skillGroups
    .map((group) => {
      const categoryName = group.category.replace(/-/g, '_').toLowerCase();
      const skillsList = group.skills.map((s) => `"${s.name}"`).join(', ');
      return `    "${categoryName}": [${skillsList}]`;
    })
    .join(',\n');

  return `"""
Technical Skills (${totalSkills} total)
=======================
"""
from typing import Dict, List, Set

SkillsMap = Dict[str, List[str]]

skills: SkillsMap = {
${categoriesStr}
}


def get_categories() -> List[str]:
    return list(skills.keys())


def has_skill(skill: str) -> bool:
    # any() short-circuits on first True
    return any(skill in cat for cat in skills.values())


# Set comprehension for O(1) lookups
all_skills: Set[str] = {
    skill for cat in skills.values() for skill in cat
}`;
}

function generateTypeScriptCode(skillGroups?: SkillGroup[]): string {
  if (!skillGroups || skillGroups.length === 0) {
    return `/**
 * Technical Skills Module
 * =======================
 * Demonstrates different data structure choices in TypeScript.
 */

/**
 * Data Structure Choice: Object vs Map vs Array
 * ---------------------------------------------
 * We use an object here because:
 * - Keys are known at compile time (categories)
 * - We want O(1) lookup by category name
 * - TypeScript can infer literal types from keys
 *
 * When to use Map instead:
 * - Keys are dynamic/unknown at compile time
 * - Need to preserve insertion order (guaranteed in Map)
 * - Keys aren't strings (Map allows any type as key)
 *
 * When to use Array:
 * - Order matters and you need index-based access
 * - You'll iterate more than lookup
 */

/**
 * 'as const' Assertion
 * --------------------
 * Without 'as const': skills.frontend has type string[]
 * With 'as const': skills.frontend has type readonly ["React", ...]
 *
 * Benefits:
 * - Prevents accidental mutations (push, pop, etc.)
 * - TypeScript knows exact values, not just "some string"
 * - Better autocomplete and type narrowing
 */
export const skills = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind"],
  backend: ["Node.js", "GraphQL", "PostgreSQL"],
  tools: ["Git", "Docker", "Vercel"]
} as const;

/**
 * Type Extraction with keyof typeof
 * ---------------------------------
 * typeof skills = the type of the skills object
 * keyof typeof skills = union of all keys: "frontend" | "backend" | "tools"
 *
 * This is called "deriving types from values" - we let the data
 * define the type rather than duplicating it manually.
 */
type SkillCategory = keyof typeof skills;

/**
 * Generic Function with Constraints
 * ---------------------------------
 * <T extends SkillCategory> means T can be any SkillCategory value.
 * This gives us:
 * - Type-safe parameter: only valid categories allowed
 * - Inferred return type: getSkills("frontend") returns the exact array type
 */
function getSkills<T extends SkillCategory>(category: T) {
  return skills[category];
}

/**
 * Arrow Function with Type Annotation
 * -----------------------------------
 * (skill: string): boolean defines parameter and return types.
 * Object.values() returns array of values (the skill arrays)
 * .flat() flattens nested arrays: [[a,b], [c]] → [a,b,c]
 * .includes() checks if element exists (O(n) lookup)
 *
 * For frequent lookups, consider converting to Set (O(1) lookup):
 * const skillSet = new Set(Object.values(skills).flat());
 */
const hasSkill = (skill: string): boolean =>
  Object.values(skills).flat().includes(skill);

export { skills, getSkills, hasSkill };`;
  }

  const totalSkills = skillGroups.reduce((a, g) => a + g.skills.length, 0);
  const categoriesStr = skillGroups
    .map((group) => {
      const categoryName = group.category.replace(/-/g, '_').toLowerCase();
      const skillsList = group.skills.map((s) => `"${s.name}"`).join(', ');
      return `  ${categoryName}: [${skillsList}]`;
    })
    .join(',\n');

  return `/**
 * Technical Skills (${totalSkills} total)
 * =======================
 */

// 'as const' = deeply readonly + literal type inference
export const skills = {
${categoriesStr}
} as const;

// Derive type from value - no manual duplication
type SkillCategory = keyof typeof skills;

// Generic constraint ensures only valid categories
function getSkills<T extends SkillCategory>(category: T) {
  return skills[category];
}

// flat() combines nested arrays, includes() searches
const hasSkill = (skill: string): boolean =>
  Object.values(skills).flat().includes(skill);

export { skills, getSkills, hasSkill };`;
}

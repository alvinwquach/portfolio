/**
 * Career Code Generator
 * =====================
 * Generates the career journey code for both TypeScript and Python.
 *
 * This module demonstrates:
 * - Interfaces with readonly properties
 * - Immutability patterns (frozen dataclass, as const)
 * - Array vs Object vs Map trade-offs
 * - flatMap for nested data transformation
 * - Python Enums vs string literals
 *
 * Educational Focus
 * -----------------
 * Comments explain:
 * 1. Why we choose specific data structures
 * 2. Immutability benefits and trade-offs
 * 3. How readonly differs from const
 * 4. Set comprehensions for deduplication
 */

import type { Language } from '../types';

interface PreviousCareer {
  title?: string;
  transferableSkills?: string[];
}

interface CareerCodeProps {
  previousCareers?: PreviousCareer[];
  currentRole: string;
}

/**
 * Generates career journey code with educational comments.
 *
 * @param props - Career history data
 * @param lang - Target programming language
 * @returns Generated code string
 */
export function generateCareerCode(props: CareerCodeProps, lang: Language): string {
  const { previousCareers, currentRole } = props;

  if (lang === 'python') {
    return generatePythonCode(previousCareers, currentRole);
  }
  return generateTypeScriptCode(previousCareers, currentRole);
}

function generatePythonCode(previousCareers?: PreviousCareer[], currentRole?: string): string {
  const careerCount = previousCareers?.length || 2;

  if (!previousCareers || previousCareers.length === 0) {
    return `"""
Career Journey → Tech
=====================
Tracks my non-linear path into software development.
"""
from dataclasses import dataclass
from typing import List, Optional, Set
from enum import Enum, auto


class Industry(Enum):
    """
    Enum: Named Constants
    ---------------------
    Enums restrict values to predefined options.
    Better than string literals because:
    - Typos caught at analysis time (Industry.TECK errors)
    - Autocomplete shows all valid options
    - Refactoring is safer (rename in one place)

    auto() generates unique values automatically.
    Use explicit values when they matter (API responses, DB storage).
    """
    TECH = auto()
    FINANCE = auto()
    HEALTHCARE = auto()
    OTHER = auto()


@dataclass(frozen=True)
class CareerStep:
    """
    frozen=True: Immutable Dataclass
    --------------------------------
    Once created, fields cannot be changed.

    Why immutability?
    - Prevents accidental state changes
    - Safe to share between threads
    - Can be used as dict keys (hashable)
    - Easier to reason about (no hidden mutations)

    Trade-off: Creating modified copies requires new instances:
        new_step = CareerStep(role="New", skills=old_step.skills, ...)

    Optional[T] = Union[T, None]
    - Explicitly marks that a value might be None
    - Default values must come after required fields
    """
    role: str
    skills: List[str]
    industry: Industry
    company: Optional[str] = None


"""
Data Structure: List[CareerStep]
--------------------------------
We use a list because:
- Order matters (chronological progression)
- We iterate through all steps
- No key-based lookup needed

Alternative: If we needed role-based lookup:
    career_map: Dict[str, CareerStep] = {
        step.role: step for step in journey
    }
"""
career_journey: List[CareerStep] = [
    CareerStep(
        role="Previous Role",
        skills=["Communication", "Problem Solving"],
        industry=Industry.OTHER,
    ),
    CareerStep(
        role="Self-Taught Developer",
        skills=["Persistence", "Curiosity", "Adaptability"],
        industry=Industry.TECH,
    ),
]

CURRENT_ROLE: str = "${currentRole || 'Full-Stack Developer'}"


def get_transferable_skills() -> Set[str]:
    """
    Extract unique skills from career journey.

    Returns Set[str] instead of List[str] because:
    - Duplicates automatically eliminated
    - O(1) membership testing
    - Communicates intent: we want unique values

    Set comprehension: {expr for item in iterable}
    Nested comprehension flattens the skill lists.
    """
    return {
        skill
        for step in career_journey
        for skill in step.skills
    }`;
  }

  const journeySteps = previousCareers
    .map((career) => {
      const skills = career.transferableSkills?.slice(0, 3).map((s) => `"${s}"`).join(', ') || '"Adaptability"';
      return `    CareerStep(
        role="${career.title || 'Role'}",
        skills=[${skills}],
        industry=Industry.OTHER,
    )`;
    })
    .join(',\n');

  return `"""
Career Journey → Tech
=====================
${careerCount} roles that shaped my path.
"""
from dataclasses import dataclass
from typing import List, Optional, Set
from enum import Enum, auto


class Industry(Enum):
    TECH = auto()
    FINANCE = auto()
    HEALTHCARE = auto()
    OTHER = auto()


@dataclass(frozen=True)  # Immutable after creation
class CareerStep:
    role: str
    skills: List[str]
    industry: Industry
    company: Optional[str] = None  # Optional = can be None


career_journey: List[CareerStep] = [
${journeySteps}
]

CURRENT_ROLE: str = "${currentRole || 'Full-Stack Developer'}"


def get_transferable_skills() -> Set[str]:
    # Set comprehension - returns unique skills
    return {
        skill
        for step in career_journey
        for skill in step.skills
    }`;
}

function generateTypeScriptCode(previousCareers?: PreviousCareer[], currentRole?: string): string {
  const careerCount = previousCareers?.length || 2;

  if (!previousCareers || previousCareers.length === 0) {
    return `/**
 * Career Journey → Tech
 * =====================
 * Tracks my non-linear path into software development.
 * Each role contributed transferable skills.
 */

/**
 * Interface: CareerStep
 * ---------------------
 * Interfaces define object "shapes" - a contract that objects must follow.
 *
 * 'readonly' modifier:
 * - Prevents reassignment after object creation
 * - Different from 'const': const prevents reassigning the variable,
 *   readonly prevents mutating the property
 *
 * Example:
 *   const step: CareerStep = { role: "Dev", skills: [] };
 *   step.role = "New";     // Error! role is readonly
 *   step.skills.push("X"); // Allowed! array itself isn't readonly
 *
 * To make array contents readonly too, use: readonly string[]
 *
 * Optional properties (?):
 * - company?: string means company can be string OR undefined
 * - Useful when not all career steps have a company name
 */
interface CareerStep {
  readonly role: string;
  readonly skills: readonly string[];  // readonly array = no push/pop
  readonly company?: string;           // ? = optional property
}

/**
 * Data Structure: Array vs Object vs Map
 * --------------------------------------
 * We use an array here because:
 * - Order matters (chronological career progression)
 * - We iterate through all steps (not looking up by key)
 * - Index-based access isn't needed
 *
 * If we needed to look up by role name, we'd use:
 *   Map<string, CareerStep> - for dynamic keys
 *   Record<RoleName, CareerStep> - for known keys
 *
 * 'as const satisfies' pattern:
 * - 'as const' = infer literal types + make deeply readonly
 * - 'satisfies' = validate against type without widening
 * - Combined: we get exact types AND type checking
 */
const careerJourney = [
  {
    role: "Previous Role",
    skills: ["Communication", "Problem Solving"],
  },
  {
    role: "Self-Taught Developer",
    skills: ["Persistence", "Curiosity", "Adaptability"],
  },
] as const satisfies readonly CareerStep[];

// Literal type: TS knows this is exactly "Full-Stack Developer"
const currentRole = "${currentRole || 'Full-Stack Developer'}" as const;

/**
 * flatMap vs map + flat
 * ---------------------
 * flatMap combines two operations:
 *   1. map: transform each element (step → step.skills)
 *   2. flat: flatten one level of nesting
 *
 * Equivalent to: careerJourney.map(s => s.skills).flat()
 *
 * Input:  [{ skills: ["A", "B"] }, { skills: ["C"] }]
 * Output: ["A", "B", "C"]
 *
 * Why ReadonlyArray<T> return type?
 * - Signals to callers: "don't modify this array"
 * - Prevents accidental mutations in consuming code
 * - Part of defensive programming / immutable data patterns
 */
function getTransferableSkills(): ReadonlyArray<string> {
  return careerJourney.flatMap(step => step.skills);
}

export { careerJourney, currentRole, getTransferableSkills };
export type { CareerStep };`;
  }

  const journeySteps = previousCareers
    .map((career) => {
      const skills = career.transferableSkills?.slice(0, 3).map((s) => `"${s}"`).join(', ') || '"Adaptability"';
      return `  {
    role: "${career.title || 'Role'}",
    skills: [${skills}],
  }`;
    })
    .join(',\n');

  return `/**
 * Career Journey → Tech
 * =====================
 * ${careerCount} roles that shaped my path into development.
 */

// Interface = contract for object shape (compile-time only)
interface CareerStep {
  readonly role: string;      // readonly prevents reassignment
  readonly skills: string[];  // Transferable skills from each role
  readonly company?: string;  // Optional property (? suffix)
}

// as const = deeply immutable + literal types
// satisfies = type-check without widening
const careerJourney = [
${journeySteps}
] as const satisfies readonly CareerStep[];

const currentRole = "${currentRole || 'Full-Stack Developer'}" as const;

// flatMap = map that flattens nested arrays into one
function getTransferableSkills(): ReadonlyArray<string> {
  return careerJourney.flatMap(step => step.skills);
}

export { careerJourney, currentRole, getTransferableSkills };
export type { CareerStep };`;
}

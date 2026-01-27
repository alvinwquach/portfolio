/**
 * Developer Code Generator
 * ========================
 * Generates the Developer profile code for both TypeScript and Python.
 *
 * This module demonstrates:
 * - Type aliases and union types
 * - Interfaces vs types
 * - Python dataclasses
 * - Type annotations
 *
 * Architecture: Template Literals
 * -------------------------------
 * We use template literals (backticks) to generate code because:
 * - Preserves formatting and indentation
 * - Easy to interpolate dynamic values
 * - Readable - code looks like the output
 *
 * Alternative approaches:
 * - AST manipulation (babel/typescript): More robust but complex
 * - String concatenation: Harder to read and maintain
 * - Template engines (handlebars): Overkill for this use case
 */

import type { Language } from '../types';

interface DeveloperCodeProps {
  name: string;
  role: string;
  location: string;
  openToRoles: string[];
  strengths: string[];
  totalSkillCount: number;
}

/**
 * Generates Developer profile code with educational comments.
 *
 * The generated code teaches:
 * - TypeScript: type vs interface, readonly, union types
 * - Python: dataclasses, Literal types, type hints
 *
 * @param props - Developer profile data
 * @param lang - Target programming language
 * @returns Generated code string
 */
export function generateDeveloperCode(props: DeveloperCodeProps, lang: Language): string {
  const { name, role, location, openToRoles, strengths, totalSkillCount } = props;

  if (lang === 'python') {
    return generatePythonCode(props);
  }

  return generateTypeScriptCode(props);
}

function generatePythonCode(props: DeveloperCodeProps): string {
  const { name, role, location, openToRoles, strengths, totalSkillCount } = props;

  const rolesStr = openToRoles.map((r) => `        "${r}"`).join(',\n');
  const strengthsStr = strengths.map((s) => `"${s}"`).join(', ');

  return `"""
Developer Profile Module
========================
Python uses type hints for static analysis (mypy, pyright).
Unlike TypeScript, Python type hints are NOT enforced at runtime -
they're for tooling, documentation, and catching bugs early.
"""
from dataclasses import dataclass
from typing import List, Literal

# Literal type - restricts to specific values (like TS union types)
# Status can only be "open", "freelance", or "unavailable"
Status = Literal["open", "freelance", "unavailable"]


@dataclass
class Developer:
    """
    @dataclass Decorator
    --------------------
    Automatically generates boilerplate methods:
    - __init__: constructor from field definitions
    - __repr__: string representation for debugging
    - __eq__: equality comparison by field values

    Why dataclass over regular class?
    - Less boilerplate (no manual __init__)
    - Immutability option with frozen=True
    - Built-in comparison and hashing

    Why dataclass over dict?
    - Type safety: IDE knows exact fields
    - Autocomplete works on fields
    - Typos caught at analysis time, not runtime
    """
    name: str
    role: str
    location: str
    tech_stack: List[str]   # List[T] = generic list of type T
    open_to: List[str]
    strengths: List[str]
    status: Status          # Must be one of the Literal values


# Instance creation - dataclass provides typed constructor
developer = Developer(
    name="${name}",
    role="${role}",
    location="${location}",
    tech_stack=[],  # Populated from skills.py (${totalSkillCount} skills)
    open_to=[
${rolesStr}
    ],
    strengths=[${strengthsStr}],
    status="open"
)`;
}

function generateTypeScriptCode(props: DeveloperCodeProps): string {
  const { name, role, location, openToRoles, strengths, totalSkillCount } = props;

  const rolesStr = openToRoles.map((r) => `    "${r}"`).join(',\n');
  const strengthsStr = strengths.map((s) => `"${s}"`).join(', ');

  return `/**
 * Developer Profile Module
 * ========================
 * TypeScript adds compile-time type checking to JavaScript.
 * Errors are caught before runtime, making refactoring safer.
 */
import { skills } from './skills';
import { careerJourney } from './career';

/**
 * Type Alias: Status
 * ------------------
 * 'type' creates an alias for any type expression.
 * Union types (A | B | C) restrict values to specific options.
 * This is called a "discriminated union" or "tagged union".
 */
type Status = "open" | "freelance" | "unavailable";

/**
 * Interface: Developer
 * --------------------
 * Interfaces define the "shape" or "contract" for objects.
 * Any object typed as Developer MUST have all these properties.
 *
 * Key differences from 'type':
 * - Can be extended: interface Senior extends Developer
 * - Can be implemented: class Person implements Developer
 * - Declaration merging: same interface name = combined
 */
interface Developer {
  readonly name: string;   // readonly = cannot reassign after init
  role: string;
  location: string;
  techStack: readonly string[];  // readonly array = no push/pop/etc
  openTo: string[];
  strengths: string[];
  status: Status;  // Must be one of the Status union values
}

/**
 * Developer Instance
 * ------------------
 * The ': Developer' annotation enforces the interface.
 * TypeScript will error if any property is missing or wrong type.
 */
const developer: Developer = {
  name: "${name}",
  role: "${role}",
  location: "${location}",
  techStack: Object.keys(skills),  // ${totalSkillCount} skills total
  openTo: [
${rolesStr}
  ],
  strengths: [${strengthsStr}],
  status: "open",
};

export default developer;`;
}

/**
 * Syntax Highlighter Module
 * =========================
 * Pure functions for code syntax highlighting and comment manipulation.
 *
 * Architecture Decision: Pure Functions
 * -------------------------------------
 * These functions are "pure" - they:
 * 1. Always return the same output for the same input
 * 2. Have no side effects (don't modify external state)
 * 3. Don't depend on external mutable state
 *
 * Benefits of pure functions:
 * - Easily testable (no mocking required)
 * - Cacheable/memoizable (same input = same output)
 * - Parallelizable (no shared state concerns)
 * - Easy to reason about (predictable behavior)
 *
 * Why not use a library like Prism.js or highlight.js?
 * ---------------------------------------------------
 * For this portfolio's needs, a custom solution is better because:
 * - Smaller bundle size (only highlighting what we need)
 * - Full control over color scheme to match design system
 * - No runtime dependencies to manage
 * - Educational value in understanding how highlighting works
 *
 * For production apps with many languages, use a library instead.
 */

import type { Language } from './types';

/**
 * Token pattern configuration for syntax highlighting.
 *
 * Order matters! Patterns are applied sequentially, and earlier matches
 * take precedence. This prevents issues like keywords being highlighted
 * inside strings or comments.
 *
 * Example of why order matters:
 *   Code: const name = "const value"
 *   If we match keywords first: <span>const</span> name = "<span>const</span> value"
 *   If we match strings first:  <span>const</span> name = <span>"const value"</span>
 *   The second is correct - "const" inside the string shouldn't be highlighted.
 */
interface TokenPattern {
  /** Regular expression to match tokens */
  regex: RegExp;
  /** Tailwind CSS class for styling */
  className: string;
}

/**
 * Strips comments from code while preserving structure.
 *
 * Use case: Toggle between "learning mode" (with comments) and
 * "clean code" view (without comments) for the portfolio display.
 *
 * @param code - Source code string
 * @param lang - Programming language for comment syntax
 * @returns Code with comments removed and whitespace cleaned up
 *
 * @example
 * ```ts
 * const code = `
 * // This is a comment
 * const x = 1;
 * `;
 * stripComments(code, 'typescript');
 * // Returns: "const x = 1;"
 * ```
 */
export function stripComments(code: string, lang: Language): string {
  let result = code;

  if (lang === 'python') {
    // Python docstrings: triple-quoted strings used for documentation
    // [\s\S]*? matches any character (including newlines) non-greedily
    result = result.replace(/"""[\s\S]*?"""/g, '');
    // Python single-line comments start with #
    result = result.replace(/#[^\n]*/g, '');
  } else {
    // TypeScript/JavaScript block comments (including JSDoc)
    result = result.replace(/\/\*\*[\s\S]*?\*\//g, '');
    // Single-line comments
    result = result.replace(/\/\/[^\n]*/g, '');
  }

  // Clean up excessive blank lines (more than 2 consecutive)
  // This prevents the code from looking sparse after comment removal
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  // Remove leading blank lines
  result = result.replace(/^\s*\n/, '');

  return result;
}

/**
 * Applies syntax highlighting to code using token-based replacement.
 *
 * Algorithm Overview:
 * 1. Escape HTML entities (prevent XSS, preserve < > in generics)
 * 2. Define patterns in priority order (comments/strings first)
 * 3. Replace each match with a placeholder token
 * 4. Swap placeholders with actual styled spans
 *
 * Why use placeholder tokens?
 * ---------------------------
 * If we directly insert <span> tags, later patterns might match
 * content inside those spans, creating nested/broken HTML.
 *
 * Example without tokens:
 *   Input: "const"
 *   After keyword match: <span class="purple">const</span>
 *   After property match: <span class="purple"><span class="blue">const</span></span>
 *   Broken! "const" matched both patterns.
 *
 * With tokens:
 *   Input: "const"
 *   After keyword match: __TOKEN_0__
 *   After property match: __TOKEN_0__ (no match - it's not "word:")
 *   Final: <span class="purple">const</span>
 *   Correct!
 *
 * @param code - Source code to highlight
 * @param lang - Programming language for syntax rules
 * @returns HTML string with syntax highlighting spans
 */
export function highlightCode(code: string, lang: Language = 'typescript'): string {
  // Step 1: Escape HTML to prevent XSS and preserve angle brackets
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Step 2: Build pattern list based on language
  // Order is critical - match comments and strings FIRST
  const patterns: TokenPattern[] = [];

  // MODIFIED(feat/design-system): Late Night Session syntax palette
  //   comments  → text-text-muted  (recedes, unobtrusive)
  //   strings   → text-success     (teal — familiar green for strings)
  //   keywords  → text-accent      (violet — primary brand, dominant token)
  //   types     → text-info        (cyan — built-ins, type system)
  //   numbers   → text-accent-warm (amber — warm contrast against violet)
  //   classes   → text-warning     (yellow — PascalCase identifiers pop)
  //   props     → text-info        (cyan — object keys)
  //   brackets  → text-text-muted  (recedes, structural chrome)
  if (lang === 'python') {
    patterns.push(
      // Docstrings (triple-quoted) - must come before regular strings
      { regex: /("""[\s\S]*?""")/g, className: 'text-text-muted' },
      // Single-line comments
      { regex: /(#[^\n]*)/g, className: 'text-text-muted' },
      // Strings (double and single quoted)
      { regex: /("[^"]*"|'[^']*')/g, className: 'text-success' },
      // Decorators (@dataclass, etc.)
      { regex: /(@\w+)/g, className: 'text-accent-warm' },
      // Python keywords
      {
        regex: /\b(from|import|class|def|return|for|in|if|else|elif|True|False|None|and|or|not|with|as|try|except|finally)\b/g,
        className: 'text-accent',
      },
      // Type hints
      {
        regex: /\b(str|int|bool|float|List|Dict|Optional|Literal|Enum|Final|Tuple|Set|Any|Union)\b/g,
        className: 'text-info',
      },
    );
  } else {
    patterns.push(
      // JSDoc/block comments - must come before strings
      { regex: /(\/\*\*[\s\S]*?\*\/)/g, className: 'text-text-muted' },
      // Single-line comments
      { regex: /(\/\/[^\n]*)/g, className: 'text-text-muted' },
      // Strings (template literals, double, single quoted)
      { regex: /(`[^`]*`|"[^"]*"|'[^']*')/g, className: 'text-success' },
      // TypeScript keywords
      {
        regex: /\b(const|let|var|export|default|import|from|return|function|type|interface|readonly|as|satisfies|extends|implements)\b/g,
        className: 'text-accent',
      },
      // Built-in types
      {
        regex: /\b(string|number|boolean|void|null|undefined|never|unknown|any|ReadonlyArray|Record|Partial|Required|Pick|Omit)\b/g,
        className: 'text-info',
      },
    );
  }

  // Common patterns for both languages
  patterns.push(
    // PascalCase identifiers (classes, interfaces, types)
    // \b = word boundary, prevents matching inside other words
    { regex: /\b([A-Z][a-zA-Z0-9]+)\b/g, className: 'text-warning' },
    // Object properties (word followed by colon, but not ::)
    // (?=...) is a lookahead - matches position without consuming
    { regex: /\b(\w+)(?=\s*:(?!:))/g, className: 'text-info' },
    // Brackets and braces - subtle color to not distract
    { regex: /([{}[\]()])/g, className: 'text-text-muted' },
  );

  // Step 3: Apply patterns with placeholder tokens
  const tokens: string[] = [];

  patterns.forEach(({ regex, className }) => {
    result = result.replace(regex, (match) => {
      const index = tokens.length;
      tokens.push(`<span class="${className}">${match}</span>`);
      return `__TOKEN_${index}__`;
    });
  });

  // Step 4: Replace placeholders with actual spans
  tokens.forEach((token, index) => {
    result = result.replace(`__TOKEN_${index}__`, token);
  });

  return result;
}

/**
 * Gets the file extension for a given language.
 *
 * @param lang - Programming language
 * @param isReactComponent - Whether the file is a React component (for .tsx)
 * @returns File extension with leading dot
 */
export function getFileExtension(lang: Language, isReactComponent = false): string {
  if (lang === 'python') return '.py';
  return isReactComponent ? '.tsx' : '.ts';
}

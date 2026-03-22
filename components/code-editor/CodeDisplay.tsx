/**
 * Code Display Component
 * ======================
 * Renders syntax-highlighted code with line numbers.
 *
 * Component Design: Presentation Only
 * -----------------------------------
 * This is a "dumb" or "presentational" component:
 * - Receives data via props
 * - No internal state
 * - No side effects
 * - Pure rendering logic
 *
 * Benefits of presentational components:
 * - Easy to test (render with props, check output)
 * - Reusable (not tied to specific data source)
 * - Easy to style/theme (all visual logic in one place)
 *
 * dangerouslySetInnerHTML
 * -----------------------
 * We use this because our syntax highlighter returns HTML strings.
 * It's called "dangerous" because raw HTML can enable XSS attacks.
 *
 * We mitigate this by:
 * 1. Escaping HTML entities FIRST in highlightCode()
 * 2. Only inserting spans with known class names
 * 3. Never using user input directly
 *
 * Alternative: Return React elements from highlighter
 * This would be safer but more complex for multi-pass highlighting.
 *
 * Performance Consideration: Memoization
 * --------------------------------------
 * If code content changes frequently, consider wrapping in useMemo:
 *   const highlighted = useMemo(
 *     () => highlightCode(code, language),
 *     [code, language]
 *   );
 *
 * For this portfolio, code only changes on tab/language switch,
 * so memoization isn't critical.
 */

'use client';

import { highlightCode } from './syntax-highlighter';
import type { Language } from './types';

interface CodeDisplayProps {
  /** Code string to display */
  code: string;
  /** Programming language for syntax highlighting */
  language: Language;
}

/**
 * Renders line numbers for the code display.
 *
 * Why a separate component?
 * - Keeps CodeDisplay focused on code rendering
 * - Line numbers have distinct styling concerns
 * - Could be made optional via props if needed
 */
function LineNumbers({ count }: { count: number }) {
  return (
    <div className="select-none text-right pr-4 text-line text-xs font-mono">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="leading-5">
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export function CodeDisplay({ code, language }: CodeDisplayProps) {
  const lineCount = code.split('\n').length;
  const highlightedCode = highlightCode(code, language);

  return (
    <div className="flex-1 overflow-auto p-4 font-mono text-xs scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
      <div className="flex">
        <LineNumbers count={lineCount} />
        <pre className="flex-1 leading-5 whitespace-pre">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightedCode,
            }}
          />
        </pre>
      </div>
    </div>
  );
}

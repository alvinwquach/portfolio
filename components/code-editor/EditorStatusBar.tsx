/**
 * Editor Status Bar Component
 * ===========================
 * Displays editor metadata in a VS Code-style status bar.
 *
 * Design Pattern: Information Display
 * -----------------------------------
 * Status bars provide contextual information without interaction.
 * Common patterns:
 * - Language indicator
 * - Encoding (UTF-8)
 * - Line/column position
 * - File name
 *
 * Color Semantics
 * ---------------
 * The background color changes based on context:
 * - Python: Yellow (brand color)
 * - Developer tab: Emerald (React/component)
 * - Skills tab: Amber (configuration)
 * - Career tab: Purple (data/journey)
 *
 * This provides visual feedback about the current context
 * without requiring the user to read text.
 */

import { cn } from '@/lib/utils';
import type { Language, TabName } from './types';
import { getFileExtension } from './syntax-highlighter';

interface EditorStatusBarProps {
  /** Currently active tab */
  activeTab: TabName;
  /** Currently selected language */
  language: Language;
  /** Number of lines in the current code */
  lineCount: number;
}

/**
 * Maps editor state to status bar background color.
 * Extracted as a function for clarity and testability.
 */
function getStatusBarColor(activeTab: TabName, language: Language): string {
  // Python always gets yellow regardless of tab
  if (language === 'python') return 'bg-yellow-600';

  // TypeScript colors vary by tab
  const tabColors: Record<TabName, string> = {
    developer: 'bg-emerald-600',
    skills: 'bg-amber-600',
    career: 'bg-purple-600',
  };

  return tabColors[activeTab];
}

/**
 * Returns the language display name for the status bar.
 */
function getLanguageDisplay(activeTab: TabName, language: Language): string {
  if (language === 'python') return 'Python';
  // Developer tab is a React component (.tsx)
  return activeTab === 'developer' ? 'TypeScript React' : 'TypeScript';
}

export function EditorStatusBar({ activeTab, language, lineCount }: EditorStatusBarProps) {
  const backgroundColor = getStatusBarColor(activeTab, language);
  const languageDisplay = getLanguageDisplay(activeTab, language);
  const fileName = `${activeTab}${getFileExtension(language, activeTab === 'developer')}`;

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-1 text-white text-xs transition-colors',
        backgroundColor
      )}
    >
      {/* Left side: Language and encoding */}
      <div className="flex items-center gap-4">
        <span>{languageDisplay}</span>
        <span>UTF-8</span>
      </div>

      {/* Right side: Position and file name */}
      <div className="flex items-center gap-4">
        <span>Ln {lineCount}, Col 1</span>
        <span>{fileName}</span>
      </div>
    </div>
  );
}

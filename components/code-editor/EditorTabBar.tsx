/**
 * Editor Tab Bar Component
 * ========================
 * Renders the file tabs and toggle controls for the code editor.
 *
 * Component Responsibilities (Single Responsibility Principle)
 * ------------------------------------------------------------
 * This component ONLY handles:
 * - Rendering tab buttons for file selection
 * - Rendering language toggle (TS/PY)
 * - Rendering comments toggle (On/Off)
 *
 * It does NOT:
 * - Manage state (lifted to parent)
 * - Generate code content
 * - Handle syntax highlighting
 *
 * Why lift state up?
 * ------------------
 * The parent component needs to know which tab/language is selected
 * to generate the correct code. By lifting state up:
 * - Single source of truth for editor state
 * - Sibling components can react to changes
 * - Easier to persist state (localStorage, URL params)
 *
 * Props Pattern: Controlled Component
 * -----------------------------------
 * This is a "controlled" component - it receives its current state
 * via props and notifies parent of changes via callbacks.
 *
 * Controlled: <TabBar activeTab={tab} onTabChange={setTab} />
 * Uncontrolled: <TabBar defaultTab="developer" /> (manages own state)
 *
 * Controlled components are more flexible but require more wiring.
 * Use controlled when parent needs to know/control the state.
 */

'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Language, TabName } from './types';
import { getFileExtension } from './syntax-highlighter';

interface EditorTabBarProps {
  /** Currently active tab */
  activeTab: TabName;
  /** Callback when tab selection changes */
  onTabChange: (tab: TabName) => void;
  /** Currently selected language */
  language: Language;
  /** Callback when language changes */
  onLanguageChange: (lang: Language) => void;
  /** Whether comments are visible */
  showComments: boolean;
  /** Callback when comments toggle changes */
  onCommentsToggle: () => void;
}

/**
 * Tab configuration for rendering.
 * Extracted here to keep render logic clean.
 */
const TABS: Array<{
  id: TabName;
  label: string;
  activeColor: string;
}> = [
  { id: 'developer', label: 'Developer', activeColor: 'border-t-emerald-500' },
  { id: 'skills', label: 'skills', activeColor: 'border-t-amber-500' },
  { id: 'career', label: 'career', activeColor: 'border-t-purple-500' },
];

export function EditorTabBar({
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  showComments,
  onCommentsToggle,
}: EditorTabBarProps) {
  /**
   * Get the appropriate icon/label for a tab based on language.
   * React files show atom symbol, others show language abbreviation.
   */
  const getTabIcon = (tabId: TabName) => {
    if (language === 'python') return 'PY';
    return tabId === 'developer' ? '⚛' : 'TS';
  };

  const getIconColor = (tabId: TabName) => {
    if (language === 'python') return 'text-yellow-400';
    if (tabId === 'developer') return 'text-blue-400';
    if (tabId === 'skills') return 'text-amber-500';
    return 'text-purple-400';
  };

  return (
    <div className="flex items-center justify-between bg-slate-800 border-b border-slate-700/50">
      {/* File Tabs */}
      <div className="flex items-center">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm transition-colors',
              activeTab === tab.id
                ? `bg-[#1e1e1e] text-slate-200 border-t-2 ${tab.activeColor}`
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
            )}
          >
            <span className={getIconColor(tab.id)}>{getTabIcon(tab.id)}</span>
            {tab.label}
            {getFileExtension(language, tab.id === 'developer')}
          </button>
        ))}
      </div>

      {/* Toggle Controls */}
      <div className="flex items-center gap-3 pr-2">
        {/* Comments Toggle */}
        <button
          onClick={onCommentsToggle}
          className={cn(
            'px-2 py-1 text-xs rounded transition-colors flex items-center gap-1',
            showComments
              ? 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
          )}
          title={showComments ? 'Hide comments' : 'Show comments'}
          aria-label={showComments ? 'Hide code comments' : 'Show code comments'}
          aria-pressed={showComments}
        >
          <span className="text-[10px]" aria-hidden="true">{'//'}</span>
          <span>{showComments ? 'On' : 'Off'}</span>
        </button>

        {/* Language Toggle */}
        <div className="flex items-center gap-1" role="group" aria-label="Select programming language">
          <button
            onClick={() => onLanguageChange('typescript')}
            className={cn(
              'px-2 py-1 text-xs rounded transition-colors',
              language === 'typescript'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
            )}
            aria-label="TypeScript"
            aria-pressed={language === 'typescript'}
          >
            TS
          </button>
          <button
            onClick={() => onLanguageChange('python')}
            className={cn(
              'px-2 py-1 text-xs rounded transition-colors',
              language === 'python'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
            )}
            aria-label="Python"
            aria-pressed={language === 'python'}
          >
            PY
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Code Editor Component
 * =====================
 * Main container that composes the code editor UI.
 *
 * Architecture: Composition Pattern
 * ---------------------------------
 * This component follows the composition pattern:
 * - Parent manages shared state (activeTab, language, showComments)
 * - Children receive state via props
 * - Children notify parent via callbacks
 *
 * Component Tree:
 * ```
 * CodeEditor (state management)
 * ├── EditorSidebar (file tree, quick info)
 * ├── EditorTabBar (file tabs, toggles)
 * ├── CodeDisplay (syntax-highlighted code)
 * ├── EditorStatusBar (language, line count)
 * └── EditorOutputPanel (output, terminal, problems)
 * ```
 *
 * Why this structure?
 * - Single Responsibility: Each component does one thing
 * - Easy to test: Components can be tested in isolation
 * - Easy to modify: Change one component without affecting others
 * - Easy to understand: Small, focused files
 *
 * State Management Decision
 * -------------------------
 * We use useState for local component state because:
 * - State is UI-specific (not shared across pages)
 * - No complex state transitions (just toggles)
 * - No need for persistence (resets on refresh is fine)
 *
 * For more complex state, consider:
 * - useReducer: Complex state transitions
 * - Context: Deeply nested prop drilling
 * - Zustand/Jotai: Shared across components
 * - URL params: State should persist/be shareable
 *
 * Data Flow
 * ---------
 * Profile data flows in from Sanity CMS (via parent).
 * This component transforms it into code strings,
 * which are passed to CodeDisplay for rendering.
 */

'use client';

import { useState, useMemo } from 'react';
import type { Language, TabName } from './types';
import { stripComments } from './syntax-highlighter';
import { generateDeveloperCode, generateSkillsCode, generateCareerCode } from './code-generators';
import { EditorSidebar } from './EditorSidebar';
import { EditorTabBar } from './EditorTabBar';
import { CodeDisplay } from './CodeDisplay';
import { EditorStatusBar } from './EditorStatusBar';
import { EditorOutputPanel } from './EditorOutputPanel';

/**
 * Profile data structure from Sanity CMS.
 * Define locally to avoid coupling to specific CMS schema.
 */
interface ProfileData {
  name: string;
  headline: string;
  location: string;
  availabilityStatus: string;
  openToRoles: string[];
  strengths: string[];
  previousCareers?: Array<{
    title?: string;
    transferableSkills?: string[];
  }>;
}

interface SkillGroup {
  category: string;
  skills: Array<{ name: string }>;
}

interface CodeEditorProps {
  /** Profile data from CMS */
  profile: ProfileData | null;
  /** Skill groups from CMS */
  skillGroups?: SkillGroup[];
}

/**
 * Default profile data when CMS data is unavailable.
 * Ensures the component always has data to render.
 */
const DEFAULT_PROFILE: ProfileData = {
  name: 'Alvin Quach',
  headline: 'Full-Stack Developer',
  location: 'San Francisco Bay Area',
  availabilityStatus: 'open',
  openToRoles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
  strengths: ['Problem Solving', 'System Design', 'Clean Code'],
};

/**
 * Maps availability status to display configuration.
 * Extracted for clarity and potential i18n support.
 */
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: 'Open to Work', color: 'bg-emerald-500' },
  freelance: { label: 'Freelancing', color: 'bg-amber-500' },
  both: { label: 'Open to Opportunities', color: 'bg-emerald-500' },
  unavailable: { label: 'Not Available', color: 'bg-slate-500' },
};

export function CodeEditor({ profile, skillGroups }: CodeEditorProps) {
  // Merge with defaults - ensures we always have data
  const p = profile || DEFAULT_PROFILE;

  // UI State
  const [activeTab, setActiveTab] = useState<TabName>('developer');
  const [language, setLanguage] = useState<Language>('typescript');
  const [showComments, setShowComments] = useState(true);

  // Derived data
  const status = STATUS_CONFIG[p.availabilityStatus] || STATUS_CONFIG.open;
  const totalSkillCount = skillGroups?.reduce((acc, g) => acc + g.skills.length, 0) || 0;
  const careerMilestoneCount = p.previousCareers?.length || 0;

  /**
   * Generate code content for each tab.
   *
   * useMemo prevents regenerating code on every render.
   * Dependencies: regenerate when profile data, skills, or language changes.
   *
   * Why memoize?
   * - Code generation involves string concatenation
   * - Result is the same for same inputs
   * - Prevents unnecessary work on re-renders (e.g., when toggling comments)
   */
  const developerCode = useMemo(
    () =>
      generateDeveloperCode(
        {
          name: p.name,
          role: p.headline,
          location: p.location,
          openToRoles: p.openToRoles,
          strengths: p.strengths,
          totalSkillCount,
        },
        language
      ),
    [p.name, p.headline, p.location, p.openToRoles, p.strengths, totalSkillCount, language]
  );

  const skillsCode = useMemo(
    () => generateSkillsCode(skillGroups, language),
    [skillGroups, language]
  );

  const careerCode = useMemo(
    () =>
      generateCareerCode(
        {
          previousCareers: p.previousCareers,
          currentRole: p.headline,
        },
        language
      ),
    [p.previousCareers, p.headline, language]
  );

  // Get current tab's code
  const codeContent = useMemo(() => {
    switch (activeTab) {
      case 'developer':
        return developerCode;
      case 'skills':
        return skillsCode;
      case 'career':
        return careerCode;
      default:
        return developerCode;
    }
  }, [activeTab, developerCode, skillsCode, careerCode]);

  // Apply comments filter
  const displayCode = useMemo(
    () => (showComments ? codeContent : stripComments(codeContent, language)),
    [showComments, codeContent, language]
  );

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 bg-slate-900">
      {/* Browser Chrome - Traffic lights and URL bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
        </div>
        <div className="flex-1 max-w-md mx-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-md text-xs text-slate-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            alvinquach.dev
          </div>
        </div>
        <div className="w-16" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Row: Sidebar + Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] h-[350px]">
          {/* Sidebar */}
          <EditorSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            language={language}
            location={p.location}
            statusLabel={status.label}
            statusColor={status.color}
            openToRoles={p.openToRoles}
          />

          {/* Editor Panel */}
          <div className="bg-[#1e1e1e] flex flex-col overflow-hidden">
            <EditorTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              language={language}
              onLanguageChange={setLanguage}
              showComments={showComments}
              onCommentsToggle={() => setShowComments(!showComments)}
            />

            <CodeDisplay code={displayCode} language={language} />

            <EditorStatusBar
              activeTab={activeTab}
              language={language}
              lineCount={displayCode.split('\n').length}
            />
          </div>
        </div>

        {/* Bottom Row: Output Panel */}
        <EditorOutputPanel
          name={p.name}
          headline={p.headline}
          location={p.location}
          statusLabel={status.label}
          openToRoles={p.openToRoles}
          skillCount={totalSkillCount}
          careerMilestoneCount={careerMilestoneCount}
        />
      </div>
    </div>
  );
}

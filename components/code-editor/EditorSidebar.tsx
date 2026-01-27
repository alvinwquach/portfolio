/**
 * Editor Sidebar Component
 * ========================
 * File explorer sidebar with profile quick info.
 *
 * Layout Pattern: VS Code-Style Explorer
 * --------------------------------------
 * The sidebar mimics VS Code's file explorer:
 * - Collapsible folder structure
 * - File icons by type
 * - Click to open file (switch tabs)
 *
 * This creates familiarity for developers viewing the portfolio.
 *
 * Responsive Design
 * -----------------
 * The sidebar is hidden on smaller screens (hidden lg:block).
 * On mobile, users interact with the tab bar instead.
 *
 * This follows the principle of progressive enhancement:
 * - Core functionality (tabs) works everywhere
 * - Enhanced experience (sidebar) on larger screens
 *
 * Props Design: Profile Data
 * --------------------------
 * Rather than passing the entire profile object, we pass only
 * the specific fields needed. This:
 * - Documents exactly what data is required
 * - Prevents unnecessary re-renders
 * - Makes the component easier to test
 */

'use client';

import { MapPin, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Language, TabName } from './types';
import { getFileExtension } from './syntax-highlighter';

interface EditorSidebarProps {
  /** Currently active tab */
  activeTab: TabName;
  /** Callback when file is clicked */
  onTabChange: (tab: TabName) => void;
  /** Currently selected language */
  language: Language;
  /** User's location */
  location: string;
  /** Availability status label */
  statusLabel: string;
  /** Availability status color class */
  statusColor: string;
  /** Roles user is open to */
  openToRoles: string[];
}

/**
 * File tree item configuration.
 * Matches the tabs but includes additional display info.
 */
const FILE_TREE = [
  { id: 'developer' as TabName, tsLabel: 'Developer', tsIcon: '⚛', tsColor: 'text-blue-400' },
  { id: 'skills' as TabName, tsLabel: 'skills', tsIcon: 'TS', tsColor: 'text-amber-500' },
  { id: 'career' as TabName, tsLabel: 'career', tsIcon: 'TS', tsColor: 'text-purple-400' },
];

export function EditorSidebar({
  activeTab,
  onTabChange,
  language,
  location,
  statusLabel,
  statusColor,
  openToRoles,
}: EditorSidebarProps) {
  /**
   * Get icon and color based on language and file type.
   * Python uses 'PY' and yellow for all files.
   */
  const getFileIcon = (file: (typeof FILE_TREE)[0]) => {
    if (language === 'python') return 'PY';
    return file.tsIcon;
  };

  const getIconColor = (file: (typeof FILE_TREE)[0]) => {
    if (language === 'python') return 'text-yellow-400';
    return file.tsColor;
  };

  return (
    <div className="bg-slate-900 border-r border-slate-700/50 p-4 hidden lg:block overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
      {/* Explorer Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-4">
        <span className="w-1 h-1 rounded-full bg-emerald-500" />
        Explorer
      </div>

      {/* File Tree */}
      <div className="space-y-1 text-sm font-mono">
        {/* Folder */}
        <div className="flex items-center gap-2 text-slate-400 py-1">
          <span className="text-amber-500">▾</span>
          <span className="text-slate-300">src</span>
        </div>

        {/* Files */}
        {FILE_TREE.map((file) => (
          <button
            key={file.id}
            onClick={() => onTabChange(file.id)}
            className={cn(
              'flex items-center gap-2 py-1 pl-6 w-full text-left rounded transition-colors',
              activeTab === file.id
                ? 'text-white bg-slate-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            )}
          >
            <span className={getIconColor(file)}>{getFileIcon(file)}</span>
            {file.tsLabel}
            {getFileExtension(language, file.id === 'developer')}
          </button>
        ))}
      </div>

      {/* Quick Info Section */}
      <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
        {/* Location */}
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-3 h-3 text-slate-500" />
          <span className="text-slate-400">{location}</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className={cn('w-2 h-2 rounded-full animate-pulse', statusColor)} />
          <span className="text-slate-400">{statusLabel}</span>
        </div>
      </div>

      {/* Open To Roles */}
      {openToRoles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            Open To
          </p>
          <div className="flex flex-wrap gap-1">
            {openToRoles.map((role, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

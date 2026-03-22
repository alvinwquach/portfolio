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
// MODIFIED(feat/design-system): Late Night Session palette
const FILE_TREE = [
  { id: 'developer' as TabName, tsLabel: 'Developer', tsIcon: '⚛', tsColor: 'text-info' },
  { id: 'skills' as TabName, tsLabel: 'skills', tsIcon: 'TS', tsColor: 'text-accent-warm' },
  { id: 'career' as TabName, tsLabel: 'career', tsIcon: 'TS', tsColor: 'text-accent' },
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
    if (language === 'python') return 'text-warning';
    return file.tsColor;
  };

  return (
    <div className="bg-surface border-r border-line/50 p-4 hidden lg:block overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
      {/* Explorer Header */}
      <div className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-4">
        <span className="w-1 h-1 rounded-full bg-success" />
        Explorer
      </div>

      {/* File Tree */}
      <div className="space-y-1 text-sm font-mono">
        {/* Folder */}
        <div className="flex items-center gap-2 text-text-muted py-1">
          <span className="text-accent-warm">▾</span>
          <span className="text-text">src</span>
        </div>

        {/* Files */}
        {FILE_TREE.map((file) => (
          <button
            key={file.id}
            onClick={() => onTabChange(file.id)}
            className={cn(
              'flex items-center gap-2 py-1 pl-6 w-full text-left rounded transition-colors',
              activeTab === file.id
                ? 'text-text bg-overlay/50'
                : 'text-text-muted hover:text-text hover:bg-surface'
            )}
          >
            <span className={getIconColor(file)}>{getFileIcon(file)}</span>
            {file.tsLabel}
            {getFileExtension(language, file.id === 'developer')}
          </button>
        ))}
      </div>

      {/* Quick Info Section */}
      <div className="mt-6 pt-4 border-t border-line space-y-3">
        {/* Location */}
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-3 h-3 text-text-muted" />
          <span className="text-text-muted">{location}</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className={cn('w-2 h-2 rounded-full animate-pulse', statusColor)} />
          <span className="text-text-muted">{statusLabel}</span>
        </div>
      </div>

      {/* Open To Roles */}
      {openToRoles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            Open To
          </p>
          <div className="flex flex-wrap gap-1">
            {openToRoles.map((role, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] bg-accent/10 text-accent rounded border border-accent/20"
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

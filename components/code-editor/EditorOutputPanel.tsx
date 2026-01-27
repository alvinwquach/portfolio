/**
 * Editor Output Panel Component
 * =============================
 * Bottom panel with output, terminal, and problems tabs.
 *
 * Design Pattern: Tabbed Content
 * ------------------------------
 * This component manages its own tab state because:
 * - Parent doesn't need to know which panel tab is active
 * - State is local to this UI section
 * - Reduces prop drilling
 *
 * When to lift state vs keep local:
 * - Lift: When siblings or parent need the state
 * - Local: When state is purely for this component's UI
 *
 * Content Strategy: Playful Terminal
 * ----------------------------------
 * The terminal tab shows Unix-style commands that "query" the
 * developer profile. This adds personality while demonstrating
 * technical knowledge (shell commands, environment variables).
 *
 * The output tab shows a "compilation" log that references
 * the other files, creating a sense of a connected codebase.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type PanelTab = 'output' | 'terminal' | 'problems';

interface EditorOutputPanelProps {
  /** Developer's name */
  name: string;
  /** Developer's role/headline */
  headline: string;
  /** Developer's location */
  location: string;
  /** Availability status label */
  statusLabel: string;
  /** Roles developer is open to */
  openToRoles: string[];
  /** Total number of skills */
  skillCount: number;
  /** Number of career milestones */
  careerMilestoneCount: number;
}

/**
 * Panel tab configuration.
 * Each tab has a color indicator and optional count.
 */
const PANEL_TABS: Array<{
  id: PanelTab;
  label: string;
  activeColor: string;
}> = [
  { id: 'output', label: 'Output', activeColor: 'bg-amber-500' },
  { id: 'terminal', label: 'Terminal', activeColor: 'bg-emerald-500' },
  { id: 'problems', label: 'Problems', activeColor: 'bg-emerald-500' },
];

export function EditorOutputPanel({
  name,
  headline,
  location,
  statusLabel,
  openToRoles,
  skillCount,
  careerMilestoneCount,
}: EditorOutputPanelProps) {
  // Local state - parent doesn't need to know which panel tab is active
  const [panelTab, setPanelTab] = useState<PanelTab>('output');

  // Get initials for avatar
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  // Format name for terminal (alvin.quach)
  const terminalName = name.toLowerCase().replace(' ', '.');

  return (
    <div className="bg-slate-950 border-t border-slate-700/50 hidden lg:block">
      {/* Panel Tab Bar */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-800 border-b border-slate-700/50">
        {PANEL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPanelTab(tab.id)}
            className={cn(
              'text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors',
              panelTab === tab.id
                ? 'text-slate-200 bg-slate-700'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                panelTab === tab.id ? tab.activeColor : 'bg-slate-500'
              )}
            />
            {tab.label}
            {/* Show "0" count for problems tab */}
            {tab.id === 'problems' && (
              <span className="text-[10px] text-emerald-400">0</span>
            )}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="p-4 h-[140px] overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
        {/* Output Tab */}
        {panelTab === 'output' && (
          <div className="flex items-start gap-6">
            {/* Profile Card */}
            <div className="bg-slate-900 rounded-lg border border-slate-700/50 overflow-hidden min-w-[260px]">
              <div className="p-3 border-b border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {initials}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{name}</h4>
                  <p className="text-xs text-emerald-400">{headline}</p>
                </div>
              </div>
              <div className="p-3 flex gap-2">
                <Link
                  href="/#contact"
                  className="flex-1 px-3 py-1.5 bg-emerald-500 text-slate-900 text-xs font-medium rounded hover:bg-emerald-400 transition-colors text-center"
                >
                  Connect
                </Link>
                <Link
                  href="/projects"
                  className="flex-1 px-3 py-1.5 border border-slate-600 text-slate-300 text-xs font-medium rounded hover:bg-slate-700 transition-colors text-center"
                >
                  View Work
                </Link>
              </div>
            </div>

            {/* Compilation Output */}
            <div className="flex-1 font-mono text-xs text-slate-400 space-y-1">
              <p className="text-emerald-400">✓ Compiled successfully</p>
              <p className="text-slate-500">└─ Developer.tsx exported</p>
              <p className="text-slate-500">└─ skills.ts loaded ({skillCount} skills)</p>
              <p className="text-slate-500">└─ career.ts parsed ({careerMilestoneCount} milestones)</p>
              <p className="mt-2 text-amber-400">Ready to render portfolio...</p>
            </div>
          </div>
        )}

        {/* Terminal Tab */}
        {panelTab === 'terminal' && (
          <div className="font-mono text-xs space-y-1">
            <p className="text-slate-500">$ whoami</p>
            <p className="text-emerald-400">{terminalName}</p>
            <p className="text-slate-500 mt-2">$ cat ./status.txt</p>
            <p className="text-amber-400">{statusLabel}</p>
            <p className="text-slate-500 mt-2">$ ls ./open-to/</p>
            <p className="text-cyan-400">{openToRoles.join('  ')}</p>
            <p className="text-slate-500 mt-2">$ echo $LOCATION</p>
            <p className="text-slate-300">{location}</p>
          </div>
        )}

        {/* Problems Tab */}
        {panelTab === 'problems' && (
          <div className="font-mono text-xs text-slate-400 flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-emerald-400 text-lg mb-1">✓</p>
              <p>No problems detected</p>
              <p className="text-slate-600 text-[10px] mt-1">Ready to ship</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

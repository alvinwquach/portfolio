/**
 * Code Editor Hero Section
 * =========================
 * GreatFrontend-inspired layout showing profile data from Sanity.
 * - Left: About panel with key details
 * - Center: Code editor showing profile as TypeScript object
 * - Right: Preview card
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollParallax } from '@/components/gsap';
import type { Profile, SkillGroup } from '@/lib/graphql/queries';

interface PreviousCareer {
  title?: string;
  company?: string;
  description?: string;
  transferableSkills?: string[];
}

interface CodeEditorHeroProps {
  profile?: Profile | null;
  skillGroups?: SkillGroup[];
}

type TabName = 'developer' | 'skills' | 'career';
type PanelTab = 'output' | 'terminal' | 'problems';

// Default fallback data
const defaultProfile = {
  name: 'Alvin Quach',
  headline: 'Full-Stack Developer',
  location: 'San Francisco Bay Area',
  availabilityStatus: 'open' as const,
  openToRoles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
  strengths: ['Problem Solving', 'System Design', 'Clean Code'],
  whatIEnjoy: ['Building user-focused products', 'Performance optimization'],
  whatImLookingFor: ['Collaborative team', 'Challenging problems'],
};

// Generate code content from profile data
function generateCode(profile: Profile | null, skillGroups?: SkillGroup[]): string {
  const p = profile || defaultProfile;

  // Availability status map
  const statusMap: Record<string, string> = {
    open: 'Open to opportunities',
    freelance: 'Available for freelance',
    both: 'Open to full-time & freelance',
    unavailable: 'Not currently available',
  };

  // Build roles string - show all roles
  const rolesStr = (p.openToRoles || defaultProfile.openToRoles)
    .map(r => `    "${r}"`)
    .join(',\n');

  // Build strengths string
  const strengthsStr = (p.strengths || defaultProfile.strengths)
    .map(s => `"${s}"`)
    .join(', ');

  // Count skills
  const totalSkills = skillGroups?.reduce((acc, g) => acc + g.skills.length, 0) || 0;

  return `// Developer Profile
// =================
import skills from './skills';
import journey from './career';

const Developer = {
  name: "${p.name || defaultProfile.name}",
  role: "${p.headline || defaultProfile.headline}",
  location: "${p.location || defaultProfile.location}",

  // See skills.ts for full breakdown (${totalSkills} skills)
  techStack: Object.keys(skills),

  openTo: [
${rolesStr}
  ],

  strengths: [${strengthsStr}],

  careerPath: journey.length + " roles → tech",

  status: "${statusMap[p.availabilityStatus || 'open']}",
};

export default Developer;`;
}

// Generate skills.ts content
function generateSkillsCode(skillGroups?: SkillGroup[]): string {
  if (!skillGroups || skillGroups.length === 0) {
    return `// Technical Skills

export const skills = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind"],
  backend: ["Node.js", "GraphQL", "PostgreSQL"],
  tools: ["Git", "Docker", "Vercel"]
};

export default skills;`;
  }

  const categoriesStr = skillGroups.map(group => {
    const categoryName = group.category.replace(/-/g, '_').toLowerCase();
    const skillsList = group.skills.map(s => `"${s.name}"`).join(', ');
    return `  ${categoryName}: [${skillsList}]`;
  }).join(',\n');

  return `// Technical Skills (${skillGroups.reduce((a, g) => a + g.skills.length, 0)} total)

export const skills = {
${categoriesStr}
};

export default skills;`;
}

// Generate career.ts content
function generateCareerCode(previousCareers?: PreviousCareer[], currentRole?: string): string {
  if (!previousCareers || previousCareers.length === 0) {
    return `// Career Journey
// ==============
// The path from various industries to tech

type CareerStep = {
  role: string;
  company?: string;
  skills: string[];
  lesson: string;
};

export const journey: CareerStep[] = [
  {
    role: "Previous Career",
    skills: ["Communication", "Problem Solving"],
    lesson: "Every experience builds transferable skills"
  },
  {
    role: "Self-Taught Developer",
    skills: ["Persistence", "Curiosity", "Adaptability"],
    lesson: "The best time to start is now"
  }
];

export const currentRole = "${currentRole || 'Full-Stack Developer'}";
export default journey;`;
  }

  const journeySteps = previousCareers.map(career => {
    const skills = career.transferableSkills?.slice(0, 3).map(s => `"${s}"`).join(', ') || '"Adaptability"';
    return `  { role: "${career.title || 'Role'}", skills: [${skills}] }`;
  }).join(',\n');

  return `// Career Journey → Tech
// ${previousCareers.length} roles that shaped my path

export const journey = [
${journeySteps}
];

export const now = "${currentRole || 'Full-Stack Developer'}";
export default journey;`;
}

// Syntax highlighting
function highlightCode(code: string) {
  let highlighted = code;

  // Escape HTML
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Strings (including template literals)
  highlighted = highlighted.replace(
    /(`[^`]*`|"[^"]*"|'[^']*')/g,
    '<span class="text-emerald-400">$1</span>'
  );

  // Keywords
  const keywords = ['const', 'export', 'default', 'import', 'from', 'return', 'function'];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(
      regex,
      '<span class="text-purple-400">$1</span>'
    );
  });

  // Properties (before colon)
  highlighted = highlighted.replace(
    /(\w+):/g,
    '<span class="text-sky-400">$1</span>:'
  );

  // Brackets
  highlighted = highlighted.replace(
    /([{}[\]()])/g,
    '<span class="text-amber-300">$1</span>'
  );

  return highlighted;
}

// Line numbers
function LineNumbers({ count }: { count: number }) {
  return (
    <div className="select-none text-right pr-4 text-slate-600 text-xs font-mono">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="leading-5">{i + 1}</div>
      ))}
    </div>
  );
}

export function CodeEditorHero({ profile, skillGroups }: CodeEditorHeroProps) {
  const [activeTab, setActiveTab] = useState<TabName>('developer');
  const [panelTab, setPanelTab] = useState<PanelTab>('output');

  const p = profile || defaultProfile;

  // Generate code for each tab
  const developerCode = generateCode(profile || null, skillGroups);
  const skillsCode = generateSkillsCode(skillGroups);
  const careerCode = generateCareerCode(
    profile?.previousCareers as PreviousCareer[] | undefined,
    profile?.headline
  );

  // Get current tab content
  const codeContent = activeTab === 'developer'
    ? developerCode
    : activeTab === 'skills'
      ? skillsCode
      : careerCode;
  const lineCount = codeContent.split('\n').length;

  // Status config
  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: 'Open to Work', color: 'bg-emerald-500' },
    freelance: { label: 'Freelancing', color: 'bg-amber-500' },
    both: { label: 'Open to Opportunities', color: 'bg-emerald-500' },
    unavailable: { label: 'Not Available', color: 'bg-slate-500' },
  };
  const status = statusConfig[p.availabilityStatus || 'open'];

  return (
    <section className="relative min-h-screen overflow-hidden py-12 px-4">
      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Hero content - headline + CTA at top */}
        <div className="pt-16 md:pt-20 pb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              Building full-stack
              <br />
              <span className="text-muted-foreground">applications with care</span>
            </h1>
            <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl">
              Meet <span className="text-foreground font-medium">{p.name}</span>, a {p.headline?.toLowerCase() || 'full-stack developer'}{' '}
              who builds performant web applications with modern tooling.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-slate-900 rounded-lg font-medium hover:bg-emerald-400 transition-colors group"
              >
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 text-foreground rounded-lg font-medium hover:bg-slate-800/50 transition-colors"
              >
                Let's Talk
              </Link>
            </div>
          </div>
        </div>

        {/* Code Editor - Tilted back like laptop screen, rotates into view on scroll */}
        <ScrollParallax
          startRotateX={45}
          endRotateX={0}
          startY={100}
          endY={0}
          startOpacity={0.3}
          endOpacity={1}
          startScale={0.85}
          endScale={1}
          perspective={1200}
          start="top 95%"
          end="top 30%"
          scrub={1.2}
          className="relative w-full"
        >
          {/* Browser chrome */}
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 bg-slate-900">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
              </div>
              {/* URL bar */}
              <div className="flex-1 max-w-md mx-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-md text-xs text-slate-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  alvinquach.dev
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Main content - 2 rows */}
            <div className="flex flex-col">
              {/* Top row: Explorer + Code Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] h-[350px]">
                {/* Explorer Panel (Left Sidebar) */}
                <div className="bg-slate-900 border-r border-slate-700/50 p-4 hidden lg:block overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                  <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-4">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    Explorer
                  </div>

                  {/* File tree */}
                  <div className="space-y-1 text-sm font-mono">
                    <div className="flex items-center gap-2 text-slate-400 py-1">
                      <span className="text-amber-500">▾</span>
                      <span className="text-slate-300">src</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('developer')}
                      className={cn(
                        "flex items-center gap-2 py-1 pl-6 w-full text-left rounded transition-colors",
                        activeTab === 'developer'
                          ? "text-white bg-slate-700/50"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      )}
                    >
                      <span className="text-blue-400">⚛</span>
                      Developer.tsx
                    </button>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className={cn(
                        "flex items-center gap-2 py-1 pl-6 w-full text-left rounded transition-colors",
                        activeTab === 'skills'
                          ? "text-white bg-slate-700/50"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      )}
                    >
                      <span className="text-amber-500">TS</span>
                      skills.ts
                    </button>
                    <button
                      onClick={() => setActiveTab('career')}
                      className={cn(
                        "flex items-center gap-2 py-1 pl-6 w-full text-left rounded transition-colors",
                        activeTab === 'career'
                          ? "text-white bg-slate-700/50"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      )}
                    >
                      <span className="text-purple-400">TS</span>
                      career.ts
                    </button>
                  </div>

                  {/* Quick info */}
                  <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400">{p.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full ${status.color} animate-pulse`} />
                      <span className="text-slate-400">{status.label}</span>
                    </div>
                  </div>

                  {/* Open To - Show all roles */}
                  {p.openToRoles && p.openToRoles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Open To
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {p.openToRoles.map((role, i) => (
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

                {/* Code Editor */}
                <div className="bg-[#1e1e1e] flex flex-col overflow-hidden">
                  {/* Tab bar */}
                  <div className="flex items-center bg-slate-800 border-b border-slate-700/50">
                    <button
                      onClick={() => setActiveTab('developer')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                        activeTab === 'developer'
                          ? "bg-[#1e1e1e] text-slate-200 border-t-2 border-t-emerald-500"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                      )}
                    >
                      <span className="text-blue-400">⚛</span>
                      Developer.tsx
                    </button>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                        activeTab === 'skills'
                          ? "bg-[#1e1e1e] text-slate-200 border-t-2 border-t-amber-500"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                      )}
                    >
                      <span className="text-amber-500">TS</span>
                      skills.ts
                    </button>
                    <button
                      onClick={() => setActiveTab('career')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                        activeTab === 'career'
                          ? "bg-[#1e1e1e] text-slate-200 border-t-2 border-t-purple-500"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                      )}
                    >
                      <span className="text-purple-400">TS</span>
                      career.ts
                    </button>
                  </div>

                  {/* Code content - scrollable with hidden scrollbar */}
                  <div className="flex-1 overflow-auto p-4 font-mono text-xs scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                    <div className="flex">
                      <LineNumbers count={lineCount} />
                      <pre className="flex-1 leading-5 whitespace-pre">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(codeContent)
                          }}
                        />
                      </pre>
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className={cn(
                    "flex items-center justify-between px-4 py-1 text-white text-xs transition-colors",
                    activeTab === 'developer' ? "bg-emerald-600" :
                    activeTab === 'skills' ? "bg-amber-600" : "bg-purple-600"
                  )}>
                    <div className="flex items-center gap-4">
                      <span>{activeTab === 'developer' ? 'TypeScript React' : 'TypeScript'}</span>
                      <span>UTF-8</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Ln {lineCount}, Col 1</span>
                      <span>{activeTab}.{activeTab === 'developer' ? 'tsx' : 'ts'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom row: Output/Preview Panel */}
              <div className="bg-slate-950 border-t border-slate-700/50 hidden lg:block">
                <div className="flex items-center gap-1 px-4 py-2 bg-slate-800 border-b border-slate-700/50">
                  <button
                    onClick={() => setPanelTab('output')}
                    className={cn(
                      "text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors",
                      panelTab === 'output'
                        ? "text-slate-200 bg-slate-700"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", panelTab === 'output' ? "bg-amber-500" : "bg-slate-500")} />
                    Output
                  </button>
                  <button
                    onClick={() => setPanelTab('terminal')}
                    className={cn(
                      "text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors",
                      panelTab === 'terminal'
                        ? "text-slate-200 bg-slate-700"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", panelTab === 'terminal' ? "bg-emerald-500" : "bg-slate-500")} />
                    Terminal
                  </button>
                  <button
                    onClick={() => setPanelTab('problems')}
                    className={cn(
                      "text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors",
                      panelTab === 'problems'
                        ? "text-slate-200 bg-slate-700"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", panelTab === 'problems' ? "bg-emerald-500" : "bg-slate-500")} />
                    Problems
                    <span className="text-[10px] text-emerald-400">0</span>
                  </button>
                </div>

                {/* Panel content */}
                <div className="p-4 h-[140px] overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                  {panelTab === 'output' && (
                    <div className="flex items-start gap-6">
                      {/* Profile Card */}
                      <div className="bg-slate-900 rounded-lg border border-slate-700/50 overflow-hidden min-w-[260px]">
                        <div className="p-3 border-b border-slate-800 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            {p.name?.split(' ').map(n => n[0]).join('') || 'AQ'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                            <p className="text-xs text-emerald-400">{p.headline}</p>
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

                      {/* Output log */}
                      <div className="flex-1 font-mono text-xs text-slate-400 space-y-1">
                        <p className="text-emerald-400">✓ Compiled successfully</p>
                        <p className="text-slate-500">└─ Developer.tsx exported</p>
                        <p className="text-slate-500">└─ skills.ts loaded ({skillGroups?.reduce((acc, g) => acc + g.skills.length, 0) || 0} skills)</p>
                        <p className="text-slate-500">└─ career.ts parsed ({profile?.previousCareers?.length || 0} milestones)</p>
                        <p className="mt-2 text-amber-400">Ready to render portfolio...</p>
                      </div>
                    </div>
                  )}

                  {panelTab === 'terminal' && (
                    <div className="font-mono text-xs space-y-1">
                      <p className="text-slate-500">$ whoami</p>
                      <p className="text-emerald-400">{p.name?.toLowerCase().replace(' ', '.')}</p>
                      <p className="text-slate-500 mt-2">$ cat ./status.txt</p>
                      <p className="text-amber-400">{status.label}</p>
                      <p className="text-slate-500 mt-2">$ ls ./open-to/</p>
                      <p className="text-cyan-400">{p.openToRoles?.join('  ') || 'opportunities'}</p>
                      <p className="text-slate-500 mt-2">$ echo $LOCATION</p>
                      <p className="text-slate-300">{p.location}</p>
                    </div>
                  )}

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
            </div>
          </div>
        </ScrollParallax>
      </div>

    </section>
  );
}

/**
 * Editor Mockup Component
 * =======================
 * A realistic code editor mockup showing a Developer profile.
 * Used in the hero section with scroll-driven parallax animation.
 */

'use client';

import * as React from 'react';

interface EditorMockupProps {
  className?: string;
}

export function EditorMockup({ className }: EditorMockupProps) {
  const codeScrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = React.useState(true);

  // Hide scroll hint after user scrolls
  const handleScroll = () => {
    if (showScrollHint) {
      setShowScrollHint(false);
    }
  };

  return (
    <div className={className}>
      {/* Window Chrome */}
      <div className="rounded-xl border border-border/50 bg-[#1e1e2e] shadow-2xl overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-border/30">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* URL Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e2e] rounded-md text-xs text-muted-foreground">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>alvinquach.dev</span>
            </div>
          </div>

          <div className="w-16" />
        </div>

        {/* Editor Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 bg-[#181825] border-r border-border/30 py-2 hidden sm:block">
            <div className="px-3 py-1 text-xs text-muted-foreground uppercase tracking-wider">
              Explorer
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground">
                <span className="text-amber">▼</span>
                <span>src</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-1 text-sm bg-[#1e1e2e] text-foreground">
                <span className="text-cyan">◆</span>
                <span>Developer.tsx</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-1 text-sm text-muted-foreground">
                <span className="text-blue-400">TS</span>
                <span>skills.ts</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-1 text-sm text-muted-foreground">
                <span className="text-blue-400">TS</span>
                <span>career.ts</span>
              </div>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 p-4 font-mono text-sm relative">
            {/* Tab Bar */}
            <div className="flex items-center gap-1 mb-4 -mt-1 -mx-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e2e] rounded-t text-foreground text-xs border-b-2 border-cyan">
                <span className="text-cyan">◆</span>
                Developer.tsx
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground text-xs">
                <span className="text-blue-400">TS</span>
                skills.ts
              </div>
            </div>

            {/* Code Lines - Scrollable */}
            <div
              ref={codeScrollRef}
              onScroll={handleScroll}
              className="space-y-0.5 text-xs sm:text-sm overflow-x-auto overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent"
            >
              <CodeLine num={1} content={<><span className="text-purple-400">const</span> <span className="text-cyan">Developer</span> = {'{'}</>} />
              <CodeLine num={2} content={<>  <span className="text-foreground">name</span>: <span className="text-amber">"Alvin Quach"</span>,</>} />
              <CodeLine num={3} content={<>  <span className="text-foreground">role</span>: <span className="text-amber">"Full Stack Developer"</span>,</>} />
              <CodeLine num={4} content={<>  <span className="text-foreground">stack</span>: [<span className="text-amber">"Next.js"</span>, <span className="text-amber">"TypeScript"</span>, <span className="text-amber">"PostgreSQL"</span>],</>} />
              <CodeLine num={5} content={<>  <span className="text-foreground">focus</span>: [<span className="text-amber">"Performance"</span>, <span className="text-amber">"Accessibility"</span>],</>} />
              <CodeLine num={6} content={<>  <span className="text-foreground">status</span>: <span className="text-amber">"Open to opportunities"</span>,</>} />
              <CodeLine num={7} content={<>{'}'}</>} />
              <CodeLine num={8} content="" />
              <CodeLine num={9} content={<><span className="text-purple-400">export default</span> <span className="text-cyan">Developer</span></>} />
              <CodeLine num={10} content="" />
              <CodeLine num={11} content={<><span className="text-gray-500">{"// Skills & Technologies"}</span></>} />
              <CodeLine num={12} content={<><span className="text-purple-400">const</span> <span className="text-cyan">skills</span> = {'{'}</>} />
              <CodeLine num={13} content={<>  <span className="text-foreground">frontend</span>: [<span className="text-amber">"React"</span>, <span className="text-amber">"Next.js"</span>, <span className="text-amber">"TypeScript"</span>],</>} />
              <CodeLine num={14} content={<>  <span className="text-foreground">backend</span>: [<span className="text-amber">"Node.js"</span>, <span className="text-amber">"Python"</span>, <span className="text-amber">"GraphQL"</span>],</>} />
              <CodeLine num={15} content={<>  <span className="text-foreground">database</span>: [<span className="text-amber">"PostgreSQL"</span>, <span className="text-amber">"Redis"</span>, <span className="text-amber">"Prisma"</span>],</>} />
              <CodeLine num={16} content={<>  <span className="text-foreground">tools</span>: [<span className="text-amber">"Git"</span>, <span className="text-amber">"Docker"</span>, <span className="text-amber">"AWS"</span>],</>} />
              <CodeLine num={17} content={<>{'}'}</>} />
            </div>

            {/* Scroll Hint Indicator */}
            {showScrollHint && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                <span>Scroll</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeLine({ num, content }: { num: number; content: React.ReactNode }) {
  return (
    <div className="flex">
      <span className="w-8 text-right pr-4 text-muted-foreground/40 select-none">{num}</span>
      <span className="text-muted-foreground">{content}</span>
    </div>
  );
}

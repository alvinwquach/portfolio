/**
 * Editor Mockup Component
 * =======================
 * A realistic code editor mockup showing a Developer profile.
 * Used in the hero section with scroll-driven parallax animation.
 */

'use client';

import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EditorMockupProps {
  className?: string;
}

type Language = 'typescript' | 'python';

export function EditorMockup({ className }: EditorMockupProps) {
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [language, setLanguage] = useState<Language>('typescript');

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
        <div className="flex items-center px-4 py-3 bg-[#181825] border-b border-border/30">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2 w-16">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
          </div>

          {/* URL Bar - Centered */}
          <div className="flex-1 flex justify-center">
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
                <span className={language === 'typescript' ? 'text-info' : 'text-warning'}>
                  {language === 'typescript' ? 'TS' : 'PY'}
                </span>
                <span>{language === 'typescript' ? 'developer.ts' : 'developer.py'}</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-1 text-sm text-muted-foreground">
                <span className="text-success">{'{ }'}</span>
                <span>types.d.ts</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-1 text-sm text-muted-foreground">
                <span className="text-amber">⚙</span>
                <span>tsconfig.json</span>
              </div>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 p-4 font-mono text-sm relative">
            {/* Tab Bar with Language Toggle */}
            <div className="flex items-center justify-between mb-4 -mt-1 -mx-1">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e2e] rounded-t text-foreground text-xs border-b-2 border-cyan">
                  <span className={language === 'typescript' ? 'text-info' : 'text-warning'}>
                    {language === 'typescript' ? 'TS' : 'PY'}
                  </span>
                  {language === 'typescript' ? 'developer.ts' : 'developer.py'}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground text-xs hidden sm:flex">
                  <span className="text-success">{'{ }'}</span>
                  types.d.ts
                </div>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center gap-1 mr-1">
                <button
                  onClick={() => setLanguage('typescript')}
                  className={cn(
                    'px-2 py-1 text-xs rounded transition-colors',
                    language === 'typescript'
                      ? 'bg-info/20 text-info border border-info/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-[#181825]'
                  )}
                >
                  TS
                </button>
                <button
                  onClick={() => setLanguage('python')}
                  className={cn(
                    'px-2 py-1 text-xs rounded transition-colors',
                    language === 'python'
                      ? 'bg-warning/20 text-warning border border-warning/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-[#181825]'
                  )}
                >
                  PY
                </button>
              </div>
            </div>

            {/* Code Lines - Scrollable */}
            <div
              ref={codeScrollRef}
              onScroll={handleScroll}
              className="space-y-0.5 text-xs sm:text-sm overflow-x-auto overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent"
            >
              {language === 'typescript' ? (
                <TypeScriptCode />
              ) : (
                <PythonCode />
              )}
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

function CodeLine({ num, content }: { num: number; content: ReactNode }) {
  return (
    <div className="flex">
      <span className="w-8 text-right pr-4 text-muted-foreground/40 select-none">{num}</span>
      <span className="text-muted-foreground">{content}</span>
    </div>
  );
}

function TypeScriptCode() {
  return (
    <>
      <CodeLine num={1} content={<><span className="text-text-muted">{"// Types catch bugs at compile time, not runtime"}</span></>} />
      <CodeLine num={2} content={<><span className="text-accent">type</span> <span className="text-cyan">Status</span> = <span className="text-amber">"available"</span> | <span className="text-amber">"busy"</span> | <span className="text-amber">"open-to-work"</span>;</>} />
      <CodeLine num={3} content="" />
      <CodeLine num={4} content={<><span className="text-accent">interface</span> <span className="text-cyan">Developer</span> {'{'}</>} />
      <CodeLine num={5} content={<>  <span className="text-accent">readonly</span> <span className="text-foreground">name</span>: <span className="text-success">string</span>;   <span className="text-text-muted">{"// immutable after creation"}</span></>} />
      <CodeLine num={6} content={<>  <span className="text-foreground">role</span>: <span className="text-success">string</span>;</>} />
      <CodeLine num={7} content={<>  <span className="text-foreground">stack</span>: <span className="text-success">readonly string[]</span>; <span className="text-text-muted">{"// prevent accidental mutations"}</span></>} />
      <CodeLine num={8} content={<>  <span className="text-foreground">status</span>: <span className="text-cyan">Status</span>;           <span className="text-text-muted">{"// union type = only these values"}</span></>} />
      <CodeLine num={9} content={<>  <span className="text-foreground">yearsExp</span>: <span className="text-success">number</span>;</>} />
      <CodeLine num={10} content={<>{'}'}</>} />
      <CodeLine num={11} content="" />
      <CodeLine num={12} content={<><span className="text-text-muted">{"// Object satisfies the interface - TS validates every field"}</span></>} />
      <CodeLine num={13} content={<><span className="text-accent">const</span> <span className="text-foreground">alvin</span>: <span className="text-cyan">Developer</span> = {'{'}</>} />
      <CodeLine num={14} content={<>  <span className="text-foreground">name</span>: <span className="text-amber">"Alvin Quach"</span>,</>} />
      <CodeLine num={15} content={<>  <span className="text-foreground">role</span>: <span className="text-amber">"Full Stack Developer"</span>,</>} />
      <CodeLine num={16} content={<>  <span className="text-foreground">stack</span>: [<span className="text-amber">"React"</span>, <span className="text-amber">"Next.js"</span>, <span className="text-amber">"TypeScript"</span>, <span className="text-amber">"Node.js"</span>],</>} />
      <CodeLine num={17} content={<>  <span className="text-foreground">status</span>: <span className="text-amber">"open-to-work"</span>,</>} />
      <CodeLine num={18} content={<>  <span className="text-foreground">yearsExp</span>: <span className="text-accent">5</span>,</>} />
      <CodeLine num={19} content={<>{'}'} <span className="text-accent">as const</span>;  <span className="text-text-muted">{"// as const = deeply readonly"}</span></>} />
      <CodeLine num={20} content="" />
      <CodeLine num={21} content={<><span className="text-text-muted">{"// Generic function - works with any type, stays type-safe"}</span></>} />
      <CodeLine num={22} content={<><span className="text-accent">function</span> <span className="text-info">buildsWith</span>{'<'}<span className="text-cyan">T</span> <span className="text-accent">extends</span> <span className="text-success">string</span>{'>'}(<span className="text-foreground">tech</span>: <span className="text-cyan">T</span>): <span className="text-success">boolean</span> {'{'}</>} />
      <CodeLine num={23} content={<>  <span className="text-accent">return</span> alvin.stack.<span className="text-info">includes</span>(tech);</>} />
      <CodeLine num={24} content={<>{'}'}</>} />
      <CodeLine num={25} content="" />
      <CodeLine num={26} content={<><span className="text-text-muted">{"// Type inference - TS knows this returns boolean"}</span></>} />
      <CodeLine num={27} content={<><span className="text-accent">const</span> <span className="text-foreground">usesTypeScript</span> = <span className="text-info">buildsWith</span>(<span className="text-amber">"TypeScript"</span>); <span className="text-text-muted">{"// ✓ true"}</span></>} />
      <CodeLine num={28} content={<><span className="text-accent">const</span> <span className="text-foreground">usesRust</span> = <span className="text-info">buildsWith</span>(<span className="text-amber">"Rust"</span>);       <span className="text-text-muted">{"// ✗ false"}</span></>} />
    </>
  );
}

function PythonCode() {
  return (
    <>
      <CodeLine num={1} content={<><span className="text-text-muted">{"# Type hints catch bugs before runtime with mypy"}</span></>} />
      <CodeLine num={2} content={<><span className="text-accent">from</span> <span className="text-foreground">typing</span> <span className="text-accent">import</span> <span className="text-foreground">Literal</span>, <span className="text-foreground">Final</span></>} />
      <CodeLine num={3} content={<><span className="text-accent">from</span> <span className="text-foreground">dataclasses</span> <span className="text-accent">import</span> <span className="text-foreground">dataclass</span>, <span className="text-foreground">field</span></>} />
      <CodeLine num={4} content="" />
      <CodeLine num={5} content={<><span className="text-text-muted">{"# Literal restricts values - like union types in TS"}</span></>} />
      <CodeLine num={6} content={<><span className="text-cyan">Status</span> = <span className="text-foreground">Literal</span>[<span className="text-amber">"available"</span>, <span className="text-amber">"busy"</span>, <span className="text-amber">"open-to-work"</span>]</>} />
      <CodeLine num={7} content="" />
      <CodeLine num={8} content={<><span className="text-warning">@dataclass</span>(<span className="text-foreground">frozen</span>=<span className="text-accent">True</span>)  <span className="text-text-muted">{"# frozen = immutable"}</span></>} />
      <CodeLine num={9} content={<><span className="text-accent">class</span> <span className="text-cyan">Developer</span>:</>} />
      <CodeLine num={10} content={<>  <span className="text-foreground">name</span>: <span className="text-cyan">Final</span>[<span className="text-success">str</span>]         <span className="text-text-muted">{"# Final = can't reassign"}</span></>} />
      <CodeLine num={11} content={<>  <span className="text-foreground">role</span>: <span className="text-success">str</span></>} />
      <CodeLine num={12} content={<>  <span className="text-foreground">stack</span>: <span className="text-success">tuple</span>[<span className="text-success">str</span>, ...]   <span className="text-text-muted">{"# tuple = immutable list"}</span></>} />
      <CodeLine num={13} content={<>  <span className="text-foreground">status</span>: <span className="text-cyan">Status</span></>} />
      <CodeLine num={14} content={<>  <span className="text-foreground">years_exp</span>: <span className="text-success">int</span></>} />
      <CodeLine num={15} content="" />
      <CodeLine num={16} content={<><span className="text-text-muted">{"# Dataclass validates types when used with mypy"}</span></>} />
      <CodeLine num={17} content={<><span className="text-foreground">alvin</span> = <span className="text-cyan">Developer</span>(</>} />
      <CodeLine num={18} content={<>  <span className="text-foreground">name</span>=<span className="text-amber">"Alvin Quach"</span>,</>} />
      <CodeLine num={19} content={<>  <span className="text-foreground">role</span>=<span className="text-amber">"Full Stack Developer"</span>,</>} />
      <CodeLine num={20} content={<>  <span className="text-foreground">stack</span>=(<span className="text-amber">"React"</span>, <span className="text-amber">"Next.js"</span>, <span className="text-amber">"TypeScript"</span>, <span className="text-amber">"Node.js"</span>),</>} />
      <CodeLine num={21} content={<>  <span className="text-foreground">status</span>=<span className="text-amber">"open-to-work"</span>,</>} />
      <CodeLine num={22} content={<>  <span className="text-foreground">years_exp</span>=<span className="text-accent">5</span>,</>} />
      <CodeLine num={23} content={<>)</>} />
      <CodeLine num={24} content="" />
      <CodeLine num={25} content={<><span className="text-text-muted">{"# Generic function with type bounds"}</span></>} />
      <CodeLine num={26} content={<><span className="text-accent">def</span> <span className="text-info">builds_with</span>(<span className="text-foreground">tech</span>: <span className="text-success">str</span>) -{'>'} <span className="text-success">bool</span>:</>} />
      <CodeLine num={27} content={<>  <span className="text-accent">return</span> tech <span className="text-accent">in</span> alvin.stack</>} />
      <CodeLine num={28} content="" />
      <CodeLine num={29} content={<><span className="text-foreground">uses_typescript</span> = <span className="text-info">builds_with</span>(<span className="text-amber">"TypeScript"</span>)  <span className="text-text-muted">{"# ✓ True"}</span></>} />
      <CodeLine num={30} content={<><span className="text-foreground">uses_rust</span> = <span className="text-info">builds_with</span>(<span className="text-amber">"Rust"</span>)        <span className="text-text-muted">{"# ✗ False"}</span></>} />
    </>
  );
}

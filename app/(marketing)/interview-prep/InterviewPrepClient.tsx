/**
 * Interview Prep — Sidebar + 2-Column Grid
 * ==========================================
 *
 * LAYOUT (matches /projects, /blog, /experience):
 *   LEFT SIDEBAR (280px, sticky):
 *     - Avatar + name
 *     - "Interview Prep" title + stats
 *     - Category filters with counts
 *     - Difficulty filter (Easy/Medium/Hard)
 *     - Starred toggle
 *
 *   RIGHT CONTENT (flex-1):
 *     - Search bar
 *     - 2-column question card grid
 *     - Infinite scroll
 *     - CTA at bottom
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Star,
  Search,
  X,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { QuestionCard, type InterviewQuestion } from '@/components/questions/QuestionCard';

interface InterviewPrepClientProps {
  questions: InterviewQuestion[];
}

const categoryLabels: Record<string, string> = {
  react: 'React',
  nextjs: 'Next.js',
  frontend: 'Frontend',
  fullstack: 'Full Stack',
  'system-design': 'System Design',
  system_design: 'System Design',
  performance: 'Performance',
  security: 'Security',
  debugging: 'Debugging',
  behavioral: 'Behavioral',
  behavioral_collaboration: 'Collaboration',
  behavioral_failure: 'Failure',
  behavioral_growth: 'Growth',
  stanford: 'Stanford',
};

const difficultyConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
};

export function InterviewPrepClient({ questions }: InterviewPrepClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string | null>(searchParams.get('difficulty'));
  const [showStarredOnly, setShowStarredOnly] = React.useState(searchParams.get('starred') === 'true');
  const [selectedQuestion, setSelectedQuestion] = React.useState<InterviewQuestion | null>(null);
  const [currentPage, setCurrentPage] = React.useState(() => {
    const p = searchParams.get('page');
    return p ? Math.max(1, parseInt(p, 10)) : 1;
  });

  const PAGE_SIZE = 20;

  const updateURL = React.useCallback((updates: { q?: string; category?: string[]; difficulty?: string | null; starred?: boolean; page?: number }) => {
    const params = new URLSearchParams();
    const q = updates.q ?? searchQuery;
    const category = updates.category ?? selectedCategories;
    const difficulty = updates.difficulty ?? selectedDifficulty;
    const starred = updates.starred ?? showStarredOnly;
    const page = updates.page ?? currentPage;
    if (q) params.set('q', q);
    if (category.length > 0) params.set('category', category.join(','));
    if (difficulty) params.set('difficulty', difficulty);
    if (starred) params.set('starred', 'true');
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.push(qs ? `/interview-prep?${qs}` : '/interview-prep', { scroll: false });
  }, [router, searchQuery, selectedCategories, selectedDifficulty, showStarredOnly, currentPage]);

  const allCategories = React.useMemo(() => {
    const cats = new Map<string, number>();
    questions.forEach(q => { if (q.category) cats.set(q.category, (cats.get(q.category) || 0) + 1); });
    return Array.from(cats.entries()).sort((a, b) => b[1] - a[1]);
  }, [questions]);

  const filteredQuestions = React.useMemo(() => {
    return questions.filter(q => {
      if (searchQuery) {
        const s = searchQuery.toLowerCase();
        if (!q.question.toLowerCase().includes(s) && !q.tags?.some(t => t.toLowerCase().includes(s)) && !q.keyPoints?.some(kp => kp.toLowerCase().includes(s))) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(q.category)) return false;
      if (selectedDifficulty && q.difficulty !== selectedDifficulty) return false;
      if (showStarredOnly && !q.isStarred) return false;
      return true;
    });
  }, [questions, searchQuery, selectedCategories, selectedDifficulty, showStarredOnly]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleQuestions = filteredQuestions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    updateURL({ page: p });
    // Scroll main content to top
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestionIndex = selectedQuestion ? filteredQuestions.findIndex(q => q._id === selectedQuestion._id) : -1;
  const handlePrevious = React.useCallback(() => { if (currentQuestionIndex > 0) setSelectedQuestion(filteredQuestions[currentQuestionIndex - 1]); }, [currentQuestionIndex, filteredQuestions]);
  const handleNext = React.useCallback(() => { if (currentQuestionIndex < filteredQuestions.length - 1) setSelectedQuestion(filteredQuestions[currentQuestionIndex + 1]); }, [currentQuestionIndex, filteredQuestions]);

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => { setSearchQuery(value); setCurrentPage(1); updateURL({ q: value, page: 1 }); };
  const toggleCategory = (cat: string) => {
    const next = selectedCategories.includes(cat) ? selectedCategories.filter(c => c !== cat) : [...selectedCategories, cat];
    setSelectedCategories(next); setCurrentPage(1);
    updateURL({ category: next, page: 1 });
  };
  const handleDifficulty = (diff: string) => {
    const next = selectedDifficulty === diff ? null : diff;
    setSelectedDifficulty(next); setCurrentPage(1);
    updateURL({ difficulty: next, page: 1 });
  };
  const handleStarred = () => { const next = !showStarredOnly; setShowStarredOnly(next); setCurrentPage(1); updateURL({ starred: next, page: 1 }); };
  const clearAll = () => { setSearchQuery(''); setSelectedCategories([]); setSelectedDifficulty(null); setShowStarredOnly(false); setCurrentPage(1); router.push('/interview-prep', { scroll: false }); };

  const starredCount = questions.filter(q => q.isStarred).length;
  const hasFilters = searchQuery || selectedCategories.length > 0 || selectedDifficulty || showStarredOnly;

  return (
    <>
      {/* Mobile layout */}
      <div className="lg:hidden" style={{ minHeight: 'calc(100vh - 80px)', padding: '24px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 4px' }}>Interview Prep</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {questions.length} questions · {starredCount} starred
          </p>
        </div>

        {/* Mobile search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Search questions..."
            style={{ width: '100%', padding: '8px 8px 8px 32px', fontSize: 13, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'var(--ds-text)', outline: 'none' }} />
        </div>

        {/* Mobile difficulty pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {Object.entries(difficultyConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => handleDifficulty(key)}
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
                backgroundColor: selectedDifficulty === key ? cfg.bg : 'rgba(255,255,255,0.04)',
                color: selectedDifficulty === key ? cfg.color : 'rgba(255,255,255,0.4)',
                borderWidth: 1, borderStyle: 'solid', borderColor: selectedDifficulty === key ? cfg.border : 'rgba(255,255,255,0.06)' }}>
              {cfg.label}
            </button>
          ))}
          <button onClick={handleStarred}
            style={{ fontSize: 12, padding: '4px 12px', borderRadius: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              backgroundColor: showStarredOnly ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)',
              color: showStarredOnly ? '#f59e0b' : 'rgba(255,255,255,0.4)',
              borderWidth: 1, borderStyle: 'solid', borderColor: showStarredOnly ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)' }}>
            <Star size={11} /> Starred
          </button>
        </div>

        {/* Mobile cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleQuestions.map(q => <QuestionCard key={q._id} question={q} onClick={() => setSelectedQuestion(q)} />)}
          {filteredQuestions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>No questions match your filters.</p>
              <button onClick={clearAll} style={{ fontSize: 13, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>Clear filters</button>
            </div>
          )}
        </div>
        {totalPages > 1 && <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={goToPage} />}
      </div>

      {/* Desktop layout — sidebar + content */}
      <div className="hidden lg:flex" style={{ minHeight: 'calc(100vh - 80px)' }}>

        {/* ═══ SIDEBAR ═══════════════════════════════════ */}
        <aside style={{
          width: 280, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 28px 24px',
          overflowY: 'auto', position: 'sticky', top: 80, height: 'calc(100vh - 80px)',
        }}>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>AQ</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>Alvin Quach</span>
          </div>

          {/* Title + stats */}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 8px' }}>Interview Prep</h1>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--ds-text)', margin: 0 }}>{questions.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>questions</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b', margin: 0 }}>{starredCount}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>starred</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6', margin: 0 }}>{allCategories.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>categories</p>
            </div>
          </div>

          {/* Category filters */}
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Category</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {allCategories.map(([cat, count]) => {
              const isActive = selectedCategories.includes(cat);
              return (
                <button key={cat} onClick={() => toggleCategory(cat)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 10px', borderRadius: 6, fontSize: 13, border: 'none',
                    backgroundColor: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                    color: isActive ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
                  }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: isActive ? '#3b82f6' : 'rgba(255,255,255,0.15)' }} />
                    {categoryLabels[cat] || cat.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Difficulty filter */}
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Difficulty</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {Object.entries(difficultyConfig).map(([key, cfg]) => (
              <button key={key} onClick={() => handleDifficulty(key)}
                style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  backgroundColor: selectedDifficulty === key ? cfg.bg : 'rgba(255,255,255,0.03)',
                  color: selectedDifficulty === key ? cfg.color : 'rgba(255,255,255,0.4)',
                  borderWidth: 1, borderStyle: 'solid', borderColor: selectedDifficulty === key ? cfg.border : 'rgba(255,255,255,0.06)',
                }}>
                {cfg.label}
              </button>
            ))}
          </div>

          {/* Starred toggle */}
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Show</p>
          <button onClick={handleStarred}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer', width: '100%', transition: 'all 0.15s',
              backgroundColor: showStarredOnly ? 'rgba(245,158,11,0.08)' : 'transparent',
              color: showStarredOnly ? '#f59e0b' : 'rgba(255,255,255,0.5)',
            }}>
            <Star size={13} style={showStarredOnly ? { fill: '#f59e0b' } : undefined} />
            Starred only ({starredCount})
          </button>

          {hasFilters && (
            <button onClick={clearAll}
              style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 16, padding: 0 }}>
              Clear all filters
            </button>
          )}
        </aside>

        {/* ═══ MAIN CONTENT ══════════════════════════════ */}
        <main style={{ flex: 1, minWidth: 0, padding: '32px 32px 48px' }}>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 320, marginBottom: 24 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
            <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Search questions, tags..."
              style={{ width: '100%', padding: '9px 36px 9px 34px', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: 'var(--ds-text)', outline: 'none', transition: 'border-color 0.15s' }} />
            {searchQuery && (
              <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.3)' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Results info */}
          {hasFilters && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              {filteredQuestions.length} of {questions.length} questions
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}

          {/* Question grid */}
          {filteredQuestions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: 16 }}>
                {visibleQuestions.map(q => <QuestionCard key={q._id} question={q} onClick={() => setSelectedQuestion(q)} />)}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={goToPage} />
              )}

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 6px' }}>Want to See These in Action?</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '0 0 16px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                  Every answer references real projects I&apos;ve built. Explore them to see the code and decision-making behind these responses.
                </p>
                <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
                  View All Projects <ArrowRight size={13} />
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>No questions match your filters.</p>
              <button onClick={clearAll} style={{ fontSize: 13, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>Clear filters</button>
            </div>
          )}
        </main>
      </div>

      {/* Overlay detail panel */}
      {selectedQuestion && (
        <OverlayDetailPanel
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={currentQuestionIndex > 0}
          hasNext={currentQuestionIndex < filteredQuestions.length - 1}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════════

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  // Show a window of page numbers around current page
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '24px 0' }}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
        style={{ padding: '6px 8px', borderRadius: 6, border: 'none', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', color: currentPage <= 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)' }}
        className="hover:bg-white/5 transition-colors">
        <ChevronsLeft size={14} />
      </button>

      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} style={{ padding: '4px 6px', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>…</span>
        ) : (
          <button key={page} onClick={() => onPageChange(page)}
            style={{
              minWidth: 32, padding: '5px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              backgroundColor: page === currentPage ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: page === currentPage ? '#3b82f6' : 'rgba(255,255,255,0.4)',
            }}
            className="hover:bg-white/5 transition-colors">
            {page}
          </button>
        )
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}
        style={{ padding: '6px 8px', borderRadius: 6, border: 'none', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', backgroundColor: 'transparent', color: currentPage >= totalPages ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)' }}
        className="hover:bg-white/5 transition-colors">
        <ChevronsRight size={14} />
      </button>

      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// INLINE DETAIL PANEL — pushes grid aside
// ═══════════════════════════════════════════════════════

const difficultyColors: Record<string, { color: string; bg: string; border: string }> = {
  easy: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  medium: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
  hard: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
};

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 10px' }}>{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: '16px 0 6px' }}>{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-text)', margin: '12px 0 4px' }}>{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul style={{ listStyle: 'disc', paddingLeft: 18, marginBottom: 10, display: 'flex', flexDirection: 'column' as const, gap: 3 }}>{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600, color: 'var(--ds-text)' }}>{children}</strong>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code style={{ padding: '1px 5px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 3, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{children}</code>
    ),
  },
};

function OverlayDetailPanel({
  question, onClose, onPrevious, onNext, hasPrevious, hasNext,
}: {
  question: InterviewQuestion;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrevious) onPrevious();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = ''; };
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

  const dc = difficultyColors[question.difficulty];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', right: 0, top: 0, zIndex: 50,
        width: '100%', maxWidth: 520, height: '100%',
        backgroundColor: '#0d1117', borderLeft: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
      }} className="animate-in slide-in-from-right-full duration-300">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            <button onClick={onPrevious} disabled={!hasPrevious}
              style={{ padding: 3, borderRadius: 4, border: 'none', cursor: hasPrevious ? 'pointer' : 'not-allowed', backgroundColor: 'transparent', color: hasPrevious ? 'var(--ds-text)' : 'rgba(255,255,255,0.1)' }}>
              <ChevronsLeft size={14} />
            </button>
            <button onClick={onNext} disabled={!hasNext}
              style={{ padding: 3, borderRadius: 4, border: 'none', cursor: hasNext ? 'pointer' : 'not-allowed', backgroundColor: 'transparent', color: hasNext ? 'var(--ds-text)' : 'rgba(255,255,255,0.1)' }}>
              <ChevronsRight size={14} />
            </button>
          </div>
          {question.isStarred && <Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />}
          {dc && (
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', padding: '1px 6px', borderRadius: 3, backgroundColor: dc.bg, color: dc.color, border: `1px solid ${dc.border}` }}>
              {question.difficulty}
            </span>
          )}
        </div>
        <button onClick={onClose} style={{ padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.4)' }} className="hover:text-white transition-colors">
          <X size={15} />
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ds-text)', margin: 0, lineHeight: 1.3 }}>{question.question}</h2>

        {/* Answer */}
        {question.answer && question.answer.length > 0 && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>Answer</p>
            <div style={{ paddingLeft: 12, borderLeft: '2px solid rgba(59,130,246,0.15)' }}>
              <PortableText value={question.answer} components={portableTextComponents} />
            </div>
          </div>
        )}

        {/* Key Points */}
        {question.keyPoints && question.keyPoints.length > 0 && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>Key Points</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {question.keyPoints.map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12 }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {(question.projectReferences?.length > 0 || question.experienceReferences?.length > 0) && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>References</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {question.projectReferences?.map(p => (
                <Link key={p._id} href={`/project/${p.slug.current}`}
                  style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(59,130,246,0.08)', color: '#3b82f6', textDecoration: 'none' }}>
                  {p.name}
                </Link>
              ))}
              {question.experienceReferences?.map(e => (
                <span key={e._id} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(245,158,11,0.08)', color: '#f59e0b' }}>
                  {e.role} @ {e.company}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Follow-ups */}
        {question.followUpQuestions && question.followUpQuestions.length > 0 && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>Follow-ups</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {question.followUpQuestions.map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: 5, fontSize: 12 }}>
                  <span style={{ color: '#f59e0b' }}>→</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Red flags */}
        {question.redFlags && question.redFlags.length > 0 && (
          <div style={{ padding: '10px 12px', borderRadius: 6, backgroundColor: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ef4444', margin: '0 0 6px', fontFamily: 'var(--font-mono)' }}>Avoid</p>
            {question.redFlags.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 5, fontSize: 12, marginBottom: 2 }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span style={{ color: 'rgba(239,68,68,0.6)' }}>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {question.tags.map((tag, i) => (
              <span key={i} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: 'rgba(255,255,255,0.15)', textAlign: 'center', flexShrink: 0 }}>
        <kbd style={{ padding: '1px 4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>Esc</kbd> close · <kbd style={{ padding: '1px 4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>←</kbd><kbd style={{ padding: '1px 4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>→</kbd> navigate
      </div>
    </div>
    </>
  );
}

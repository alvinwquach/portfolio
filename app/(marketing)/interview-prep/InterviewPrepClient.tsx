/**
 * Interview Prep Client Component
 * ================================
 * Card grid layout with URL-synced filters and infinite scroll
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Code,
  Layers,
  Gauge,
  Shield,
  Users,
  Target,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Search,
  X,
  SlidersHorizontal,
  Filter,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { QuestionCard, type InterviewQuestion } from '@/components/questions/QuestionCard';
import { QuestionDetailPanel } from '@/components/questions/QuestionDetailPanel';

interface InterviewPrepClientProps {
  questions: InterviewQuestion[];
}

const categoryConfig: Record<string, { icon: typeof Code; label: string; color: string }> = {
  react: { icon: Code, label: 'React', color: 'text-blue-500' },
  nextjs: { icon: Layers, label: 'Next.js', color: 'text-foreground' },
  frontend: { icon: Code, label: 'Frontend', color: 'text-blue-500' },
  fullstack: { icon: Layers, label: 'Full Stack', color: 'text-purple-500' },
  'system-design': { icon: Layers, label: 'System Design', color: 'text-purple-500' },
  system_design: { icon: Layers, label: 'System Design', color: 'text-purple-500' },
  performance: { icon: Gauge, label: 'Performance', color: 'text-green-500' },
  security: { icon: Shield, label: 'Security', color: 'text-red-500' },
  debugging: { icon: AlertTriangle, label: 'Debugging', color: 'text-orange-500' },
  behavioral: { icon: Users, label: 'Behavioral', color: 'text-amber' },
  behavioral_collaboration: { icon: Users, label: 'Collaboration', color: 'text-amber' },
  behavioral_failure: { icon: Users, label: 'Learning from Failure', color: 'text-amber' },
  behavioral_growth: { icon: Users, label: 'Growth', color: 'text-amber' },
  stanford: { icon: Target, label: 'Stanford-Specific', color: 'text-cardinal-red' },
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-600 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function InterviewPrepClient({ questions }: InterviewPrepClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string | null>(
    searchParams.get('difficulty')
  );
  const [showStarredOnly, setShowStarredOnly] = React.useState(
    searchParams.get('starred') === 'true'
  );
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState<InterviewQuestion | null>(null);

  // Update URL when filters change
  const updateURL = React.useCallback(
    (updates: {
      q?: string;
      category?: string[];
      difficulty?: string | null;
      starred?: boolean;
    }) => {
      const params = new URLSearchParams();

      const q = updates.q ?? searchQuery;
      const category = updates.category ?? selectedCategories;
      const difficulty = updates.difficulty ?? selectedDifficulty;
      const starred = updates.starred ?? showStarredOnly;

      if (q) params.set('q', q);
      if (category.length > 0) params.set('category', category.join(','));
      if (difficulty) params.set('difficulty', difficulty);
      if (starred) params.set('starred', 'true');

      const queryString = params.toString();
      router.push(queryString ? `/interview-prep?${queryString}` : '/interview-prep', {
        scroll: false,
      });
    },
    [router, searchQuery, selectedCategories, selectedDifficulty, showStarredOnly]
  );

  // Get all unique categories
  const allCategories = React.useMemo(() => {
    const cats = new Set<string>();
    questions.forEach((q) => {
      if (q.category) cats.add(q.category);
    });
    return Array.from(cats).sort();
  }, [questions]);

  // Filter questions
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesTags = q.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesKeyPoints = q.keyPoints?.some((kp) => kp.toLowerCase().includes(query));
        if (!matchesQuestion && !matchesTags && !matchesKeyPoints) return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(q.category)) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Starred filter
      if (showStarredOnly && !q.isStarred) {
        return false;
      }

      return true;
    });
  }, [questions, searchQuery, selectedCategories, selectedDifficulty, showStarredOnly]);

  // Infinite scroll
  const { displayCount, hasMore, isLoading, sentinelRef } = useInfiniteScroll({
    totalItems: filteredQuestions.length,
    batchSize: 24,
  });

  const visibleQuestions = filteredQuestions.slice(0, displayCount);

  // Find current question index for navigation
  const currentQuestionIndex = selectedQuestion
    ? filteredQuestions.findIndex((q) => q._id === selectedQuestion._id)
    : -1;

  const handlePreviousQuestion = React.useCallback(() => {
    if (currentQuestionIndex > 0) {
      setSelectedQuestion(filteredQuestions[currentQuestionIndex - 1]);
    }
  }, [currentQuestionIndex, filteredQuestions]);

  const handleNextQuestion = React.useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setSelectedQuestion(filteredQuestions[currentQuestionIndex + 1]);
    }
  }, [currentQuestionIndex, filteredQuestions]);

  // Filter handlers with URL sync
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateURL({ q: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    updateURL({ category: newCategories });
  };

  const handleDifficultyChange = (diff: string) => {
    const newDifficulty = selectedDifficulty === diff ? null : diff;
    setSelectedDifficulty(newDifficulty);
    updateURL({ difficulty: newDifficulty });
  };

  const handleStarredChange = () => {
    const newStarred = !showStarredOnly;
    setShowStarredOnly(newStarred);
    updateURL({ starred: newStarred });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedDifficulty(null);
    setShowStarredOnly(false);
    router.push('/interview-prep', { scroll: false });
  };

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0 || selectedDifficulty || showStarredOnly;

  const totalQuestions = questions.length;
  const starredCount = questions.filter((q) => q.isStarred).length;

  // Category counts for filter UI
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      if (q.category) {
        counts[q.category] = (counts[q.category] || 0) + 1;
      }
    });
    return counts;
  }, [questions]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions, tags, or key points..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors',
                showFilters || hasActiveFilters
                  ? 'bg-cyan/10 border-cyan/30 text-cyan'
                  : 'bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 bg-cyan text-background text-xs rounded-full">
                  {(selectedCategories.length > 0 ? 1 : 0) +
                    (selectedDifficulty ? 1 : 0) +
                    (showStarredOnly ? 1 : 0)}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => {
                  const config = categoryConfig[category] || {
                    icon: Lightbulb,
                    label: category.replace(/_/g, ' '),
                    color: 'text-muted-foreground',
                  };
                  const Icon = config.icon;
                  const isSelected = selectedCategories.includes(category);
                  const count = categoryCounts[category] || 0;

                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors',
                        isSelected
                          ? 'bg-cyan/10 border-cyan/30 text-cyan'
                          : 'bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                      )}
                    >
                      <Icon className={cn('h-3 w-3', isSelected ? 'text-cyan' : config.color)} />
                      {config.label}
                      <span className="text-muted-foreground/60">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty and Starred */}
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => handleDifficultyChange(diff)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs border capitalize transition-colors',
                        selectedDifficulty === diff
                          ? difficultyColors[diff]
                          : 'bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Show</label>
                <button
                  onClick={handleStarredChange}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors',
                    showStarredOnly
                      ? 'bg-amber/10 border-amber/30 text-amber'
                      : 'bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Star className={cn('h-3 w-3', showStarredOnly && 'fill-current')} />
                  Starred only ({starredCount})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-medium text-foreground">
            {Math.min(displayCount, filteredQuestions.length)}
          </span>{' '}
          of {filteredQuestions.length} questions
          {filteredQuestions.length !== totalQuestions && (
            <span className="text-muted-foreground/60"> (filtered from {totalQuestions})</span>
          )}
        </p>
      </div>

      {/* No Results */}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-16">
          <Filter className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Card Grid */}
      {filteredQuestions.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleQuestions.map((q) => (
            <QuestionCard key={q._id} question={q} onClick={() => setSelectedQuestion(q)} />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && filteredQuestions.length > 24 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          You&apos;ve reached the end ({filteredQuestions.length} questions)
        </div>
      )}

      {/* CTA */}
      {filteredQuestions.length > 0 && (
        <div className="mt-12 p-8 bg-card border border-border rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-2">Want to See These in Action?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Every answer references real projects I&apos;ve built. Explore them to see the code,
            architecture, and decision-making behind these responses.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Detail Panel */}
      <QuestionDetailPanel
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        hasPrevious={currentQuestionIndex > 0}
        hasNext={currentQuestionIndex < filteredQuestions.length - 1}
      />
    </div>
  );
}

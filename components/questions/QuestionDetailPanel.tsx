/**
 * QuestionDetailPanel Component
 * ==============================
 * Slide-over panel showing full question details
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import {
  X,
  Star,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { InterviewQuestion } from './QuestionCard';

interface QuestionDetailPanelProps {
  question: InterviewQuestion | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  hard: 'bg-error/10 text-error border-error/20',
};

// Portable Text components for rich text rendering
const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 last:mb-0">{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg font-semibold mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-base font-semibold mt-4 mb-2">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-muted-foreground">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-muted-foreground">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
};

export function QuestionDetailPanel({
  question,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: QuestionDetailPanelProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) onPrevious();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
    };

    if (question) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [question, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  if (!question) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-2xl',
          'bg-background border-l border-border shadow-xl',
          'animate-in slide-in-from-right-full duration-300',
          'flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            {/* Navigation */}
            {(hasPrevious || hasNext) && (
              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    hasPrevious
                      ? 'hover:bg-secondary text-foreground'
                      : 'text-muted-foreground/30 cursor-not-allowed'
                  )}
                  aria-label="Previous question"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={onNext}
                  disabled={!hasNext}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    hasNext
                      ? 'hover:bg-secondary text-foreground'
                      : 'text-muted-foreground/30 cursor-not-allowed'
                  )}
                  aria-label="Next question"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Badges */}
            {question.isStarred && (
              <Star className="h-4 w-4 text-amber fill-amber" />
            )}
            {question.difficulty && (
              <Badge
                variant="outline"
                className={cn('text-xs capitalize', difficultyColors[question.difficulty])}
              >
                {question.difficulty}
              </Badge>
            )}
            {question.confidenceLevel > 0 && (
              <span className="text-xs text-muted-foreground">
                {'●'.repeat(question.confidenceLevel)}
                {'○'.repeat(5 - question.confidenceLevel)}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Question */}
          <h2 id="panel-title" className="text-xl font-bold leading-snug">
            {question.question}
          </h2>

          {/* Answer */}
          {question.answer && question.answer.length > 0 && (
            <div className="prose prose-sm max-w-none">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-cyan" />
                <h4 className="text-sm font-semibold text-cyan m-0">My Answer</h4>
              </div>
              <div className="pl-4 border-l-2 border-cyan/20">
                <PortableText
                  value={question.answer}
                  components={portableTextComponents}
                />
              </div>
            </div>
          )}

          {/* Key Points */}
          {question.keyPoints && question.keyPoints.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Key Points to Hit
                </h4>
              </div>
              <ul className="space-y-2 pl-6">
                {question.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-success shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project & Experience References */}
          {((question.projectReferences && question.projectReferences.length > 0) ||
            (question.experienceReferences && question.experienceReferences.length > 0)) && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                Reference in Answer
              </h4>
              <div className="flex flex-wrap gap-2">
                {question.projectReferences?.map((project) => (
                  <Link
                    key={project._id}
                    href={`/project/${project.slug.current}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan/10 text-cyan rounded-full text-sm hover:bg-cyan/20 transition-colors"
                  >
                    {project.name}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
                {question.experienceReferences?.map((exp) => (
                  <span
                    key={exp._id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber/10 text-amber rounded-full text-sm"
                  >
                    {exp.role} @ {exp.company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions */}
          {question.followUpQuestions && question.followUpQuestions.length > 0 && (
            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                Likely Follow-ups
              </h4>
              <ul className="space-y-2">
                {question.followUpQuestions.map((followUp, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-amber">→</span>
                    <span className="text-muted-foreground">{followUp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Red Flags */}
          {question.redFlags && question.redFlags.length > 0 && (
            <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
              <h4 className="text-sm font-semibold text-error mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Avoid Saying
              </h4>
              <ul className="space-y-1">
                {question.redFlags.map((flag, i) => (
                  <li key={i} className="text-sm text-error/80 flex gap-2">
                    <span>✕</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="pt-4 border-t flex flex-wrap gap-1">
              {question.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="p-4 border-t border-border bg-secondary/30 text-center text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-foreground">Esc</kbd> to close
          {(hasPrevious || hasNext) && (
            <>, <kbd className="px-1.5 py-0.5 bg-secondary rounded text-foreground">←</kbd>/<kbd className="px-1.5 py-0.5 bg-secondary rounded text-foreground">→</kbd> to navigate</>
          )}
        </div>
      </div>
    </>
  );
}

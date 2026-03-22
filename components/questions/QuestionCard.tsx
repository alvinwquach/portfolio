/**
 * QuestionCard Component
 * ======================
 * Card display for interview questions in grid layout
 */

'use client';

import { Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface InterviewQuestion {
  _id: string;
  question: string;
  category: string;
  tags: string[];
  roleType: string[];
  isStarred: boolean;
  confidenceLevel: number;
  answer: any[];
  keyPoints: string[];
  projectReferences: {
    _id: string;
    name: string;
    slug: { current: string };
  }[];
  experienceReferences: {
    _id: string;
    company: string;
    role: string;
  }[];
  followUpQuestions: string[];
  redFlags: string[];
  difficulty: string;
}

interface QuestionCardProps {
  question: InterviewQuestion;
  onClick: () => void;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-success/20 text-success border-success/30',
  medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  hard: 'bg-error/20 text-error border-error/30',
};

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group text-left w-full rounded-xl border bg-card p-5',
        'transition-all duration-200',
        'hover:border-cyan/30 hover:bg-card/80 hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-cyan/50',
        question.isStarred ? 'border-amber/20' : 'border-border/50'
      )}
    >
      {/* Header: Star + Difficulty */}
      <div className="flex items-center gap-2 mb-3">
        {question.isStarred && (
          <Star className="h-4 w-4 text-amber fill-amber flex-shrink-0" />
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
          <span className="text-xs text-muted-foreground ml-auto">
            {'●'.repeat(question.confidenceLevel)}
            {'○'.repeat(5 - question.confidenceLevel)}
          </span>
        )}
      </div>

      {/* Question Text */}
      <p className="font-semibold text-base leading-snug line-clamp-3 mb-3 group-hover:text-cyan transition-colors">
        {question.question}
      </p>

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {question.tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          {question.tags.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{question.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Click prompt */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-cyan transition-colors pt-2 border-t border-border/30">
        <span>View answer</span>
        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

/**
 * QuestionCard Component
 * ======================
 * Card display for interview questions — matches dark theme with blue accent
 */

'use client';

import { Star, ArrowRight } from 'lucide-react';

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

const difficultyColors: Record<string, { color: string; bg: string; border: string }> = {
  easy: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  medium: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
  hard: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
};

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  const dc = difficultyColors[question.difficulty];

  return (
    <button
      onClick={onClick}
      className="group hover:border-[rgba(59,130,246,0.25)] transition-all duration-200"
      style={{
        textAlign: 'left',
        width: '100%',
        padding: '16px 18px',
        borderRadius: 12,
        border: question.isStarred ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header: Star + Difficulty + Confidence */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        {question.isStarred && (
          <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b', flexShrink: 0 }} />
        )}
        {dc && (
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 4, backgroundColor: dc.bg, color: dc.color, border: `1px solid ${dc.border}` }}>
            {question.difficulty}
          </span>
        )}
        {question.confidenceLevel > 0 && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto', letterSpacing: 1 }}>
            {'●'.repeat(question.confidenceLevel)}{'○'.repeat(5 - question.confidenceLevel)}
          </span>
        )}
      </div>

      {/* Question Text */}
      <p className="group-hover:text-[#3b82f6] transition-colors line-clamp-3" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 10px', lineHeight: 1.4, flex: 1 }}>
        {question.question}
      </p>

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {question.tags.slice(0, 4).map((tag, i) => (
            <span key={i} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
              #{tag}
            </span>
          ))}
          {question.tags.length > 4 && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>+{question.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Click prompt */}
      <div className="group-hover:text-[#3b82f6] transition-colors" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.3)', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        View answer <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

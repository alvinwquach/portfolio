/**
 * QuestionDetailPanel — Slide-over with dark theme matching schedule colors
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
import type { InterviewQuestion } from './QuestionCard';

interface QuestionDetailPanelProps {
  question: InterviewQuestion | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const difficultyColors: Record<string, { color: string; bg: string; border: string }> = {
  easy: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  medium: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
  hard: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
};

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 12px' }}>{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ds-text)', margin: '20px 0 8px' }}>{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ds-text)', margin: '16px 0 6px' }}>{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul style={{ listStyle: 'disc', paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol style={{ listStyle: 'decimal', paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600, color: 'var(--ds-text)' }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code style={{ padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{children}</code>
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

  const dc = difficultyColors[question.difficulty];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        style={{
          position: 'fixed', right: 0, top: 0, zIndex: 50,
          height: '100%', width: '100%', maxWidth: 640,
          backgroundColor: '#0d1117',
          borderLeft: '1px solid rgba(48,54,61,0.7)',
          display: 'flex', flexDirection: 'column',
        }}
        className="animate-in slide-in-from-right-full duration-300"
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(48,54,61,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Navigation */}
            {(hasPrevious || hasNext) && (
              <div style={{ display: 'flex', gap: 2, marginRight: 8 }}>
                <button onClick={onPrevious} disabled={!hasPrevious}
                  style={{ padding: 4, borderRadius: 4, border: 'none', cursor: hasPrevious ? 'pointer' : 'not-allowed', backgroundColor: 'transparent', color: hasPrevious ? 'var(--ds-text)' : 'rgba(255,255,255,0.15)' }}
                  className="hover:bg-white/5 transition-colors" aria-label="Previous question">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={onNext} disabled={!hasNext}
                  style={{ padding: 4, borderRadius: 4, border: 'none', cursor: hasNext ? 'pointer' : 'not-allowed', backgroundColor: 'transparent', color: hasNext ? 'var(--ds-text)' : 'rgba(255,255,255,0.15)' }}
                  className="hover:bg-white/5 transition-colors" aria-label="Next question">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {question.isStarred && <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />}
            {dc && (
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 4, backgroundColor: dc.bg, color: dc.color, border: `1px solid ${dc.border}` }}>
                {question.difficulty}
              </span>
            )}
            {question.confidenceLevel > 0 && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>
                {'●'.repeat(question.confidenceLevel)}{'○'.repeat(5 - question.confidenceLevel)}
              </span>
            )}
          </div>

          <button onClick={onClose} style={{ padding: 6, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)' }} className="hover:bg-white/5 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Question */}
          <h2 id="panel-title" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ds-text)', margin: 0, lineHeight: 1.35 }}>
            {question.question}
          </h2>

          {/* Answer */}
          {question.answer && question.answer.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <MessageSquare size={14} style={{ color: '#3b82f6' }} />
                <h4 style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', margin: 0 }}>My Answer</h4>
              </div>
              <div style={{ paddingLeft: 14, borderLeft: '2px solid rgba(59,130,246,0.2)' }}>
                <PortableText value={question.answer} components={portableTextComponents} />
              </div>
            </div>
          )}

          {/* Key Points */}
          {question.keyPoints && question.keyPoints.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
                <h4 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Key Points to Hit</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 20 }}>
                {question.keyPoints.map((point, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13 }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {((question.projectReferences?.length > 0) || (question.experienceReferences?.length > 0)) && (
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Reference in Answer</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {question.projectReferences?.map(project => (
                  <Link key={project._id} href={`/project/${project.slug.current}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 16, fontSize: 12, backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', textDecoration: 'none' }}
                    className="hover:bg-[rgba(59,130,246,0.15)] transition-colors">
                    {project.name} <ArrowRight size={11} />
                  </Link>
                ))}
                {question.experienceReferences?.map(exp => (
                  <span key={exp._id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 16, fontSize: 12, backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                    {exp.role} @ {exp.company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions */}
          {question.followUpQuestions && question.followUpQuestions.length > 0 && (
            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', margin: '0 0 8px' }}>Likely Follow-ups</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {question.followUpQuestions.map((followUp, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13 }}>
                    <span style={{ color: '#f59e0b' }}>→</span>
                    <span style={{ color: 'rgba(255,255,255,0.45)' }}>{followUp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags */}
          {question.redFlags && question.redFlags.length > 0 && (
            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#ef4444', margin: '0 0 8px' }}>
                <AlertTriangle size={13} /> Avoid Saying
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {question.redFlags.map((flag, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13 }}>
                    <span style={{ color: '#ef4444' }}>✕</span>
                    <span style={{ color: 'rgba(239,68,68,0.7)' }}>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {question.tags.map((tag, i) => (
                <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(48,54,61,0.7)', backgroundColor: 'rgba(255,255,255,0.02)', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
          Press <kbd style={{ padding: '1px 5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, color: 'rgba(255,255,255,0.5)' }}>Esc</kbd> to close
          {(hasPrevious || hasNext) && (
            <>, <kbd style={{ padding: '1px 5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, color: 'rgba(255,255,255,0.5)' }}>←</kbd>/<kbd style={{ padding: '1px 5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, color: 'rgba(255,255,255,0.5)' }}>→</kbd> to navigate</>
          )}
        </div>
      </div>
    </>
  );
}

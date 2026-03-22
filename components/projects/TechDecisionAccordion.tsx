/**
 * TechDecisionAccordion
 * =====================
 * GSAP-animated accordion for Technical Decisions Q&A.
 * Replaces the native <details>/<summary> pattern with precise timing control.
 *
 * EXPAND: 0.4 s, power2.out — unhurried, content arrives without rushing.
 * COLLAPSE: 0.3 s, power2.in — faster than expand intentionally.
 *   WHY: When a user closes a panel they have already decided they're done
 *   with it. A slow collapse makes the UI feel sluggish at exactly the moment
 *   the user wants to move on. Snap shut, stay out of the way.
 *
 * TECHNIQUE: GSAP height:'auto'
 *   height:0 → height:'auto' measures the element's natural height at
 *   animation start, tweens to it, then sets height:'auto' on complete so
 *   the panel reflows correctly if content changes. overflow:hidden is set
 *   during animation to clip the reveal; removed on complete so any future
 *   tooltips or dropdowns inside the panel are not clipped.
 *
 * MULTIPLE OPEN: Any number of items can be open simultaneously — matching
 * the native <details> behavior and letting the user compare answers.
 */

'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TechnicalDecision } from '@/lib/graphql/queries';

interface TechDecisionAccordionProps {
  items: TechnicalDecision[];
  className?: string;
}

interface AccordionItemProps {
  item:     TechnicalDecision;
  index:    number;
  isOpen:   boolean;
  onToggle: () => void;
}

function AccordionItem({ item, index, isOpen, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  // Track whether this is the initial render to skip the opening animation
  // on mount (items start closed — no animation needed until user interacts).
  const didMount = useRef(false);

  useGSAP(
    () => {
      const content = contentRef.current;
      if (!content) return;

      if (!didMount.current) {
        // First render — set closed state immediately, no animation.
        gsap.set(content, { height: 0, overflow: 'hidden' });
        didMount.current = true;
        return;
      }

      if (isOpen) {
        // EXPAND — 0.4 s, power2.out
        gsap.fromTo(
          content,
          { height: 0, overflow: 'hidden' },
          {
            height:   'auto',
            duration: 0.4,
            ease:     'power2.out',
            onComplete() {
              // Remove overflow clip so content inside can overflow
              // (tooltips, long answers, etc.) once fully open.
              gsap.set(content, { overflow: '' });
            },
          },
        );
      } else {
        // COLLAPSE — 0.3 s, power2.in (faster: user is done, snap shut)
        gsap.set(content, { overflow: 'hidden' });
        gsap.to(content, {
          height:   0,
          duration: 0.3,
          ease:     'power2.in',
        });
      }
    },
    // Re-run when isOpen toggles.
    { dependencies: [isOpen] },
  );

  return (
    <div className="rounded-lg border bg-card/50 overflow-hidden">

      {/* Trigger ─────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="text-accent font-mono text-xs bg-accent/20 px-2 py-0.5 rounded flex-shrink-0">
          Q{index + 1}
        </span>
        <span className="text-sm font-medium flex-1">{item.question}</span>
        {/* Chevron rotates 90° when open */}
        <ChevronRight
          className={cn(
            'h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-300',
            isOpen && 'rotate-90',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Content panel — height animated by GSAP ────────────────────────── */}
      <div ref={contentRef} style={{ height: 0, overflow: 'hidden' }}>
        <div className="px-4 pb-4 pt-1">
          <div className="ml-10 pl-4 border-l-2 border-accent/20">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechDecisionAccordion({ items, className }: TechDecisionAccordionProps) {
  // Set of open item indices — allows multiple items open simultaneously.
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          index={index}
          isOpen={openSet.has(index)}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
}

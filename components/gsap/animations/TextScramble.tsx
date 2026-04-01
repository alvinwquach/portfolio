/**
 * TextScramble — Auto-cycling scramble text effect
 * Shows a rotating set of phrases with character scramble transitions
 */

'use client';

import * as React from 'react';

interface TextScrambleProps {
  /** Array of phrases to cycle through */
  phrases: string[];
  /** Interval between phrases in ms */
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({ phrases, interval = 2500, className, style }: TextScrambleProps) {
  const [displayText, setDisplayText] = React.useState(phrases[0] || '');
  const indexRef = React.useRef(0);
  const frameRef = React.useRef<number>(0);
  const mountedRef = React.useRef(true);

  const scrambleTo = React.useCallback((target: string) => {
    let iteration = 0;
    const maxLength = Math.max(displayText.length, target.length);

    const step = () => {
      if (!mountedRef.current) return;

      let result = '';
      for (let i = 0; i < maxLength; i++) {
        if (i < iteration) {
          result += target[i] || '';
        } else if (i < target.length) {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(result);
      iteration += 1;

      if (iteration <= target.length + 5) {
        frameRef.current = requestAnimationFrame(() => {
          setTimeout(() => step(), 25);
        });
      } else {
        setDisplayText(target);
      }
    };

    step();
  }, [displayText.length]);

  React.useEffect(() => {
    mountedRef.current = true;

    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % phrases.length;
      scrambleTo(phrases[indexRef.current]);
    }, interval);

    return () => {
      mountedRef.current = false;
      clearInterval(timer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [phrases, interval, scrambleTo]);

  return (
    <span className={className} style={style}>
      {displayText}
      <span style={{ display: 'inline-block', width: 3, height: '0.85em', backgroundColor: '#3b82f6', marginLeft: 4, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
    </span>
  );
}

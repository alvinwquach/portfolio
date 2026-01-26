/**
 * Share Buttons Component
 * =======================
 * Social share buttons for blog posts and projects
 */

'use client';

import * as React from 'react';
import { Twitter, Linkedin, Link2, Check, Facebook, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

// Reddit icon (not in lucide-react)
function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

// Hacker News icon
function HackerNewsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 0v24h24V0H0zm12.8 13.4v5.2H11v-5.2L6.7 4.8h2.3L12 10l3-5.2h2.3l-4.5 8.6z" />
    </svg>
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
  className?: string;
}

export function ShareButtons({ url, title, summary, className }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = summary ? encodeURIComponent(summary) : '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs text-muted-foreground mr-1">Share:</span>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share on X (Twitter)"
      >
        <Twitter className="h-4 w-4" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>

      <a
        href={shareLinks.reddit}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share on Reddit"
      >
        <RedditIcon className="h-4 w-4" />
      </a>

      <a
        href={shareLinks.hackernews}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share on Hacker News"
      >
        <HackerNewsIcon className="h-4 w-4" />
      </a>

      <a
        href={shareLinks.email}
        className="p-2 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share via Email"
      >
        <Mail className="h-4 w-4" />
      </a>

      <button
        onClick={copyToClipboard}
        className="p-2 rounded-md bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        aria-label={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

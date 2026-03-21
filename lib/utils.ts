/**
 * Utility Functions
 * =================
 * Common utility functions used throughout the application
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 * This allows for conditional classes and deduplication
 *
 * @example
 * cn('px-4', 'py-2', isActive && 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string for display
 */
export function formatDate(date: string | Date | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Calculate a human-readable duration between two dates
 */
export function calculateDuration(startDate?: string, endDate?: string, isCurrent?: boolean): string {
  if (!startDate) return '';
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return '';
  const end = isCurrent ? new Date() : (endDate ? new Date(endDate) : new Date());
  if (isNaN(end.getTime())) return '';
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) {
    return `${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} yr${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`;
  }
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Capitalize the first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Convert category slug to display label
 */
export function categoryToLabel(category: string): string {
  const labels: Record<string, string> = {
    databases: 'Databases & Storage',
    frontend: 'Frontend',
    backend: 'Backend & APIs',
    'data-ml': 'Data & Machine Learning',
    testing: 'Testing & QA',
    'project-tools': 'Project & Workflow Tools',
    analytics: 'Analytics & Monitoring',
    cms: 'CMS',
    communication: 'Communication',
    product: 'Product & Strategy',
    community: 'Community',
    build: 'Build',
    bug: 'Bug Fix',
    decision: 'Decision',
    concept: 'Concept',
    tutorial: 'Tutorial',
    chart: 'Chart',
  };
  return labels[category] || capitalizeWords(category.replace(/-/g, ' '));
}

/**
 * Get emoji for node type
 */
export function getNodeTypeEmoji(nodeType: string): string {
  const emojis: Record<string, string> = {
    build: '\uD83C\uDFD7\uFE0F',
    bug: '\uD83D\uDC1B',
    decision: '\uD83E\uDD14',
    concept: '\uD83D\uDCA1',
    tutorial: '\uD83D\uDCDA',
    chart: '\uD83D\uDCCA',
  };
  return emojis[nodeType] || '\uD83D\uDCDD';
}

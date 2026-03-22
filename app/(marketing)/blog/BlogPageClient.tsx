/**
 * Blog Page Client Component
 * ==========================
 * Apollo GraphQL-style blog with category filters, search, and clean card layout.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Search, X, FileText } from 'lucide-react';
import { LogoMark } from '@/components/ui/logos';
import type { KnowledgeNode, Tag } from '@/lib/graphql/queries';

// Node type configuration for labels
const nodeTypeLabels: Record<string, string> = {
  build: 'Build',
  bug: 'Bug',
  decision: 'Decision',
  concept: 'Concept',
  tutorial: 'Tutorial',
  chart: 'Chart',
  deep_dive: 'Deep Dive',
  lesson_learned: 'Lesson Learned',
  tool_review: 'Tool Review',
};

interface BlogPageClientProps {
  knowledgeNodes: KnowledgeNode[];
  tags: Tag[];
  initialType: string;
  initialSearch: string;
}

// Calculate reading time based on summary length (approximation)
function getReadingTime(node: KnowledgeNode): number {
  const wordsPerMinute = 200;
  // Use summary word count as approximation (full content would be better but summary is available)
  const wordCount = node.summary?.split(/\s+/).length || 0;
  // Minimum 1 minute, add extra time for technical content
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute) + 2);
}

// Count nodes per type
function countNodesByType(nodes: KnowledgeNode[], type: string): number {
  return nodes.filter((node) => node.nodeType === type).length;
}

/**
 * Featured Post Card - Apollo GraphQL style (single large card)
 */
function FeaturedPostCard({ node }: { node: KnowledgeNode }) {
  const readingTime = getReadingTime(node);
  return (
    <Link href={`/blog/${node.slug.current}`} className="group block">
      <article className="relative p-8 md:p-10 rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-300">
        {/* Date and Reading Time */}
        <div className="text-sm text-muted-foreground mb-4">
          {node.publishedAt ? formatDate(node.publishedAt) : 'Draft'}
          <span className="mx-2">·</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Title - Large */}
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors mb-6 max-w-3xl">
          {node.title}
        </h2>

        {/* Read article button */}
        <span className="inline-flex items-center text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-colors">
          Read article
        </span>
      </article>
    </Link>
  );
}

/**
 * Regular Post Card - Apollo style with date, title, separator, author
 */
function PostCard({ node }: { node: KnowledgeNode }) {
  const readingTime = getReadingTime(node);
  return (
    <Link href={`/blog/${node.slug.current}`} className="group block h-full">
      <article className="h-full p-5 rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-200 flex flex-col">
        {/* Date with orange dot and reading time */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-sm text-muted-foreground">
            {node.publishedAt ? formatDate(node.publishedAt) : 'Draft'}
            <span className="mx-1.5">·</span>
            {readingTime} min
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3 flex-1">
          {node.title}
        </h3>

        {/* Dashed separator */}
        <div className="border-t border-dashed border-border/50 my-4" />

        {/* Author */}
        <div className="flex items-center gap-3">
          <LogoMark size={32} />
          <span className="text-sm text-muted-foreground">Alvin Quach</span>
        </div>
      </article>
    </Link>
  );
}

/**
 * Tag Filter Link - Apollo style plain text with counts
 */
function TagLink({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm transition-colors ${
        active
          ? 'text-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className="ml-1 text-muted-foreground">({count})</span>
      )}
    </button>
  );
}

export function BlogPageClient({ knowledgeNodes, tags, initialType, initialSearch }: BlogPageClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState(initialType);
  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [searchFocused, setSearchFocused] = React.useState(false);

  // Update URL when filters change
  const updateURL = React.useCallback((type: string, search: string) => {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.set('type', type);
    if (search) params.set('q', search);
    const query = params.toString();
    router.push(query ? `/blog?${query}` : '/blog', { scroll: false });
  }, [router]);

  // Handle tab change - memoized to prevent unnecessary re-renders
  const handleTabChange = React.useCallback((tab: string) => {
    setActiveTab(tab);
    updateURL(tab, searchTerm);
  }, [updateURL, searchTerm]);

  // Handle search change - memoized to prevent unnecessary re-renders
  const handleSearchChange = React.useCallback((term: string) => {
    setSearchTerm(term);
    updateURL(activeTab, term);
  }, [updateURL, activeTab]);

  // Get unique node types from data
  const nodeTypes = [...new Set(knowledgeNodes.map((n) => n.nodeType))];

  // Filter nodes based on type and search
  const filteredNodes = React.useMemo(() => {
    return knowledgeNodes.filter((node) => {
      // Type filter
      if (activeTab && activeTab !== 'all') {
        if (node.nodeType !== activeTab) return false;
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const titleMatch = node.title.toLowerCase().includes(search);
        const summaryMatch = node.summary?.toLowerCase().includes(search);
        const tagMatch = node.tags?.some(
          (t) => t.name.toLowerCase().includes(search)
        );
        if (!titleMatch && !summaryMatch && !tagMatch) return false;
      }

      return true;
    });
  }, [knowledgeNodes, activeTab, searchTerm]);

  // Get the latest post (by publishedAt date) as the single featured post
  // All other posts go in the regular grid
  const sortedByDate = [...filteredNodes].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA; // Newest first
  });

  const latestPost = sortedByDate[0] || null;
  const regularPosts = sortedByDate.slice(1);

  const hasFilters = activeTab !== 'all' || searchTerm;

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light mb-2">Blog</h1>
        </div>

        {/* Tag Filters - Apollo style rows with counts */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 pb-6 border-b border-border/30">
          <TagLink
            label="All"
            count={knowledgeNodes.length}
            active={activeTab === 'all'}
            onClick={() => handleTabChange('all')}
          />
          {nodeTypes.map((type) => (
            <TagLink
              key={type}
              label={nodeTypeLabels[type] || type}
              count={countNodesByType(knowledgeNodes, type)}
              active={activeTab === type}
              onClick={() => handleTabChange(type)}
            />
          ))}
        </div>

        {/* Search Bar */}
        <div className={`relative w-full max-w-sm mb-10 transition-all duration-200 ${searchFocused ? 'max-w-md' : ''}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-10 py-2 bg-transparent border border-border/50 rounded-md text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-border transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Results */}
        {filteredNodes.length > 0 ? (
          <div className="space-y-12">
            {/* What's new - Single latest post */}
            {latestPost && (
              <section>
                <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
                  What's new
                </h2>
                <FeaturedPostCard node={latestPost} />
              </section>
            )}

            {/* All Posts - Grid of cards */}
            {regularPosts.length > 0 && (
              <section>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularPosts.map((node) => (
                    <PostCard key={node._id} node={node} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              {hasFilters
                ? 'No articles match your filters.'
                : 'No articles found.'}
            </p>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                  router.push('/blog', { scroll: false });
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

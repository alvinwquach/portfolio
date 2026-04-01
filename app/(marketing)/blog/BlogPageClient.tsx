/**
 * Blog Page — Sidebar + 2-Column Grid
 * ====================================
 *
 * LAYOUT (matches /projects pattern):
 *   LEFT SIDEBAR (280px, sticky):
 *     - Avatar + name
 *     - "Blog" title + stats
 *     - Type filters (All, Build, Bug, Decision, etc.)
 *     - Tag multi-select via react-select
 *
 *   RIGHT CONTENT (flex-1):
 *     - Search bar
 *     - Featured "What's new" hero card
 *     - 2-column post card grid
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { Search, X, FileText, ArrowRight } from 'lucide-react';
import { LogoMark } from '@/components/ui/logos';
import { formatDate } from '@/lib/utils';
import type { KnowledgeNode, Tag } from '@/lib/graphql/queries';

const nodeTypeLabels: Record<string, string> = {
  build: 'Build',
  bug: 'Bug',
  decision: 'Decision',
  concept: 'Concept',
  tutorial: 'Tutorial',
  chart: 'Chart',
  deep_dive: 'Deep Dive',
  lesson_learned: 'Lesson',
  tool_review: 'Tool Review',
};

interface BlogPageClientProps {
  knowledgeNodes: KnowledgeNode[];
  tags: Tag[];
  initialType: string;
  initialSearch: string;
}

function getReadingTime(node: KnowledgeNode): number {
  const wordCount = node.summary?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(wordCount / 200) + 2);
}

// ═══════════════════════════════════════════════════════
// FEATURED POST CARD
// ═══════════════════════════════════════════════════════

function FeaturedPostCard({ node }: { node: KnowledgeNode }) {
  const readingTime = getReadingTime(node);
  return (
    <Link href={`/blog/${node.slug.current}`} className="group block">
      <article
        style={{
          padding: '28px 24px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
        className="hover:border-[rgba(59,130,246,0.2)] transition-all duration-200"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          {node.featured && (
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', marginRight: 4 }}>Featured</span>
          )}
          {node.publishedAt ? formatDate(node.publishedAt) : 'Draft'}
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>

        <h2 className="group-hover:text-[#3b82f6] transition-colors" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 8px', lineHeight: 1.3, maxWidth: 640 }}>
          {node.title}
        </h2>

        {node.summary && (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 16px', lineHeight: 1.6, maxWidth: 600 }} className="line-clamp-2">
            {node.summary}
          </p>
        )}

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: '#3b82f6' }}>
          Read article <ArrowRight size={13} />
        </span>
      </article>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════
// REGULAR POST CARD
// ═══════════════════════════════════════════════════════

function PostCard({ node }: { node: KnowledgeNode }) {
  const readingTime = getReadingTime(node);
  return (
    <Link href={`/blog/${node.slug.current}`} className="group block h-full">
      <article
        style={{
          height: '100%',
          padding: '16px 18px 18px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(255,255,255,0.02)',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="hover:border-[rgba(59,130,246,0.2)] transition-all duration-200"
      >
        {/* Date + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
          {node.publishedAt ? formatDate(node.publishedAt) : 'Draft'}
          <span>·</span>
          <span>{readingTime} min</span>
        </div>

        {/* Type badge */}
        {node.nodeType && nodeTypeLabels[node.nodeType] && (
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)', alignSelf: 'flex-start', marginBottom: 8 }}>
            {nodeTypeLabels[node.nodeType]}
          </span>
        )}

        {/* Title */}
        <h3 className="group-hover:text-[#3b82f6] transition-colors line-clamp-3" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: 0, flex: 1, lineHeight: 1.4 }}>
          {node.title}
        </h3>

        {/* Separator + author */}
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', margin: '14px 0 12px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogoMark size={28} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Alvin Quach</span>
        </div>
      </article>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════

export function BlogPageClient({ knowledgeNodes, tags, initialType, initialSearch }: BlogPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(initialType);
  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const updateURL = React.useCallback((type: string, search: string) => {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.set('type', type);
    if (search) params.set('q', search);
    const query = params.toString();
    router.push(query ? `/blog?${query}` : '/blog', { scroll: false });
  }, [router]);

  const handleTabChange = React.useCallback((tab: string) => {
    setActiveTab(tab);
    updateURL(tab, searchTerm);
  }, [updateURL, searchTerm]);

  const handleSearch = React.useCallback((term: string) => {
    setSearchTerm(term);
    updateURL(activeTab, term);
  }, [updateURL, activeTab]);

  // Get unique node types from data
  const nodeTypes = React.useMemo(() => {
    const types = [...new Set(knowledgeNodes.map(n => n.nodeType))];
    return types.map(type => ({
      key: type,
      label: nodeTypeLabels[type] || type,
      count: knowledgeNodes.filter(n => n.nodeType === type).length,
    }));
  }, [knowledgeNodes]);

  // Tag options for react-select
  const tagOptions = React.useMemo(() => {
    return tags.map(t => ({ value: t.name, label: t.name }));
  }, [tags]);

  // Filter nodes
  const filtered = React.useMemo(() => {
    return knowledgeNodes.filter(node => {
      if (activeTab && activeTab !== 'all' && node.nodeType !== activeTab) return false;
      if (selectedTags.length > 0) {
        const nodeTags = node.tags?.map(t => t.name) || [];
        if (!selectedTags.some(t => nodeTags.includes(t))) return false;
      }
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return node.title.toLowerCase().includes(s)
          || node.summary?.toLowerCase().includes(s)
          || node.tags?.some(t => t.name.toLowerCase().includes(s));
      }
      return true;
    });
  }, [knowledgeNodes, activeTab, searchTerm, selectedTags]);

  // Sort by date, split featured
  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [filtered]);

  const latestPost = sorted[0] || null;
  const regularPosts = sorted.slice(1);
  const featuredCount = knowledgeNodes.filter(n => n.featured).length;

  return (
    <>
      {/* Mobile layout */}
      <div className="lg:hidden" style={{ minHeight: 'calc(100vh - 80px)', padding: '24px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 4px' }}>Blog</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {knowledgeNodes.length} articles · {featuredCount} featured
          </p>
        </div>

        {/* Mobile search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input
            type="text" value={searchTerm} onChange={e => handleSearch(e.target.value)}
            placeholder="Search articles..."
            style={{ width: '100%', padding: '8px 8px 8px 32px', fontSize: 13, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'var(--ds-text)', outline: 'none' }}
          />
        </div>

        {/* Mobile type filters — horizontal scroll */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
          <button
            onClick={() => handleTabChange('all')}
            style={{
              fontSize: 12, padding: '4px 12px', borderRadius: 16, border: 'none', whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'all' ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
              color: activeTab === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
            }}
          >
            All ({knowledgeNodes.length})
          </button>
          {nodeTypes.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              style={{
                fontSize: 12, padding: '4px 12px', borderRadius: 16, border: 'none', whiteSpace: 'nowrap',
                backgroundColor: activeTab === key ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                color: activeTab === key ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Mobile cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map(node => <PostCard key={node._id} node={node} />)}
          {sorted.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>No articles match your filters.</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveTab('all'); setSelectedTags([]); router.push('/blog', { scroll: false }); }}
                style={{ fontSize: 13, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop layout — sidebar + content */}
      <div className="hidden lg:flex" style={{ minHeight: 'calc(100vh - 80px)' }}>

        {/* ═══ SIDEBAR ═══════════════════════════════════ */}
        <aside style={{
          width: 280,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 28px 24px',
          overflowY: 'auto',
          position: 'sticky',
          top: 80,
          height: 'calc(100vh - 80px)',
        }}>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>AQ</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>Alvin Quach</span>
          </div>

          {/* Title + stats */}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 8px' }}>Blog</h1>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--ds-text)', margin: 0 }}>{knowledgeNodes.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>articles</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6', margin: 0 }}>{featuredCount}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>featured</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', margin: 0 }}>{nodeTypes.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>types</p>
            </div>
          </div>

          {/* Type filters */}
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Type</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
            {[{ key: 'all', label: 'All', count: knowledgeNodes.length }, ...nodeTypes].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 10px', borderRadius: 6, fontSize: 13, border: 'none',
                  backgroundColor: activeTab === key ? 'rgba(59,130,246,0.08)' : 'transparent',
                  color: activeTab === key ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: activeTab === key ? '#3b82f6' : 'rgba(255,255,255,0.15)' }} />
                  {label}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{count}</span>
              </button>
            ))}
          </div>

          {/* Tag multi-select */}
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Topics</p>
          <Select
            isMulti
            options={tagOptions}
            value={selectedTags.map(t => ({ value: t, label: t }))}
            onChange={(selected) => setSelectedTags((selected || []).map(s => s.value))}
            placeholder="Filter by topic..."
            noOptionsMessage={() => 'No topics found'}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderColor: state.isFocused ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)',
                borderRadius: 8,
                minHeight: 36,
                fontSize: 12,
                boxShadow: 'none',
                '&:hover': { borderColor: 'rgba(59,130,246,0.3)' },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#161b22',
                border: '1px solid rgba(48,54,61,0.7)',
                borderRadius: 8,
                zIndex: 50,
              }),
              option: (base, state) => ({
                ...base,
                fontSize: 12,
                backgroundColor: state.isFocused ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: state.isSelected ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                '&:active': { backgroundColor: 'rgba(59,130,246,0.15)' },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: 'rgba(59,130,246,0.12)',
                borderRadius: 4,
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#3b82f6',
                fontSize: 11,
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#3b82f6',
                '&:hover': { backgroundColor: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
              }),
              input: (base) => ({ ...base, color: 'var(--ds-text)', fontSize: 12 }),
              placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.25)', fontSize: 12 }),
              indicatorSeparator: () => ({ display: 'none' }),
              dropdownIndicator: (base) => ({ ...base, color: 'rgba(255,255,255,0.2)', padding: 4 }),
              clearIndicator: (base) => ({ ...base, color: 'rgba(255,255,255,0.25)', padding: 4 }),
            }}
          />
        </aside>

        {/* ═══ MAIN CONTENT ══════════════════════════════ */}
        <main style={{ flex: 1, minWidth: 0, padding: '32px 32px 48px' }}>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 320, marginBottom: 24 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
            <input
              type="text" value={searchTerm} onChange={e => handleSearch(e.target.value)}
              placeholder="Search articles..."
              style={{ width: '100%', padding: '9px 36px 9px 34px', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: 'var(--ds-text)', outline: 'none', transition: 'border-color 0.15s' }}
            />
            {searchTerm && (
              <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.3)' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Results info */}
          {(activeTab !== 'all' || searchTerm || selectedTags.length > 0) && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              {filtered.length} of {knowledgeNodes.length} articles
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedTags.length > 0 && ` tagged ${selectedTags.join(', ')}`}
            </p>
          )}

          {sorted.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Featured / latest post */}
              {latestPost && (
                <section>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>What&apos;s new</p>
                  <FeaturedPostCard node={latestPost} />
                </section>
              )}

              {/* Post grid — 2 columns */}
              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: 16 }}>
                  {regularPosts.map(node => <PostCard key={node._id} node={node} />)}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <FileText size={40} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>No articles match your filters.</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveTab('all'); setSelectedTags([]); router.push('/blog', { scroll: false }); }}
                style={{ fontSize: 13, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear filters
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

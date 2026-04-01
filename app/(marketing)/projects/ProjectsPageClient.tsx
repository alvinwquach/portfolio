/**
 * Projects Page — Sidebar + 2-Column Grid (Kevin's layout pattern)
 * ================================================================
 *
 * LAYOUT:
 *   LEFT SIDEBAR (280px, sticky):
 *     - Avatar + name
 *     - "Projects" title + count
 *     - Status filters (All, Featured, Client Work)
 *     - Tech tag cloud for filtering
 *
 *   RIGHT CONTENT (flex-1):
 *     - Search bar
 *     - 2-column project card grid
 *
 * DESIGN:
 *   Uses the same dark theme / color tokens as the schedule page.
 *   Cards use subtle borders, hover states, and the blue accent.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ExternalLink,
  Github,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import Select from 'react-select';
import type { Project } from '@/lib/graphql/queries';
import { TransitionLink } from '@/components/transitions/TransitionLink';

interface ProjectsPageClientProps {
  projects: Project[];
  categories: string[];
  initialCategory: string;
  initialSearch: string;
}

// ═══════════════════════════════════════════════════════
// PROJECT CARD — compact card for the 2-column grid
// ═══════════════════════════════════════════════════════

function ProjectCard({ project }: { project: Project }) {
  const hasImage = !!project.image?.url;

  return (
    <TransitionLink href={`/project/${project.slug.current}`} slug={project.slug.current}>
      <div
        className="group rounded-xl overflow-hidden transition-all duration-200"
        style={{
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        {/* Image or placeholder */}
        <div
          className="aspect-[16/9] relative overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
        >
          {hasImage ? (
            <Image
              src={project.image!.url!}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ fontSize: 48, fontWeight: 700, color: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-mono)' }}>
                {project.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}

          {/* Status badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && (
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                Featured
              </span>
            )}
            {project.liveUrl && (
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                Live
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px 18px' }}>
          {/* Title */}
          <h3 className="group-hover:text-[#3b82f6] transition-colors" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ds-text)', margin: 0 }}>
            {project.name}
          </h3>

          {/* Tagline */}
          {project.tagline && (
            <p className="line-clamp-2" style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.4)', margin: '6px 0 0' }}>
              {project.tagline}
            </p>
          )}

          {/* Meta row: role · duration */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            {project.role && <span>{project.role}</span>}
            {project.duration && (
              <>
                {project.role && <span>·</span>}
                <span>{project.duration}</span>
              </>
            )}
            {project.teamSize && (
              <>
                <span>·</span>
                <span>{project.teamSize === 1 ? 'Solo' : `Team of ${project.teamSize}`}</span>
              </>
            )}
          </div>

          {/* Tech badges */}
          {project.techStack && project.techStack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
              {project.techStack.slice(0, 8).map((skill) => (
                <span
                  key={skill._id}
                  style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {skill.name}
                </span>
              ))}
              {project.techStack.length > 8 && (
                <span style={{ fontSize: 11, padding: '2px 8px', color: 'rgba(255,255,255,0.25)' }}>
                  +{project.techStack.length - 8}
                </span>
              )}
            </div>
          )}

          {/* Action row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="group-hover:text-[#3b82f6] transition-colors" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View case study <ArrowRight size={13} />
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {project.liveUrl && (
                <span
                  onClick={(e) => { e.preventDefault(); window.open(project.liveUrl!, '_blank') }}
                  style={{ padding: 4, borderRadius: 4, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                  className="hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                </span>
              )}
              {project.githubUrl && (
                <span
                  onClick={(e) => { e.preventDefault(); window.open(project.githubUrl!, '_blank') }}
                  style={{ padding: 4, borderRadius: 4, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                  className="hover:text-white transition-colors"
                >
                  <Github size={14} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════

export function ProjectsPageClient({ projects, categories, initialCategory, initialSearch }: ProjectsPageClientProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = React.useState(initialCategory);
  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [selectedTech, setSelectedTech] = React.useState<string[]>([]);

  const updateURL = React.useCallback((category: string, search: string, tech: string[]) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('q', search);
    tech.forEach(t => params.append('tech', t));
    const query = params.toString();
    router.push(query ? `/projects?${query}` : '/projects', { scroll: false });
  }, [router]);

  const handleFilter = React.useCallback((filter: string) => {
    setActiveFilter(filter);
    updateURL(filter, searchTerm, selectedTech);
  }, [updateURL, searchTerm, selectedTech]);

  const handleSearch = React.useCallback((term: string) => {
    setSearchTerm(term);
    updateURL(activeFilter, term, selectedTech);
  }, [updateURL, activeFilter, selectedTech]);

  const toggleTech = React.useCallback((name: string) => {
    setSelectedTech(prev => {
      const next = prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name];
      updateURL(activeFilter, searchTerm, next);
      return next;
    });
  }, [updateURL, activeFilter, searchTerm]);

  // Filter projects
  const filtered = React.useMemo(() => {
    return projects.filter((p) => {
      if (activeFilter === 'featured' && !p.featured) return false;
      if (activeFilter && activeFilter !== 'all' && activeFilter !== 'featured') {
        if (!p.techStack?.some(t => t.category === activeFilter)) return false;
      }
      if (selectedTech.length > 0) {
        const projectTechNames = p.techStack?.map(t => t.name) || [];
        if (!selectedTech.every(t => projectTechNames.includes(t))) return false;
      }
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(s)
          || p.tagline?.toLowerCase().includes(s)
          || p.techStack?.some(t => t.name.toLowerCase().includes(s))
          || p.situation?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [projects, activeFilter, searchTerm, selectedTech]);

  // Collect all unique tech names for the tag cloud
  const allTech = React.useMemo(() => {
    const techMap = new Map<string, number>();
    projects.forEach(p => p.techStack?.forEach(t => techMap.set(t.name, (techMap.get(t.name) || 0) + 1)));
    return Array.from(techMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const featuredCount = projects.filter(p => p.featured).length;
  const liveCount = projects.filter(p => p.liveUrl).length;

  return (
    <>
      {/* Mobile layout */}
      <div className="lg:hidden" style={{ minHeight: 'calc(100vh - 80px)', padding: '24px 16px' }}>
        {/* Mobile header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 4px' }}>Projects</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {projects.length} projects · {liveCount} live · {featuredCount} featured
          </p>
        </div>

        {/* Mobile search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input
            type="text" value={searchTerm} onChange={e => handleSearch(e.target.value)}
            placeholder="Search projects..."
            style={{ width: '100%', padding: '8px 8px 8px 32px', fontSize: 13, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'var(--ds-text)', outline: 'none' }}
          />
        </div>

        {/* Mobile cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(p => <ProjectCard key={p._id} project={p} />)}
        </div>
      </div>

      {/* Desktop layout — sidebar + 2-column grid */}
      <div className="hidden lg:flex" style={{ minHeight: 'calc(100vh - 80px)' }}>

        {/* ═══ SIDEBAR ═══════════════════════════════════ */}
        <aside style={{
          width: 280,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 28px 24px',
          overflowY: 'auto',
          position: 'sticky',
          top: 80, // below nav
          height: 'calc(100vh - 80px)',
        }}>
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>AQ</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>Alvin Quach</span>
          </div>

          {/* Title + stats */}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 8px' }}>Projects</h1>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--ds-text)', margin: 0 }}>{projects.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>total</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', margin: 0 }}>{liveCount}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>live</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6', margin: 0 }}>{featuredCount}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>featured</p>
            </div>
          </div>

          {/* Status filters */}
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Status</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
            {[
              { key: 'all', label: 'All', count: projects.length },
              { key: 'featured', label: 'Featured', count: featuredCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => handleFilter(key)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 10px', borderRadius: 6, fontSize: 13, border: 'none',
                  backgroundColor: activeFilter === key ? 'rgba(59,130,246,0.08)' : 'transparent',
                  color: activeFilter === key ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: activeFilter === key ? '#3b82f6' : 'rgba(255,255,255,0.15)' }} />
                  {label}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{count}</span>
              </button>
            ))}
          </div>

          {/* Tech multi-select */}
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Tech</p>
          <Select
            isMulti
            options={allTech.map(([name]) => ({ value: name, label: name }))}
            value={selectedTech.map(t => ({ value: t, label: t }))}
            onChange={(selected) => {
              const next = (selected || []).map(s => s.value);
              setSelectedTech(next);
              updateURL(activeFilter, searchTerm, next);
            }}
            placeholder="Filter by tech..."
            noOptionsMessage={() => 'No tech found'}
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
              placeholder="Search projects or tech..."
              style={{ width: '100%', padding: '9px 36px 9px 34px', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: 'var(--ds-text)', outline: 'none', transition: 'border-color 0.15s' }}
            />
            {searchTerm && (
              <button onClick={() => handleSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.3)' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Results info */}
          {(activeFilter !== 'all' || searchTerm || selectedTech.length > 0) && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              {filtered.length} of {projects.length} projects
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedTech.length > 0 && ` using ${selectedTech.join(', ')}`}
            </p>
          )}

          {/* Project grid — 2 columns */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: 16 }}>
              {filtered.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
                No projects match your filters.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setActiveFilter('all'); setSelectedTech([]); router.push('/projects', { scroll: false }) }}
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

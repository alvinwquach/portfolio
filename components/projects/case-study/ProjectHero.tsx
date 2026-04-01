/**
 * ProjectHero — Hero with accent gradient bar, overview card, and polished layout
 */

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, Play, ArrowLeft } from 'lucide-react'
import type { Project } from '@/lib/graphql/queries'
import { ProjectHeroEnter } from '@/components/transitions/ProjectHeroEnter'

export function ProjectHero({ project, slug }: { project: Project; slug: string }) {
  const hasImage = !!project.image?.url
  const firstResult = project.results?.[0]

  return (
    <div style={{ marginBottom: 40 }}>
      <ProjectHeroEnter slug={slug} />

      {/* Back link */}
      <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20, textDecoration: 'none' }} className="hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      {/* Image — only if project has one */}
      {hasImage && (
        <div style={{ aspectRatio: '21/9', position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 24, border: '1px solid var(--sched-border)' }} data-flip-id={`project-image-${slug}`}>
          <Image src={project.image!.url!} alt={project.name} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
        </div>
      )}

      {/* Status badges */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {project.featured && (
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 4, backgroundColor: 'rgba(59,130,246,0.12)', color: 'var(--sched-accent)', border: '1px solid rgba(59,130,246,0.2)' }}>Featured</span>
        )}
        {project.liveUrl && (
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 4, backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--sched-success)', border: '1px solid rgba(34,197,94,0.15)' }}>Live</span>
        )}
      </div>

      {/* Title */}
      <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 10px', lineHeight: 1.15, letterSpacing: '-0.01em' }}>{project.name}</h1>

      {/* Tagline */}
      {project.tagline && (
        <p style={{ fontSize: 16, color: 'var(--sched-text-secondary)', margin: '0 0 20px', maxWidth: 640, lineHeight: 1.6 }}>{project.tagline}</p>
      )}

      {/* Meta + Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" style={{ gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.role && <MetaPill label={project.role} />}
          {project.teamSize && <MetaPill label={project.teamSize === 1 ? 'Solo' : `Team of ${project.teamSize}`} />}
          {project.duration && <MetaPill label={project.duration} />}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {project.liveUrl && <ActionButton href={project.liveUrl} icon={<ExternalLink size={13} />} label="Live Site" primary />}
          {project.githubUrl && <ActionButton href={project.githubUrl} icon={<Github size={13} />} label="Source" />}
          {project.demoUrl && <ActionButton href={project.demoUrl} icon={<Play size={13} />} label="Demo" />}
        </div>
      </div>

      {/* Tech stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingBottom: 20, borderBottom: '1px solid var(--sched-border)' }}>
          {project.techStack.map((skill) => (
            <span key={skill._id} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 4, backgroundColor: 'var(--sched-bg-tertiary)', color: 'var(--sched-text-secondary)', border: '1px solid var(--sched-border)' }}>
              {skill.name}
            </span>
          ))}
        </div>
      )}

      {/* ═══ Overview Card — executive summary ═══════════ */}
      <OverviewCard project={project} firstResult={firstResult} />
    </div>
  )
}

/**
 * OverviewCard — Quick-scan summary before diving into sections.
 * Shows project type, key stats, and the top result at a glance.
 */
function OverviewCard({ project, firstResult }: { project: Project; firstResult?: string }) {
  const stats = [
    project.role && { label: 'Role', value: project.role },
    project.teamSize && { label: 'Team', value: project.teamSize === 1 ? 'Solo' : `${project.teamSize} people` },
    project.duration && { label: 'Timeline', value: project.duration },
    project.techStack?.length && { label: 'Stack', value: `${project.techStack.length} technologies` },
  ].filter(Boolean) as { label: string; value: string }[]

  if (stats.length === 0 && !firstResult) return null

  return (
    <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 10, border: '1px solid var(--sched-border)', backgroundColor: 'var(--sched-bg-secondary)' }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--sched-text-muted)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>Overview</p>

      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 16 }}>
        {stats.map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: 11, color: 'var(--sched-text-muted)', margin: '0 0 2px' }}>{label}</p>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--sched-text-primary)', margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {firstResult && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--sched-border)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ color: 'var(--sched-success)', fontSize: 13, marginTop: 1 }}>✓</span>
          <p style={{ fontSize: 13, color: 'var(--sched-text-secondary)', margin: 0, lineHeight: 1.5 }}>{firstResult}</p>
        </div>
      )}
    </div>
  )
}

function MetaPill({ label }: { label: string }) {
  return (
    <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 16, backgroundColor: 'var(--sched-bg-tertiary)', color: 'var(--sched-text-secondary)', border: '1px solid var(--sched-border)' }}>{label}</span>
  )
}

function ActionButton({ href, icon, label, primary }: { href: string; icon: React.ReactNode; label: string; primary?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', backgroundColor: primary ? 'var(--sched-accent)' : 'transparent', color: primary ? 'white' : 'var(--sched-text-secondary)', border: primary ? 'none' : '1px solid var(--sched-border)' }}
      className="hover:opacity-80 transition-opacity"
    >{icon} {label}</a>
  )
}

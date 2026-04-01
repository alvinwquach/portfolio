/**
 * ProjectSections — All case study content sections as individual components.
 * Each section is conditionally rendered based on whether the project has that data.
 */

import Image from 'next/image'
import Link from 'next/link'
import { Target, Zap, Rocket, Code, Map, MessageSquare, HelpCircle, Scale, AlertTriangle, BookOpen, Play, Lightbulb, CheckCircle2, XCircle, ChevronRight } from 'lucide-react'
import type { Project } from '@/lib/graphql/queries'
import { ProjectRoadmap, MetricCallout, TechDecisionAccordion, ArchitecturePlaceholder } from '@/components/projects'
import { SectionHeader } from './SectionHeader'
import { STARBlock } from './STARBlock'

// Card style shared across sections
const card: React.CSSProperties = { borderRadius: 10, border: '1px solid var(--sched-border)', backgroundColor: 'var(--sched-bg-secondary)' }

export function ProblemSection({ project }: { project: Project }) {
  if (!project.situation && !project.task) return null
  return (
    <section style={{ marginBottom: 40, maxWidth: 720 }}>
      <SectionHeader icon={Target} color="#f59e0b" title="The Problem" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {project.situation && (
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-text)', marginBottom: 6 }}>Situation</h3>
            <p style={{ fontSize: 14, color: 'var(--sched-text-secondary)', lineHeight: 1.7, margin: 0 }}>{project.situation}</p>
          </div>
        )}
        {project.task && (
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-text)', marginBottom: 6 }}>My Goal</h3>
            <p style={{ fontSize: 14, color: 'var(--sched-text-secondary)', lineHeight: 1.7, margin: 0 }}>{project.task}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function ApproachSection({ project }: { project: Project }) {
  if (!project.actions?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={Zap} color="#67e8f9" title="My Approach" />
      <div className="grid md:grid-cols-2" style={{ gap: 10 }}>
        {project.actions.map((action, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: 10 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(103,232,249,0.08)', color: '#67e8f9', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
            <p style={{ fontSize: 13, color: 'var(--sched-text-secondary)', lineHeight: 1.6, margin: 0 }}>{action}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function OutcomeSection({ project }: { project: Project }) {
  if (!project.results?.length && !project.metrics?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={Rocket} color="#22c55e" title="The Outcome" />
      {project.metrics && project.metrics.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 12, marginBottom: project.results?.length ? 16 : 0 }}>
          {project.metrics.map((m, i) => (
            <MetricCallout key={i} before={m.before} after={m.after} label={m.label} prefix={m.prefix} suffix={m.suffix} lowerIsBetter={m.lowerIsBetter} />
          ))}
        </div>
      )}
      {project.results && project.results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 8 }}>
          {project.results.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 8, backgroundColor: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.08)' }}>
              <CheckCircle2 size={14} style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: 'var(--ds-text)', lineHeight: 1.4, margin: 0 }}>{r}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function ArchitectureSection({ project }: { project: Project }) {
  if (!project.architectureNotes) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={Code} color="#67e8f9" title="Architecture" subtitle="System design and component relationships" />
      <ArchitecturePlaceholder />
    </section>
  )
}

export function RoadmapSection({ project }: { project: Project }) {
  if (!project.roadmap?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={Map} color="#8b5cf6" title="Project Roadmap" subtitle="MVP, stretch goals, and future vision" />
      <div style={{ ...card, padding: 20 }}>
        <ProjectRoadmap roadmap={project.roadmap} />
      </div>
    </section>
  )
}

export function InterviewSection({ project }: { project: Project }) {
  if (!project.interviewQuestions?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={MessageSquare} color="#67e8f9" title="Interview Questions" subtitle="Common questions, answered in STAR format" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {project.interviewQuestions.map((q, i) => (
          <details key={i} className="group" style={{ ...card, overflow: 'hidden' }}>
            <summary style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, cursor: 'pointer', listStyle: 'none' }} className="hover:bg-white/[0.02] transition-colors">
              <span style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(103,232,249,0.08)', color: '#67e8f9', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>Q{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ds-text)', margin: 0, lineHeight: 1.4 }}>{q.question}</p>
              </div>
              <ChevronRight size={14} style={{ color: 'var(--sched-text-muted)', marginTop: 4, transition: 'transform 0.2s' }} className="group-open:rotate-90" />
            </summary>
            <div style={{ padding: '8px 14px 14px', marginLeft: 38 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.situation && <STARBlock letter="S" label="Situation" color="amber">{q.situation}</STARBlock>}
                {q.task && <STARBlock letter="T" label="Task" color="blue">{q.task}</STARBlock>}
                {q.actions && q.actions.length > 0 && (
                  <STARBlock letter="A" label="Actions" color="cyan">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {q.actions.map((a: string, j: number) => (
                        <li key={j} style={{ display: 'flex', gap: 6 }}><span style={{ color: '#67e8f9' }}>→</span>{a}</li>
                      ))}
                    </ul>
                  </STARBlock>
                )}
                {q.result && <STARBlock letter="R" label="Result" color="emerald">{q.result}</STARBlock>}
                {q.keyTakeaway && (
                  <div style={{ display: 'flex', gap: 8, padding: 10, backgroundColor: 'var(--sched-bg-tertiary)', borderRadius: 8, fontSize: 13 }}>
                    <Lightbulb size={14} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ margin: 0, color: 'var(--sched-text-secondary)' }}><span style={{ fontWeight: 600, color: '#f59e0b' }}>Key Takeaway:</span> {q.keyTakeaway}</p>
                  </div>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export function TechDecisionsSection({ project }: { project: Project }) {
  if (!project.technicalDecisions?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={HelpCircle} color="#8b5cf6" title="Technical Decisions" subtitle="Why I chose X over Y" />
      <TechDecisionAccordion items={project.technicalDecisions} />
    </section>
  )
}

export function TradeoffsSection({ project }: { project: Project }) {
  if (!project.tradeoffs?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={Scale} color="#f59e0b" title="Key Trade-offs" subtitle="Every decision has costs" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {project.tradeoffs.map((t, i) => (
          <div key={i} style={{ ...card, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--sched-border)', backgroundColor: 'var(--sched-bg-tertiary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale size={14} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--ds-text)', margin: 0 }}>{t.decision}</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-3" style={{ padding: 16, gap: 16, fontSize: 13 }}>
              {t.prosGained && t.prosGained.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> Gained</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {t.prosGained.map((p: string, j: number) => <li key={j} style={{ color: 'var(--sched-text-secondary)', display: 'flex', gap: 6 }}><span style={{ color: '#22c55e' }}>+</span>{p}</li>)}
                  </ul>
                </div>
              )}
              {t.consAccepted && t.consAccepted.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={12} /> Gave Up</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {t.consAccepted.map((c: string, j: number) => <li key={j} style={{ color: 'var(--sched-text-secondary)', display: 'flex', gap: 6 }}><span style={{ color: '#ef4444' }}>−</span>{c}</li>)}
                  </ul>
                </div>
              )}
              {t.whyWorthIt && (
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}><Lightbulb size={12} /> Why Worth It</h4>
                  <p style={{ color: 'var(--sched-text-secondary)', lineHeight: 1.5, margin: 0 }}>{t.whyWorthIt}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ChallengesSection({ project }: { project: Project }) {
  if (!project.challenges?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={AlertTriangle} color="#ef4444" title="Challenges & Solutions" subtitle="The hardest problems I solved" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {project.challenges.map((ch, i) => (
          <details key={i} className="group" style={{ ...card, overflow: 'hidden' }}>
            <summary style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, cursor: 'pointer', listStyle: 'none' }} className="hover:bg-white/[0.02] transition-colors">
              <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ds-text)', flex: 1 }}>{ch.problem}</span>
              <ChevronRight size={14} style={{ color: 'var(--sched-text-muted)', transition: 'transform 0.2s' }} className="group-open:rotate-90" />
            </summary>
            <div style={{ padding: '6px 12px 14px', marginLeft: 34 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                {ch.approach && <div><h4 style={{ fontSize: 11, fontWeight: 600, color: '#67e8f9', marginBottom: 4 }}>Approach</h4><p style={{ color: 'var(--sched-text-secondary)', lineHeight: 1.6, margin: 0 }}>{ch.approach}</p></div>}
                {ch.solution && <div><h4 style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', marginBottom: 4 }}>Solution</h4><p style={{ color: 'var(--sched-text-secondary)', lineHeight: 1.6, margin: 0 }}>{ch.solution}</p></div>}
                {ch.lesson && (
                  <div style={{ display: 'flex', gap: 8, padding: 10, backgroundColor: 'rgba(245,158,11,0.04)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.08)' }}>
                    <Lightbulb size={14} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ margin: 0, color: 'var(--sched-text-secondary)' }}><span style={{ fontWeight: 600, color: '#f59e0b' }}>Lesson:</span> {ch.lesson}</p>
                  </div>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export function CodeHighlightsSection({ project }: { project: Project }) {
  if (!project.codeHighlights?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={Code} color="#67e8f9" title="Code Highlights" subtitle="Key sections I'd walk through in a code review" />
      <div className="grid md:grid-cols-2" style={{ gap: 12 }}>
        {project.codeHighlights.map((h, i) => (
          <div key={i} style={{ ...card, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--ds-text)', margin: 0 }}>{h.title}</h3>
              {h.filePath && <code style={{ fontSize: 10, color: 'var(--sched-text-muted)', backgroundColor: 'var(--sched-bg-tertiary)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{h.filePath}</code>}
            </div>
            {h.explanation && <p style={{ fontSize: 13, color: 'var(--sched-text-secondary)', lineHeight: 1.6, margin: 0 }}>{h.explanation}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export function GallerySection({ project }: { project: Project }) {
  if (!project.gallery?.length) return null
  return (
    <section style={{ marginBottom: 40 }}>
      <SectionHeader icon={Play} color="rgba(255,255,255,0.4)" title="Screenshots" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: 12 }}>
        {project.gallery.map((img, i) => img?.url && (
          <div key={i} style={{ aspectRatio: '16/9', position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--sched-border)' }} className="group">
            <Image src={img.url} alt={img.alt || `${project.name} screenshot ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function LessonsSection({ project }: { project: Project }) {
  if (!project.lessonsLearned?.length && !project.futureImprovements?.length) return null
  const hasBoth = (project.lessonsLearned?.length ?? 0) > 0 && (project.futureImprovements?.length ?? 0) > 0
  return (
    <section style={{ marginBottom: 40 }}>
      <div className={hasBoth ? 'grid md:grid-cols-2' : ''} style={{ gap: 20 }}>
        {project.lessonsLearned && project.lessonsLearned.length > 0 && (
          <div>
            <SectionHeader icon={BookOpen} color="#f59e0b" title="What I Learned" size="sm" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {project.lessonsLearned.map((l, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--sched-text-secondary)', padding: 8, borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.06)' }}>
                  <span style={{ color: '#f59e0b' }}>→</span>{l}
                </li>
              ))}
            </ul>
          </div>
        )}
        {project.futureImprovements && project.futureImprovements.length > 0 && (
          <div>
            <SectionHeader icon={Rocket} color="#67e8f9" title="Future Plans" size="sm" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {project.futureImprovements.map((f, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--sched-text-secondary)', padding: 8, borderRadius: 8, backgroundColor: 'rgba(103,232,249,0.03)', border: '1px solid rgba(103,232,249,0.06)' }}>
                  <span style={{ color: '#67e8f9' }}>+</span>{f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * SectionDivider — subtle horizontal line between major sections.
 * Use between sections that feel too close together.
 */
export function SectionDivider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--sched-border)', margin: '8px 0 32px' }} />
}

/**
 * FooterCTA — End of case study with next project link + contact CTA.
 */
export function FooterCTA({ nextProject }: { nextProject?: { name: string; slug: string } }) {
  return (
    <div style={{ paddingTop: 32, borderTop: '1px solid var(--sched-border)' }}>
      {/* Next project card */}
      {nextProject && (
        <Link href={`/project/${nextProject.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderRadius: 10, border: '1px solid var(--sched-border)', backgroundColor: 'var(--sched-bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="hover:border-[rgba(59,130,246,0.3)] transition-colors">
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sched-text-muted)', margin: '0 0 4px', fontFamily: 'var(--font-mono)' }}>Next project</p>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ds-text)', margin: 0 }}>{nextProject.name}</p>
            </div>
            <span style={{ fontSize: 18, color: 'var(--sched-text-muted)' }}>→</span>
          </div>
        </Link>
      )}

      {/* Contact + all projects */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--sched-text-muted)', marginBottom: 14 }}>Want to discuss this project?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <Link href="/contact" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, backgroundColor: 'var(--sched-accent)', color: 'white', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">Get in Touch</Link>
          <Link href="/projects" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid var(--sched-border)', color: 'var(--sched-text-secondary)', textDecoration: 'none' }} className="hover:border-white/20 transition-colors">All Projects</Link>
        </div>
      </div>
    </div>
  )
}

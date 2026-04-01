/**
 * Experience Page Client — Sidebar Tabs + Detail Panel
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Download,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  Scale,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

import type { Tradeoff, TechnicalDecision, Challenge } from '@/types/graphql';

interface ExperienceItem {
  _id: string;
  company: string;
  role: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  situation?: string;
  tasks?: string[];
  actions?: string[];
  results?: string[];
  tradeoffs?: Tradeoff[];
  technicalDecisions?: TechnicalDecision[];
  challenges?: Challenge[];
  lessonsLearned?: string[];
  techStack?: { _id: string; name: string }[];
  duration: string;
  formattedStart: string;
  formattedEnd?: string;
}

interface ClientItem {
  _id: string;
  name: string;
  clientName?: string;
  clientIndustry?: string;
  situation?: string;
  results?: string[];
  techStack?: { _id: string; name: string }[];
  slug?: string;
  liveUrl?: string;
}

interface Section {
  label: string;
  items: ExperienceItem[];
}

interface Props {
  sections: Section[];
  clients: ClientItem[];
  tCreativeStudioId?: string;
  resumeUrl?: string;
}

export function ExperiencePageClient({ sections, clients, tCreativeStudioId, resumeUrl }: Props) {
  // Default to first company
  const allItems = sections.flatMap(s => s.items);
  const [activeId, setActiveId] = React.useState(allItems[0]?._id || '');
  const active = allItems.find(i => i._id === activeId);
  const isTCreative = activeId === tCreativeStudioId;

  return (
    <>
      {/* Mobile layout */}
      <div className="lg:hidden" style={{ minHeight: 'calc(100vh - 80px)', padding: '24px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 4px' }}>Experience</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {allItems.length} roles · {allItems.filter(i => i.isCurrent).length} current
          </p>
        </div>

        {/* Mobile — all roles expanded in a list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sections.map(section => (
            <div key={section.label}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>{section.label}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.items.map(item => (
                  <MobileExperienceCard key={item._id} item={item} clients={item._id === tCreativeStudioId ? clients : []} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile footer */}
        <FooterCTA resumeUrl={resumeUrl} />
      </div>

      {/* Desktop layout — sidebar tabs + detail */}
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

          {/* Title */}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 8px' }}>Experience</h1>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--ds-text)', margin: 0 }}>{allItems.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>roles</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', margin: 0 }}>{allItems.filter(i => i.isCurrent).length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>current</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6', margin: 0 }}>{sections.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>domains</p>
            </div>
          </div>

          {/* Company tabs grouped by domain */}
          {sections.map(section => (
            <div key={section.label} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 8px', fontFamily: 'var(--font-mono)' }}>{section.label}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map(item => {
                  const isActive = item._id === activeId;
                  return (
                    <button
                      key={item._id}
                      onClick={() => setActiveId(item._id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 10px', borderRadius: 6, fontSize: 13, border: 'none',
                        backgroundColor: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                        color: isActive ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, lineHeight: 1.3 }}>{item.company}</div>
                        <div style={{ fontSize: 11, color: isActive ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.25)', marginTop: 1 }}>
                          {item.role}
                        </div>
                      </div>
                      {item.isCurrent && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Resume download */}
          {resumeUrl && (
            <a
              href={`${resumeUrl}?dl=resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none',
                marginTop: 8, width: '100%', justifyContent: 'center',
              }}
              className="hover:border-[rgba(59,130,246,0.2)] hover:text-white transition-all"
            >
              <Download size={13} /> Download Resume
            </a>
          )}
        </aside>

        {/* ═══ MAIN CONTENT ══════════════════════════════ */}
        <main style={{ flex: 1, minWidth: 0, padding: '32px 32px 48px' }}>
          {active ? (
            <div>
              {/* Role title + company */}
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 6px', lineHeight: 1.3 }}>
                {active.role} <span style={{ color: '#3b82f6' }}>@ {active.company}</span>
              </h2>

              {/* Date + duration + location */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  {active.formattedStart} — {active.formattedEnd || 'Present'}
                </span>
                <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 11 }}>
                  {active.duration}
                </span>
                {active.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {active.location}
                  </span>
                )}
                {active.employmentType && (
                  <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 11, textTransform: 'capitalize' }}>
                    {active.employmentType.replace(/_/g, ' ')}
                  </span>
                )}
                {active.isCurrent && (
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.15)' }}>Current</span>
                )}
              </div>

              {/* Situation callout */}
              {active.situation && (
                <div style={{ borderLeft: '3px solid rgba(59,130,246,0.4)', padding: '12px 16px', marginBottom: 24, backgroundColor: 'rgba(59,130,246,0.04)', borderRadius: '0 8px 8px 0' }}>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.7 }}>
                    {active.situation}
                  </p>
                </div>
              )}

              {/* Results / achievements */}
              {active.results && active.results.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {active.results.map((result, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' }}>
                        <ChevronRight size={14} style={{ color: '#3b82f6', marginTop: 2, flexShrink: 0 }} />
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key actions (what I did) */}
              {active.actions && active.actions.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>What I Did</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {active.actions.map((action, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'rgba(103,232,249,0.08)', color: '#67e8f9', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical decisions */}
              {active.technicalDecisions && active.technicalDecisions.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Technical Decisions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {active.technicalDecisions.map((td, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                          <Lightbulb size={13} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ds-text)', margin: 0 }}>{td.question}</p>
                        </div>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 0 21px', lineHeight: 1.6 }}>{td.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {active.challenges && active.challenges.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Challenges</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {active.challenges.map((ch, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                          <AlertTriangle size={13} style={{ color: '#ef4444', marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ds-text)', margin: 0 }}>{ch.problem}</p>
                        </div>
                        {ch.solution && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 21px', lineHeight: 1.6 }}>{ch.solution}</p>}
                        {ch.lesson && (
                          <div style={{ display: 'flex', gap: 6, margin: '6px 0 0 21px', fontSize: 12 }}>
                            <BookOpen size={11} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
                            <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.5 }}>{ch.lesson}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tradeoffs */}
              {active.tradeoffs && active.tradeoffs.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Trade-offs</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {active.tradeoffs.map((t, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <Scale size={13} style={{ color: '#f59e0b' }} />
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ds-text)', margin: 0 }}>{t.decision}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginLeft: 19, fontSize: 12 }}>
                          {t.prosGained && t.prosGained.length > 0 && (
                            <div>
                              {t.prosGained.map((p, j) => (
                                <div key={j} style={{ display: 'flex', gap: 4, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                                  <span style={{ color: '#22c55e' }}>+</span>{p}
                                </div>
                              ))}
                            </div>
                          )}
                          {t.consAccepted && t.consAccepted.length > 0 && (
                            <div>
                              {t.consAccepted.map((c, j) => (
                                <div key={j} style={{ display: 'flex', gap: 4, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                                  <span style={{ color: '#ef4444' }}>−</span>{c}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons learned */}
              {active.lessonsLearned && active.lessonsLearned.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Lessons Learned</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {active.lessonsLearned.map((lesson, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.45)', padding: '6px 10px', borderRadius: 6, backgroundColor: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.06)' }}>
                        <span style={{ color: '#f59e0b' }}>→</span>{lesson}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech stack */}
              {active.techStack && active.techStack.length > 0 && (
                <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>Technologies</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {active.techStack.map(skill => (
                      <span key={skill._id} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Client projects (under T Creative Studio) */}
              {isTCreative && clients.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>Client Work</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {clients.map(client => (
                      <div key={client._id} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(245,158,11,0.15)', backgroundColor: 'rgba(245,158,11,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {client.slug ? (
                              <Link href={`/project/${client.slug}`} style={{ fontSize: 14, fontWeight: 600, color: 'var(--ds-text)', textDecoration: 'none' }} className="hover:text-[#f59e0b] transition-colors">
                                {client.name}
                              </Link>
                            ) : (
                              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ds-text)' }}>{client.name}</span>
                            )}
                            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Briefcase size={9} /> Client
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {client.liveUrl && (
                              <a href={client.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }} className="hover:text-white transition-colors">
                                <ExternalLink size={11} /> Live
                              </a>
                            )}
                            {client.slug && (
                              <Link href={`/project/${client.slug}`} style={{ fontSize: 12, fontWeight: 500, color: '#f59e0b', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
                                Case Study <ArrowRight size={11} style={{ display: 'inline' }} />
                              </Link>
                            )}
                          </div>
                        </div>
                        {client.clientName && (
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 6px' }}>
                            {client.clientName}{client.clientIndustry && ` · ${client.clientIndustry}`}
                          </p>
                        )}
                        {client.results && client.results.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {client.results.slice(0, 2).map((r, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                                <CheckCircle2 size={11} style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }} />
                                <span className="line-clamp-1">{r}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <FooterCTA resumeUrl={resumeUrl} />
            </div>
          ) : (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Select a role from the sidebar.</p>
          )}
        </main>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// Mobile Experience Card — compact, no tabs
// ═══════════════════════════════════════════════════════

function MobileExperienceCard({ item, clients }: { item: ExperienceItem; clients: ClientItem[] }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: 0 }}>{item.role}</h3>
        {item.isCurrent && (
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.15)' }}>Current</span>
        )}
      </div>
      <p style={{ fontSize: 13, color: '#3b82f6', margin: '0 0 6px', fontWeight: 500 }}>@ {item.company}</p>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <span>{item.formattedStart} — {item.formattedEnd || 'Present'}</span>
        <span>{item.duration}</span>
        {item.location && <span>{item.location}</span>}
      </div>

      {item.situation && (
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', lineHeight: 1.6 }} className="line-clamp-2">
          {item.situation}
        </p>
      )}

      {item.results && item.results.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {item.results.slice(0, 2).map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
              <CheckCircle2 size={11} style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }} />
              <span className="line-clamp-1">{r}</span>
            </div>
          ))}
        </div>
      )}

      {item.techStack && item.techStack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {item.techStack.slice(0, 5).map(skill => (
            <span key={skill._id} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {skill.name}
            </span>
          ))}
          {item.techStack.length > 5 && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>+{item.techStack.length - 5}</span>
          )}
        </div>
      )}

      {/* Client projects nested */}
      {clients.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', margin: '0 0 8px' }}>Client Work</p>
          {clients.map(client => (
            <div key={client._id} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.15)', backgroundColor: 'rgba(245,158,11,0.03)', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-text)' }}>{client.name}</span>
                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>Client</span>
              </div>
              {client.results?.[0] && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }} className="line-clamp-1">{client.results[0]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Footer CTA
// ═══════════════════════════════════════════════════════

function FooterCTA({ resumeUrl }: { resumeUrl?: string }) {
  return (
    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 6px' }}>Interested in working together?</p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }}>
        I&apos;m always open to discussing new opportunities and interesting projects.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <Link href="/schedule" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
          Get in Touch
        </Link>
        {resumeUrl && (
          <a href={`${resumeUrl}?dl=resume.pdf`} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }} className="hover:border-white/20 transition-colors">
            <Download size={13} /> Resume
          </a>
        )}
      </div>
    </div>
  );
}

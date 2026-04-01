/**
 * FeaturedProjects — Numbered sections, elevated cards, visual rhythm
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Github, Briefcase, Code2, Star, CheckCircle2 } from 'lucide-react';
import { FadeIn, TextReveal } from '@/components/gsap';
import type { Project } from '@/lib/graphql/queries';

function SectionNumber({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>{num}</span>
      <div style={{ height: 1, width: 32, backgroundColor: 'rgba(59,130,246,0.3)' }} />
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{label}</span>
    </div>
  );
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  const clientProjects = projects.filter(p => p.projectType === 'freelance');
  const personalProjects = projects.filter(p => p.projectType !== 'freelance');
  const featuredClient = clientProjects[0];
  const otherClients = clientProjects.slice(1);

  return (
    <section id="projects" style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* ═══ CLIENT WORK ═══════════════════════════════ */}
        {clientProjects.length > 0 && (
          <>
            <FadeIn>
              <SectionNumber num="01" label="Client Work" />
              <TextReveal as="h2" by="word" stagger={0.05} duration={0.5} className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                Professional Projects
              </TextReveal>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '0 0 40px', maxWidth: 480 }}>Real solutions built for real clients</p>
            </FadeIn>

            {/* Featured hero card */}
            {featuredClient && (
              <FadeIn>
                <div style={{ marginBottom: 24, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0d1117' }}>
                  <div className="grid lg:grid-cols-2">
                    {/* Image */}
                    <div className="aspect-[16/10] lg:aspect-auto" style={{ position: 'relative', minHeight: 280, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      {featuredClient.image?.url ? (
                        <Image src={featuredClient.image.url} alt={featuredClient.name} fill sizes="(max-width: 1024px) 100vw, 50vw" priority className="object-cover" />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Briefcase size={48} style={{ color: 'rgba(255,255,255,0.06)' }} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: 32 }} className="lg:py-10 lg:px-10">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Star size={10} style={{ fill: '#3b82f6' }} /> Featured
                        </span>
                        {featuredClient.clientIndustry && (
                          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>{featuredClient.clientIndustry}</span>
                        )}
                      </div>

                      <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ds-text)', margin: '0 0 8px' }}>{featuredClient.name}</h3>
                      {featuredClient.tagline && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px', lineHeight: 1.6 }}>{featuredClient.tagline}</p>}

                      {featuredClient.results && featuredClient.results.length > 0 && (
                        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {featuredClient.results.slice(0, 2).map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                              <CheckCircle2 size={13} style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }} />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {featuredClient.techStack && featuredClient.techStack.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 20 }}>
                          {featuredClient.techStack.slice(0, 6).map(s => (
                            <span key={s._id} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>{s.name}</span>
                          ))}
                          {featuredClient.techStack.length > 6 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>+{featuredClient.techStack.length - 6}</span>}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/project/${featuredClient.slug.current}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none' }}
                          className="hover:opacity-85 transition-opacity">
                          View Case Study <ArrowRight size={13} />
                        </Link>
                        {featuredClient.liveUrl && (
                          <a href={featuredClient.liveUrl} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                            className="hover:border-white/20 transition-colors">
                            <ExternalLink size={13} /> Live Site
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Other client cards */}
            {otherClients.length > 0 && (
              <div className="grid md:grid-cols-2" style={{ gap: 16, marginBottom: 64 }}>
                {otherClients.map(project => (
                  <FadeIn key={project._id}>
                    <ProjectCard project={project} />
                  </FadeIn>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══ PRODUCTS ══════════════════════════════════ */}
        {personalProjects.length > 0 && (
          <>
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
                <div>
                  <SectionNumber num="02" label="Products" />
                  <TextReveal as="h2" by="word" stagger={0.05} duration={0.5} className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                    What I&apos;ve Built
                  </TextReveal>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Ideas I&apos;ve shipped to learn, explore, and solve problems</p>
                </div>
                <Link href="/projects" className="hidden md:flex hover:text-white transition-colors"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                  View All <ArrowRight size={13} />
                </Link>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
              {personalProjects.map((project, i) => (
                <FadeIn key={project._id}>
                  <ProjectCard project={project} priority={i < 3} />
                </FadeIn>
              ))}
            </div>

            <FadeIn className="mt-10 text-center md:hidden">
              <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                View All Projects <ArrowRight size={13} />
              </Link>
            </FadeIn>
          </>
        )}
      </div>
    </section>
  );
}

/**
 * ProjectCard — Consistent card used for all project types
 */
function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const isClient = project.projectType === 'freelance';

  return (
    <Link href={`/project/${project.slug.current}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }} className="group">
      <div
        style={{ height: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0d1117', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' }}
        className="hover:border-[rgba(59,130,246,0.2)]"
      >
        {/* Image */}
        <div className="aspect-[16/9]" style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          {project.image?.url ? (
            <Image src={project.image.url} alt={project.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={priority} className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isClient ? <Briefcase size={28} style={{ color: 'rgba(255,255,255,0.06)' }} /> : <Code2 size={28} style={{ color: 'rgba(255,255,255,0.06)' }} />}
            </div>
          )}

          {/* Badges overlay */}
          {isClient && (
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}>Client</span>
              {project.clientIndustry && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)' }}>{project.clientIndustry}</span>}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 className="group-hover:text-[#3b82f6] transition-colors" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 4px' }}>{project.name}</h3>
          {project.tagline && <p className="line-clamp-2" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', lineHeight: 1.5, flex: 1 }}>{project.tagline}</p>}

          {project.techStack && project.techStack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
              {project.techStack.slice(0, 4).map(s => (
                <span key={s._id} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}>{s.name}</span>
              ))}
              {project.techStack.length > 4 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>+{project.techStack.length - 4}</span>}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 'auto' }}>
            <span className="group-hover:text-[#3b82f6] transition-colors" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Details <ArrowRight size={11} />
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {project.liveUrl && (
                <span onClick={e => { e.preventDefault(); window.open(project.liveUrl!, '_blank'); }} style={{ padding: 3, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }} className="hover:text-white transition-colors">
                  <ExternalLink size={12} />
                </span>
              )}
              {project.githubUrl && (
                <span onClick={e => { e.preventDefault(); window.open(project.githubUrl!, '_blank'); }} style={{ padding: 3, color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }} className="hover:text-white transition-colors">
                  <Github size={12} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

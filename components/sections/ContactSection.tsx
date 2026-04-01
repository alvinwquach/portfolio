/**
 * Contact Section — Numbered, elevated bg, polished cards
 */

import Link from 'next/link';
import { ContactForm } from '@/components/sections/ContactForm';
import { Github, Linkedin, Mail, ArrowRight, Twitter, Calendar } from 'lucide-react';
import { FadeIn, TextReveal, StaggerChildren } from '@/components/gsap';

interface ContactSectionProps {
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export function ContactSection({ email, github, linkedin, twitter }: ContactSectionProps) {
  const contactLinks = [
    { href: email ? `mailto:${email}` : null, label: 'Email me', icon: Mail },
    { href: linkedin, label: 'Connect on LinkedIn', icon: Linkedin },
    { href: github, label: 'Follow on GitHub', icon: Github },
    { href: twitter, label: 'Follow on X', icon: Twitter },
  ].filter(link => link.href);

  return (
    <section id="contact" style={{ padding: '80px 0 96px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Section number + header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>05</span>
          <div style={{ height: 1, width: 32, backgroundColor: 'rgba(59,130,246,0.3)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Get in Touch</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <TextReveal as="h2" by="word" stagger={0.06} duration={0.5} className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Let&apos;s work together.
          </TextReveal>
          <FadeIn delay={0.3} distance={10}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
              Have a project in mind or want to chat? I typically respond within 1-2 days.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2" style={{ gap: 32 }}>
          {/* Left — Quick Links */}
          <StaggerChildren stagger={0.08} delay={0.2} from="bottom" distance={15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contactLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href!}
                  target={link.href?.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href?.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: '#0d1117',
                    textDecoration: 'none',
                  }}
                  className="group hover:border-[rgba(59,130,246,0.2)] transition-all"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ds-text)' }}>{link.label}</span>
                  </div>
                  <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.15)' }} className="group-hover:translate-x-1 transition-transform" />
                </a>
              );
            })}

            {/* Schedule CTA — highlighted */}
            <Link href="/schedule"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 10,
                border: '1px solid rgba(59,130,246,0.15)',
                backgroundColor: 'rgba(59,130,246,0.04)',
                textDecoration: 'none',
              }}
              className="group hover:border-[rgba(59,130,246,0.3)] transition-all"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={18} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#3b82f6' }}>Schedule a call</span>
              </div>
              <ArrowRight size={14} style={{ color: 'rgba(59,130,246,0.4)' }} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          </StaggerChildren>

          {/* Right — Form in elevated card */}
          <FadeIn delay={0.3} distance={20}>
          <div style={{ padding: '24px 28px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0d1117' }}>
            <ContactForm />
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

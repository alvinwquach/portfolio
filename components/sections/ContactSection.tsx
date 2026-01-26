/**
 * Contact Section
 * ===============
 * GreatFrontend-inspired contact section.
 * Left: quick links. Right: message form.
 */

import Link from 'next/link';
import { ContactForm } from '@/components/sections/ContactForm';
import { Github, Linkedin, Mail, ArrowRight, Twitter } from 'lucide-react';

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
    <section id="contact" className="py-24 md:py-32">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Don&apos;t hesitate to reach out.
            <br />
            <span className="text-muted-foreground">I&apos;m always open to chat.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Have questions, feedback, or a project in mind? I typically respond within 1-2 days.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Left - Quick Links */}
          <div className="space-y-3">
            {contactLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href!}
                  target={link.href?.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href?.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border hover:bg-card/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground font-medium">{link.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </a>
              );
            })}
          </div>

          {/* Right - Form */}
          <div className="rounded-lg border border-border/50 p-6 md:p-8 bg-card/30">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

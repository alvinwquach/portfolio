/**
 * Footer Component
 * ================
 * GreatFrontEnd-style footer with large brand on left, link columns on right.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { LogoTurntableAnimated } from '@/components/ui/logo-new/LogoTurntableAnimated';

// X (Twitter) icon - lucide doesn't have the X logo
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface FooterProps {
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

const footerLinks = {
  projects: {
    title: 'Projects',
    links: [
      { label: 'All Projects', href: '/projects' },
      { label: 'Hoparc Physical Therapy', href: '/projects/hoparc' },
      { label: 'OpportunIQ', href: '/projects/opportuniq' },
      { label: 'Hoop Almanac', href: '/projects/hoop-almanac' },
      { label: 'SculptQL', href: '/projects/sculptql' },
    ],
  },
  knowledge: {
    title: 'Knowledge',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Experience', href: '/experience' },
      { label: 'Interview Prep', href: '/interview-prep' },
    ],
  },
  connect: {
    title: 'Connect',
    links: [
      { label: 'Contact', href: '/#contact' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/alvinwquach', external: true },
      { label: 'GitHub', href: 'https://github.com/alvinwquach', external: true },
      { label: 'X', href: 'https://x.com/mistersjc', external: true },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Resume', href: '/resume.pdf', external: true },
    ],
  },
};

export function Footer({ github, linkedin, twitter }: FooterProps) {
  return (
    <footer className="border-t border-border/30 bg-background">
      <div className="container max-w-7xl py-16 md:py-20">
        {/* Main footer grid - Brand left, links right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column - larger like GreatFrontEnd */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Logo size={48} />
              <span className="font-semibold text-foreground text-2xl">alvinquach</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[280px] mb-6">
              Full Stack Developer building systems that respect complexity.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Open to opportunities
            </p>

            {/* Interactive turntable - click play to spin */}
            <div className="mt-6">
              <LogoTurntableAnimated
                size={200}
                showControls={true}
              />
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="font-medium text-muted-foreground/70 text-xs mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {'external' in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar - no top border */}
        <div className="mt-16 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social icons - left side */}
            <div className="flex items-center gap-4">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="X"
                >
                  <XIcon className="h-5 w-5" />
                </a>
              )}
            </div>

            {/* Copyright with logo */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()}</span>
              <Logo size={20} />
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

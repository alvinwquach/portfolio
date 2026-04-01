/**
 * Footer — Minimal. Copyright + social icons.
 */

import { Github, Linkedin } from 'lucide-react';

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
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

export function Footer({ github, linkedin, twitter }: FooterProps) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', margin: 0 }}>
          © {new Date().getFullYear()} Alvin Quach
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ color: 'rgba(255,255,255,0.2)' }} className="hover:text-white transition-colors">
              <Linkedin size={15} />
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              style={{ color: 'rgba(255,255,255,0.2)' }} className="hover:text-white transition-colors">
              <Github size={15} />
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="X"
              style={{ color: 'rgba(255,255,255,0.2)' }} className="hover:text-white transition-colors">
              <XIcon className="h-[15px] w-[15px]" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

/**
 * Navigation Component
 * ====================
 * Main site navigation with responsive mobile menu.
 * Uses inline dark theme styles matching the rest of the site.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/logos';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/blog', label: 'Blog' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => { setIsOpen(false); }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full backdrop-blur"
        style={{ backgroundColor: 'rgba(13,13,20,0.92)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
            <Logo size={28} />
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ds-text)' }}>Alvin Quach</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 4 }} aria-label="Main navigation">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  style={{
                    padding: '6px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s',
                    color: isActive ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                    backgroundColor: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  }}
                  className="hover:text-white hover:bg-white/5 transition-all"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 16 }}>
            <Link href="/schedule"
              style={{
                padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none',
              }}
              className="hover:opacity-85 transition-opacity"
            >
              Schedule a Call
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            style={{ position: 'relative', zIndex: 60, padding: 8, borderRadius: 6, border: 'none', backgroundColor: 'transparent', color: 'var(--ds-text)', cursor: 'pointer' }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', left: 0, right: 0, top: 64, zIndex: 9999,
          backgroundColor: 'rgba(13,13,20,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.2s',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 4 }} aria-label="Mobile navigation">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                style={{
                  padding: '12px 16px', borderRadius: 8, fontSize: 17, fontWeight: 500, textDecoration: 'none',
                  color: isActive ? '#3b82f6' : 'var(--ds-text)',
                  backgroundColor: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/schedule"
            style={{
              display: 'block', width: '100%', marginTop: 8, padding: '10px 16px', borderRadius: 8,
              fontSize: 15, fontWeight: 500, backgroundColor: '#3b82f6', color: 'white',
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Schedule a Call
          </Link>
        </nav>
      </div>
    </>
  );
}

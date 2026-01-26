/**
 * Navigation Component
 * ====================
 * Main site navigation with responsive mobile menu.
 * Labels are concise — the page titles tell the full story.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/blog', label: 'Blog' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Close menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-colors hover:opacity-80"
        >
          <Logo size={36} />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-base text-foreground">Alvin Quach</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Full Stack Developer</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-all duration-[var(--timing-micro)]',
                pathname === link.href
                  ? 'text-cyan bg-cyan/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="gold"
            size="sm"
            onClick={() => {
              // If on homepage, scroll to contact. Otherwise navigate to homepage with hash.
              if (pathname === '/') {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#contact';
              }
            }}
          >
            Let's Talk
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-x-0 top-16 bottom-0 z-50 bg-background/95 backdrop-blur md:hidden transition-all duration-[var(--timing-beat)]',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <nav className="container flex flex-col gap-2 py-6" aria-label="Mobile navigation">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-3 text-lg font-medium rounded-md transition-all',
                'animate-fade-in',
                pathname === link.href
                  ? 'text-cyan bg-cyan/10'
                  : 'text-foreground hover:bg-secondary'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t">
            <Button
              variant="gold"
              className="w-full"
              size="lg"
              onClick={() => {
                setIsOpen(false);
                if (pathname === '/') {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#contact';
                }
              }}
            >
              Let's Talk
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

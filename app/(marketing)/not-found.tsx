/**
 * 404 Not Found Page
 * ==================
 * Custom 404 page for marketing routes
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-24">
      <div className="container text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-[10rem] md:text-[14rem] font-bold leading-none text-cyan/10">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              <Search className="h-4 w-4 mr-2" />
              View Projects
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-cyan hover:underline">
              About Me
            </Link>
            <Link href="/skills" className="text-cyan hover:underline">
              Skills
            </Link>
            <Link href="/knowledge" className="text-cyan hover:underline">
              Knowledge Base
            </Link>
            <Link href="/contact" className="text-cyan hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

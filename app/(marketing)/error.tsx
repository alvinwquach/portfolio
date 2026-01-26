/**
 * Error Boundary
 * ==============
 * Handles runtime errors in marketing pages
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-24">
      <div className="container text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 rounded-full bg-coral/10">
            <AlertCircle className="h-16 w-16 text-coral" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>

        {/* Error digest (for debugging) */}
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

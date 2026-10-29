'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RotateCcw, Database, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.warn('Application error boundary caught:', error.message || error);
  }, [error]);

  const isDbError =
    error.name === 'MongooseServerSelectionError' ||
    error.message?.includes('MongoDB') ||
    error.message?.includes('whitelist') ||
    error.message?.includes('cluster') ||
    error.message?.includes('TopologyDescription');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-7xl font-black tracking-tighter text-destructive/60">
          Oops!
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isDbError ? 'Database Connection Issue' : 'Something went wrong'}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {isDbError
            ? 'Could not connect to MongoDB Atlas. Your current IP may not be active in the Atlas IP Access List.'
            : error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>

          {isDbError && (
            <Link href="/db-error">
              <Button variant="outline" className="gap-2">
                <Database className="w-4 h-4" />
                View Fix Guide
              </Button>
            </Link>
          )}

          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#fafafa',
          color: '#18181b',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <div
            style={{
              fontSize: '4rem',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: '#a1a1aa',
            }}
          >
            500
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>
            Something went very wrong
          </h1>
          <p style={{ color: '#71717a', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {error.message || 'A critical error occurred. Please try again.'}
          </p>
          {error.digest && (
            <p
              style={{
                color: '#a1a1aa',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.625rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: '#18181b',
              color: '#fafafa',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

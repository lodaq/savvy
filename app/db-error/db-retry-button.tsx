'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RotateCcw, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { checkDatabaseConnection } from '@/actions/system';

export function DbRetryButton() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleRetry = async () => {
    setChecking(true);
    setLastError(null);

    try {
      const res = await checkDatabaseConnection();
      if (res.connected) {
        toast.success('Database connection restored! Redirecting...');
        router.push('/feed');
        router.refresh();
      } else {
        setLastError(res.message);
        toast.error('Could not connect to MongoDB Atlas. Please check your IP Access List.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown connection error';
      setLastError(msg);
      toast.error('Connection attempt failed.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <Button
          onClick={handleRetry}
          disabled={checking}
          className="gap-2 px-5 font-semibold"
          size="lg"
        >
          {checking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
          <span>{checking ? 'Testing Connection...' : 'Test Connection & Retry'}</span>
        </Button>
      </div>

      {lastError && (
        <div className="w-full mt-2 p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs text-left font-mono break-all flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block font-sans">Connection Failed:</span>
            <span>{lastError}</span>
          </div>
        </div>
      )}
    </div>
  );
}

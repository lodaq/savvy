import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Home, ShieldAlert, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { DbRetryButton } from './db-retry-button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Connection Error — Savvy',
  description: 'Savvy is currently unable to reach your MongoDB Atlas database.',
};

export default function DatabaseErrorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl mx-auto space-y-6 text-center">
        {/* Warning Icon Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 shadow-sm mx-auto">
          <Database className="w-8 h-8" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>MongoDB Connection Required</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Database Connection Error
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Savvy could not establish a connection to your MongoDB Atlas cluster.
            The application is protecting your session while access is resolved.
          </p>
        </div>

        {/* Actionable Solution Steps */}
        <div className="text-left bg-card border border-border/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Troubleshooting Steps (Atlas Whitelist)</span>
          </h2>

          <ul className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-foreground block mb-0.5 font-semibold">
                  IP Access List is marked &ldquo;Inactive&rdquo; in Atlas:
                </strong>
                In your MongoDB Atlas dashboard under{' '}
                <span className="font-semibold text-foreground">Network Access &gt; IP Access List</span>,
                every entry must show status <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>.
                If entries show <span className="font-semibold text-amber-600 dark:text-amber-400">Inactive</span>,
                click <span className="font-semibold text-foreground">Edit</span> on{' '}
                <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">0.0.0.0/0</code> or your current IP and click <span className="font-semibold text-foreground">Confirm</span> to activate it.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-foreground block mb-0.5 font-semibold">
                  Check if your Cluster is Paused:
                </strong>
                In MongoDB Atlas under <span className="font-semibold text-foreground">Database</span>,
                ensure your cluster is active and running. Free tier (M0) clusters pause after periods of inactivity. Click <span className="font-semibold text-foreground">Resume</span> if paused.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-foreground block mb-0.5 font-semibold">
                  Verify Credentials in .env.local:
                </strong>
                Ensure <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">MONGODB_URI</code> has the correct database username and password with read/write permissions.
              </div>
            </li>
          </ul>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <a
              href="https://cloud.mongodb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
            >
              <span>Open MongoDB Atlas Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Retry Button and Home Link */}
        <div className="space-y-3 pt-2">
          <DbRetryButton />

          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home Page</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

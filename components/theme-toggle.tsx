'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => {};

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Before mounting, default to light mode to match server render
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  if (collapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="w-9 h-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-400 transition-transform -rotate-12 hover:rotate-0" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform rotate-0 hover:rotate-45" />
        )}
      </Button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium',
        'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border/50 cursor-pointer select-none'
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="flex items-center gap-2.5">
        {isDark ? (
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center transition-colors">
            <Moon className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center transition-colors">
            <Sun className="w-3.5 h-3.5" />
          </div>
        )}
        <span className="font-medium text-foreground">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      <div
        className={cn(
          'w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center',
          isDark ? 'bg-primary' : 'bg-muted-foreground/30'
        )}
      >
        <div
          className={cn(
            'w-3 h-3 rounded-full bg-background shadow-xs transition-transform duration-200 ease-in-out',
            isDark ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </div>
    </button>
  );
}

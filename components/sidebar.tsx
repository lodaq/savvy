'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import {
  MdChevronLeft,
  MdChevronRight,
  MdArticle,
  MdImage,
  MdDynamicFeed,
  MdKey,
} from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const navItems = [
  {
    name: 'Feed',
    href: '/feed',
    icon: MdDynamicFeed,
    badge: 'Live',
  },
  {
    name: 'Articles',
    href: '/articles',
    icon: MdArticle,
  },
  {
    name: 'Gallery',
    href: '/gallery',
    icon: MdImage,
  },
  {
    name: 'Settings / API',
    href: '/settings',
    icon: MdKey,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
        setIsMobile(true);
      } else {
        setIsExpanded(true);
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={cn(
        'z-30 bg-card/95 backdrop-blur-md border-r border-border/80 h-screen p-3 sticky top-0 left-0 flex flex-col justify-between transition-all duration-300 select-none shadow-sm',
        isExpanded ? 'w-64 min-w-64' : 'w-20 min-w-20'
      )}
    >
      {/* Top section: Header & Navigation */}
      <div className="flex flex-col gap-4">
        {/* Toggle button */}
        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 top-6 w-6 h-6 rounded-full border border-border bg-background shadow-md hover:bg-muted p-0 text-muted-foreground hover:text-foreground z-40"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <MdChevronLeft className="w-3.5 h-3.5" /> : <MdChevronRight className="w-3.5 h-3.5" />}
          </Button>
        )}

        {/* Brand header */}
        <Link
          href="/feed"
          className={cn(
            'flex items-center gap-3 px-2 py-2 rounded-xl transition-colors hover:bg-muted/50',
            !isExpanded && 'justify-center px-0'
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground flex items-center justify-center font-black text-xl flex-shrink-0 shadow-sm ring-1 ring-primary/20">
            S
          </div>
          {isExpanded && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-lg tracking-tight text-foreground flex items-center gap-1.5 leading-none">
                Savvy
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[11px] text-muted-foreground font-medium mt-1 truncate">
                Content & Curation
              </span>
            </div>
          )}
        </Link>

        <Separator className="bg-border/60" />

        {/* Navigation links */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ name, href, icon: Icon, badge }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={name}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  !isExpanded && 'justify-center px-0'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />

                {isExpanded && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{name}</span>
                    {badge && !isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                        {badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Collapsed floating tooltip */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-popover border border-border text-popover-foreground text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                    {name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Theme Toggle & User Account */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Dark mode switch */}
        <div className={cn('w-full', !isExpanded && 'flex justify-center')}>
          <ThemeToggle collapsed={!isExpanded} />
        </div>

        <Separator className="bg-border/60" />

        {/* User profile section */}
        <div
          className={cn(
            'flex items-center gap-3 p-1.5 rounded-xl bg-muted/30 border border-border/40 overflow-hidden',
            !isExpanded && 'justify-center p-1 bg-transparent border-transparent'
          )}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 rounded-lg ring-1 ring-border',
              },
            }}
          />
          {isExpanded && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold truncate text-foreground leading-tight">
                {user?.fullName || user?.username || 'Account'}
              </span>
              <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

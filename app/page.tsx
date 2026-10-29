import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Image as ImageIcon, FileText } from 'lucide-react';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/feed');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight">Savvy</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personal Content Management System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
          Capture, write, and curate your digital universe.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
          Savvy is your unified workspace for polymorphic bookmarking, rich MDX publishing, and cloud media galleries.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 rounded-full px-8 text-base shadow-lg">
              <span>Start for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left w-full">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Polymorphic Feed</h3>
            <p className="text-sm text-muted-foreground">
              Save web bookmarks with rich OpenGraph cards, YouTube videos, Shorts, quotes, and notes.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">In-App MDX Editor</h3>
            <p className="text-sm text-muted-foreground">
              Write rich MDX articles in a Notion-like WYSIWYG editor and publish with server-rendered speed.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Cloud Media Gallery</h3>
            <p className="text-sm text-muted-foreground">
              Upload images directly to high-speed CDN storage and organize them in a responsive masonry grid.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Savvy CMS — Built with Next.js 15, Clerk, MongoDB & Uploadthing.
      </footer>
    </div>
  );
}

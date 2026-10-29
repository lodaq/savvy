'use client';

import { detectLanguage } from '@/lib/utils';

interface QuoteCardProps {
  quote: string;
  author?: string;
}

export default function QuoteCard({ quote, author }: QuoteCardProps) {
  const dir = detectLanguage(quote);

  return (
    <div
      dir={dir}
      className="p-4 sm:p-5 rounded-xl bg-muted/30 border-l-[3px] border-primary/70 dark:border-primary/80 transition-colors"
    >
      <blockquote className="text-base sm:text-[17px] font-serif italic text-foreground/95 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {author && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground not-italic font-sans">
          <span>—</span>
          <span className="font-medium text-foreground/80">{author}</span>
        </div>
      )}
    </div>
  );
}

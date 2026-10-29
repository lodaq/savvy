'use client';

import { detectLanguage } from '@/lib/utils';
import { FileText } from 'lucide-react';

export default function TextPost({ text }: { text: string }) {
  const dir = detectLanguage(text);

  return (
    <div
      dir={dir}
      className="p-4 sm:p-4.5 rounded-xl bg-muted/40 border border-border/70 text-foreground text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words flex items-start gap-3"
    >
      <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
        <FileText className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0 text-foreground/90">
        {text}
      </div>
    </div>
  );
}

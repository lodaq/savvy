'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function ImagePost({ url, caption }: { url: string; caption?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-center justify-between">
        <span>Image unavailable</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
          <span>Open link</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border/70 bg-muted/10 shadow-xs flex items-center justify-center max-w-full mx-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={caption || 'Post image'}
        onError={() => setHasError(true)}
        className="max-h-[560px] w-auto max-w-full object-contain rounded-xl transition-transform duration-300"
        loading="lazy"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
        title="View full image"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

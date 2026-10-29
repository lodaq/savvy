'use client';

import { useState } from 'react';
import { Globe, ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  favicon?: string;
}

export default function LinkPreview({
  url,
  ogTitle,
  ogDescription,
  ogImage,
  favicon,
}: LinkPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const [favError, setFavError] = useState(false);

  let hostname = '';
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    hostname = url;
  }

  const showImage = Boolean(ogImage && !imgError);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row border border-border/80 rounded-xl overflow-hidden hover:border-primary/40 hover:bg-muted/30 transition-all bg-card/60 shadow-xs"
    >
      {/* Left / Main text side */}
      <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between gap-3 min-w-0">
        <div className="space-y-1.5">
          <h4 className="font-semibold text-sm sm:text-[15px] text-foreground group-hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
            {ogTitle || url}
          </h4>

          {ogDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {ogDescription}
            </p>
          )}
        </div>

        {/* Footer domain + favicon */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {favicon && !favError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              onError={() => setFavError(true)}
              className="w-3.5 h-3.5 rounded-xs object-contain shrink-0"
            />
          ) : (
            <Globe className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
          )}
          <span className="font-medium text-[11px] truncate text-muted-foreground">
            {hostname}
          </span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity ml-auto shrink-0 text-muted-foreground" />
        </div>
      </div>

      {/* Right side Cover Image (Notion style) */}
      {showImage && (
        <div className="w-full sm:w-52 md:w-60 h-36 sm:h-auto min-h-[110px] shrink-0 border-t sm:border-t-0 sm:border-l border-border/60 bg-muted/20 relative overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImage}
            alt={ogTitle || 'Preview image'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
    </a>
  );
}

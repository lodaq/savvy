'use client';

function getShortId(url: string): string | null {
  const match = url.match(/(?:shorts\/|youtu\.be\/)([\w-]{11})/);
  if (match) return match[1];
  const standardMatch = url.match(/(?:watch\?v=)([\w-]{11})/);
  return standardMatch ? standardMatch[1] : null;
}

export default function ShortEmbed({ url, caption }: { url: string; caption?: string }) {
  const shortId = getShortId(url);

  if (!shortId) {
    return (
      <div className="p-3.5 bg-muted/50 rounded-xl text-xs text-destructive border border-destructive/20">
        Invalid YouTube Short URL: <a href={url} target="_blank" rel="noreferrer" className="underline">{url}</a>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <div className="relative w-full max-w-[330px] aspect-[9/16] rounded-xl overflow-hidden shadow-sm bg-black border border-border/80">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${shortId}`}
          title={caption || 'YouTube Short'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}

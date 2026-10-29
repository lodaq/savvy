'use client';

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function VideoEmbed({ url, caption }: { url: string; caption?: string }) {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <div className="p-3.5 bg-muted/50 rounded-xl text-xs text-destructive border border-destructive/20">
        Invalid or unsupported video URL: <a href={url} target="_blank" rel="noreferrer" className="underline">{url}</a>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-sm border border-border/80">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={caption || 'YouTube Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}

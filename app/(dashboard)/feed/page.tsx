import { auth } from '@clerk/nextjs/server';
import { getShares } from '@/actions/shares';
import AddPostDialog from '@/components/feed/add-post-dialog';
import PostCard from '@/components/feed/post-card';
import VideoEmbed from '@/components/feed/video-embed';
import ShortEmbed from '@/components/feed/short-embed';
import LinkPreview from '@/components/feed/link-preview';
import QuoteCard from '@/components/feed/quote-card';
import TextPost from '@/components/feed/text-post';
import ImagePost from '@/components/feed/image-post';
import CodePost from '@/components/feed/code-post';
import { IShare } from '@/models/share';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Feed — Savvy',
  description: 'Your polymorphic bookmarks and shares feed.',
};

export default async function FeedPage() {
  const { userId } = await auth();
  const shares: IShare[] = await getShares();

  return (
    <div className="w-full px-6 sm:px-10 py-8 space-y-6">
      {/* Full-width Header consistent with Articles page */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Feed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your saved bookmarks, videos, quotes, notes, and media.
          </p>
        </div>
        <AddPostDialog />
      </div>

      {/* Posts Content */}
      {shares.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Your feed is empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start saving articles, quotes, YouTube videos, and notes by clicking &ldquo;New Share&rdquo; above.
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto flex flex-col gap-5 pt-2">
          {shares.map((post) => (
            <PostCard key={String(post._id)} post={post} currentUserId={userId || undefined}>
              {post.type === 'video' && 'url' in post && (
                <VideoEmbed url={post.url} caption={post.caption} />
              )}
              {post.type === 'short' && 'url' in post && (
                <ShortEmbed url={post.url} caption={post.caption} />
              )}
              {post.type === 'image' && 'url' in post && (
                <ImagePost url={post.url} caption={post.caption} />
              )}
              {post.type === 'link' && 'url' in post && (
                <LinkPreview
                  url={post.url}
                  ogTitle={post.ogTitle}
                  ogDescription={post.ogDescription}
                  ogImage={post.ogImage}
                  favicon={post.favicon}
                />
              )}
              {post.type === 'quote' && 'quote' in post && (
                <QuoteCard quote={post.quote} author={post.author} />
              )}
              {post.type === 'text' && 'text' in post && (
                <TextPost text={post.text} />
              )}
              {post.type === 'code' && 'code' in post && (
                <CodePost
                  code={post.code}
                  language={post.language}
                  title={post.title}
                />
              )}
            </PostCard>
          ))}
        </div>
      )}
    </div>
  );
}

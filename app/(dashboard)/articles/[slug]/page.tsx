import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/actions/articles';
import MDXRenderer from '@/components/mdx/mdx-renderer';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found — Savvy' };
  }

  return {
    title: `${article.title} — Savvy`,
    description: article.description || `Read ${article.title} on Savvy.`,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Back and Edit Links */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Articles</span>
        </Link>

        <Link href={`/articles/${article.slug}/edit`}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Article</span>
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={new Date(article.createdAt).toISOString()}>
            {formatDate(article.createdAt)}
          </time>
          {!article.published && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
              Draft
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
          {article.title}
        </h1>

        {article.description && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.description}
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Compiled MDX Content */}
      <article className="pt-4 border-t border-border/40">
        <MDXRenderer source={article.content} />
      </article>
    </div>
  );
}

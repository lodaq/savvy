import Link from 'next/link';
import { getArticles } from '@/actions/articles';
import { IArticle } from '@/models/article';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ImportArticlesDialog } from '@/components/articles/import-articles-dialog';
import { ArticlesClientView } from '@/components/articles/articles-client-view';

export const metadata = {
  title: 'Articles — Savvy',
  description: 'Write, manage, search, and publish your MDX articles.',
};

export default async function ArticlesPage() {
  const articles: IArticle[] = await getArticles();

  return (
    <div className="w-full px-6 sm:px-10 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-4 pb-4 border-b border-border/60 text-left">
        <div className="text-left space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Articles
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Write, import, search, and serve interactive MDX articles with live components.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <ImportArticlesDialog />
          <Link href="/articles/new">
            <Button className="gap-2 rounded-full shadow-sm hover:shadow transition-shadow font-semibold">
              <PlusCircle className="w-4 h-4" />
              <span>New Article</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Articles Client View with Real-time Search & Filters */}
      <ArticlesClientView initialArticles={articles} />
    </div>
  );
}

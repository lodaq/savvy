import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/actions/articles';
import EditArticleForm from './edit-form';

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <EditArticleForm article={article} />
    </div>
  );
}

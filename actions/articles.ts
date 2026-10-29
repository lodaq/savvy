'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ArticleModel, { type IArticle } from '@/models/article';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { notifyPortfolioRevalidate } from '@/lib/notify-portfolio';
import { CreateArticleSchema, UpdateArticleSchema } from '@/lib/validators';

export async function getArticles(onlyPublished = false): Promise<IArticle[]> {
  const { userId } = await auth();

  try {
    await dbConnect();

    const query: Record<string, unknown> = {};
    if (onlyPublished) {
      query.published = true;
    } else if (userId) {
      query.userId = userId;
    } else {
      return [];
    }

    const articles = await ArticleModel.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(articles));
  } catch (error) {
    console.warn('Failed to fetch articles from MongoDB:', error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<IArticle | null> {
  const { userId } = await auth();
  await dbConnect();

  const query = userId
    ? { slug, $or: [{ userId }, { published: true }] }
    : { slug, published: true };

  const article = await ArticleModel.findOne(query).lean();
  if (!article) return null;

  return JSON.parse(JSON.stringify(article));
}

export async function createArticle(data: {
  title: string;
  description?: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  tags?: string[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = CreateArticleSchema.parse(data);

  await dbConnect();

  let baseSlug = slugify(validated.title);
  if (!baseSlug) baseSlug = 'untitled-article';

  let slug = baseSlug;
  let counter = 1;
  while (await ArticleModel.exists({ userId, slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newArticle = await ArticleModel.create({
    userId,
    slug,
    title: validated.title,
    description: validated.description || '',
    content: validated.content,
    coverImage: validated.coverImage || '',
    published: validated.published ?? false,
    tags: validated.tags || [],
  });

  revalidatePath('/articles');
  await notifyPortfolioRevalidate(newArticle.slug);
  return JSON.parse(JSON.stringify(newArticle));
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    description?: string;
    content?: string;
    coverImage?: string;
    published?: boolean;
    tags?: string[];
  }
) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = UpdateArticleSchema.parse(data);

  await dbConnect();

  const article = await ArticleModel.findOneAndUpdate(
    { _id: id, userId },
    { $set: validated },
    { new: true }
  ).lean();

  if (!article) throw new Error('Article not found or unauthorized');

  revalidatePath('/articles');
  revalidatePath(`/articles/${article.slug}`);
  await notifyPortfolioRevalidate(article.slug);
  return JSON.parse(JSON.stringify(article));
}

export async function deleteArticle(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  const deleted = await ArticleModel.findOneAndDelete({ _id: id, userId }).lean();
  if (!deleted) throw new Error('Article not found or unauthorized');

  revalidatePath('/articles');
  await notifyPortfolioRevalidate(deleted.slug);
  return JSON.parse(JSON.stringify(deleted));
}

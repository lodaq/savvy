import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ArticleModel from '@/models/article';
import { authenticateApiKey } from '@/lib/api-auth';

/**
 * GET /api/v1/articles/[slug]
 * Returns full article with raw MDX content for the specified slug.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
  const userId = await authenticateApiKey(authHeader);

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized: A valid Savvy API key is required (Authorization: Bearer sv_live_...)' },
      { status: 401 }
    );
  }

  const { slug } = await params;
  await dbConnect();

  const article = await ArticleModel.findOne({
    userId,
    slug,
    published: true,
  })
    .select('slug title description content type tags featured featuredRank coverImage createdAt updatedAt')
    .lean();

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json(article, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ArticleModel from '@/models/article';
import { authenticateApiKey } from '@/lib/api-auth';

/**
 * GET /api/v1/articles
 * Returns metadata for published articles created by the authenticated API key owner.
 * Strips 'content' to keep payload lightweight for fast listing, filtering, and sitemaps.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
  const userId = await authenticateApiKey(authHeader);

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized: A valid Savvy API key is required (Authorization: Bearer sv_live_...)' },
      { status: 401 }
    );
  }

  await dbConnect();

  const url = new URL(req.url);
  const featuredOnly = url.searchParams.get('featured') === 'true';
  const type = url.searchParams.get('type');
  const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 500);

  const filter: Record<string, unknown> = {
    userId,
    published: true,
  };

  if (featuredOnly) {
    filter.featured = true;
  }
  if (type) {
    filter.type = type;
  }

  // Sort by featuredRank (if featured requested) or latest createdAt
  const sort = featuredOnly ? { featuredRank: 1, createdAt: -1 } : { createdAt: -1 };

  const articles = await ArticleModel.find(filter)
    .select('slug title description type tags featured featuredRank coverImage createdAt updatedAt')
    .sort(sort as any)
    .limit(limit)
    .lean();

  return NextResponse.json(articles, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}

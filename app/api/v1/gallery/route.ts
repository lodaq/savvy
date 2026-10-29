import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryImageModel from '@/models/gallery-image';
import { authenticateApiKey } from '@/lib/api-auth';

/**
 * GET /api/v1/gallery
 * Returns the CDN gallery images belonging to the API key owner.
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
  const limit = Math.min(Number(url.searchParams.get('limit')) || 200, 500);

  const images = await GalleryImageModel.find({ userId })
    .select('url filename caption size createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json(images, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}

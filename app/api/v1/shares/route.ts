import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ShareModel } from '@/models/share';
import { authenticateApiKey } from '@/lib/api-auth';

/**
 * GET /api/v1/shares
 * Returns the polymorphic shares feed belonging to the API key owner.
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
  const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 500);

  const shares = await ShareModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json(shares, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}

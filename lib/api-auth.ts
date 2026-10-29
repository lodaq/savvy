import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import ApiKeyModel from '@/models/api-key';

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export function generateRawApiKey(): { rawKey: string; keyPrefix: string; keyHash: string } {
  // Generate a cryptographically secure 32-byte key formatted like: sv_live_...
  const randomBytes = crypto.randomBytes(24).toString('base64url');
  const rawKey = `sv_live_${randomBytes}`;
  const keyPrefix = rawKey.slice(0, 15);
  const keyHash = hashApiKey(rawKey);

  return { rawKey, keyPrefix, keyHash };
}

/**
 * Validates a Bearer token or x-api-key against stored API keys.
 * Returns the corresponding userId if valid, or null if invalid.
 */
export async function authenticateApiKey(authHeaderOrKey: string | null): Promise<string | null> {
  if (!authHeaderOrKey) return null;

  const rawKey = authHeaderOrKey.startsWith('Bearer ')
    ? authHeaderOrKey.slice(7).trim()
    : authHeaderOrKey.trim();

  if (!rawKey.startsWith('sv_live_')) {
    return null;
  }

  await dbConnect();
  const keyHash = hashApiKey(rawKey);

  const keyDoc = await ApiKeyModel.findOneAndUpdate(
    { keyHash },
    { $set: { lastUsedAt: new Date() } },
    { new: true }
  ).lean();

  if (!keyDoc) {
    return null;
  }

  return keyDoc.userId;
}

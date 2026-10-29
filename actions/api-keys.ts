'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ApiKeyModel from '@/models/api-key';
import { generateRawApiKey } from '@/lib/api-auth';
import { revalidatePath } from 'next/cache';

export async function getUserApiKeys() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    await dbConnect();
    const keys = await ApiKeyModel.find({ userId })
      .select('name keyPrefix createdAt lastUsedAt')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(keys));
  } catch (error) {
    console.warn('Failed to fetch API keys from MongoDB:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export async function createApiKey(name = 'Magic-Lamp Portfolio') {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  const { rawKey, keyPrefix, keyHash } = generateRawApiKey();

  await ApiKeyModel.create({
    userId,
    name,
    keyHash,
    keyPrefix,
  });

  revalidatePath('/settings');
  // Return rawKey ONLY ONCE so the user can copy it!
  return { rawKey, keyPrefix };
}

export async function deleteApiKey(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  await ApiKeyModel.findOneAndDelete({ _id: id, userId });
  revalidatePath('/settings');
  return { success: true };
}

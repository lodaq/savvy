'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import {
  ShareModel,
  TextShareModel,
  ImageShareModel,
  LinkShareModel,
  VideoShareModel,
  ShortShareModel,
  QuoteShareModel,
  CodeShareModel,
  type IShare,
} from '@/models/share';
import { revalidatePath } from 'next/cache';
import { notifyPortfolioRevalidate } from '@/lib/notify-portfolio';
import ogs from 'open-graph-scraper';
import { CreateShareSchema, UpdateShareSchema, type CreateShareInput } from '@/lib/validators';

export async function getShares(): Promise<IShare[]> {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    await dbConnect();
    const shares = await ShareModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(shares));
  } catch (error) {
    console.warn('Failed to fetch shares from MongoDB:', error instanceof Error ? error.message : error);
    return [];
  }
}

export async function createShare(formData: CreateShareInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = CreateShareSchema.parse(formData);

  await dbConnect();

  let newShare;
  const caption = validated.caption || '';

  switch (validated.type) {
    case 'text':
      newShare = await TextShareModel.create({
        userId,
        caption,
        text: validated.text,
      });
      break;

    case 'image':
      newShare = await ImageShareModel.create({
        userId,
        caption,
        url: validated.url,
      });
      break;

    case 'video':
      newShare = await VideoShareModel.create({
        userId,
        caption,
        url: validated.url,
      });
      break;

    case 'short':
      newShare = await ShortShareModel.create({
        userId,
        caption,
        url: validated.url,
      });
      break;

    case 'quote':
      newShare = await QuoteShareModel.create({
        userId,
        caption,
        quote: validated.quote,
        author: validated.author || 'Unknown',
      });
      break;

    case 'link': {
      let ogTitle = '';
      let ogDescription = '';
      let ogImage = '';
      let favicon = '';

      try {
        const { result } = await ogs({ url: validated.url, timeout: 5000 });
        ogTitle = result.ogTitle || '';
        ogDescription = result.ogDescription || '';
        favicon = result.favicon || '';
        if (result.ogImage && result.ogImage.length > 0) {
          ogImage = typeof result.ogImage[0] === 'string'
            ? result.ogImage[0]
            : (result.ogImage[0] as { url: string }).url || '';
        }
      } catch (e) {
        console.warn('Could not scrape OpenGraph for:', validated.url, e);
      }

      newShare = await LinkShareModel.create({
        userId,
        caption,
        url: validated.url,
        ogTitle,
        ogDescription,
        ogImage,
        favicon,
      });
      break;
    }

    case 'code':
      newShare = await CodeShareModel.create({
        userId,
        caption,
        code: validated.code,
        language: validated.language || 'typescript',
        title: validated.title || '',
      });
      break;

    default:
      throw new Error('Unsupported share type');
  }

  revalidatePath('/feed');
  await notifyPortfolioRevalidate();
  return JSON.parse(JSON.stringify(newShare));
}

export async function updateShare(
  id: string,
  updateData: {
    caption?: string;
    text?: string;
    url?: string;
    quote?: string;
    author?: string;
    code?: string;
    language?: string;
    title?: string;
  }
) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = UpdateShareSchema.parse(updateData);

  await dbConnect();

  const existingShare = await ShareModel.findOne({ _id: id, userId });
  if (!existingShare) throw new Error('Share not found or unauthorized');

  const fullUpdateData: Record<string, unknown> = { ...validated };

  if (
    existingShare.type === 'link' &&
    validated.url &&
    validated.url !== (existingShare as unknown as { url: string }).url
  ) {
    try {
      const { result } = await ogs({ url: validated.url, timeout: 5000 });
      fullUpdateData.ogTitle = result.ogTitle || '';
      fullUpdateData.ogDescription = result.ogDescription || '';
      fullUpdateData.favicon = result.favicon || '';
      if (result.ogImage && result.ogImage.length > 0) {
        fullUpdateData.ogImage =
          typeof result.ogImage[0] === 'string'
            ? result.ogImage[0]
            : (result.ogImage[0] as { url: string }).url || '';
      }
    } catch (e) {
      console.warn('Could not scrape OpenGraph on update for:', validated.url, e);
    }
  }

  const share = await ShareModel.findOneAndUpdate(
    { _id: id, userId },
    { $set: fullUpdateData },
    { new: true }
  ).lean();

  if (!share) throw new Error('Share not found or unauthorized');

  revalidatePath('/feed');
  await notifyPortfolioRevalidate();
  return JSON.parse(JSON.stringify(share));
}

export async function deleteShare(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  const deleted = await ShareModel.findOneAndDelete({ _id: id, userId }).lean();
  if (!deleted) throw new Error('Share not found or unauthorized');

  revalidatePath('/feed');
  await notifyPortfolioRevalidate();
  return JSON.parse(JSON.stringify(deleted));
}

export async function likeShare(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  const share = await ShareModel.findById(id);
  if (!share) throw new Error('Share not found');

  const likedBy: string[] = share.likedBy || [];
  const alreadyLiked = likedBy.includes(userId);

  const update = alreadyLiked
    ? {
        $pull: { likedBy: userId },
        $inc: { likes: -1 },
      }
    : {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 },
      };

  const updated = await ShareModel.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!updated) throw new Error('Share not found');

  if (updated.likes < 0) {
    await ShareModel.findByIdAndUpdate(id, { $set: { likes: 0 } });
    updated.likes = 0;
  }

  revalidatePath('/feed');
  await notifyPortfolioRevalidate();
  return JSON.parse(JSON.stringify(updated));
}

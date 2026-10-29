'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import GalleryImageModel, { type IGalleryImage } from '@/models/gallery-image';
import { revalidatePath } from 'next/cache';
import { notifyPortfolioRevalidate } from '@/lib/notify-portfolio';
import { UTApi } from 'uploadthing/server';
import { GalleryImageSchema } from '@/lib/validators';

const utapi = new UTApi();

export async function getGalleryImages(): Promise<IGalleryImage[]> {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    await dbConnect();
    const images = await GalleryImageModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(images));
  } catch (error) {
    console.warn('Failed to fetch gallery images from MongoDB:', error instanceof Error ? error.message : error);
    return [];
  }
}

export async function saveGalleryImage(data: {
  url: string;
  key: string;
  filename?: string;
  caption?: string;
  size?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = GalleryImageSchema.parse(data);

  await dbConnect();
  const image = await GalleryImageModel.create({
    userId,
    url: validated.url,
    key: validated.key,
    filename: validated.filename || '',
    caption: validated.caption || '',
    size: validated.size,
  });

  revalidatePath('/gallery');
  await notifyPortfolioRevalidate();
  return JSON.parse(JSON.stringify(image));
}

export async function deleteGalleryImage(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();
  const image = await GalleryImageModel.findOne({ _id: id, userId });
  if (!image) throw new Error('Image not found or unauthorized');

  try {
    if (image.key) {
      await utapi.deleteFiles(image.key);
    }
  } catch (err) {
    console.warn('Failed to delete file from Uploadthing:', err);
  }

  await GalleryImageModel.deleteOne({ _id: id, userId });

  revalidatePath('/gallery');
  await notifyPortfolioRevalidate();
  return { success: true };
}

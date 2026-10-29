import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import GalleryImageModel from '@/models/gallery-image';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: '8MB', maxFileCount: 10 },
  })
    .middleware(async () => {
      const { userId } = await auth();
      console.log('[UploadThing Middleware] Upload initiated, userId:', userId);
      if (!userId) throw new UploadThingError('Unauthorized');
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('[UploadThing onUploadComplete] File uploaded:', file);
      try {
        await dbConnect();
        const doc = await GalleryImageModel.create({
          userId: metadata.userId,
          url: file.ufsUrl || file.url,
          key: file.key,
          filename: file.name,
          size: file.size,
        });
        console.log('[UploadThing onUploadComplete] Image document saved to DB:', doc._id);
      } catch (err) {
        console.error('Failed to save gallery image to DB:', err);
      }
      return { uploadedBy: metadata.userId, url: file.ufsUrl || file.url, key: file.key };
    }),

  coverImageUploader: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError('Unauthorized');
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl || file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

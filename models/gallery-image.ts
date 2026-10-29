import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface IGalleryImage extends Document {
  userId: string;
  url: string;
  key: string;
  filename: string;
  caption: string;
  size?: number;
  createdAt: Date;
  updatedAt: Date;
}

const galleryImageSchema = new Schema<IGalleryImage>(
  {
    userId: { type: String, required: true, index: true },
    url: { type: String, required: true },
    key: { type: String, required: true },
    filename: { type: String, default: '' },
    caption: { type: String, default: '' },
    size: { type: Number },
  },
  {
    timestamps: true,
  }
);

galleryImageSchema.index({ userId: 1, createdAt: -1 });

export const GalleryImageModel: Model<IGalleryImage> =
  models.GalleryImage || model<IGalleryImage>('GalleryImage', galleryImageSchema);

export default GalleryImageModel;

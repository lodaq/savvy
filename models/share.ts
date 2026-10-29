import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export interface IShareBase extends Document {
  userId: string;
  caption: string;
  likes: number;
  likedBy?: string[];
  type: 'text' | 'image' | 'link' | 'video' | 'short' | 'quote' | 'code';
  createdAt: Date;
  updatedAt: Date;
}

export interface ITextShare extends IShareBase {
  type: 'text';
  text: string;
}

export interface IImageShare extends IShareBase {
  type: 'image';
  url: string;
}

export interface ILinkShare extends IShareBase {
  type: 'link';
  url: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  favicon?: string;
}

export interface IVideoShare extends IShareBase {
  type: 'video';
  url: string;
}

export interface IShortShare extends IShareBase {
  type: 'short';
  url: string;
}

export interface IQuoteShare extends IShareBase {
  type: 'quote';
  quote: string;
  author: string;
}

export interface ICodeShare extends IShareBase {
  type: 'code';
  code: string;
  language?: string;
  title?: string;
}

export type IShare =
  | ITextShare
  | IImageShare
  | ILinkShare
  | IVideoShare
  | IShortShare
  | IQuoteShare
  | ICodeShare;

const shareBaseSchema = new Schema<IShareBase>(
  {
    userId: { type: String, required: true, index: true },
    caption: { type: String, default: '' },
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    type: { type: String, required: true },
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
  }
);

shareBaseSchema.index({ userId: 1, createdAt: -1 });

export const ShareModel: Model<IShareBase> =
  models.Share || model<IShareBase>('Share', shareBaseSchema);

export const TextShareModel: Model<ITextShare> =
  (ShareModel.discriminators && ShareModel.discriminators.text as Model<ITextShare>) ||
  ShareModel.discriminator<ITextShare>(
    'text',
    new Schema({ text: { type: String, required: true } })
  );

export const ImageShareModel: Model<IImageShare> =
  (ShareModel.discriminators && ShareModel.discriminators.image as Model<IImageShare>) ||
  ShareModel.discriminator<IImageShare>(
    'image',
    new Schema({ url: { type: String, required: true } })
  );

export const LinkShareModel: Model<ILinkShare> =
  (ShareModel.discriminators && ShareModel.discriminators.link as Model<ILinkShare>) ||
  ShareModel.discriminator<ILinkShare>(
    'link',
    new Schema({
      url: { type: String, required: true },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      favicon: { type: String, default: '' },
    })
  );

export const VideoShareModel: Model<IVideoShare> =
  (ShareModel.discriminators && ShareModel.discriminators.video as Model<IVideoShare>) ||
  ShareModel.discriminator<IVideoShare>(
    'video',
    new Schema({ url: { type: String, required: true } })
  );

export const ShortShareModel: Model<IShortShare> =
  (ShareModel.discriminators && ShareModel.discriminators.short as Model<IShortShare>) ||
  ShareModel.discriminator<IShortShare>(
    'short',
    new Schema({ url: { type: String, required: true } })
  );

export const QuoteShareModel: Model<IQuoteShare> =
  (ShareModel.discriminators && ShareModel.discriminators.quote as Model<IQuoteShare>) ||
  ShareModel.discriminator<IQuoteShare>(
    'quote',
    new Schema({
      quote: { type: String, required: true },
      author: { type: String, default: 'Unknown' },
    })
  );

export const CodeShareModel: Model<ICodeShare> =
  (ShareModel.discriminators && ShareModel.discriminators.code as Model<ICodeShare>) ||
  ShareModel.discriminator<ICodeShare>(
    'code',
    new Schema({
      code: { type: String, required: true },
      language: { type: String, default: 'typescript' },
      title: { type: String, default: '' },
    })
  );

export default ShareModel;

import mongoose, { Document, Model, Schema, models, model } from 'mongoose';

export type ArticleType = 'article' | 'notes' | 'tutorial' | 'snippet';

export interface IArticle extends Document {
  userId: string;
  slug: string;
  title: string;
  description: string;
  content: string; // Raw MDX string
  coverImage?: string;
  type: ArticleType;
  featured: boolean;
  featuredRank?: number;
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    userId: { type: String, required: true, index: true },
    slug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    type: {
      type: String,
      enum: ['article', 'notes', 'tutorial', 'snippet'],
      default: 'article',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    featuredRank: { type: Number, default: 0 },
    published: { type: Boolean, default: false, index: true },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

articleSchema.index({ userId: 1, slug: 1 }, { unique: true });
articleSchema.index({ userId: 1, createdAt: -1 });
articleSchema.index({ userId: 1, published: 1, createdAt: -1 });
articleSchema.index({ userId: 1, featured: 1, featuredRank: 1 });

export const ArticleModel: Model<IArticle> =
  models.Article || model<IArticle>('Article', articleSchema);

export default ArticleModel;

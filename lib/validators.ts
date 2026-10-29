import { z } from 'zod';

export const ShareTypeEnum = z.enum(['text', 'image', 'link', 'video', 'short', 'quote', 'code']);
export type ShareType = z.infer<typeof ShareTypeEnum>;

export const BaseShareSchema = z.object({
  caption: z.string().default(''),
});

export const TextShareSchema = BaseShareSchema.extend({
  type: z.literal('text'),
  text: z.string().min(1, 'Text content is required'),
});

export const ImageShareSchema = BaseShareSchema.extend({
  type: z.literal('image'),
  url: z.string().url('A valid image URL is required'),
});

export const LinkShareSchema = BaseShareSchema.extend({
  type: z.literal('link'),
  url: z.string().url('A valid link URL is required'),
});

export const VideoShareSchema = BaseShareSchema.extend({
  type: z.literal('video'),
  url: z.string().url('A valid video URL is required'),
});

export const ShortShareSchema = BaseShareSchema.extend({
  type: z.literal('short'),
  url: z.string().url('A valid YouTube Short URL is required'),
});

export const QuoteShareSchema = BaseShareSchema.extend({
  type: z.literal('quote'),
  quote: z.string().min(1, 'Quote text is required'),
  author: z.string().default('Unknown'),
});

export const CodeShareSchema = BaseShareSchema.extend({
  type: z.literal('code'),
  code: z.string().min(1, 'Code content is required'),
  language: z.string().default('typescript'),
  title: z.string().default(''),
});

export const CreateShareSchema = z.discriminatedUnion('type', [
  TextShareSchema,
  ImageShareSchema,
  LinkShareSchema,
  VideoShareSchema,
  ShortShareSchema,
  QuoteShareSchema,
  CodeShareSchema,
]);

export type CreateShareInput = z.infer<typeof CreateShareSchema>;

export const UpdateShareSchema = z.object({
  caption: z.string().optional(),
  text: z.string().optional(),
  quote: z.string().optional(),
  author: z.string().optional(),
  url: z.string().optional(),
  code: z.string().optional(),
  language: z.string().optional(),
  title: z.string().optional(),
});

export type UpdateShareInput = z.infer<typeof UpdateShareSchema>;

// Article schemas
export const ArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().default(''),
  content: z.string().min(1, 'MDX content is required'),
  coverImage: z.string().optional().default(''),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;

export const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  content: z.string().default(''),
  coverImage: z.string().optional().default(''),
  published: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;

export const UpdateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

// Gallery Image schemas
export const GalleryImageSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
  filename: z.string().default(''),
  caption: z.string().default(''),
  size: z.number().optional(),
});

export type GalleryImageInput = z.infer<typeof GalleryImageSchema>;

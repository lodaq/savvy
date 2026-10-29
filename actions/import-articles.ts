'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ArticleModel, { ArticleType } from '@/models/article';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { notifyPortfolioRevalidate } from '@/lib/notify-portfolio';

interface ParsedFile {
  filename: string;
  raw: string;
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: { filename: string; error: string }[];
}

function parseMdxFile(raw: string, filename: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter: Record<string, any> = {};
  let body = raw;

  if (match) {
    const yaml = match[1];
    body = match[2].trim();
    let currentKey = '';

    for (const line of yaml.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('- ') && currentKey) {
        if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
        frontmatter[currentKey].push(trimmed.slice(2).trim().replace(/^['"]|['"]$/g, ''));
      } else {
        const idx = trimmed.indexOf(':');
        if (idx !== -1) {
          currentKey = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (val) {
            if (val === 'true') frontmatter[currentKey] = true;
            else if (val === 'false') frontmatter[currentKey] = false;
            else if (val === '[]') frontmatter[currentKey] = [];
            else frontmatter[currentKey] = val;
          } else {
            frontmatter[currentKey] = '';
          }
        }
      }
    }
  }

  // Determine base title and slug
  const title = (typeof frontmatter.title === 'string' && frontmatter.title.trim())
    ? frontmatter.title.trim()
    : filename.replace(/\.(mdx|md)$/i, '').replace(/[-_]/g, ' ');

  let baseSlug = slugify(frontmatter.slug || filename.replace(/\.(mdx|md)$/i, ''));
  if (!baseSlug) baseSlug = slugify(title) || 'imported-article';

  const validTypes: ArticleType[] = ['article', 'notes', 'tutorial', 'snippet'];
  const type: ArticleType = validTypes.includes(frontmatter.type) ? frontmatter.type : 'article';

  let description = '';
  if (typeof frontmatter.description === 'string') {
    description = frontmatter.description.trim();
  } else if (Array.isArray(frontmatter.description)) {
    description = frontmatter.description.join(', ').trim();
  }

  const rawTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const tags = rawTags
    .map((t: any) => String(t || '').trim())
    .filter((t: string) => t && t !== 'null' && t !== 'undefined');

  return {
    slug: baseSlug,
    title,
    description,
    content: body || '',
    tags,
    type,
    published: frontmatter.published !== undefined ? Boolean(frontmatter.published) : true,
    coverImage: typeof frontmatter.coverImage === 'string' ? frontmatter.coverImage : '',
    featured: Boolean(frontmatter.featured),
    featuredRank: Number(frontmatter.featuredRank) || 0,
  };
}

export async function importArticles(files: ParsedFile[]): Promise<ImportResult> {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await dbConnect();

  let imported = 0;
  const importedSlugs: string[] = [];
  let skipped = 0;
  const errors: { filename: string; error: string }[] = [];

  for (const file of files) {
    try {
      if (!file.filename.match(/\.(mdx|md)$/i)) {
        errors.push({ filename: file.filename, error: 'Only .md and .mdx files are supported' });
        continue;
      }

      const parsed = parseMdxFile(file.raw, file.filename);

      // Check if an article already exists for this user with the same slug or title
      const existing = await ArticleModel.findOne({
        userId,
        $or: [{ slug: parsed.slug }, { title: parsed.title }],
      });

      if (existing) {
        skipped++;
        errors.push({
          filename: file.filename,
          error: `Article with slug "${parsed.slug}" already exists — skipped`,
        });
        continue;
      }

      await ArticleModel.create({
        userId,
        slug: parsed.slug,
        title: parsed.title,
        description: parsed.description,
        content: parsed.content,
        tags: parsed.tags,
        type: parsed.type,
        published: parsed.published,
        coverImage: parsed.coverImage,
        featured: parsed.featured,
        featuredRank: parsed.featuredRank,
      });
      imported++;
      importedSlugs.push(parsed.slug);
    } catch (err) {
      errors.push({
        filename: file.filename,
        error: err instanceof Error ? err.message : 'Unknown error during import',
      });
    }
  }

  revalidatePath('/articles');
  await Promise.all(importedSlugs.map((slug) => notifyPortfolioRevalidate(slug)));
  return {
    total: files.length,
    imported,
    skipped,
    errors,
  };
}

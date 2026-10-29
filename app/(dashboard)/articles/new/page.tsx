'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Editor } from '@/components/editor/editor';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import { createArticle } from '@/actions/articles';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

const defaultMDX = `# Introduction

Welcome to your new MDX article! You can write standard Markdown as well as rich React components.

<Callout type="info" title="Pro Tip">
  You can embed interactive callout blocks, code snippets, and custom components directly inside your content.
</Callout>

## Features
- **Fast:** Server-side rendered with next-mdx-remote
- **Extensible:** Supports full GitHub Flavored Markdown and custom components
- **Live syntax highlighting:** For JavaScript, TypeScript, Python, and more!
`;

export default function NewArticlePage() {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState(defaultMDX);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter an article title');
      return;
    }

    const mdxContent = editorRef.current ? editorRef.current.getMarkdown() : content;
    if (!mdxContent.trim()) {
      toast.error('Please write some content for your article');
      return;
    }

    setIsSaving(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const created = await createArticle({
        title,
        description,
        content: mdxContent,
        published,
        tags,
      });

      toast.success('Article created successfully!');
      router.push(`/articles/${created.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary w-4 h-4"
            />
            <span>Publish immediately</span>
          </label>

          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Article'}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title..."
            className="text-2xl sm:text-3xl font-bold h-auto py-3 px-4 border-border bg-card"
            required
          />
        </div>

        {/* Short Description */}
        <div className="space-y-1.5">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief excerpt or description (optional)..."
            rows={2}
            className="text-sm border-border bg-card"
          />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label htmlFor="article-tags" className="text-xs text-muted-foreground">
            Tags (comma separated)
          </Label>
          <Input
            id="article-tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tech, react, nextjs..."
            className="text-xs border-border bg-card"
          />
        </div>

        {/* MDX Editor */}
        <div className="space-y-1.5 pt-2">
          <Label className="text-xs text-muted-foreground">MDX Content</Label>
          <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm min-h-[480px]">
            <Editor
              ref={editorRef}
              markdown={content}
              onChange={setContent}
              contentEditableClassName="prose prose-neutral dark:prose-invert max-w-none p-6 min-h-[420px] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

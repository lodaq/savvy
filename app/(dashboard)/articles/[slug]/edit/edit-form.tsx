'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IArticle } from '@/models/article';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Editor } from '@/components/editor/editor';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import { updateArticle, deleteArticle } from '@/actions/articles';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';

export default function EditArticleForm({ article }: { article: IArticle }) {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);

  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description || '');
  const [tagsInput, setTagsInput] = useState((article.tags || []).join(', '));
  const [published, setPublished] = useState(article.published ?? false);
  const [content, setContent] = useState(article.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    const mdxContent = editorRef.current ? editorRef.current.getMarkdown() : content;
    setIsSaving(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await updateArticle(String(article._id), {
        title,
        description,
        content: mdxContent,
        published,
        tags,
      });

      toast.success('Article updated!');
      router.push(`/articles/${article.slug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteArticle(String(article._id));
      toast.success('Article deleted');
      router.push('/articles');
      router.refresh();
    } catch {
      toast.error('Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Article</span>
        </Link>

        <div className="flex items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 gap-1.5">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this article?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary w-4 h-4"
            />
            <span>Published</span>
          </label>

          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
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
            placeholder="Brief description..."
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

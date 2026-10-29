'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PlusCircle,
  FileText,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Quote,
  Code2,
  Loader2,
} from 'lucide-react';
import { createShare } from '@/actions/shares';
import { toast } from 'sonner';

const shareTypes = [
  { value: 'text', label: 'Note / Text', icon: FileText, placeholder: 'Write your thoughts here...' },
  { value: 'code', label: 'Code Snippet', icon: Code2, placeholder: 'console.log("Hello World");' },
  { value: 'link', label: 'Web Link', icon: LinkIcon, placeholder: 'https://example.com' },
  { value: 'video', label: 'YouTube Video', icon: Video, placeholder: 'https://youtube.com/watch?v=...' },
  { value: 'short', label: 'YouTube Short', icon: Video, placeholder: 'https://youtube.com/shorts/...' },
  { value: 'image', label: 'Image URL', icon: ImageIcon, placeholder: 'https://images.unsplash.com/...' },
  { value: 'quote', label: 'Quote', icon: Quote, placeholder: 'Enter an inspiring quote...' },
] as const;

type ShareTypeKey = typeof shareTypes[number]['value'];

export default function AddPostDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ShareTypeKey>('link');
  const [caption, setCaption] = useState('');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCaption('');
    setText('');
    setUrl('');
    setQuote('');
    setAuthor('');
    setCode('');
    setLanguage('typescript');
    setTitle('');
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createShare({
        type,
        caption,
        text,
        url,
        quote,
        author,
        code,
        language,
        title,
      });

      toast.success('Post added to your feed!');
      resetForm();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full shadow-sm hover:shadow transition-shadow">
          <PlusCircle className="w-4 h-4" />
          <span>New Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Content to Feed</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Content Type Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="post-type">Content Type</Label>
            <Select
              value={type}
              onValueChange={(val) => setType(val as ShareTypeKey)}
            >
              <SelectTrigger id="post-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {shareTypes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span>{t.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Input based on Type */}
          {type === 'text' && (
            <div className="space-y-1.5">
              <Label htmlFor="post-text">Text Note</Label>
              <Textarea
                id="post-text"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
              />
            </div>
          )}

          {type === 'code' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="post-code-title">Title / Filename (Optional)</Label>
                  <Input
                    id="post-code-title"
                    placeholder="e.g. auth-helper.ts"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="post-code-lang">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="post-code-lang">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="bash">Bash / Shell</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="c">C / C++</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-code">Code Snippet</Label>
                <Textarea
                  id="post-code"
                  placeholder="// Paste or write your code snippet here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  rows={6}
                  className="font-mono text-xs leading-relaxed"
                />
              </div>
            </>
          )}

          {(type === 'link' || type === 'video' || type === 'short' || type === 'image') && (
            <div className="space-y-1.5">
              <Label htmlFor="post-url">
                {type === 'link' && 'Website Link URL'}
                {type === 'video' && 'YouTube Video URL'}
                {type === 'short' && 'YouTube Short URL'}
                {type === 'image' && 'Image Direct URL'}
              </Label>
              <Input
                id="post-url"
                type="url"
                placeholder={shareTypes.find((t) => t.value === type)?.placeholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              {type === 'link' && (
                <p className="text-xs text-muted-foreground">
                  OpenGraph metadata (title, preview image, description) will be automatically fetched.
                </p>
              )}
            </div>
          )}

          {type === 'quote' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="post-quote">Quote Text</Label>
                <Textarea
                  id="post-quote"
                  placeholder="In the middle of difficulty lies opportunity..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-author">Author / Speaker</Label>
                <Input
                  id="post-author"
                  placeholder="Albert Einstein"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Optional Caption */}
          <div className="space-y-1.5">
            <Label htmlFor="post-caption">Caption (Optional)</Label>
            <Input
              id="post-caption"
              placeholder="Add your note or commentary..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Adding...' : 'Post Share'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

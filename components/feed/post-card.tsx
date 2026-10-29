'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { IShare } from '@/models/share';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Heart,
  Share2,
  Trash2,
  Edit3,
  MoreVertical,
  Link as LinkIcon,
  Video,
  FileText,
  Quote,
  Image as ImageIcon,
  Check,
  Code2,
} from 'lucide-react';
import { XShareButton, XIcon, FacebookShareButton, FacebookIcon } from 'react-share';
import { likeShare, deleteShare, updateShare } from '@/actions/shares';
import { toast } from 'sonner';

const typeIcons: Record<string, React.ElementType> = {
  text: FileText,
  code: Code2,
  image: ImageIcon,
  link: LinkIcon,
  video: Video,
  short: Video,
  quote: Quote,
};

interface PostCardProps {
  post: IShare;
  currentUserId?: string;
  children: React.ReactNode;
}

export default function PostCard({ post, currentUserId, children }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(() => {
    return Boolean(currentUserId && post.likedBy && post.likedBy.includes(currentUserId));
  });
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit form state
  const [editCaption, setEditCaption] = useState(post.caption || '');
  const [editText, setEditText] = useState('text' in post ? post.text : '');
  const [editUrl, setEditUrl] = useState('url' in post ? post.url : '');
  const [editQuote, setEditQuote] = useState('quote' in post ? post.quote : '');
  const [editAuthor, setEditAuthor] = useState('author' in post ? post.author : '');
  const [editCode, setEditCode] = useState('code' in post ? post.code : '');
  const [editLanguage, setEditLanguage] = useState('language' in post ? post.language || 'typescript' : 'typescript');
  const [editTitle, setEditTitle] = useState('title' in post ? post.title || '' : '');

  const Icon = typeIcons[post.type] || FileText;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const willLike = !hasLiked;
    try {
      setLikes((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));
      setHasLiked(willLike);
      await likeShare(String(post._id));
    } catch {
      setLikes((prev) => (willLike ? Math.max(0, prev - 1) : prev + 1));
      setHasLiked(!willLike);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteShare(String(post._id));
      toast.success('Post deleted successfully');
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateShare(String(post._id), {
        caption: editCaption,
        text: editText,
        url: editUrl,
        quote: editQuote,
        author: editAuthor,
        code: editCode,
        language: editLanguage,
        title: editTitle,
      });
      toast.success('Post updated successfully');
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="w-full bg-card border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted font-medium capitalize text-foreground/80">
            <Icon className="w-3.5 h-3.5" />
            {post.type}
          </span>
          <span>•</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {formatDate(post.createdAt)}
          </time>
        </div>

        {/* Post Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <MoreVertical className="w-4 h-4" />
              <span className="sr-only">Post options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 text-destructive focus:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This post will be permanently removed.
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Caption if provided */}
      {post.caption && (
        <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
          {post.caption}
        </p>
      )}

      {/* Main post content */}
      <div className="w-full">{children}</div>

      {/* Footer bar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-muted-foreground">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 px-3 rounded-full hover:text-red-500 hover:bg-red-500/10 ${
            hasLiked ? 'text-red-500' : ''
          }`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500' : ''}`} />
          <span className="text-xs font-semibold">{likes}</span>
        </Button>

        {/* Share Button with Social Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 px-3 rounded-full">
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1 p-2 min-w-36">
            <XShareButton url={typeof window !== 'undefined' ? window.location.href : ''} text={post.caption || 'Check this out on Savvy'}>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md cursor-pointer w-full">
                <XIcon size={20} />
                <span>X (Twitter)</span>
              </div>
            </XShareButton>

            <FacebookShareButton url={typeof window !== 'undefined' ? window.location.href : ''}>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md cursor-pointer w-full">
                <FacebookIcon size={20} />
                <span>Facebook</span>
              </div>
            </FacebookShareButton>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md cursor-pointer w-full text-left"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Post Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-caption">Caption</Label>
              <Input
                id="edit-caption"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Add a caption..."
              />
            </div>

            {post.type === 'text' && (
              <div className="space-y-1.5">
                <Label htmlFor="edit-text">Text</Label>
                <Textarea
                  id="edit-text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {post.type === 'code' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-code-title">Title / Filename</Label>
                    <Input
                      id="edit-code-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-code-lang">Language</Label>
                    <Input
                      id="edit-code-lang"
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-code">Code</Label>
                  <Textarea
                    id="edit-code"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    rows={6}
                    className="font-mono text-xs"
                  />
                </div>
              </>
            )}

            {('url' in post) && (
              <div className="space-y-1.5">
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                />
              </div>
            )}

            {post.type === 'quote' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-quote">Quote</Label>
                  <Textarea
                    id="edit-quote"
                    value={editQuote}
                    onChange={(e) => setEditQuote(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-author">Author</Label>
                  <Input
                    id="edit-author"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}

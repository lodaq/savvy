'use client';

import { useState } from 'react';
import { IGalleryImage } from '@/models/gallery-image';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import { Copy, Download, Trash2, Check, ExternalLink, Maximize2 } from 'lucide-react';
import { deleteGalleryImage } from '@/actions/gallery';
import { toast } from 'sonner';

export default function GalleryImageCard({ image }: { image: IGalleryImage }) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(image.url);
    setCopied(true);
    toast.success('CDN link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(image.url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = image.filename || 'savvy-image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(href);
      toast.success('Download started');
    } catch {
      toast.error('Failed to download image');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGalleryImage(String(image._id));
      toast.success('Image deleted from gallery');
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <div
        onClick={() => setPreviewOpen(true)}
        className="group relative rounded-2xl overflow-hidden bg-card border border-border/70 hover:border-primary/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
      >
        <div className="relative w-full overflow-hidden bg-muted/40 aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.caption || image.filename || 'Gallery image'}
            className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Top Quick Actions Bar (Visible on Hover) */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="w-8 h-8 rounded-xl bg-background/90 hover:bg-background text-foreground backdrop-blur-md shadow-xs"
              onClick={handleCopy}
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="w-8 h-8 rounded-xl bg-background/90 hover:bg-background text-foreground backdrop-blur-md shadow-xs"
              onClick={handleDownload}
              title="Download asset"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>

            <div onClick={(e) => e.stopPropagation()}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-8 h-8 rounded-xl shadow-xs"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this file from your media library and CDN storage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Bottom metadata banner */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between text-white">
            <span className="text-xs font-medium truncate max-w-[70%]">
              {image.filename || 'Untitled image'}
            </span>
            {image.size && (
              <span className="text-[10px] font-mono opacity-80">
                {formatFileSize(image.size)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Full-view Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-[94vw] max-w-4xl p-3 bg-card/95 backdrop-blur-xl border-border/80 overflow-hidden">
          <div className="relative flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.filename || 'Image preview'}
              className="max-h-[75vh] w-auto object-contain rounded-xl"
            />
            <div className="w-full flex items-center justify-between px-4 py-3 border-t border-border/60 mt-2">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {image.filename || 'Image'}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatFileSize(image.size)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-lg text-xs"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 rounded-lg text-xs"
                  onClick={handleDownload}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Button>
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Open direct link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

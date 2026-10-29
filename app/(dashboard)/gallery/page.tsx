import { getGalleryImages } from '@/actions/gallery';
import GalleryImageCard from '@/components/gallery/image-card';
import MasonryGrid from '@/components/gallery/masonry-grid';
import { InlineUploadDropzone } from '@/components/gallery/gallery-dropzone';
import { IGalleryImage } from '@/models/gallery-image';
import { Image as ImageIcon, Sparkles, FolderArchive } from 'lucide-react';

export const metadata = {
  title: 'Gallery — Savvy',
  description: 'Upload, manage, and serve your media assets with Uploadthing CDN.',
};

export default async function GalleryPage() {
  const images: IGalleryImage[] = await getGalleryImages();

  return (
    <div className="w-full px-6 sm:px-10 py-8 space-y-6">
      {/* Full-width Header consistent with Articles & Feed */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Gallery
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cloud media storage powered by Uploadthing. Copy direct CDN URLs or download assets.
          </p>
        </div>
      </div>

      {/* Main Gallery Content */}
      {images.length === 0 ? (
        <div className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <InlineUploadDropzone />
          </div>

          <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No images yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Drag and drop images above or click to select files to start building your media gallery.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top inline dropzone to quickly drop more images */}
          <div className="max-w-2xl mx-auto">
            <InlineUploadDropzone />
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-card px-4 py-2.5 rounded-2xl border border-border/60">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">
                {images.length} {images.length === 1 ? 'image' : 'images'} stored
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Hover or click any image to copy link, view, or download</span>
            </div>
          </div>

          {/* Images Masonry */}
          <MasonryGrid>
            {images.map((image) => (
              <GalleryImageCard key={String(image._id)} image={image} />
            ))}
          </MasonryGrid>
        </div>
      )}
    </div>
  );
}

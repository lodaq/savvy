'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function InlineUploadDropzone() {
  const router = useRouter();

  return (
    <div className="w-full">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          toast.success(`Successfully uploaded ${res?.length || 1} image(s)!`);
          router.refresh();
        }}
        onUploadError={(error: Error) => {
          console.error('Upload error:', error);
          toast.error(`Upload failed: ${error.message}`);
        }}
        className="border-dashed border-2 border-border/80 hover:border-primary/50 rounded-2xl bg-card/50 hover:bg-card transition-all p-8"
      />
    </div>
  );
}

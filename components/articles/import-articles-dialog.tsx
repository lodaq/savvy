'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UploadCloud, FileCode2, Check, AlertCircle, Loader2 } from 'lucide-react';
import { importArticles, ImportResult } from '@/actions/import-articles';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ImportArticlesDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((file) =>
      file.name.match(/\.(mdx|md)$/i)
    );

    if (files.length === 0) {
      toast.error('Please select .md or .mdx files only');
      return;
    }

    setSelectedFiles(files);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.name.match(/\.(mdx|md)$/i)
    );

    if (files.length === 0) {
      toast.error('Please drop .md or .mdx files only');
      return;
    }

    setSelectedFiles(files);
    setResult(null);
  };

  const handleUploadAndImport = async () => {
    if (selectedFiles.length === 0) return;
    setIsImporting(true);

    try {
      const parsedFiles = await Promise.all(
        selectedFiles.map(async (file) => ({
          filename: file.name,
          raw: await file.text(),
        }))
      );

      const res = await importArticles(parsedFiles);
      setResult(res);

      if (res.imported > 0) {
        toast.success(`Imported ${res.imported} new article(s)!${res.skipped > 0 ? ` (${res.skipped} skipped as already existing)` : ''}`);
        router.refresh();
      } else if (res.skipped > 0) {
        toast.info(`All ${res.skipped} article(s) already exist and were skipped.`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const resetDialog = () => {
    setSelectedFiles([]);
    setResult(null);
    setIsImporting(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full shadow-xs">
          <UploadCloud className="w-4 h-4" />
          <span>Import Articles</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border/80">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Import Markdown / MDX Articles</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload your existing <code className="text-primary font-mono">.md</code> or{' '}
                <code className="text-primary font-mono">.mdx</code> files. Frontmatter (title, tags, slug, type) is automatically parsed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-dashed border-2 border-border/80 hover:border-primary/50 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors p-6 flex flex-col items-center justify-center text-center cursor-pointer space-y-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".md,.mdx"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-foreground">
              Click to select or drag & drop files
            </div>
            <div className="text-[11px] text-muted-foreground">
              Supports single or bulk <span className="font-mono text-primary">.md</span> /{' '}
              <span className="font-mono text-primary">.mdx</span> files
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && !result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-foreground">
                <span>Selected Files ({selectedFiles.length})</span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl bg-muted/30 p-2 border border-border/50 text-xs">
                {selectedFiles.map((f) => (
                  <div key={f.name} className="flex items-center justify-between py-1 px-2 rounded-lg bg-background/50">
                    <span className="font-mono truncate">{f.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" disabled={isImporting} onClick={handleUploadAndImport} className="gap-2">
                  {isImporting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isImporting ? 'Importing...' : `Import ${selectedFiles.length} File(s)`}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Result view */}
          {result && (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Processed {result.total} file(s): <strong>{result.imported} created</strong>
                  {result.skipped > 0 && `, ${result.skipped} skipped (already exists)`}.
                </span>
              </div>

              {result.errors.length > 0 && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Errors ({result.errors.length}):</span>
                  </div>
                  {result.errors.map((e, idx) => (
                    <div key={idx} className="font-mono text-[11px]">
                      {e.filename}: {e.error}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

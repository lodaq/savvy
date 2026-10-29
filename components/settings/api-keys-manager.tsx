'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  ShieldCheck,
  Terminal,
  BookOpen,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  Code2,
  Sparkles,
} from 'lucide-react';
import { createApiKey, deleteApiKey } from '@/actions/api-keys';
import { toast } from 'sonner';

interface ApiKeyItem {
  _id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
}

export function ApiKeysManager({ initialKeys }: { initialKeys: ApiKeyItem[] }) {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    try {
      const res = await createApiKey(newKeyName.trim());
      setNewlyCreatedKey(res.rawKey);
      setKeys((prev) => [
        {
          _id: Math.random().toString(),
          name: newKeyName.trim(),
          keyPrefix: res.keyPrefix,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNewKeyName('');
      toast.success('API key generated successfully!');
    } catch {
      toast.error('Failed to generate API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApiKey(id);
      setKeys((prev) => prev.filter((k) => k._id !== id));
      toast.success('API key revoked');
    } catch {
      toast.error('Failed to revoke API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Action Bar */}
      <div className="flex flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/70 text-left w-full">
        <div className="text-left space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Active API Keys</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate and manage access tokens to query your articles, shares, and gallery images from external apps.
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl font-semibold shadow-xs shrink-0">
              <Plus className="w-4 h-4" />
              <span>Create New Key</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border text-left">
            <DialogHeader className="text-left">
              <DialogTitle className="text-left">Generate New API Key</DialogTitle>
              <DialogDescription className="text-xs text-left">
                Give your key a descriptive label (e.g., &ldquo;Magic-Lamp Portfolio&rdquo; or &ldquo;Production Website&rdquo;).
              </DialogDescription>
            </DialogHeader>

            {!newlyCreatedKey ? (
              <form onSubmit={handleCreateKey} className="space-y-4 mt-2 text-left">
                <div>
                  <Input
                    placeholder="e.g. Magic-Lamp Portfolio"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating || !newKeyName.trim()}>
                    {isCreating ? 'Generating...' : 'Generate Key'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 mt-2 text-left">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs">
                  ⚠️ Make sure to copy your key now. For your security, you will not be able to see it again!
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted font-mono text-xs border border-border/80">
                  <span className="flex-1 truncate">{newlyCreatedKey}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1.5 h-8 text-xs shrink-0"
                    onClick={() => copyToClipboard(newlyCreatedKey)}
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setNewlyCreatedKey(null);
                      setModalOpen(false);
                    }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Keys List */}
      <div className="rounded-2xl border border-border/70 overflow-hidden bg-card text-left">
        {keys.length === 0 ? (
          <div className="p-8 text-left text-sm text-muted-foreground flex flex-col items-start gap-2">
            <span className="font-semibold text-foreground">No API keys created yet</span>
            <span>Click &ldquo;Create New Key&rdquo; above to generate your first live access token.</span>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {keys.map((k) => (
              <div key={k._id} className="p-4 flex items-center justify-between gap-4 text-left">
                <div className="space-y-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{k.name}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {k.keyPrefix}...
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                    {k.lastUsedAt && (
                      <span>Last used: {new Date(k.lastUsedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
                  onClick={() => handleDelete(k._id)}
                  title="Revoke key"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ApiDocsViewer() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      title: 'Published Articles (List & Metadata)',
      method: 'GET',
      path: '/api/v1/articles',
      desc: 'Retrieves metadata for all published articles (omits raw MDX content for fast loading, feeds, filters, and sitemaps).',
      params: '?featured=true | ?type=notes | ?limit=100',
      curl: `curl -H "Authorization: Bearer YOUR_SAVVY_API_KEY" \\\n  http://localhost:3000/api/v1/articles`,
      icon: BookOpen,
    },
    {
      title: 'Single Article (Full MDX Content)',
      method: 'GET',
      path: '/api/v1/articles/[slug]',
      desc: 'Retrieves the complete article object including the raw MDX content string for on-demand compilation and rendering.',
      params: 'Slug parameter in URL path',
      curl: `curl -H "Authorization: Bearer YOUR_SAVVY_API_KEY" \\\n  http://localhost:3000/api/v1/articles/my-slug`,
      icon: Code2,
    },
    {
      title: 'Polymorphic Feed (Shares)',
      method: 'GET',
      path: '/api/v1/shares',
      desc: 'Retrieves your curated link cards, OpenGraph previews, quotes, notes, and short posts.',
      params: '?limit=100',
      curl: `curl -H "Authorization: Bearer YOUR_SAVVY_API_KEY" \\\n  http://localhost:3000/api/v1/shares`,
      icon: Layers,
    },
    {
      title: 'Media Gallery Assets',
      method: 'GET',
      path: '/api/v1/gallery',
      desc: 'Retrieves your uploaded high-resolution gallery images with CDN URLs, dimensions, and captions.',
      params: '?limit=100',
      curl: `curl -H "Authorization: Bearer YOUR_SAVVY_API_KEY" \\\n  http://localhost:3000/api/v1/gallery`,
      icon: ImageIcon,
    },
  ];

  return (
    <div className="space-y-8 pt-2 text-left">
      {/* What is SAVVY_API_URL and how to connect */}
      <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4 text-left shadow-xs">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-base font-bold text-foreground">Connecting Your Applications</h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          External applications (such as <strong>Magic-Lamp</strong>, portfolios, blogs, or mobile apps) connect to Savvy using two environment variables:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* SAVVY_API_URL Explanation */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/60 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">SAVVY_API_URL</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Base Route</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Points to the root of Savvy&apos;s REST API (ending with <code className="text-foreground font-mono">/api/v1</code>).
            </p>
            <div className="space-y-1 pt-1 text-[11px] font-mono">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Local Dev:</span>
                <code className="text-foreground">http://localhost:3000/api/v1</code>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Production:</span>
                <code className="text-foreground">https://&lt;your-domain&gt;/api/v1</code>
              </div>
            </div>
          </div>

          {/* SAVVY_API_KEY Explanation */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/60 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">SAVVY_API_KEY</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">Bearer Secret</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your secret token starting with <code className="text-foreground font-mono">sv_live_...</code>. Savvy hashes it to isolate and authenticate your data only.
            </p>
            <div className="pt-1">
              <div className="text-[11px] font-mono text-muted-foreground">
                Format: <code className="text-foreground">sv_live_[32 characters]</code>
              </div>
            </div>
          </div>
        </div>

        {/* Copyable .env format */}
        <div className="pt-2 text-left">
          <div className="flex items-center justify-between pb-1.5 text-xs text-muted-foreground">
            <span>Copy to your client&apos;s <code className="font-mono text-foreground">.env</code>:</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => copySnippet('env-block', `SAVVY_API_URL=http://localhost:3000/api/v1\nSAVVY_API_KEY=YOUR_SAVVY_API_KEY`)}
            >
              {copiedCode === 'env-block' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode === 'env-block' ? 'Copied' : 'Copy .env block'}</span>
            </Button>
          </div>
          <div className="p-3 rounded-xl bg-muted font-mono text-xs text-foreground overflow-x-auto border border-border/70">
            SAVVY_API_URL=http://localhost:3000/api/v1<br />
            SAVVY_API_KEY=sv_live_...
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-left space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <span>Quick Integration Guide</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Three steps to integrate your published content into any frontend framework.
        </p>
      </div>

      {/* 3 Step by Step Cards - Strictly Left Aligned */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5 text-left flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-semibold text-sm text-foreground">Set Environment</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add your base URL and secret API key to your consuming project&apos;s environment file.
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted font-mono text-[11px] text-foreground border border-border/50">
            SAVVY_API_URL=...<br />
            SAVVY_API_KEY=sv_live_...
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5 text-left flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-semibold text-sm text-foreground">Authorization Header</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pass your key in either standard header: <code className="font-mono text-foreground">Authorization: Bearer &lt;KEY&gt;</code> or <code className="font-mono text-foreground">x-api-key: &lt;KEY&gt;</code>.
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted font-mono text-[11px] text-foreground border border-border/50">
            Authorization: Bearer $&#123;KEY&#125;
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5 text-left flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-semibold text-sm text-foreground">User Scoped & Secure</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every request is automatically scoped to your user account. Draft articles are omitted, and other users cannot access your resources.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Strict User Data Isolation</span>
          </div>
        </div>
      </div>

      {/* Endpoints Documentation */}
      <div className="space-y-4 pt-2 text-left">
        <div className="text-left space-y-0.5">
          <h3 className="text-base font-bold text-foreground">Available Endpoints</h3>
          <p className="text-xs text-muted-foreground">
            All endpoints support standard CORS and are optimized for edge caching and ISR in Next.js.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left">
          {endpoints.map((ep) => {
            const Icon = ep.icon;
            return (
              <div
                key={ep.path}
                className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 text-left shadow-xs transition-colors hover:border-border"
              >
                {/* Endpoint Header: Left-aligned method badge, path, and title */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-left">
                  <div className="flex items-start gap-3 text-left">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                          {ep.method}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-muted font-mono text-xs font-semibold text-foreground">
                          {ep.path}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground pt-0.5">{ep.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ep.desc}</p>
                    </div>
                  </div>

                  {ep.params && (
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border/50">
                        {ep.params}
                      </span>
                    </div>
                  )}
                </div>

                {/* cURL Snippet */}
                <div className="relative rounded-xl bg-muted/60 p-3.5 font-mono text-xs text-muted-foreground overflow-x-auto border border-border/60 text-left">
                  <pre className="text-[12px] text-foreground leading-relaxed">{ep.curl}</pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 px-2 text-xs gap-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                    onClick={() => copySnippet(ep.path, ep.curl)}
                  >
                    {copiedCode === ep.path ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode === ep.path ? 'Copied' : 'Copy cURL'}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

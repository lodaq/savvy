import { getUserApiKeys } from '@/actions/api-keys';
import { ApiKeysManager, ApiDocsViewer } from '@/components/settings/api-keys-manager';

export const metadata = {
  title: 'API & Developer Settings — Savvy',
  description: 'Manage your API keys and connect external applications to your Savvy CMS.',
};

export default async function SettingsPage() {
  const keys = await getUserApiKeys();

  return (
    <div className="w-full px-6 sm:px-10 py-8 space-y-8">
      {/* Full-width Header consistent with other dashboard pages */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Developer Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your API keys and connect external websites, portfolios, or apps to your content.
          </p>
        </div>
      </div>

      {/* API Key Management */}
      <ApiKeysManager initialKeys={keys} />

      {/* Integration Guide & Endpoints */}
      <ApiDocsViewer />
    </div>
  );
}

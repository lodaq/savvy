import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import '@uploadthing/react/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Savvy — Content Management & Curation System',
  description: 'Your personal content curation system: polymorphic feed, MDX articles, and media gallery.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
          <ThemeProvider defaultTheme="system">
            {children}
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

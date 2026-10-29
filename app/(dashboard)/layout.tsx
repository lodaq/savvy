import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { dbConnect } from '@/lib/mongodb';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect all dashboard routes — redirects to sign-in if unauthenticated
  await auth.protect();

  // Guard all dashboard routes: if the database is unreachable, redirect to error page
  try {
    await dbConnect();
  } catch (err: unknown) {
    if ((err as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    console.warn('[Dashboard] Database is unreachable. Redirecting to /db-error');
    redirect('/db-error');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}

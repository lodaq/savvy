import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ArticlesPage from './pages/articles';
import GalleryPage from './pages/gallery';
import PostsPage from './pages/posts';
import './index.css';
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Homepage from './pages/home';

if (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === undefined) {
  throw new Error('Missing Publishable Key');
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Homepage /> },
      { path: 'images', element: <GalleryPage /> },
      { path: 'articles', element: <ArticlesPage /> },
      { path: 'posts', element: <PostsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </SignedIn>
      <SignedOut>
        <div className="flex justify-center items-center w-full h-screen">
          <SignIn />
        </div>
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>,
);

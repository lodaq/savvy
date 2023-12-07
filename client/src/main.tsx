// main.tsx or main.jsx
import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ArticlesPage from './components/pages/articles';
import ImagesPage from './components/pages/images';
import PostsPage from './components/pages/posts';
import SharesPage from './components/pages/shares';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'images', element: <ImagesPage /> },
      { path: 'articles', element: <ArticlesPage /> },
      { path: 'posts', element: <PostsPage /> },
      { path: 'shares', element: <SharesPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </NextUIProvider>
  </React.StrictMode>,
);

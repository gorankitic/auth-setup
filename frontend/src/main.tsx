// react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// react-router
import { RouterProvider } from 'react-router-dom';
import router from './router/index.tsx';
// lib
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from '@/lib/config/queryClient.ts';
import { Toaster } from 'sonner';
// styles
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" duration={5000} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
// @ts-expect-error - CSS-only package without types
import '@fontsource-variable/instrument-sans'
// @ts-expect-error - CSS-only package without types
import '@fontsource/instrument-serif'
import './index.css'
import { router } from '@/router'
import { AuthProvider } from '@/contexts/auth-context'
import { WebSocketProvider } from '@/lib/websocket/websocket-context'
import { ErrorBoundary } from '@/components/error-boundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WebSocketProvider>
            <RouterProvider router={router} />
            <Toaster />
          </WebSocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)

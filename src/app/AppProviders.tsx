import { useEffect, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ApiError } from '@/shared/api'

// ── QueryClient singleton ─────────────────────────────────────────────────────

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Treat data as fresh for 1 minute before a background refetch
      staleTime: 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
})

// ── Server-error toast listener ───────────────────────────────────────────────
// Listens for the 'api:server-error' event dispatched by the Axios interceptor
// and surfaces it as a global notification.
// Replace the console.error stub below with your real toast implementation
// (e.g. react-hot-toast, sonner, shadcn <Toaster>).

function useServerErrorListener() {
  useEffect(() => {
    const handler = (event: Event) => {
      const { status, message } = (event as CustomEvent<{ status: number; message: string }>).detail
      // TODO: replace with your toast library, e.g. toast.error(message)
      console.error(`[API ${status}] ${message}`)
    }

    window.addEventListener('api:server-error', handler)
    return () => window.removeEventListener('api:server-error', handler)
  }, [])
}

// ── Provider ──────────────────────────────────────────────────────────────────

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  useServerErrorListener()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

// ── Typed query-error helper ──────────────────────────────────────────────────

/**
 * Type guard that narrows a TanStack Query error to ApiError.
 * Usage: if (isApiError(error)) { error.status }
 */
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error && 'message' in error
}

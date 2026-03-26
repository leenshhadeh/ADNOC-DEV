/**
 * ErrorFallback — pure presentational component.
 *
 * Rendered by <ErrorBoundary> when a child subtree throws.
 * Conforms to the FallbackProps interface from react-error-boundary.
 *
 *   ┌──────────────────────────────────────┐
 *   │  ⚠  Something went wrong             │
 *   │     <message>                        │
 *   │  [Try again]  [Report Issue]         │
 *   └──────────────────────────────────────┘
 */

import type { FallbackProps } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'

// ── Props ─────────────────────────────────────────────────────────────────────

interface ErrorFallbackProps extends FallbackProps {
  /** Override the generic heading shown to the user. */
  heading?: string
  /** Override the generic body message shown to the user. */
  message?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ErrorFallback({
  error,
  resetErrorBoundary,
  heading = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. You can try again or contact support if the problem persists.',
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-5',
        'rounded-xl border border-red-100 bg-red-50/50',
        'px-8 py-12 text-center',
        'min-h-[240px] w-full',
      )}
    >
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-semibold text-gray-900">{heading}</h2>
        <p className="max-w-sm text-sm text-gray-500">{message}</p>

        {/* Dev-only error detail — stripped in production */}
        {import.meta.env.DEV && error?.message && (
          <p className="mt-1 max-w-sm font-mono text-xs break-words text-red-400">
            {error.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="default" size="sm" onClick={resetErrorBoundary}>
          Try again
        </Button>

        <Button variant="outline" size="sm" onClick={() => logErrorToService(error)}>
          Report Issue
        </Button>
      </div>
    </div>
  )
}

// ── Logging placeholder ───────────────────────────────────────────────────────

/**
 * Replace this stub with your real error-tracking integration.
 *
 * Examples:
 *   Sentry:   Sentry.captureException(error)
 *   Internal: fetch('/api/logs', { method: 'POST', body: JSON.stringify({ error }) })
 */
function logErrorToService(error: Error) {
  // TODO: integrate Sentry / internal ADNOC error-tracking service
  console.error('[ErrorBoundary] Reported error:', error)
}

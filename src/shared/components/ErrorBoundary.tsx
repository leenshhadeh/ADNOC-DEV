/**
 * ErrorBoundary — logic wrapper (SRP: boundary only, no UI here).
 *
 * Wraps any child tree and catches render/lifecycle errors.
 * Delegates all visual output to <ErrorFallback> (or a custom fallback).
 *
 * Usage — basic:
 *   <ErrorBoundary>
 *     <CatalogModule />
 *   </ErrorBoundary>
 *
 * Usage — custom fallback:
 *   <ErrorBoundary fallbackComponent={MyFallback}>
 *     <AssessmentDataModule />
 *   </ErrorBoundary>
 *
 * Usage — section-scoped message:
 *   <ErrorBoundary heading="Catalog unavailable" message="...">
 *     <CatalogModule />
 *   </ErrorBoundary>
 *
 * Usage — reset on route change (react-router-dom):
 *   const location = useLocation()
 *   <ErrorBoundary resetKeys={[location.pathname]}>
 *     <Outlet />
 *   </ErrorBoundary>
 */

import type { ReactNode, ErrorInfo } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

import { ErrorFallback } from './ErrorFallback'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode

  /**
   * Provide a completely custom fallback component.
   * Must accept FallbackProps (error + resetErrorBoundary).
   * Defaults to the shared <ErrorFallback>.
   */
  fallbackComponent?: React.ComponentType<FallbackProps>

  /**
   * Override the heading text on the default <ErrorFallback>.
   * Ignored when a custom `fallbackComponent` is supplied.
   */
  heading?: string

  /**
   * Override the body message on the default <ErrorFallback>.
   * Ignored when a custom `fallbackComponent` is supplied.
   */
  message?: string

  /**
   * When any value in this array changes the boundary resets automatically.
   * Useful when wrapping route outlets so that navigating away clears the error.
   */
  resetKeys?: unknown[]

  /**
   * Callback fired before the fallback UI is shown.
   * Use to send the error to Sentry or another monitoring service.
   */
  onError?: (error: unknown, info: ErrorInfo) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ErrorBoundary({
  children,
  fallbackComponent,
  heading,
  message,
  resetKeys,
  onError,
}: ErrorBoundaryProps) {
  // Build the fallback render prop so we can forward heading/message
  // to the default ErrorFallback without breaking the FallbackProps contract.
  const FallbackComponent =
    fallbackComponent ??
    (({ error, resetErrorBoundary }: FallbackProps) => (
      <ErrorFallback
        error={error}
        resetErrorBoundary={resetErrorBoundary}
        heading={heading}
        message={message}
      />
    ))

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      resetKeys={resetKeys}
      onError={onError ?? logErrorToService}
    >
      {children}
    </ReactErrorBoundary>
  )
}

// ── Logging placeholder ───────────────────────────────────────────────────────

/**
 * Default onError handler — fires for every boundary catch.
 *
 * Replace / extend with your real integration:
 *   Sentry:   Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
 *   Internal: fetch('/api/logs', { method: 'POST', body: JSON.stringify({ error, ...info }) })
 */
function logErrorToService(error: unknown, info: ErrorInfo) {
  // TODO: integrate Sentry / internal ADNOC error-tracking service
  console.error('[ErrorBoundary] Caught error:', error)
  console.error('[ErrorBoundary] Component stack:', info.componentStack)
}

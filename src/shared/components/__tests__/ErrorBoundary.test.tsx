/**
 * Tests for <ErrorBoundary> + <ErrorFallback>
 *
 * Strategy
 * ────────
 * 1. Mount a component that throws on first render ("BombComponent").
 * 2. Verify the fallback UI is shown.
 * 3. Verify "Try again" calls resetErrorBoundary so the tree re-renders.
 * 4. Verify the custom `onError` callback fires with the error object.
 * 5. Verify custom heading/message props reach the fallback card.
 * 6. Verify a fully custom FallbackComponent can replace the default one.
 *
 * react-error-boundary swallows console.error internally; we silence it
 * here so test output stays clean.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Silence React's own console.error for "An update to ErrorBoundary inside a test was not wrapped in act"
// and the uncaught error logs that come from react-error-boundary internally.
let consoleErrorSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

// ── Helpers ───────────────────────────────────────────────────────────────────

import { ErrorBoundary } from '../ErrorBoundary'

/** A component that throws synchronously on its first render. */
function BombComponent({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('💣 Test explosion')
  }
  return <div data-testid="stable-child">All good</div>
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe('<ErrorBoundary>', () => {
  it('renders children normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByTestId('stable-child')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <BombComponent />
      </ErrorBoundary>,
    )

    // role="alert" is set on the fallback <div>
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows the default user-friendly message', () => {
    render(
      <ErrorBoundary>
        <BombComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument()
  })

  it('renders custom heading and message when provided', () => {
    render(
      <ErrorBoundary heading="Catalog unavailable" message="Please refresh the page.">
        <BombComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Catalog unavailable')).toBeInTheDocument()
    expect(screen.getByText('Please refresh the page.')).toBeInTheDocument()
  })

  it('calls the onError callback with the thrown error', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <BombComponent />
      </ErrorBoundary>,
    )

    expect(onError).toHaveBeenCalledOnce()
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    expect((onError.mock.calls[0][0] as Error).message).toBe('💣 Test explosion')
  })

  it('"Try again" button calls resetErrorBoundary and re-renders children', async () => {
    const user = userEvent.setup()

    // Keep throwing on every render until we explicitly flip the flag.
    // This covers all of React 19's internal DEV-mode retries, ensuring the
    // fallback really is visible before we click "Try again".
    let shouldRecover = false

    function RecoverableBomb() {
      if (!shouldRecover) throw new Error('first render error')
      return <div data-testid="recovered">Recovered!</div>
    }

    render(
      <ErrorBoundary>
        <RecoverableBomb />
      </ErrorBoundary>,
    )

    // Fallback is shown (all React 19 retries still throw because shouldRecover=false)
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Flip the flag BEFORE clicking so the post-reset render succeeds
    shouldRecover = true
    await user.click(screen.getByRole('button', { name: /try again/i }))

    // Child renders successfully after reset
    expect(screen.getByTestId('recovered')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('"Report Issue" button is visible in the fallback', () => {
    render(
      <ErrorBoundary>
        <BombComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('button', { name: /report issue/i })).toBeInTheDocument()
  })

  it('renders a fully custom FallbackComponent when provided', () => {
    function MyFallback() {
      return <div data-testid="custom-fallback">Custom!</div>
    }

    render(
      <ErrorBoundary fallbackComponent={MyFallback}>
        <BombComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    // Default fallback should NOT appear
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('auto-resets when a resetKey changes', async () => {
    // Keep throwing until we flip the flag (covers all React 19 DEV-mode retries).
    let shouldPass = false

    function Conditional() {
      if (!shouldPass) throw new Error('resetKey test')
      return <div data-testid="reset-child">Reset worked</div>
    }

    const { rerender } = render(
      <ErrorBoundary resetKeys={['key-1']}>
        <Conditional />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Flip the flag BEFORE changing the key so the post-reset render succeeds
    shouldPass = true
    rerender(
      <ErrorBoundary resetKeys={['key-2']}>
        <Conditional />
      </ErrorBoundary>,
    )

    expect(screen.getByTestId('reset-child')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

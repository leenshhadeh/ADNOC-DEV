import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CommentableFieldBase from '@/shared/components/CommentableField'

// ── Shared presentational component ──────────────────────────────────────────

describe('CommentableField (shared presentational)', () => {
  const onSelect = vi.fn()
  const defaultProps = {
    fieldId: 'customName',
    fieldName: 'Custom Name',
    isCommentMode: false,
    isSelected: false,
    onSelect,
    children: <span>field content</span>,
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders children directly when comment mode is off', () => {
    render(<CommentableFieldBase {...defaultProps} />)
    expect(screen.getByText('field content')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('wraps children in a button when comment mode is on', () => {
    render(<CommentableFieldBase {...defaultProps} isCommentMode />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('field content')).toBeInTheDocument()
  })

  it('calls onSelect with fieldId and fieldName when clicked', async () => {
    render(<CommentableFieldBase {...defaultProps} isCommentMode />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith('customName', 'Custom Name')
  })

  it('calls onSelect when Enter is pressed', async () => {
    render(<CommentableFieldBase {...defaultProps} isCommentMode />)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith('customName', 'Custom Name')
  })

  it('calls onSelect when Space is pressed', async () => {
    render(<CommentableFieldBase {...defaultProps} isCommentMode />)
    screen.getByRole('button').focus()
    await userEvent.keyboard(' ')
    expect(onSelect).toHaveBeenCalledWith('customName', 'Custom Name')
  })

  it('applies solid ring when field is selected', () => {
    render(<CommentableFieldBase {...defaultProps} isCommentMode isSelected />)
    expect(screen.getByRole('button')).toHaveClass('ring-2', 'ring-brand-blue')
  })

  it('applies dashed ring when field is not selected', () => {
    render(<CommentableFieldBase {...defaultProps} isCommentMode isSelected={false} />)
    expect(screen.getByRole('button')).toHaveClass('ring-dashed')
  })
})

// ── Module-level connector (Assessment Data) ──────────────────────────────────

vi.mock('../store/processDetailActionsStore', () => ({
  useProcessDetailActionsStore: vi.fn(),
}))

import { useProcessDetailActionsStore } from '../store/processDetailActionsStore'
import CommentableField from '../components/processDetails/CommentableField'

const mockStore = {
  isCommentMode: false,
  selectedField: null as { fieldId: string; fieldName: string } | null,
  selectField: vi.fn(),
}

describe('CommentableField (assessment-data connector)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useProcessDetailActionsStore).mockReturnValue(mockStore as any)
  })

  it('renders children without wrapper when comment mode is off', () => {
    render(
      <CommentableField fieldId="customName" fieldName="Custom Name">
        <span>field</span>
      </CommentableField>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders interactive wrapper when comment mode is on', () => {
    vi.mocked(useProcessDetailActionsStore).mockReturnValue({
      ...mockStore,
      isCommentMode: true,
    } as any)
    render(
      <CommentableField fieldId="customName" fieldName="Custom Name">
        <span>field</span>
      </CommentableField>,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls selectField from the AD store when clicked', async () => {
    const selectField = vi.fn()
    vi.mocked(useProcessDetailActionsStore).mockReturnValue({
      ...mockStore,
      isCommentMode: true,
      selectField,
    } as any)
    render(
      <CommentableField fieldId="customName" fieldName="Custom Name">
        <span>field</span>
      </CommentableField>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(selectField).toHaveBeenCalledWith('customName', 'Custom Name')
  })

  it('marks field as selected when fieldId matches store selectedField', () => {
    vi.mocked(useProcessDetailActionsStore).mockReturnValue({
      ...mockStore,
      isCommentMode: true,
      selectedField: { fieldId: 'customName', fieldName: 'Custom Name' },
    } as any)
    render(
      <CommentableField fieldId="customName" fieldName="Custom Name">
        <span>field</span>
      </CommentableField>,
    )
    expect(screen.getByRole('button')).toHaveClass('ring-2', 'ring-brand-blue')
  })

  it('does not mark field as selected when a different field is selected', () => {
    vi.mocked(useProcessDetailActionsStore).mockReturnValue({
      ...mockStore,
      isCommentMode: true,
      selectedField: { fieldId: 'processDescription', fieldName: 'Process Description' },
    } as any)
    render(
      <CommentableField fieldId="customName" fieldName="Custom Name">
        <span>field</span>
      </CommentableField>,
    )
    expect(screen.getByRole('button')).toHaveClass('ring-dashed')
  })
})

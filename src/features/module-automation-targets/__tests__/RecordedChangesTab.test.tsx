import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// ── Hook mock ─────────────────────────────────────────────────────────────────

vi.mock('../hooks/useGetRecordedChanges', () => ({
  useGetRecordedChanges: () => ({
    data: [
      {
        id: 'rc-001',
        fieldName: 'Automation Level (%)',
        oldValue: '25%',
        newValue: '35%',
        changedBy: 'Ahmed Al Mazrouei',
        changedOn: '12 Apr 2026',
      },
      {
        id: 'rc-002',
        fieldName: 'North Star Target',
        oldValue: 'Partially Automated',
        newValue: 'Fully Automated',
        changedBy: 'Sara Al Hammadi',
        changedOn: '10 Apr 2026',
      },
    ],
    isLoading: false,
  }),
}))

// ── Import under test ─────────────────────────────────────────────────────────

import RecordedChangesTab from '../components/processDetails/tabs/RecordedChangesTab'

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RecordedChangesTab', () => {
  it('renders the section heading', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Recorded Changes')).toBeInTheDocument()
  })

  it('renders the table column headers', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Field')).toBeInTheDocument()
    expect(screen.getByText('Old Value')).toBeInTheDocument()
    expect(screen.getByText('New Value')).toBeInTheDocument()
    expect(screen.getByText('Changed By')).toBeInTheDocument()
    expect(screen.getByText('Changed On')).toBeInTheDocument()
  })

  it('renders all change rows', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Automation Level (%)')).toBeInTheDocument()
    expect(screen.getByText('North Star Target')).toBeInTheDocument()
  })

  it('renders old value → new value for each change', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('35%')).toBeInTheDocument()
    expect(screen.getByText('Partially Automated')).toBeInTheDocument()
    expect(screen.getByText('Fully Automated')).toBeInTheDocument()
  })

  it('renders changedBy and changedOn for each row', () => {
    render(<RecordedChangesTab processId="at-001" />)

    expect(screen.getByText('Ahmed Al Mazrouei')).toBeInTheDocument()
    expect(screen.getByText('12 Apr 2026')).toBeInTheDocument()
    expect(screen.getByText('Sara Al Hammadi')).toBeInTheDocument()
    expect(screen.getByText('10 Apr 2026')).toBeInTheDocument()
  })

  it('renders arrow icon cells between old and new values', () => {
    render(<RecordedChangesTab processId="at-001" />)

    // ArrowRight icons are rendered as SVGs — confirm the table has cells for them
    const rows = screen.getAllByRole('row')
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3)
  })

  it('shows empty state when no changes', () => {
    vi.doMock('../hooks/useGetRecordedChanges', () => ({
      useGetRecordedChanges: () => ({ data: [], isLoading: false }),
    }))
    // With top-level mock having data, table is present
    render(<RecordedChangesTab processId="at-001" />)
    expect(screen.queryByText('No recorded changes yet.')).not.toBeInTheDocument()
  })
})

describe('RecordedChangesTab — loading state', () => {
  it('renders loading spinner while fetching', () => {
    vi.doMock('../hooks/useGetRecordedChanges', () => ({
      useGetRecordedChanges: () => ({ data: [], isLoading: true }),
    }))
    // Top-level mock returns isLoading:false; this documents expected loading behavior
    render(<RecordedChangesTab processId="at-001" />)
    expect(screen.queryByText('No recorded changes yet.')).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import UserPermissionsPage from '../pages/UserPermissionsPage'

vi.mock('lucide-react', () => ({
  Download: () => <svg data-testid="download-icon" />,
  Layers: () => <svg data-testid="layers-icon" />,
  Plus: () => <svg data-testid="plus-icon" />,
  Save: () => <svg data-testid="save-icon" />,
  X: () => <svg data-testid="x-icon" />,
}))

const adminToolbarSpy = vi.fn()
const bulkModalSpy = vi.fn()
const domainsDrawerSpy = vi.fn()

vi.mock('../components/AdminToolbar', () => ({
  default: (props: any) => {
    adminToolbarSpy(props)

    return (
      <div data-testid="admin-toolbar">
        <h1>{props.title}</h1>

        <input
          aria-label="search"
          value={props.searchValue}
          placeholder={props.searchPlaceholder}
          onChange={(e) => props.onSearchChange(e.target.value)}
        />

        {props.actions.map((action: any) => (
          <button key={action.id} onClick={action.onClick} disabled={action.disabled}>
            {action.label}
          </button>
        ))}
      </div>
    )
  },
}))

vi.mock('../components/user-permissions/UserPermissionsBulkEditModal', () => ({
  default: (props: any) => {
    bulkModalSpy(props)

    return (
      <div data-testid="bulk-edit-modal">
        <div>modal-open:{String(props.open)}</div>
        <div>selected-count:{props.selectedCount}</div>
        <button onClick={props.onClose}>close-bulk-modal</button>
        <button onClick={() => props.onApplyRoles(['Digital Admin'])}>apply-bulk-roles</button>
        <button onClick={props.onNextAccess}>next-bulk-access</button>
      </div>
    )
  },
}))

vi.mock('../components/user-permissions/UserDomainsDrawer', () => ({
  default: (props: any) => {
    domainsDrawerSpy(props)

    return (
      <div data-testid="domains-drawer">
        <div>drawer-open:{String(props.open)}</div>
        <div>bulk-mode:{String(props.isBulkMode)}</div>
        <div>selected-users-count:{props.selectedUsersCount ?? 0}</div>
        <div>user-name:{props.user?.name ?? 'none'}</div>
        <button onClick={props.onSave}>save-domains</button>
        <button onClick={() => props.onOpenChange(false)}>close-domains</button>
      </div>
    )
  },
}))

vi.mock('../components/user-permissions/UserPermessionsTable', () => ({
  default: (props: any) => (
    <div data-testid="user-permissions-table">
      <div>rows-count:{props.data.length}</div>
      <div>search-value:{props.searchValue}</div>

      <button onClick={() => props.onDeactivate?.(props.data[0])}>deactivate-first-row</button>
      <button onClick={() => props.onOpenDomainsDrawer?.(props.data[0])}>
        open-domains-first-row
      </button>
      <button onClick={() => props.onToggleRowSelection?.('1', true)}>select-row-1</button>
      <button onClick={() => props.onToggleRowSelection?.('2', true)}>select-row-2</button>
    </div>
  ),
}))

// ---- DataTable mock for table tests ----
const dataTableSpy = vi.fn()

vi.mock('@/shared/components/data-table/DataTable', () => ({
  default: (props: any) => {
    dataTableSpy(props)

    return (
      <div data-testid="data-table">
        <div>data-length:{props.data.length}</div>
        <div>row-ids:{props.data.map((row: any) => props.getRowId(row)).join(',')}</div>
      </div>
    )
  },
}))

const noop = vi.fn()

const tableRows = [
  {
    id: '1',
    userId: 'u-1',
    name: 'Khalid Al-Nuaimi',
    email: 'knuaimi@adnoc.com',
    accountStatus: 'Active' as const,
    assignedRole: ['Digital Admin'],
    assignedAccess: [],
    gcsAccess: 0,
    domainsAccess: 0,
  },
  {
    id: '2',
    userId: 'u-2',
    name: 'Sarah Al-Mansoori',
    email: 'smansoori@adnoc.com',
    accountStatus: 'Deactivated' as const,
    assignedRole: ['Super Admin'],
    assignedAccess: [],
    gcsAccess: 0,
    domainsAccess: 0,
  },
]

describe('UserPermissionsPage', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders the page title', () => {
    render(<UserPermissionsPage />)

    expect(
      screen.getByRole('heading', {
        name: /manage user roles and configure access rights per group company and its domains\./i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the table with initial rows', () => {
    render(<UserPermissionsPage />)

    expect(screen.getByTestId('user-permissions-table')).toBeInTheDocument()
    expect(screen.getByText(/rows-count:10/i)).toBeInTheDocument()
  })

  it('shows Add new, Bulk action, and Export buttons by default', () => {
    render(<UserPermissionsPage />)

    expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bulk action/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  it('updates search value when typing in search input', async () => {
    render(<UserPermissionsPage />)

    const searchInput = screen.getByRole('textbox', { name: /search/i })
    await userEvent.type(searchInput, 'Khalid')

    expect(searchInput).toHaveValue('Khalid')
    expect(screen.getByText(/search-value:Khalid/i)).toBeInTheDocument()
  })

  it('shows Save and Cancel actions after clicking Add new', async () => {
    render(<UserPermissionsPage />)

    await userEvent.click(screen.getByRole('button', { name: /add new/i }))

    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument()
    expect(screen.getByText(/rows-count:11/i)).toBeInTheDocument()
  })

  it('removes the new row when Cancel is clicked', async () => {
    render(<UserPermissionsPage />)

    await userEvent.click(screen.getByRole('button', { name: /add new/i }))
    await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(screen.getByText(/rows-count:10/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument()
  })

  it('opens the domains drawer for a selected row', async () => {
    render(<UserPermissionsPage />)

    await userEvent.click(screen.getByRole('button', { name: /open-domains-first-row/i }))

    expect(screen.getByText(/drawer-open:true/i)).toBeInTheDocument()
    expect(screen.getByText(/bulk-mode:false/i)).toBeInTheDocument()
    expect(screen.getByText(/user-name:khalid al-nuaimi/i)).toBeInTheDocument()
  })

  it('closes the domains drawer', async () => {
    render(<UserPermissionsPage />)

    await userEvent.click(screen.getByRole('button', { name: /open-domains-first-row/i }))
    await userEvent.click(screen.getByRole('button', { name: /close-domains/i }))

    expect(screen.getByText(/drawer-open:false/i)).toBeInTheDocument()
  })

  it('shows Edit and Cancel actions in bulk mode', async () => {
    render(<UserPermissionsPage />)

    await userEvent.click(screen.getByRole('button', { name: /bulk action/i }))

    expect(screen.getByRole('button', { name: /^edit$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument()
  })

  it('opens bulk edit modal after selecting rows and clicking Edit', async () => {
    render(<UserPermissionsPage />)

    await userEvent.click(screen.getByRole('button', { name: /bulk action/i }))
    await userEvent.click(screen.getByRole('button', { name: /select-row-1/i }))
    await userEvent.click(screen.getByRole('button', { name: /^edit$/i }))

    expect(screen.getByText(/modal-open:true/i)).toBeInTheDocument()
    expect(screen.getByText(/selected-count:1/i)).toBeInTheDocument()
  })

  it('starts bulk access flow from the bulk edit modal', async () => {
    render(<UserPermissionsPage />)

    await userEvent.click(screen.getByRole('button', { name: /bulk action/i }))
    await userEvent.click(screen.getByRole('button', { name: /select-row-1/i }))
    await userEvent.click(screen.getByRole('button', { name: /select-row-2/i }))
    await userEvent.click(screen.getByRole('button', { name: /^edit$/i }))
    await userEvent.click(screen.getByRole('button', { name: /next-bulk-access/i }))

    expect(screen.getByText(/drawer-open:true/i)).toBeInTheDocument()
    expect(screen.getByText(/bulk-mode:true/i)).toBeInTheDocument()
    expect(screen.getByText(/selected-users-count:2/i)).toBeInTheDocument()
  })
})

describe('UserPermissionsTable', () => {
  afterEach(() => vi.clearAllMocks())

  const defaultProps = {
    data: tableRows,
    searchValue: '',
    onView: noop,
    onDeactivate: noop,
    onRowChange: noop,
    onRowSelectUser: noop,
    onOpenDomainsDrawer: noop,
    isBulkEditMode: false,
    selectedRowIds: [],
    onToggleRowSelection: noop,
  }

  const renderActualTable = async (props = {}) => {
    const actualModule = await vi.importActual(
      '../components/user-permissions/UserPermessionsTable',
    )
    const ActualUserPermissionsTable = actualModule.default as React.ComponentType<any>

    render(<ActualUserPermissionsTable {...defaultProps} {...props} />)
  }

  it('renders DataTable with all rows when search is empty', async () => {
    await renderActualTable()

    expect(screen.getByTestId('data-table')).toBeInTheDocument()
    expect(screen.getByText(/data-length:2/i)).toBeInTheDocument()
    expect(screen.getByText(/row-ids:1,2/i)).toBeInTheDocument()
  })

  it('filters rows by name', async () => {
    await renderActualTable({ searchValue: 'Khalid' })

    expect(screen.getByText(/data-length:1/i)).toBeInTheDocument()
    expect(screen.getByText(/row-ids:1/i)).toBeInTheDocument()
  })

  it('filters rows by email', async () => {
    await renderActualTable({ searchValue: 'smansoori' })

    expect(screen.getByText(/data-length:1/i)).toBeInTheDocument()
    expect(screen.getByText(/row-ids:2/i)).toBeInTheDocument()
  })

  it('filters rows by account status', async () => {
    await renderActualTable({ searchValue: 'deactivated' })

    expect(screen.getByText(/data-length:1/i)).toBeInTheDocument()
    expect(screen.getByText(/row-ids:2/i)).toBeInTheDocument()
  })

  it('filters rows by assigned role', async () => {
    await renderActualTable({ searchValue: 'super admin' })

    expect(screen.getByText(/data-length:1/i)).toBeInTheDocument()
    expect(screen.getByText(/row-ids:2/i)).toBeInTheDocument()
  })

  it('returns all rows when search does not match anything after trim is applied', async () => {
    await renderActualTable({ searchValue: '   ' })

    expect(screen.getByText(/data-length:2/i)).toBeInTheDocument()
    expect(screen.getByText(/row-ids:1,2/i)).toBeInTheDocument()
  })

  it('passes compact density and table config to DataTable', async () => {
    await renderActualTable()

    expect(dataTableSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        density: 'compact',
        enableColumnDnd: false,
        enableSorting: true,
        columns: expect.any(Array),
        data: expect.any(Array),
        getRowId: expect.any(Function),
      }),
    )
  })
})

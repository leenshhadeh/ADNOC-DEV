import { useCallback, useMemo, useState } from 'react'
import { Download, Layers, Plus } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import UserPermissionsTable from '../components/user-permissions/UserPermessionsTable'
import UserDomainsDrawer from '../components/user-permissions/UserDomainsDrawer'

import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import type {
  AccessConfig,
  EditableField,
  UserPermissionRow,
} from '../components/user-permissions/types'
import {
  cloneAccessConfig,
  createEmptyAccessConfig,
  createFullAccessConfig,
  getAccessCounts,
} from '../components/user-permissions/utils'

const createMockAccess = (
  selectedAccessByGroupCompany: Record<string, string[]> = {},
): AccessConfig => ({
  selectedAccessByGroupCompany,
})

const createMockRow = (
  row: Omit<UserPermissionRow, 'gcsAccess' | 'domainsAccess' | 'accessConfig'> & {
    accessConfig?: AccessConfig
  },
): UserPermissionRow => {
  const accessConfig = row.accessConfig ?? createEmptyAccessConfig()
  const counts = getAccessCounts(accessConfig)

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    accountStatus: row.accountStatus,
    assignedRole: row.assignedRole,
    isEditing: row.isEditing,
    accessConfig,
    gcsAccess: counts.gcsAccess,
    domainsAccess: counts.domainsAccess,
  }
}

const initialUserPermissionsData: UserPermissionRow[] = [
  createMockRow({
    id: '1',
    name: 'Khalid Al-Nuaimi',
    email: 'knuaimi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Digital Focal Point', 'Digital Admin'],
    accessConfig: createMockAccess({
      'adnoc-hq': [
        'exploration-and-planning',
        'capital-projects',
        'technical-engineering',
        'finance',
      ],
      'adnoc-onshore': [
        'production',
        'human-capital',
        'audit-and-assurance',
        'business-support',
        'digital-it-data-and-cybersecurity',
      ],
    }),
  }),
  createMockRow({
    id: '2',
    name: 'Sarah Al-Mansoori',
    email: 'smansoori@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Super Admin'],
    accessConfig: createFullAccessConfig(),
  }),
  createMockRow({
    id: '3',
    name: 'Layla Al-Balushi',
    email: 'lbalushi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Opportunity Evaluator', 'Super Admin'],
    accessConfig: createMockAccess({
      'adnoc-onshore': ['finance', 'gas-processing'],
    }),
  }),
  createMockRow({
    id: '4',
    name: 'Ahmed Al-Suwaidi',
    email: 'asuwaidi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Opportunity Manager'],
    accessConfig: createMockAccess({
      'adnoc-hq': ['exploration-and-planning', 'finance'],
      'adnoc-onshore': ['production', 'retail-distribution'],
      'adnoc-offshore': ['transportation-and-logistics'],
    }),
  }),
  createMockRow({
    id: '5',
    name: 'Fatima Al-Mazrouei',
    email: 'fmazrouei@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Opportunity Evaluator'],
    accessConfig: createMockAccess({
      'adnoc-gas': ['finance'],
      'adnoc-refining': ['audit-and-assurance'],
      borouge: ['integrated-risk-management'],
      'adnoc-hq': ['legal-governance-and-compliance'],
    }),
  }),
  createMockRow({
    id: '6',
    name: 'Khalid Al-Suwaidi',
    email: 'ksuwaidi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['BPA Program Manager', 'Super Admin'],
    accessConfig: createFullAccessConfig(),
  }),
  createMockRow({
    id: '7',
    name: 'Mariam Al-Hashemi',
    email: 'mhashemi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Digital VP', 'Digital Admin'],
    accessConfig: createMockAccess({
      'adnoc-hq': ['digital-it-data-and-cybersecurity', 'strategy-and-corporate-planning'],
      'adnoc-distribution': ['business-support', 'corporate-communications'],
      'adnoc-gas': [
        'finance',
        'human-capital',
        'audit-and-assurance',
        'integrated-risk-management',
      ],
    }),
  }),
  createMockRow({
    id: '8',
    name: 'Omar Al-Mansoori',
    email: 'omansoori@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Digital Admin', 'Super Admin'],
    accessConfig: createFullAccessConfig(),
  }),
  createMockRow({
    id: '9',
    name: 'Fatima Al-Hamadi',
    email: 'fhamadi@adnoc.com',
    accountStatus: 'Deactivated',
    assignedRole: ['Opportunity Evaluator', 'Digital Admin'],
    accessConfig: createMockAccess({
      'adnoc-hq': ['retail-distribution', 'finance'],
      'adnoc-offshore': ['production'],
    }),
  }),
  createMockRow({
    id: '10',
    name: 'Saif Al-Jaberi',
    email: 'saljaberi@adnoc.com',
    accountStatus: 'Deactivated',
    assignedRole: ['Business Focal Point'],
    accessConfig: createMockAccess({
      'adnoc-onshore': ['gas-processing', 'refining'],
      'adnoc-drilling': ['trading', 'transportation-and-logistics'],
      'adnoc-gas': ['procurement-and-inventory', 'finance'],
    }),
  }),
]

const UserPermissionsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState<UserPermissionRow[]>(initialUserPermissionsData)

  const [isDomainsDrawerOpen, setIsDomainsDrawerOpen] = useState(false)
  const [selectedUserForDomains, setSelectedUserForDomains] = useState<UserPermissionRow | null>(
    null,
  )
  const [draftAccessConfig, setDraftAccessConfig] =
    useState<AccessConfig>(createEmptyAccessConfig())

  const handleAddNew = useCallback(() => {
    setRows((prev) => [
      {
        id: String(Date.now()),
        name: '',
        email: '',
        accountStatus: 'Deactivated',
        assignedRole: [],
        gcsAccess: '0',
        domainsAccess: '0',
        accessConfig: createEmptyAccessConfig(),
        isEditing: true,
      },
      ...prev,
    ])
  }, [])

  const handleView = useCallback((user: UserPermissionRow) => {
    console.log('view', user)
  }, [])

  const handleDeactivate = useCallback((user: UserPermissionRow) => {
    setRows((prev) =>
      prev.map((row) => (row.id === user.id ? { ...row, accountStatus: 'Deactivated' } : row)),
    )
  }, [])

  const handleRowChange = useCallback(
    (rowId: string, field: EditableField, value: string | string[]) => {
      setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
    },
    [],
  )

  const handleRowSelectUser = useCallback(
    (rowId: string, user: { name: string; email: string }) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                name: user.name,
                email: user.email,
              }
            : row,
        ),
      )
    },
    [],
  )

  const handleOpenDomainsDrawer = useCallback((user: UserPermissionRow) => {
    setSelectedUserForDomains(user)
    setDraftAccessConfig(cloneAccessConfig(user.accessConfig))
    setIsDomainsDrawerOpen(true)
  }, [])

  const handleCloseDomainsDrawer = useCallback(() => {
    setIsDomainsDrawerOpen(false)
    setSelectedUserForDomains(null)
    setDraftAccessConfig(createEmptyAccessConfig())
  }, [])

  const handleSaveDomains = useCallback(() => {
    if (!selectedUserForDomains) return

    const nextAccessConfig = cloneAccessConfig(draftAccessConfig)
    const counts = getAccessCounts(nextAccessConfig)

    setRows((prev) =>
      prev.map((row) =>
        row.id === selectedUserForDomains.id
          ? {
              ...row,
              accessConfig: nextAccessConfig,
              gcsAccess: counts.gcsAccess,
              domainsAccess: counts.domainsAccess,
            }
          : row,
      ),
    )

    handleCloseDomainsDrawer()
  }, [draftAccessConfig, handleCloseDomainsDrawer, selectedUserForDomains])

  const actions = useMemo<ToolbarAction[]>(
    () => [
      {
        id: 'add-new',
        label: 'Add new',
        icon: Plus,
        onClick: handleAddNew,
      },
      {
        id: 'bulk-action',
        label: 'Bulk action',
        icon: Layers,
        onClick: () => console.log('Bulk Action'),
      },
      {
        id: 'export',
        label: 'Export',
        icon: Download,
        onClick: () => console.log('Export'),
      },
    ],
    [handleAddNew],
  )

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar
        title="Manage user roles and configure access rights per group company and its domains."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={actions}
      />

      <UserPermissionsTable
        data={rows}
        searchValue={searchValue}
        onView={handleView}
        onDeactivate={handleDeactivate}
        onRowChange={handleRowChange}
        onRowSelectUser={handleRowSelectUser}
        onOpenDomainsDrawer={handleOpenDomainsDrawer}
      />

      <UserDomainsDrawer
        open={isDomainsDrawerOpen}
        user={selectedUserForDomains}
        draftAccessConfig={draftAccessConfig}
        onOpenChange={setIsDomainsDrawerOpen}
        onChange={setDraftAccessConfig}
        onSave={handleSaveDomains}
      />
    </div>
  )
}

export default UserPermissionsPage

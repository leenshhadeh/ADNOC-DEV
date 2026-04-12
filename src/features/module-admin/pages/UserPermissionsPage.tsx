import { useCallback, useMemo, useState } from 'react'
import { Download, Layers, Plus, Save, X } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import UserPermissionsTable from '../components/user-permissions/UserPermessionsTable'
import UserDomainsDrawer from '../components/user-permissions/UserDomainsDrawer'
import { domains, groupCompanies } from '../components/user-permissions/constants'

import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import type {
  AccessConfig,
  AccessConfigItem,
  EditableField,
  UserPermissionRow,
} from '../components/user-permissions/types'
import {
  cloneAccessConfig,
  createEmptyAccessConfig,
  createFullAccessConfig,
  getAccessCounts,
} from '../components/user-permissions/utils'

const getGroupCompanyByName = (name: string) => {
  const groupCompany = groupCompanies.find((item) => item.name === name)

  if (!groupCompany) {
    throw new Error(`Unknown group company: ${name}`)
  }

  return groupCompany
}

const getDomainsByCodes = (codes: string[]) =>
  codes.map((code) => {
    const domain = domains.find((item) => item.code === code)

    if (!domain) {
      throw new Error(`Unknown domain code: ${code}`)
    }

    return domain
  })

const createMockAccessItem = (
  groupCompanyName: string,
  domainCodes: string[],
): AccessConfigItem => ({
  groupCompany: {
    ...getGroupCompanyByName(groupCompanyName),
    applicableDomains: getDomainsByCodes(domainCodes),
  },
})

const createMockAccess = (...items: AccessConfigItem[]): AccessConfig => items

const createMockRow = (
  row: Omit<UserPermissionRow, 'gcsAccess' | 'domainsAccess' | 'assignedAccess'> & {
    assignedAccess?: AccessConfig
  },
): UserPermissionRow => {
  const assignedAccess = row.assignedAccess ?? createEmptyAccessConfig()
  const counts = getAccessCounts(assignedAccess)

  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    email: row.email,
    accountStatus: row.accountStatus,
    assignedRole: row.assignedRole,
    isEditing: row.isEditing,
    assignedAccess,
    gcsAccess: counts.gcsAccess,
    domainsAccess: counts.domainsAccess,
  }
}

const initialUserPermissionsData: UserPermissionRow[] = [
  createMockRow({
    id: '1',
    userId: 'u-1',
    name: 'Khalid Al-Nuaimi',
    email: 'knuaimi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Digital Focal Point', 'Digital Admin'],
    assignedAccess: createMockAccess(
      createMockAccessItem('ADNOC HQ', ['EXP', 'CAP', 'ENG', 'FIN']),
      createMockAccessItem('ADNOC Onshore', ['PRD', 'HR', 'AUD', 'BUS', 'IT']),
    ),
  }),
  createMockRow({
    id: '2',
    userId: 'u-2',
    name: 'Sarah Al-Mansoori',
    email: 'smansoori@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Super Admin'],
    assignedAccess: createFullAccessConfig(),
  }),
  createMockRow({
    id: '3',
    userId: 'u-3',
    name: 'Layla Al-Balushi',
    email: 'lbalushi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Opportunity Evaluator', 'Super Admin'],
    assignedAccess: createMockAccess(createMockAccessItem('ADNOC Onshore', ['FIN', 'GAS'])),
  }),
  createMockRow({
    id: '4',
    userId: 'u-4',
    name: 'Ahmed Al-Suwaidi',
    email: 'asuwaidi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Opportunity Manager'],
    assignedAccess: createMockAccess(
      createMockAccessItem('ADNOC HQ', ['EXP', 'FIN']),
      createMockAccessItem('ADNOC Onshore', ['PRD', 'RET']),
      createMockAccessItem('ADNOC Offshore', ['LOG']),
    ),
  }),
  createMockRow({
    id: '5',
    userId: 'u-5',
    name: 'Fatima Al-Mazrouei',
    email: 'fmazrouei@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Opportunity Evaluator'],
    assignedAccess: createMockAccess(
      createMockAccessItem('ADNOC Gas', ['FIN']),
      createMockAccessItem('ADNOC Refining', ['AUD']),
      createMockAccessItem('Borouge', ['IRM']),
      createMockAccessItem('ADNOC HQ', ['LGC']),
    ),
  }),
  createMockRow({
    id: '6',
    userId: 'u-6',
    name: 'Khalid Al-Suwaidi',
    email: 'ksuwaidi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['BPA Program Manager', 'Super Admin'],
    assignedAccess: createFullAccessConfig(),
  }),
  createMockRow({
    id: '7',
    userId: 'u-7',
    name: 'Mariam Al-Hashemi',
    email: 'mhashemi@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Digital VP', 'Digital Admin'],
    assignedAccess: createMockAccess(
      createMockAccessItem('ADNOC HQ', ['IT', 'SCP']),
      createMockAccessItem('ADNOC Distribution', ['BUS', 'COM']),
      createMockAccessItem('ADNOC Gas', ['FIN', 'HR', 'AUD', 'IRM']),
    ),
  }),
  createMockRow({
    id: '8',
    userId: 'u-8',
    name: 'Omar Al-Mansoori',
    email: 'omansoori@adnoc.com',
    accountStatus: 'Active',
    assignedRole: ['Digital Admin', 'Super Admin'],
    assignedAccess: createFullAccessConfig(),
  }),
  createMockRow({
    id: '9',
    userId: 'u-9',
    name: 'Fatima Al-Hamadi',
    email: 'fhamadi@adnoc.com',
    accountStatus: 'Deactivated',
    assignedRole: ['Opportunity Evaluator', 'Digital Admin'],
    assignedAccess: createMockAccess(
      createMockAccessItem('ADNOC HQ', ['RET', 'FIN']),
      createMockAccessItem('ADNOC Offshore', ['PRD']),
    ),
  }),
  createMockRow({
    id: '10',
    userId: 'u-10',
    name: 'Saif Al-Jaberi',
    email: 'saljaberi@adnoc.com',
    accountStatus: 'Deactivated',
    assignedRole: ['Business Focal Point'],
    assignedAccess: createMockAccess(
      createMockAccessItem('ADNOC Onshore', ['GAS', 'REF']),
      createMockAccessItem('ADNOC Drilling', ['TRD', 'LOG']),
      createMockAccessItem('ADNOC Gas', ['PIN', 'FIN']),
    ),
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

  const editingRow = useMemo(() => rows.find((row) => row.isEditing), [rows])

  const handleAddNew = useCallback(() => {
    if (editingRow) return

    setRows((prev) => [
      {
        id: String(Date.now()),
        userId: '',
        name: '',
        email: '',
        accountStatus: 'Deactivated',
        assignedRole: [],
        assignedAccess: createEmptyAccessConfig(),
        gcsAccess: 0,
        domainsAccess: 0,
        isEditing: true,
      },
      ...prev,
    ])
  }, [editingRow])

  const handleCancelNew = useCallback(() => {
    setRows((prev) => prev.filter((row) => !row.isEditing))
  }, [])

  const handleSaveNew = useCallback(() => {
    if (!editingRow) return

    const trimmedName = editingRow.name.trim()
    const trimmedEmail = editingRow.email.trim()

    if (!editingRow.userId || !trimmedName || !trimmedEmail) {
      console.error('User selection is required before saving')
      return
    }

    if (editingRow.assignedRole.length === 0) {
      console.error('At least one role is required before saving')
      return
    }

    const counts = getAccessCounts(editingRow.assignedAccess)

    setRows((prev) =>
      prev.map((row) =>
        row.id === editingRow.id
          ? {
              ...row,
              name: trimmedName,
              email: trimmedEmail,
              accountStatus: 'Active',
              gcsAccess: counts.gcsAccess,
              domainsAccess: counts.domainsAccess,
              isEditing: false,
            }
          : row,
      ),
    )
  }, [editingRow])

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
    (rowId: string, user: { id?: string; name: string; email: string }) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                userId: user.id ?? row.userId,
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
    setDraftAccessConfig(cloneAccessConfig(user.assignedAccess))
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
              assignedAccess: nextAccessConfig,
              gcsAccess: Number(counts.gcsAccess),
              domainsAccess: Number(counts.domainsAccess),
            }
          : row,
      ),
    )

    handleCloseDomainsDrawer()
  }, [draftAccessConfig, handleCloseDomainsDrawer, selectedUserForDomains])

  const actions = useMemo<ToolbarAction[]>(
    () =>
      editingRow
        ? [
            {
              id: 'save-new',
              label: 'Save',
              icon: Save,
              onClick: handleSaveNew,
            },
            {
              id: 'cancel-new',
              label: 'Cancel',
              icon: X,
              onClick: handleCancelNew,
            },
          ]
        : [
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
    [editingRow, handleAddNew, handleCancelNew, handleSaveNew],
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

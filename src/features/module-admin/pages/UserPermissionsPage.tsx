import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, Layers, Plus, Save, X } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import UserPermissionsTable from '../components/user-permissions/UserPermessionsTable'
import UserDomainsDrawer from '../components/user-permissions/UserDomainsDrawer'
import { domains, groupCompanies } from '../components/user-permissions/constants'
import { SuccessToast } from '@/shared/components/SuccessToast'
import UserStatusConfirmModal from '../components/user-permissions/UserStatusConfirmModal'

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
import UserPermissionsBulkEditModal from '../components/user-permissions/UserPermissionsBulkEditModal'

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

type UserPermissionsPageProps = {
  searchValue: string
  setToolbarActions: React.Dispatch<React.SetStateAction<ToolbarAction[]>>
}

const UserPermissionsPage = ({ searchValue, setToolbarActions }: UserPermissionsPageProps) => {
  const [rows, setRows] = useState<UserPermissionRow[]>(initialUserPermissionsData)

  const [isDomainsDrawerOpen, setIsDomainsDrawerOpen] = useState(false)
  const [selectedUserForDomains, setSelectedUserForDomains] = useState<UserPermissionRow | null>(
    null,
  )
  const [draftAccessConfig, setDraftAccessConfig] =
    useState<AccessConfig>(createEmptyAccessConfig())

  const [isBulkEditMode, setIsBulkEditMode] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isBulkAccessFlow, setIsBulkAccessFlow] = useState(false)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [pendingStatusUser, setPendingStatusUser] = useState<UserPermissionRow | null>(null)
  const [pendingStatusAction, setPendingStatusAction] = useState<'activate' | 'deactivate' | null>(
    null,
  )

  const showToast = useCallback((message: string) => {
    setToastOpen(false)
    setToastMessage(message)

    requestAnimationFrame(() => {
      setToastOpen(true)
    })
  }, [])

  const editingRow = useMemo(() => rows.find((row) => row.isEditing), [rows])

  const handleAddNew = useCallback(() => {
    if (editingRow || isBulkEditMode) return

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

    showToast('New user row added')
  }, [editingRow, isBulkEditMode, showToast])

  const handleCancelNew = useCallback(() => {
    setRows((prev) => prev.filter((row) => !row.isEditing))
    showToast('New user creation cancelled')
  }, [showToast])

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

    showToast('User permissions saved successfully')
  }, [editingRow, showToast])

  const handleSaveRolesOnBlur = useCallback(
    (rowId: string) => {
      const row = rows.find((item) => item.id === rowId)

      if (!row) return
      if (!row.isEditing) return

      const counts = getAccessCounts(row.assignedAccess)

      setRows((prev) =>
        prev.map((item) =>
          item.id === rowId
            ? {
                ...item,
                accountStatus:
                  item.userId && item.name.trim() && item.email.trim()
                    ? 'Active'
                    : item.accountStatus,
                gcsAccess: counts.gcsAccess,
                domainsAccess: counts.domainsAccess,
                isEditing: false,
              }
            : item,
        ),
      )

      showToast('Roles updated successfully')
    },
    [rows, showToast],
  )

  const handleView = useCallback((user: UserPermissionRow) => {
    // TODO: implement view user details
  }, [])

  const handleDeactivate = useCallback((user: UserPermissionRow) => {
    const nextAction = user.accountStatus === 'Active' ? 'deactivate' : 'activate'

    setPendingStatusUser(user)
    setPendingStatusAction(nextAction)
    setStatusModalOpen(true)
  }, [])
  const handleConfirmStatusChange = useCallback(() => {
    if (!pendingStatusUser || !pendingStatusAction) return

    setRows((prev) =>
      prev.map((row) =>
        row.id === pendingStatusUser.id
          ? {
              ...row,
              accountStatus: pendingStatusAction === 'activate' ? 'Active' : 'Deactivated',
            }
          : row,
      ),
    )

    showToast(
      pendingStatusAction === 'activate'
        ? 'User activated successfully'
        : 'User deactivated successfully',
    )

    setStatusModalOpen(false)
    setPendingStatusUser(null)
    setPendingStatusAction(null)
  }, [pendingStatusAction, pendingStatusUser, showToast])

  const handleCloseStatusModal = useCallback(() => {
    setStatusModalOpen(false)
    setPendingStatusUser(null)
    setPendingStatusAction(null)
  }, [])

  const handleRowChange = useCallback(
    (rowId: string, field: EditableField, value: string | string[]) => {
      setRows((prev) => {
        const currentRow = prev.find((row) => row.id === rowId)

        if (field === 'assignedRole' && currentRow) {
          const previousRoles = currentRow.assignedRole ?? []
          const nextRoles = Array.isArray(value) ? value : []

          if (nextRoles.length > previousRoles.length) {
            showToast('Role added successfully')
          } else if (nextRoles.length < previousRoles.length) {
            showToast('Role removed successfully')
          }
        }

        return prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
      })
    },
    [showToast],
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
    setIsBulkAccessFlow(false)
  }, [])

  const handleCloseDomainsDrawer = useCallback(() => {
    setIsDomainsDrawerOpen(false)
    setSelectedUserForDomains(null)
    setDraftAccessConfig(createEmptyAccessConfig())
    setIsBulkAccessFlow(false)
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
    showToast('User access updated successfully')
  }, [draftAccessConfig, handleCloseDomainsDrawer, selectedUserForDomains, showToast])

  const handleStartBulkEdit = useCallback(() => {
    setIsBulkEditMode(true)
    setSelectedRowIds([])
    showToast('Bulk edit mode enabled')
  }, [showToast])

  const handleCancelBulkEdit = useCallback(() => {
    setIsBulkEditMode(false)
    setSelectedRowIds([])
    setIsBulkEditModalOpen(false)
    setIsBulkAccessFlow(false)
    showToast('Bulk edit cancelled')
  }, [showToast])

  const handleToggleRowSelection = useCallback((rowId: string, checked: boolean) => {
    setSelectedRowIds((prev) => {
      if (checked) {
        return prev.includes(rowId) ? prev : [...prev, rowId]
      }

      return prev.filter((id) => id !== rowId)
    })
  }, [])

  const handleOpenBulkModal = useCallback(() => {
    setIsBulkEditModalOpen(true)
  }, [])

  const handleApplyBulkRoles = useCallback(
    (roles: string[]) => {
      setRows((prev) =>
        prev.map((row) =>
          selectedRowIds.includes(row.id)
            ? {
                ...row,
                assignedRole: roles,
              }
            : row,
        ),
      )

      setIsBulkEditModalOpen(false)
      setIsBulkEditMode(false)
      setSelectedRowIds([])
      showToast('Roles applied to selected users')
    },
    [selectedRowIds, showToast],
  )

  const handleNextBulkAccess = useCallback(() => {
    setIsBulkEditModalOpen(false)
    setIsBulkAccessFlow(true)
    setSelectedUserForDomains(null)
    setDraftAccessConfig(createEmptyAccessConfig())
    setIsDomainsDrawerOpen(true)
  }, [])

  const handleSaveBulkDomains = useCallback(() => {
    const nextAccessConfig = cloneAccessConfig(draftAccessConfig)
    const counts = getAccessCounts(nextAccessConfig)

    setRows((prev) =>
      prev.map((row) =>
        selectedRowIds.includes(row.id)
          ? {
              ...row,
              assignedAccess: nextAccessConfig,
              gcsAccess: Number(counts.gcsAccess),
              domainsAccess: Number(counts.domainsAccess),
            }
          : row,
      ),
    )

    setIsDomainsDrawerOpen(false)
    setDraftAccessConfig(createEmptyAccessConfig())
    setIsBulkAccessFlow(false)
    setIsBulkEditMode(false)
    setSelectedRowIds([])
    showToast('Access applied to selected users')
  }, [draftAccessConfig, selectedRowIds, showToast])

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
        : isBulkEditMode
          ? [
              {
                id: 'edit',
                label: 'Edit',
                icon: Save,
                onClick: handleOpenBulkModal,
                disabled: selectedRowIds.length === 0,
              },
              {
                id: 'cancel-bulk',
                label: 'Cancel',
                icon: X,
                onClick: handleCancelBulkEdit,
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
                onClick: handleStartBulkEdit,
              },
              {
                id: 'export',
                label: 'Export',
                icon: Download,
                onClick: () => {
                  showToast('Export started successfully')
                },
              },
            ],
    [
      editingRow,
      handleAddNew,
      handleCancelBulkEdit,
      handleCancelNew,
      handleOpenBulkModal,
      handleSaveNew,
      handleStartBulkEdit,
      isBulkEditMode,
      selectedRowIds.length,
      showToast,
    ],
  )

  useEffect(() => {
    setToolbarActions(actions)
  }, [actions, setToolbarActions])

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar title="Manage user roles and configure access rights per group company and its domains." />

      <UserPermissionsTable
        data={rows}
        searchValue={searchValue}
        onView={handleView}
        onDeactivate={handleDeactivate}
        onRowChange={handleRowChange}
        onRowSelectUser={handleRowSelectUser}
        onOpenDomainsDrawer={handleOpenDomainsDrawer}
        isBulkEditMode={isBulkEditMode}
        selectedRowIds={selectedRowIds}
        onToggleRowSelection={handleToggleRowSelection}
        onRoleBlur={handleSaveRolesOnBlur}
      />

      <UserPermissionsBulkEditModal
        open={isBulkEditModalOpen}
        selectedCount={selectedRowIds.length}
        onClose={() => setIsBulkEditModalOpen(false)}
        onApplyRoles={handleApplyBulkRoles}
        onNextAccess={handleNextBulkAccess}
      />

      <UserDomainsDrawer
        open={isDomainsDrawerOpen}
        user={selectedUserForDomains}
        draftAccessConfig={draftAccessConfig}
        onOpenChange={(open) => {
          if (!open) {
            if (isBulkAccessFlow) {
              setIsDomainsDrawerOpen(false)
              setDraftAccessConfig(createEmptyAccessConfig())
              setIsBulkAccessFlow(false)
            } else {
              handleCloseDomainsDrawer()
            }
            return
          }

          setIsDomainsDrawerOpen(true)
        }}
        onChange={setDraftAccessConfig}
        onSave={isBulkAccessFlow ? handleSaveBulkDomains : handleSaveDomains}
        isBulkMode={isBulkAccessFlow}
        selectedUsersCount={selectedRowIds.length}
      />
      <UserStatusConfirmModal
        open={statusModalOpen}
        userName={pendingStatusUser?.name}
        actionType={pendingStatusAction}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusChange}
      />

      <SuccessToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        variant="success"
      />
    </div>
  )
}

export default UserPermissionsPage

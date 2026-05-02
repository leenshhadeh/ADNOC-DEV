import React, { useEffect, useRef, useState } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { ChevronDown, Eye, MoreHorizontal, Pencil, Plus, RotateCcw } from 'lucide-react'

import { EditLevel4sModal } from './modals/EditLevel4sModal'
import {
  useGetLevel4s,
  useGetLevel4Names,
} from '@features/module-process-catalog/hooks/useGetLevel4s'
import { saveLevel4s } from '@features/module-process-catalog/api/level4Service'
import { updateEntities } from '@features/module-process-catalog/api/processCatalogService'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { PermissionGuard } from '@/shared/components/PermissionGuard'
import { includeListFilterFn, firstCharFilterFn } from '@/shared/components/data-table/ColumnFilter'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { StatusBadgeCell, type CatalogStatus } from '@/shared/components/cells'
import type { ProcessItem, YesNo } from '@features/module-process-catalog/types'
import type { Domain, GroupCompany } from '@features/module-process-catalog/types'

// Augment TanStack Table meta so isBulkMode is type-safe.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    isBulkMode?: boolean
    isFullReport?: boolean
    onUpdateDraftRow?: (id: string, field: string, value: string) => void
    draftRowIds?: Set<string>
    firstDraftRowId?: string
    /** Maps rowId → array of field names that failed validation. */
    draftValidationErrors?: Record<string, string[]>
  }
}
// ─── DraftNameInput ──────────────────────────────────────────────────────────
const DraftNameInput = ({
  rowId,
  field,
  autoFocus,
  onUpdate,
  hasError,
}: {
  rowId: string
  field: 'level1Name' | 'level2Name' | 'level3Name'
  autoFocus: boolean
  onUpdate: (
    id: string,
    field: 'level1Name' | 'level2Name' | 'level3Name' | 'description',
    value: string,
  ) => void
  hasError?: boolean
}) => {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      // slight delay so the row is painted before focusing
      const t = setTimeout(() => ref.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder="Enter process name"
        onChange={(e) => {
          setValue(e.target.value)
          onUpdate(rowId, field, e.target.value)
        }}
        className={cn(
          'text-foreground placeholder:text-muted-foreground/60 focus:border-primary caret-primary w-full border-b bg-transparent text-sm outline-none',
          hasError ? 'border-red-500' : 'border-border',
        )}
      />
      {hasError && (
        <div className="group/err absolute top-0 right-0 inline-flex">
          <button
            type="button"
            aria-label="Validation error"
            className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none font-bold text-white"
          >
            !
          </button>
          <div className="bg-accent pointer-events-none absolute right-0 bottom-full z-50 mb-2 hidden w-[220px] rounded-xl px-4 py-3 text-sm leading-snug text-[#151718] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] group-hover/err:block">
            Process name is required. Please add a process name before submitting.
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DraftDescriptionInput ────────────────────────────────────────────────────
const DraftDescriptionInput = ({
  rowId,
  onUpdate,
  hasError,
}: {
  rowId: string
  onUpdate: (id: string, field: 'level3Name' | 'description', value: string) => void
  hasError?: boolean
}) => {
  const [value, setValue] = useState('')
  return (
    <div className="group/desc relative w-full">
      <Textarea
        rows={2}
        value={value}
        placeholder="Enter description"
        onChange={(e) => {
          setValue(e.target.value)
          onUpdate(rowId, 'description', e.target.value)
        }}
        className={cn(
          'text-foreground placeholder:text-muted-foreground/60 focus:border-primary caret-primary w-full resize-none border-b bg-transparent text-sm outline-none',
          hasError ? 'border-red-500' : 'border-border',
        )}
      />
      {hasError && (
        <div className="group/err absolute top-0 right-0 inline-flex">
          <button
            type="button"
            aria-label="Validation error"
            className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none font-bold text-white"
          >
            !
          </button>
          <div className="bg-accent pointer-events-none absolute right-0 bottom-full z-50 mb-2 hidden w-[220px] rounded-xl px-4 py-3 text-sm leading-snug text-[#151718] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] group-hover/err:block">
            Description is required. Please add a description before submitting.
          </div>
        </div>
      )}
    </div>
  )
}
// ─── Entity Site Cell ─────────────────────────────────────────────────────────

const EntitySiteCell = ({
  initialValue,
  entityName,
  siteName,
  parentCode,
  parentId,
  companyId,
}: {
  initialValue: YesNo
  entityName: string
  siteName: string
  parentCode: string
  /** The Level 3 row id — used to fetch scoped L4 records from the query cache. */
  parentId: string
  /** Group company ID used when calling updateEntities. */
  companyId: string
}) => {
  const [value, setValue] = useState<YesNo>(initialValue)
  const [editOpen, setEditOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Fetch L4s scoped to this L3 row — only runs when the modal is open
  const { data: level4s, isLoading: isLoadingL4s } = useGetLevel4s(editOpen ? parentId : undefined)
  const { data: previousL4Names } = useGetLevel4Names(editOpen ? parentId : undefined)

  const initialRows = level4s?.map((l4) => ({
    processName: l4.name,
    processDescription: l4.description,
  }))

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="text-foreground hover:bg-muted/60 focus-visible:ring-ring inline-flex h-7 min-w-[52px] items-center justify-between gap-1 rounded-md px-1.5 text-sm outline-none focus-visible:ring-2"
          >
            <span>{value}</span>
            <ChevronDown className="text-muted-foreground size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="w-24 overflow-hidden rounded-xl border p-0 shadow-md"
        >
          {(['Yes', 'No'] as const).map((opt) => (
            <DropdownMenuItem
              key={opt}
              onSelect={() => {
                setValue(opt)
                updateEntities({
                  updates: [
                    { processId: parentId, company: companyId, site: siteName, value: opt },
                  ],
                }).catch(() => {
                  // Silently revert on failure — the next server fetch will correct the value
                  setValue(value)
                })
              }}
              className={cn(
                'rounded-none px-3 py-2 text-sm font-normal',
                value === opt && 'bg-accent',
              )}
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {value === 'Yes' && (
        <>
          <button
            type="button"
            className="text-brand-blue text-xs font-medium whitespace-nowrap hover:underline"
            onClick={() => setEditOpen(true)}
          >
            Edit L4s
          </button>

          <EditLevel4sModal
            open={editOpen}
            onOpenChange={setEditOpen}
            parentLabel={`${entityName} - ${siteName}`}
            parentCode={parentCode}
            initialRows={initialRows}
            previousProcessNames={previousL4Names}
            isLoading={isLoadingL4s}
            onSave={async (rows) => {
              try {
                const result = await saveLevel4s(
                  parentId,
                  rows.map((r) => ({
                    processName: r.processName,
                    processDescription: r.processDescription,
                    status: r.status,
                  })),
                )
                setToastMsg(
                  `Level 4s saved — ${result.created} created, ${result.updated} updated, ${result.deleted} removed.`,
                )
              } catch {
                setToastMsg('Failed to save Level 4 changes.')
              }
            }}
          />

          <SuccessToast
            open={!!toastMsg}
            message={toastMsg ?? ''}
            onClose={() => setToastMsg(null)}
          />
        </>
      )}
    </div>
  )
}

// ─── Inline Row Actions (L1/L2 columns) ──────────────────────────────────────

type CatalogRowAction = {
  id: string
  label: string
  icon: React.ElementType
  onSelect: (item: ProcessItem) => void
}

const CellRowActions = ({ item, actions }: { item: ProcessItem; actions: CatalogRowAction[] }) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="text-muted-foreground ml-auto shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-100"
        aria-label="Row actions"
      >
        <MoreHorizontal className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      sideOffset={4}
      className="w-52 overflow-hidden rounded-2xl border p-0 shadow-lg"
    >
      {actions.map((a, i) => (
        <DropdownMenuItem
          key={a.id}
          onSelect={() => a.onSelect(item)}
          className={cn(
            'flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal transition-colors',
            'border-b border-transparent',
            'hover:border-brand-blue hover:border-b',
            i < actions.length - 1 && 'border-border border-b',
          )}
        >
          <a.icon className="text-muted-foreground size-4 shrink-0" />
          {a.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

// ─── Switch-to-Draft confirmation modal ──────────────────────────────────────

const SwitchToDraftConfirmModal = ({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) => {
  if (!open) return null
  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="bg-accent w-full max-w-sm rounded-2xl p-6 shadow-2xl">
        <h2 className="text-foreground text-lg font-semibold">Switch to Draft?</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          This will create a draft from the published version. The published version will remain
          unchanged until you save.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-full px-6"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="button" className="h-10 rounded-full px-6" onClick={onConfirm}>
            Switch to Draft
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Level 3 Row Actions (with icons + bold Draft) ────────────────────────────

function Level3RowActions({
  item,
  onViewRecordedChanges,
  onSwitchToDraft,
  onAddL4s,
  // onEditL4s,
  onRename,
}: {
  item: ProcessItem
  onViewRecordedChanges: (item: ProcessItem) => void
  onSwitchToDraft: (item: ProcessItem) => void
  onAddL4s: (item: ProcessItem) => void
  // onEditL4s?: (item: ProcessItem) => void
  onRename: (item: ProcessItem) => void
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground ml-auto shrink-0 opacity-0 transition-opacity group-hover/cell:opacity-100"
            aria-label="Row actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="w-56 overflow-hidden rounded-2xl border p-0 shadow-lg"
        >
          <DropdownMenuItem
            onSelect={() => onViewRecordedChanges(item)}
            className="border-border hover:border-brand-blue flex items-center gap-3 rounded-none border-b px-4 py-2.5 text-sm font-normal transition-colors"
          >
            <Eye className="text-muted-foreground size-4 shrink-0" />
            View recorded changes
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setConfirmOpen(true)}
            className="border-border hover:border-brand-blue flex items-center gap-3 rounded-none border-b px-4 py-2.5 text-sm font-normal transition-colors"
          >
            <RotateCcw className="text-muted-foreground size-4 shrink-0" />
            <span>
              Switch to <strong className="font-semibold">Draft</strong> version
            </span>
          </DropdownMenuItem>
          <PermissionGuard action="ADD_LEVEL_4">
            <DropdownMenuItem
              onSelect={() => onAddL4s(item)}
              className="border-border hover:border-brand-blue flex items-center gap-3 rounded-none border-b px-4 py-2.5 text-sm font-normal transition-colors"
            >
              <Plus className="text-muted-foreground size-4 shrink-0" />
              Add L4s
            </DropdownMenuItem>
          </PermissionGuard>
          {/* {onEditL4s && (
            <DropdownMenuItem
              onSelect={() => onEditL4s(item)}
              className="flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal"
            >
              <Pencil className="text-muted-foreground size-4 shrink-0" />
              Edit L4s
            </DropdownMenuItem>
          )} */}
          <PermissionGuard action="RENAME_PROCESS">
            <DropdownMenuItem
              onSelect={() => onRename(item)}
              className="flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal"
            >
              <Pencil className="text-muted-foreground size-4 shrink-0" />
              Rename
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
      <SwitchToDraftConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onSwitchToDraft(item)
          setConfirmOpen(false)
        }}
      />
    </>
  )
}

// ─── Entity matrix column group builder ──────────────────────────────────────

function buildEntityColumns(groupCompanies: GroupCompany[]): ColumnDef<ProcessItem, unknown>[] {
  return groupCompanies.map((entity) => ({
    id: `entity__${entity.id}`,
    header: entity.name,
    meta: { isEntityGroup: true },
    columns: entity.sites.map((site) => ({
      id: `entity__${entity.id}__${site.id}`,
      header: site.name,
      size: 200,
      enableSorting: false,
      cell: (info: CellContext<ProcessItem, unknown>) => {
        const row = info.row.original
        const siteValue = (row.entities[entity.id]?.[site.name] ?? 'No') as YesNo
        // Use the row's level3Code as the parent code for Level 4 generation.
        // E.g. level3Code "EXP.1.1.1" → new L4 rows get "EXP.1.1.1.1", "EXP.1.1.1.2", …
        return (
          <EntitySiteCell
            initialValue={siteValue}
            entityName={entity.name}
            siteName={site.name}
            parentCode={row.level3Code}
            parentId={row.id}
            companyId={entity.id}
          />
        )
      },
    })),
  }))
}

// ─── Public exports ───────────────────────────────────────────────────────────

// ─── Read-only entity column builder (full report) ───────────────────────────
// In full-report mode the entity matrix is read-only plain text cells with an
// extra "Shared Service process?" sub-column under each group company.

const ReadOnlyEntityCell = ({ value }: { value: string }) => (
  <span className={cn('text-sm', value === 'Yes' ? 'text-foreground' : 'text-muted-foreground')}>
    {value}
  </span>
)

function buildFullReportEntityColumns(
  groupCompanies: GroupCompany[],
): ColumnDef<ProcessItem, unknown>[] {
  return groupCompanies.map((entity) => ({
    id: `entity__${entity.id}`,
    header: entity.name,
    meta: { isEntityGroup: true },
    columns: [
      // "Shared Service process?" sub-column
      {
        id: `entity__${entity.id}__sharedService`,
        header: 'Shared Service process?',
        size: 200,
        enableSorting: false,
        cell: (info: CellContext<ProcessItem, unknown>) => (
          <ReadOnlyEntityCell value={info.row.original.isSharedService ? 'Yes' : 'No'} />
        ),
      } satisfies ColumnDef<ProcessItem, unknown>,
      // Site sub-columns
      ...entity.sites.map(
        (site): ColumnDef<ProcessItem, unknown> => ({
          id: `entity__${entity.id}__${site.id}`,
          header: site.name,
          size: 200,
          enableSorting: false,
          cell: (info: CellContext<ProcessItem, unknown>) => {
            const val = (info.row.original.entities[entity.id]?.[site.name] ?? 'No') as string
            return <ReadOnlyEntityCell value={val} />
          },
        }),
      ),
    ],
  }))
}

export type CatalogColumnActions = {
  /** Opens modal to add L1 draft rows — triggered from Domain column context menu */
  onAddL1: (item: ProcessItem) => void
  /** Opens modal to add L2 draft rows — triggered from Level 1 column context menu */
  onAddL2: (item: ProcessItem) => void
  /** Opens 'Add L3 processes' modal from L2 column context menu */
  onAddL3: (item: ProcessItem) => void
  onRename: (item: ProcessItem) => void
  // ── L3 column context menu ──
  onViewRecordedChanges: (item: ProcessItem) => void
  onSwitchToDraft: (item: ProcessItem) => void
  onAddL4s: (item: ProcessItem) => void
  /** Opens EditLevel4sModal (Entry B) — optional, shown only when provided */
  onEditL4s?: (item: ProcessItem) => void
}

/** Column IDs to pin to the left — pass directly to DataTable's initialColumnPinning. */
export const CATALOG_PINNED_LEFT = ['domain', 'level1', 'level2', 'level3'] as const

// ─── Full-report L4 cell components ──────────────────────────────────────────
// Each cell fetches its own L4 rows from the query cache (populated earlier
// by EntitySiteCell). This avoids a top-level N+1 fetch loop — TanStack Query
// deduplicates & caches by parentId automatically.

const Level4Cell = ({ parentId }: { parentId: string }) => {
  const { data: l4s, isLoading } = useGetLevel4s(parentId)
  if (isLoading) return <span className="text-muted-foreground text-xs">…</span>
  if (!l4s || l4s.length === 0)
    return <em className="text-muted-foreground text-sm">No Level 4 processes</em>
  return (
    <div className="flex flex-col gap-1">
      {l4s.map((l4) => (
        <div key={l4.id} className="flex flex-col gap-0.5">
          <span className="text-foreground text-base leading-tight font-light">{l4.name}</span>
          <span className="text-muted-foreground text-sm font-light">{l4.processCode}</span>
        </div>
      ))}
    </div>
  )
}

const Level4DescriptionCell = ({ parentId }: { parentId: string }) => {
  const { data: l4s, isLoading } = useGetLevel4s(parentId)
  if (isLoading) return <span className="text-muted-foreground text-xs">…</span>
  if (!l4s || l4s.length === 0) return <span className="text-muted-foreground text-sm">-</span>
  return (
    <div className="flex flex-col gap-1">
      {l4s.map((l4) => (
        <span key={l4.id} className="text-muted-foreground line-clamp-2 text-sm whitespace-normal">
          {l4.description}
        </span>
      ))}
    </div>
  )
}

/**
 * Returns the two extra columns (Level 4 + Level 4 Description) to append
 * when the full-report view is active.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function buildFullReportColumns(): ColumnDef<ProcessItem, unknown>[] {
  const level4Col: ColumnDef<ProcessItem, unknown> = {
    id: 'level4',
    header: 'Level 4',
    size: 260,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => (
      <Level4Cell parentId={info.row.original.id} />
    ),
  }

  const level4DescCol: ColumnDef<ProcessItem, unknown> = {
    id: 'level4Description',
    header: 'Level 4 Description',
    size: 340,
    enableSorting: false,
    cell: (info: CellContext<ProcessItem, unknown>) => (
      <Level4DescriptionCell parentId={info.row.original.id} />
    ),
  }

  return [wrap(level4Col), wrap(level4DescCol)]
}

/**
 * Wraps a leaf column in a single-column group so it participates in the
 * two-tier header symmetrically with entity groups. The group header (depth 0)
 * renders empty; the leaf header (depth 1) renders the column name + sort icon.
 * isDivider meta is propagated from the leaf to the wrapper group.
 */
function wrap<T>(leaf: ColumnDef<T, unknown>): ColumnDef<T, unknown> {
  const leafMeta = (leaf as { meta?: Record<string, unknown> }).meta ?? {}
  const groupId = `grp__${(leaf as { id?: string; accessorKey?: string }).id ?? (leaf as { accessorKey?: string }).accessorKey}`
  return {
    id: groupId,
    header: '',
    meta: { isDivider: leafMeta.isDivider },
    columns: [leaf],
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function buildCatalogColumns(
  rowActions?: CatalogColumnActions,
  groupCompanies: GroupCompany[] = [],
  fullReport = false,
  domains: Domain[] = [],
): ColumnDef<ProcessItem, unknown>[] {
  // Actions for the Domain column context menu
  const domainActions: CatalogRowAction[] = rowActions
    ? [
        { id: 'add-l1', label: 'Add L1 processes', icon: Plus, onSelect: rowActions.onAddL1 },
        { id: 'rename', label: 'Rename', icon: Pencil, onSelect: rowActions.onRename },
      ]
    : []

  // Actions for the Level 1 column context menu
  const l1Actions: CatalogRowAction[] = rowActions
    ? [
        { id: 'add-l2', label: 'Add L2 processes', icon: Plus, onSelect: rowActions.onAddL2 },
        { id: 'rename', label: 'Rename', icon: Pencil, onSelect: rowActions.onRename },
      ]
    : []

  // Actions for the Level 2 column context menu
  const l2Actions: CatalogRowAction[] = rowActions
    ? [
        { id: 'add-l3', label: 'Add L3 processes', icon: Plus, onSelect: rowActions.onAddL3 },
        { id: 'rename', label: 'Rename', icon: Pencil, onSelect: rowActions.onRename },
      ]
    : []

  // ── Flat leaf column defs ──────────────────────────────────────────────────
  const domainCol: ColumnDef<ProcessItem, unknown> = {
    id: 'domain',
    accessorKey: 'domain',
    header: 'Domain',
    size: 180,
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: includeListFilterFn,
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const rows = info.table.getRowModel().rows
      const prev = info.row.index > 0 ? rows[info.row.index - 1] : null
      if (prev?.original.domain === info.row.original.domain) return null
      const isFullReport = info.table.options.meta?.isFullReport ?? false
      const domainName =
        domains.find((d) => d.id === info.row.original.domain)?.name ?? info.row.original.domain
      return (
        <div className="flex w-full min-w-0 items-center gap-1">
          <span className="text-foreground flex-1 truncate text-sm font-medium">{domainName}</span>
          {domainActions.length > 0 && !isFullReport && (
            <CellRowActions item={info.row.original} actions={domainActions} />
          )}
        </div>
      )
    },
  }

  const level1Col: ColumnDef<ProcessItem, unknown> = {
    id: 'level1',
    accessorFn: (row) => row.level1Name,
    header: 'Level 1',
    size: 200,
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: includeListFilterFn,
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const rows = info.table.getRowModel().rows
      const prev = info.row.index > 0 ? rows[info.row.index - 1] : null
      if (
        prev?.original.domain === info.row.original.domain &&
        prev?.original.level1Code === info.row.original.level1Code
      )
        return null

      const isDraftL1 = info.row.original.level3Status === 'Draft' && !info.row.original.level1Name
      const isFirstDraft = info.table.options.meta?.firstDraftRowId === info.row.original.id
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const isFullReport = info.table.options.meta?.isFullReport ?? false

      if (isDraftL1 && onUpdate) {
        return (
          <div className="flex w-full min-w-0 flex-col gap-0.5">
            <DraftNameInput
              rowId={info.row.original.id}
              field="level1Name"
              autoFocus={!!isFirstDraft}
              onUpdate={onUpdate}
            />
            <span className="text-muted-foreground text-xs">{info.row.original.level1Code}</span>
          </div>
        )
      }

      return (
        <div className="flex w-full min-w-0 items-center gap-1">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-foreground truncate text-sm leading-tight font-medium">
              {info.row.original.level1Name}
            </span>
            <span className="text-muted-foreground text-xs">{info.row.original.level1Code}</span>
          </div>
          {l1Actions.length > 0 && !isFullReport && (
            <CellRowActions item={info.row.original} actions={l1Actions} />
          )}
        </div>
      )
    },
  }

  const level2Col: ColumnDef<ProcessItem, unknown> = {
    id: 'level2',
    accessorFn: (row) => row.level2Name,
    header: 'Level 2',
    size: 200,
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: includeListFilterFn,
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const rows = info.table.getRowModel().rows
      const prev = info.row.index > 0 ? rows[info.row.index - 1] : null
      if (
        prev?.original.level1Code === info.row.original.level1Code &&
        prev?.original.level2Code === info.row.original.level2Code
      )
        return null

      const isDraftL2 = info.row.original.level3Status === 'Draft' && !info.row.original.level2Name
      const isFirstDraft = info.table.options.meta?.firstDraftRowId === info.row.original.id
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const isFullReport = info.table.options.meta?.isFullReport ?? false

      if (isDraftL2 && onUpdate) {
        return (
          <div className="flex w-full min-w-0 flex-col gap-0.5">
            <DraftNameInput
              rowId={info.row.original.id}
              field="level2Name"
              autoFocus={!!isFirstDraft && !!info.row.original.level1Name}
              onUpdate={onUpdate}
            />
            <span className="text-muted-foreground text-xs">{info.row.original.level2Code}</span>
          </div>
        )
      }

      return (
        <div className="flex w-full min-w-0 items-center gap-1">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-foreground truncate text-sm leading-tight font-medium">
              {info.row.original.level2Name}
            </span>
            <span className="text-muted-foreground text-xs">{info.row.original.level2Code}</span>
          </div>
          {l2Actions.length > 0 && !isFullReport && (
            <CellRowActions item={info.row.original} actions={l2Actions} />
          )}
        </div>
      )
    },
  }

  const level3Col: ColumnDef<ProcessItem, unknown> = {
    id: 'level3',
    accessorFn: (row) => row.level3Name,
    header: 'Level 3',
    size: 240,
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: firstCharFilterFn,
    meta: { filterByFirstChar: true },
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const isBulkMode = info.table.options.meta?.isBulkMode ?? false
      const isFullReport = info.table.options.meta?.isFullReport ?? false
      const isSelected = info.row.getIsSelected()
      const isDraft = info.row.original.level3Status === 'Draft'
      const isFirstDraft = info.table.options.meta?.firstDraftRowId === info.row.original.id
      const onUpdate = info.table.options.meta?.onUpdateDraftRow

      if (isDraft && onUpdate) {
        const errors = info.table.options.meta?.draftValidationErrors?.[info.row.original.id] ?? []
        const hasNameError = errors.includes('level3Name')
        return (
          <div className="flex w-full items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <DraftNameInput
                rowId={info.row.original.id}
                field="level3Name"
                autoFocus={!!isFirstDraft && !!info.row.original.level2Name}
                onUpdate={onUpdate}
                hasError={hasNameError}
              />
              <span className="text-muted-foreground text-xs">{info.row.original.level3Code}</span>
            </div>
            {rowActions && !isBulkMode && !isFullReport && (
              <Level3RowActions
                item={info.row.original}
                onViewRecordedChanges={rowActions.onViewRecordedChanges}
                onSwitchToDraft={rowActions.onSwitchToDraft}
                onAddL4s={rowActions.onAddL4s}
                onEditL4s={rowActions.onEditL4s}
                onRename={rowActions.onRename}
              />
            )}
          </div>
        )
      }

      return (
        <div className="flex w-full items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span
              className={cn(
                'text-foreground truncate leading-tight',
                isFullReport ? 'text-base font-light' : 'text-sm font-medium',
              )}
            >
              {info.row.original.level3Name}
            </span>
            <span className="text-muted-foreground text-sm font-light">
              {info.row.original.level3Code}
            </span>
          </div>
          {rowActions && !isBulkMode && !isFullReport && (
            <Level3RowActions
              item={info.row.original}
              onViewRecordedChanges={rowActions.onViewRecordedChanges}
              onSwitchToDraft={rowActions.onSwitchToDraft}
              onAddL4s={rowActions.onAddL4s}
              onEditL4s={rowActions.onEditL4s}
              onRename={rowActions.onRename}
            />
          )}
          {isBulkMode && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => info.row.toggleSelected(!!checked)}
              aria-label={`Select ${info.row.original.level3Name}`}
              className="ms-auto shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )
    },
  }

  const level3StatusCol: ColumnDef<ProcessItem, unknown> = {
    id: 'level3Status',
    accessorKey: 'level3Status',
    header: 'Level 3 Status',
    size: 170,
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: includeListFilterFn,
    meta: { fixedFilterOptions: ['Published', 'Draft', 'Pending Approval'] },
    cell: (info: CellContext<ProcessItem, unknown>) => (
      <StatusBadgeCell status={info.getValue() as CatalogStatus} />
    ),
  }

  const descriptionCol: ColumnDef<ProcessItem, unknown> = {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    size: 480,
    enableSorting: false,
    // Last static column — renders a right border divider before entity columns.
    meta: { isDivider: true },
    cell: (info: CellContext<ProcessItem, unknown>) => {
      const isDraft = info.row.original.level3Status === 'Draft'
      const onUpdate = info.table.options.meta?.onUpdateDraftRow
      const isReport = info.table.options.meta?.isFullReport ?? false
      if (isDraft && onUpdate) {
        const errors = info.table.options.meta?.draftValidationErrors?.[info.row.original.id] ?? []
        const hasDescError = errors.includes('description')
        return (
          <DraftDescriptionInput
            rowId={info.row.original.id}
            onUpdate={onUpdate}
            hasError={hasDescError}
          />
        )
      }
      return (
        <span
          className={cn(
            'line-clamp-3 text-sm whitespace-normal',
            isReport ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {String(info.getValue())}
        </span>
      )
    },
  }

  return [
    wrap(domainCol),
    wrap(level1Col),
    wrap(level2Col),
    wrap(level3Col),
    wrap(level3StatusCol),
    wrap(descriptionCol),
    // L4 columns injected right after description in full-report mode
    ...(fullReport ? buildFullReportColumns() : []),
    // Full-report uses read-only entity columns with "Shared Service" sub-column;
    // default view uses interactive entity columns with dropdown + Edit L4s link.
    ...(fullReport
      ? buildFullReportEntityColumns(groupCompanies)
      : buildEntityColumns(groupCompanies)),
  ]
}

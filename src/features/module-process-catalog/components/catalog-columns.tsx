import React, { useEffect, useRef, useState } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { ChevronDown, Eye, MoreHorizontal, Pencil, Plus, RotateCcw } from 'lucide-react'

import { EditLevel4sModal } from './EditLevel4sModal'
import { useGetLevel4s } from '@features/module-process-catalog/hooks/useGetLevel4s'
import { PermissionGuard } from '@/shared/components/PermissionGuard'
import { includeListFilterFn, firstCharFilterFn } from '@/shared/components/data-table/ColumnFilter'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { StatusBadgeCell, type CatalogStatus } from '@/shared/components/cells'
import type { ProcessItem, YesNo } from '@features/module-process-catalog/types'
import type { GroupCompany } from '@features/module-process-catalog/types'

// Augment TanStack Table meta so isBulkMode is type-safe.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    isBulkMode?: boolean
    isFullReport?: boolean
    onUpdateDraftRow?: (
      id: string,
      field: 'level1Name' | 'level2Name' | 'level3Name' | 'description',
      value: string,
    ) => void
    draftRowIds?: Set<string>
    firstDraftRowId?: string
  }
}
// ─── DraftNameInput ──────────────────────────────────────────────────────────
const DraftNameInput = ({
  rowId,
  field,
  autoFocus,
  onUpdate,
}: {
  rowId: string
  field: 'level1Name' | 'level2Name' | 'level3Name'
  autoFocus: boolean
  onUpdate: (
    id: string,
    field: 'level1Name' | 'level2Name' | 'level3Name' | 'description',
    value: string,
  ) => void
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
    <input
      ref={ref}
      type="text"
      value={value}
      placeholder="Enter process name"
      onChange={(e) => {
        setValue(e.target.value)
        onUpdate(rowId, field, e.target.value)
      }}
      className="text-foreground placeholder:text-muted-foreground/60 border-border focus:border-primary caret-primary w-full border-b bg-transparent text-sm outline-none"
    />
  )
}

// ─── DraftDescriptionInput ────────────────────────────────────────────────────
const DraftDescriptionInput = ({
  rowId,
  onUpdate,
}: {
  rowId: string
  onUpdate: (id: string, field: 'level3Name' | 'description', value: string) => void
}) => {
  const [value, setValue] = useState('')
  return (
    <textarea
      rows={2}
      value={value}
      placeholder="Enter description"
      onChange={(e) => {
        setValue(e.target.value)
        onUpdate(rowId, 'description', e.target.value)
      }}
      className="text-foreground placeholder:text-muted-foreground/60 border-border focus:border-primary caret-primary w-full resize-none border-b bg-transparent text-sm outline-none"
    />
  )
}
// ─── Entity Site Cell ─────────────────────────────────────────────────────────

const EntitySiteCell = ({
  initialValue,
  entityName,
  siteName,
  parentCode,
  parentId,
}: {
  initialValue: YesNo
  entityName: string
  siteName: string
  parentCode: string
  /** The Level 3 row id — used to fetch scoped L4 records from the query cache. */
  parentId: string
}) => {
  const [value, setValue] = useState<YesNo>(initialValue)
  const [editOpen, setEditOpen] = useState(false)

  // Fetch L4s scoped to this L3 row — only runs when the modal is open
  const { data: level4s, isLoading: isLoadingL4s } = useGetLevel4s(editOpen ? parentId : undefined)

  const initialRows = level4s?.map((l4) => ({
    processCode: l4.processCode,
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
              onSelect={() => setValue(opt)}
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
            className="text-xs font-medium whitespace-nowrap text-[#0047BA] hover:underline"
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
            isLoading={isLoadingL4s}
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
            'hover:border-b hover:border-[#0047ba]',
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

// ─── Level 3 Row Actions (with icons + bold Draft) ────────────────────────────

const Level3RowActions = ({
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
}) => (
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
        className="border-border flex items-center gap-3 rounded-none border-b px-4 py-2.5 text-sm font-normal transition-colors hover:border-[#0047ba]"
      >
        <Eye className="text-muted-foreground size-4 shrink-0" />
        View recorded changes
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => onSwitchToDraft(item)}
        className="border-border flex items-center gap-3 rounded-none border-b px-4 py-2.5 text-sm font-normal transition-colors hover:border-[#0047ba]"
      >
        <RotateCcw className="text-muted-foreground size-4 shrink-0" />
        <span>
          Switch to <strong className="font-semibold">Draft</strong> version
        </span>
      </DropdownMenuItem>
      <PermissionGuard action="ADD_LEVEL_4">
        <DropdownMenuItem
          onSelect={() => onAddL4s(item)}
          className="border-border flex items-center gap-3 rounded-none border-b px-4 py-2.5 text-sm font-normal transition-colors hover:border-[#0047ba]"
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
)

// ─── Entity matrix column group builder ──────────────────────────────────────

function buildEntityColumns(groupCompanies: GroupCompany[]): ColumnDef<ProcessItem, unknown>[] {
  return groupCompanies.map((entity) => ({
    id: `entity__${entity.name}`,
    header: entity.name,
    meta: { isEntityGroup: true },
    columns: entity.sites.map((site) => ({
      id: `entity__${entity.name}__${site}`,
      header: site,
      size: 200,
      enableSorting: false,
      cell: (info: CellContext<ProcessItem, unknown>) => {
        const row = info.row.original
        const siteValue = (row.entities[entity.name]?.[site] ?? 'No') as YesNo
        // Use the row's level3Code as the parent code for Level 4 generation.
        // E.g. level3Code "EXP.1.1.1" → new L4 rows get "EXP.1.1.1.1", "EXP.1.1.1.2", …
        return (
          <EntitySiteCell
            initialValue={siteValue}
            entityName={entity.name}
            siteName={site}
            parentCode={row.level3Code}
            parentId={row.id}
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
    id: `entity__${entity.name}`,
    header: entity.name,
    meta: { isEntityGroup: true },
    columns: [
      // "Shared Service process?" sub-column
      {
        id: `entity__${entity.name}__sharedService`,
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
          id: `entity__${entity.name}__${site}`,
          header: site,
          size: 200,
          enableSorting: false,
          cell: (info: CellContext<ProcessItem, unknown>) => {
            const val = (info.row.original.entities[entity.name]?.[site] ?? 'No') as string
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

export function buildCatalogColumns(
  rowActions?: CatalogColumnActions,
  groupCompanies: GroupCompany[] = [],
  fullReport = false,
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
      return (
        <div className="flex w-full min-w-0 items-center gap-1">
          <span className="text-foreground flex-1 truncate text-sm font-medium">
            {info.row.original.domain}
          </span>
          {domainActions.length > 0 && (
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
          {l1Actions.length > 0 && <CellRowActions item={info.row.original} actions={l1Actions} />}
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
          {l2Actions.length > 0 && <CellRowActions item={info.row.original} actions={l2Actions} />}
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
        return (
          <div className="flex w-full items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <DraftNameInput
                rowId={info.row.original.id}
                field="level3Name"
                autoFocus={!!isFirstDraft && !!info.row.original.level2Name}
                onUpdate={onUpdate}
              />
              <span className="text-muted-foreground text-xs">{info.row.original.level3Code}</span>
            </div>
            {rowActions && !isBulkMode && (
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
          {rowActions && !isBulkMode && (
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
        return <DraftDescriptionInput rowId={info.row.original.id} onUpdate={onUpdate} />
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

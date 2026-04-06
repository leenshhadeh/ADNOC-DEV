import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Column } from '@tanstack/react-table'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Button } from '@/shared/components/ui/button'
import FilterIcon from '@/assets/icons/Shape.svg?react'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Column meta key used to supply a fixed list of filter options (e.g. Status). */
export interface ColumnFilterMeta {
  fixedFilterOptions?: string[]
  /** When true, options are unique first characters (A-Z, #) instead of full values. */
  filterByFirstChar?: boolean
}

/** Custom "include-list" filter function for TanStack Table. */
export function includeListFilterFn<TData>(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue || filterValue.length === 0) return true
  const cellValue = String(row.getValue(columnId) ?? '')
  return filterValue.includes(cellValue)
}

// TanStack auto-remove: treat empty array / undefined as "no filter"
includeListFilterFn.autoRemove = (val: unknown) => !val || (Array.isArray(val) && val.length === 0)

/** Filter function that matches on first character of the cell value. */
export function firstCharFilterFn<TData>(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue || filterValue.length === 0) return true
  const cellValue = String(row.getValue(columnId) ?? '').trim()
  if (!cellValue) return false
  const first = cellValue[0].toUpperCase()
  const bucket = /[A-Z]/.test(first) ? first : '#'
  return filterValue.includes(bucket)
}

firstCharFilterFn.autoRemove = (val: unknown) => !val || (Array.isArray(val) && val.length === 0)

// ── Component ─────────────────────────────────────────────────────────────────

interface ColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>
}

const ColumnFilter = <TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [pendingValues, setPendingValues] = useState<Set<string>>(new Set())
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Unique options — from fixed meta, first-char extraction, or faceted row values
  const meta = column.columnDef.meta as ColumnFilterMeta | undefined
  const isCharMode = !!meta?.filterByFirstChar

  // Resolve faceted values outside useMemo so React can track when the Map changes
  const facetedValues = column.getFacetedUniqueValues()

  const allOptions = useMemo<string[]>(() => {
    if (meta?.fixedFilterOptions) return meta.fixedFilterOptions

    const values = Array.from(facetedValues.keys())
      .map(String)
      .filter((v) => v.length > 0)

    if (isCharMode) {
      const chars = new Set<string>()
      values.forEach((v) => {
        const first = v.trim()[0]?.toUpperCase()
        if (first) chars.add(/[A-Z]/.test(first) ? first : '#')
      })
      return [...chars].sort((a, b) => a.localeCompare(b))
    }

    return [...new Set(values)].sort((a, b) => a.localeCompare(b))
  }, [facetedValues, meta, isCharMode])

  // Filtered by search
  const visibleOptions = useMemo(() => {
    if (!search) return allOptions
    const q = search.toLowerCase()
    return allOptions.filter((v) => v.toLowerCase().includes(q))
  }, [allOptions, search])

  // Active filter state from column
  const activeFilter = column.getFilterValue() as string[] | undefined
  const isActive = !!activeFilter && activeFilter.length > 0

  // Dynamically reposition the popover to stay anchored under the trigger
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const popover = popoverRef.current
    const popoverWidth = 256 // w-64 = 16rem = 256px

    let top = triggerRect.bottom + 4
    let left = triggerRect.left

    // Clamp to viewport edges
    if (left + popoverWidth > window.innerWidth - 8) {
      left = window.innerWidth - popoverWidth - 8
    }
    if (left < 8) left = 8

    const popoverHeight = popover.offsetHeight
    if (top + popoverHeight > window.innerHeight - 8) {
      // Flip above the trigger
      top = triggerRect.top - popoverHeight - 4
    }

    popover.style.top = `${top}px`
    popover.style.left = `${left}px`
  }, [])

  // Position on open + follow scroll / resize
  useEffect(() => {
    if (!open) return
    // Initial position after first paint
    requestAnimationFrame(updatePosition)

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  // Reset local state whenever popover opens
  useEffect(() => {
    if (open) {
      setSearch('')
      setPendingValues(new Set(activeFilter ?? allOptions))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Click-outside to close
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // ── Toggle helpers ────────────────────────────────────────────────────────
  const toggleOne = useCallback((value: string) => {
    setPendingValues((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }, [])

  const allSelected = visibleOptions.length > 0 && visibleOptions.every((v) => pendingValues.has(v))
  const someSelected = visibleOptions.some((v) => pendingValues.has(v)) && !allSelected

  const toggleAll = useCallback(() => {
    setPendingValues((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        visibleOptions.forEach((v) => next.delete(v))
      } else {
        visibleOptions.forEach((v) => next.add(v))
      }
      return next
    })
  }, [allSelected, visibleOptions])

  // ── Sort handlers ─────────────────────────────────────────────────────────
  const handleSort = useCallback(
    (dir: 'asc' | 'desc') => {
      column.toggleSorting(dir === 'desc')
      setSortDir(dir)
      setOpen(false)
    },
    [column],
  )

  // ── Apply / Clear ─────────────────────────────────────────────────────────
  const handleApply = useCallback(() => {
    // If everything is selected, clear the filter instead
    if (pendingValues.size >= allOptions.length) {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue(Array.from(pendingValues))
    }
    setOpen(false)
  }, [column, pendingValues, allOptions])

  const handleClear = useCallback(() => {
    column.setFilterValue(undefined)
    setOpen(false)
  }, [column])

  return (
    <>
      {/* Trigger icon */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Filter ${String(column.columnDef.header)}`}
        className={cn(
          'inline-flex items-center justify-center rounded p-0.5 transition-colors',
          isActive ? 'text-[#5B23FF]' : 'text-muted-foreground/70 hover:text-foreground',
        )}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        <FilterIcon className="size-3.5" />
      </button>

      {/* Popover — portaled to document.body so it escapes overflow containers */}
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className={cn(
              'bg-background border-border fixed z-[100] w-64 rounded-xl border shadow-xl',
              'animate-in fade-in-0 zoom-in-95',
            )}
          >
            {/* Sort options */}
            <div className="border-border border-b px-1 py-1">
              <button
                type="button"
                onClick={() => handleSort('asc')}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  sortDir === 'asc'
                    ? 'bg-accent text-foreground'
                    : 'text-foreground hover:bg-accent/60',
                )}
              >
                <ArrowDownNarrowWide className="size-4 opacity-70" />
                Sort A to Z
              </button>
              <button
                type="button"
                onClick={() => handleSort('desc')}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  sortDir === 'desc'
                    ? 'bg-accent text-foreground'
                    : 'text-foreground hover:bg-accent/60',
                )}
              >
                <ArrowUpNarrowWide className="size-4 opacity-70" />
                Sort Z to A
              </button>
            </div>

            {/* Filter label */}
            <div className="px-3 pt-3 pb-1.5">
              <span className="text-muted-foreground text-sm font-medium">Filter by:</span>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
              <div className="border-border bg-card flex items-center gap-2 rounded-lg border px-2.5">
                <Search className="text-muted-foreground size-3.5 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="text-foreground placeholder:text-muted-foreground/60 h-9 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-52 overflow-y-auto px-1 pb-1">
              {/* Select All */}
              <label className="hover:bg-accent/60 flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-1.5">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                />
                <span className="text-foreground text-sm font-medium">Select All</span>
              </label>

              {visibleOptions.map((option) => (
                <label
                  key={option}
                  className="hover:bg-accent/60 flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-1.5"
                >
                  <Checkbox
                    checked={pendingValues.has(option)}
                    onCheckedChange={() => toggleOne(option)}
                  />
                  <span className="text-foreground truncate text-sm">{option}</span>
                </label>
              ))}

              {visibleOptions.length === 0 && (
                <p className="text-muted-foreground px-3 py-2 text-center text-xs">No matches</p>
              )}
            </div>

            {/* Footer */}
            <div className="border-border grid grid-cols-2 gap-2 border-t px-3 py-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-9 rounded-full"
                onClick={handleClear}
              >
                Clear filter
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-full bg-[#5B23FF] text-white hover:bg-[#4A1DD6]"
                onClick={handleApply}
              >
                Apply filter
              </Button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export default ColumnFilter

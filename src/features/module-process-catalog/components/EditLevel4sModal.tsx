/**
 * EditLevel4sModal
 *
 * Allows users to add, edit, and delete Level 4 processes under a parent node.
 * Matches Figma design 6506-359505.
 *
 * Architecture (SRP):
 *   - Schema / types   → pure Zod definitions (catalog.schemas.ts)
 *   - StatusBadge       → read-only status display
 *   - Level4RowItem     → single-row presentation (cells + actions)
 *   - EditLevel4sModal  → form state + submit logic + layout
 */

import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Plus, Search, Trash2, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import {
  editLevel4sFormSchema,
  type EditLevel4sFormValues,
  type EditLevel4Row,
} from '@features/module-process-catalog/schemas/catalog.schemas'

type FormValues = EditLevel4sFormValues
type Level4Row = EditLevel4Row

// ── Props ─────────────────────────────────────────────────────────────────────

export interface EditLevel4sModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentLabel: string
  parentCode: string
  initialRows?: Level4Row[]
  /** Previously added process names under the same group company (shown as suggestions). */
  previousProcessNames?: string[]
  isLoading?: boolean
  onSave?: (rows: Level4Row[]) => void
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-[#DFEBFF]',
  Draft: 'bg-[#E0E0E0]',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-1.5 text-xs leading-[13px] font-normal text-[#151718]',
        STATUS_STYLES[status] ?? 'bg-[#E0E0E0]',
      )}
    >
      {status}
    </span>
  )
}

// ── Searchable suggestions dropdown ───────────────────────────────────────────

interface ProcessNameSuggestionsProps {
  suggestions: string[]
  onSelect: (name: string) => void
}

function ProcessNameSuggestions({ suggestions, onSelect }: ProcessNameSuggestionsProps) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-2xl border border-[#DFE3E6] bg-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]">
      {/* Search row */}
      <div className="flex items-center gap-2 border-b border-[#DFE3E6] bg-[#F1F3F5] px-3 py-2">
        <Search className="size-4 shrink-0 text-[#0047BA]" />
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 bg-transparent text-xs font-normal text-[#687076] outline-none placeholder:text-[#687076]"
        />
      </div>

      {/* Suggestion items */}
      <div className="max-h-[200px] overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((name, i) => (
            <button
              key={i}
              type="button"
              className="flex w-full items-center border-b border-[#DFE3E6]/50 px-3 py-2 text-left text-sm font-normal text-[#687076] transition-colors last:border-b-0 hover:bg-[#F1F3F5]"
              onMouseDown={(e) => {
                e.preventDefault()
                onSelect(name)
              }}
            >
              {name}
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-xs text-[#687076]">No matches</div>
        )}
      </div>
    </div>
  )
}

// ── Single-row sub-component ──────────────────────────────────────────────────

interface Level4RowProps {
  index: number
  processCode: string
  status: string
  nameError?: string
  register: ReturnType<typeof useForm<FormValues>>['register']
  previousProcessNames?: string[]
  onSelectSuggestion: (name: string) => void
  onRemove: () => void
}

function Level4RowItem({
  index,
  processCode,
  status,
  nameError,
  register,
  previousProcessNames,
  onSelectSuggestion,
  onRemove,
}: Level4RowProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasSuggestions = previousProcessNames && previousProcessNames.length > 0
  const { onBlur: rhfOnBlur, ...registerRest } = register(`rows.${index}.processName`)

  return (
    <div className="flex min-h-[56px] border-b border-[#DFE3E6] last:border-b-0">
      {/* Process Code */}
      <div className="flex w-[140px] shrink-0 items-center px-4 py-2">
        <span className="text-sm font-normal text-[#687076]">{processCode}</span>
      </div>

      {/* Process Name */}
      <div ref={containerRef} className="relative flex flex-1 items-center px-4 py-2">
        <input
          {...registerRest}
          placeholder="Start writing..."
          aria-label="Process name"
          onFocus={() => hasSuggestions && setShowSuggestions(true)}
          onBlur={(e) => {
            rhfOnBlur(e)
            // Keep dropdown open when focus moves within the suggestions container
            if (containerRef.current?.contains(e.relatedTarget as Node)) return
            setShowSuggestions(false)
          }}
          className={cn(
            'w-full bg-transparent text-sm font-normal text-[#151718] outline-none',
            'placeholder:font-light placeholder:text-[#687076]',
            nameError && 'text-[#EB3865]',
          )}
        />
        {showSuggestions && hasSuggestions && (
          <ProcessNameSuggestions
            suggestions={previousProcessNames}
            onSelect={(name) => {
              onSelectSuggestion(name)
              setShowSuggestions(false)
            }}
          />
        )}
      </div>

      {/* Process Description */}
      <div className="flex flex-1 items-center px-4 py-2">
        <input
          {...register(`rows.${index}.processDescription`)}
          placeholder="Start writing..."
          aria-label="Process description"
          className="w-full bg-transparent text-sm font-normal text-[#151718] outline-none placeholder:font-light placeholder:text-[#687076]"
        />
      </div>

      {/* Status */}
      <div className="flex w-[100px] shrink-0 items-center px-4 py-2">
        <StatusBadge status={status} />
      </div>

      {/* Actions */}
      <div className="flex w-[56px] shrink-0 items-center justify-center py-2">
        <button
          type="button"
          className="rounded-full p-1 text-[#EB3865] transition-colors hover:bg-[#DFE3E6]"
          aria-label="Delete row"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export const EditLevel4sModal = ({
  open,
  onOpenChange,
  parentLabel,
  parentCode,
  initialRows = [],
  previousProcessNames = [],
  isLoading = false,
  onSave,
}: EditLevel4sModalProps) => {
  const makeEmptyRow = (): Level4Row => ({
    processName: '',
    processDescription: '',
    status: 'Draft',
  })

  const defaultRows: Level4Row[] = initialRows.length > 0 ? initialRows : [makeEmptyRow()]

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editLevel4sFormSchema),
    defaultValues: { rows: defaultRows },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'rows' })

  useEffect(() => {
    if (open && !isLoading) {
      reset({
        rows: initialRows.length > 0 ? initialRows : [makeEmptyRow()],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isLoading, initialRows.length])

  const handleAddRow = () => {
    append(makeEmptyRow())
  }

  const handleSave = handleSubmit((data) => {
    onSave?.(data.rows)
    onOpenChange(false)
  })

  const handleCancel = () => {
    reset({ rows: defaultRows })
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col gap-8 rounded-2xl bg-[#F1F3F5] p-8 shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]">
        {/* ── Header block ── */}
        <div className="flex shrink-0 flex-col gap-[18px]">
          {/* Title row */}
          <div className="flex items-start gap-2">
            <h2 className="flex-1 text-2xl leading-8 font-medium text-[#151718]">
              Edit Level 4s under {parentLabel}
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={handleCancel}
              className="shrink-0 rounded-full p-1 text-[#687076] transition-colors hover:text-[#151718]"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Info notice */}
          <div className="flex items-center gap-1">
            <Info className="size-4 shrink-0 text-[#151718]" />
            <span className="text-sm font-normal text-[#151718]">
              Level 4 changes will be applied when Level 3 is submitted.
            </span>
          </div>
        </div>

        {/* ── Scrollable table card ── */}
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#DFE3E6] bg-white">
          <div className="flex h-full flex-col overflow-y-auto px-4 py-3">
            {isLoading ? (
              <div className="space-y-3 py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-[#DFE3E6]" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-[#DFE3E6]" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-[#DFE3E6]" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="flex min-h-[56px] border-b border-[#DFE3E6]">
                  <div className="flex w-[140px] shrink-0 items-center px-4 py-2">
                    <span className="text-xs font-normal text-[#687076] uppercase">
                      Process code
                    </span>
                  </div>
                  <div className="flex flex-1 items-center px-4 py-2">
                    <span className="text-xs font-normal text-[#687076] uppercase">
                      Process name
                    </span>
                  </div>
                  <div className="flex flex-1 items-center px-4 py-2">
                    <span className="text-xs font-normal text-[#687076] uppercase">
                      Process Description
                    </span>
                  </div>
                  <div className="flex w-[100px] shrink-0 items-center px-4 py-2">
                    <span className="text-xs font-normal text-[#687076] uppercase">Status</span>
                  </div>
                  <div className="w-[56px] shrink-0" />
                </div>

                {/* Data rows */}
                {fields.map((field, index) => (
                  <Level4RowItem
                    key={field.id}
                    index={index}
                    processCode={`${parentCode}.${index + 1}`}
                    status={field.status ?? 'Draft'}
                    nameError={errors.rows?.[index]?.processName?.message}
                    register={register}
                    previousProcessNames={previousProcessNames}
                    onSelectSuggestion={(name) =>
                      setValue(`rows.${index}.processName`, name, { shouldValidate: true })
                    }
                    onRemove={() => remove(index)}
                  />
                ))}

                {/* Add row trigger */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center gap-1 text-sm font-medium text-[#0047BA] hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    <Plus className="size-4" />
                    Add Level 4
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex shrink-0 justify-end gap-3">
          <button
            type="button"
            className="flex w-48 items-center justify-center rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-sm font-medium text-[#151718] shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex w-48 items-center justify-center rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

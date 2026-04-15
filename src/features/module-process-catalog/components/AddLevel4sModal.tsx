import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronRight, Info, Plus, Search, Trash2, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { useGetGroupCompanies } from '@features/module-process-catalog/hooks/useGetGroupCompanies'
import {
  addLevel4sFormSchema,
  type AddLevel4sFormValues,
  type AddLevel4Item,
} from '@features/module-process-catalog/schemas/catalog.schemas'
import type { GroupCompany, CompanySiteRef } from '@features/module-process-catalog/types'

export type { AddLevel4Item }

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AddLevel4sModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentItem: { level3Name: string; level3Code: string } | null
  previousProcessNames?: string[]
  onSave?: (companySites: CompanySiteRef[], items: AddLevel4Item[]) => void
}

type Step = 'select' | 'form'

// ── Helper: build a unique key for a company + site pair ──────────────────────

const compSiteKey = (companyId: string, siteId: string) => `${companyId}::${siteId}`

// ── Step 1: Company / Site multi-select ───────────────────────────────────────

interface SelectStepProps {
  groupCompanies: GroupCompany[]
  selected: Set<string>
  onToggle: (key: string) => void
}

const CompanySiteSelect = ({ groupCompanies, selected, onToggle }: SelectStepProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="border-border max-h-[260px] overflow-y-auto rounded-2xl border bg-white shadow-lg">
      {groupCompanies.map((gc) => {
        const isExpanded = expanded.has(gc.id)

        return (
          <div key={gc.id} className="border-border border-b last:border-0">
            {/* Company row — expand/collapse only */}
            <button
              type="button"
              onClick={() => toggleExpand(gc.id)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-[#ECEDEE]"
            >
              <span className="text-foreground flex-1 text-sm font-medium">{gc.name}</span>
              {gc.sites.length > 0 &&
                (isExpanded ? (
                  <ChevronDown className="text-muted-foreground size-4" />
                ) : (
                  <ChevronRight className="text-muted-foreground size-4" />
                ))}
            </button>

            {/* Sites */}
            {isExpanded &&
              gc.sites.map((site) => {
                const key = compSiteKey(gc.id, site.id)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onToggle(key)}
                    className={cn(
                      'flex w-full items-center gap-3 py-2 pr-3 pl-10 text-start transition-colors',
                      selected.has(key) ? 'bg-[#ECEDEE]' : 'hover:bg-[#F8F9FA]',
                    )}
                  >
                    <Checkbox checked={selected.has(key)} className="size-4" />
                    <span className="text-foreground text-sm">{site.name}</span>
                  </button>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}

// ── Selected tags display ─────────────────────────────────────────────────────

const SelectedTags = ({
  items,
  onRemove,
}: {
  items: { key: string; label: string }[]
  onRemove: (key: string) => void
}) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map(({ key, label }) => (
      <span
        key={key}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#2F68D9]/50 bg-[#DCE5F9] px-3 py-1 text-xs"
      >
        <span className="text-foreground max-w-[200px] truncate">{label}</span>
        <button
          type="button"
          onClick={() => onRemove(key)}
          className="text-foreground/70 hover:text-foreground transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="size-3" />
        </button>
      </span>
    ))}
  </div>
)

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

interface AddLevel4RowProps {
  index: number
  processCode: string
  nameError?: string
  register: ReturnType<typeof useForm<AddLevel4sFormValues>>['register']
  previousProcessNames?: string[]
  onSelectSuggestion: (name: string) => void
  onRemove: () => void
}

function AddLevel4RowItem({
  index,
  processCode,
  nameError,
  register,
  previousProcessNames,
  onSelectSuggestion,
  onRemove,
}: AddLevel4RowProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasSuggestions = previousProcessNames && previousProcessNames.length > 0
  const { onBlur: rhfOnBlur, ...registerRest } = register(`items.${index}.processName`)

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
          {...register(`items.${index}.processDescription`)}
          placeholder="Start writing..."
          aria-label="Process description"
          className="w-full bg-transparent text-sm font-normal text-[#151718] outline-none placeholder:font-light placeholder:text-[#687076]"
        />
      </div>

      {/* Status */}
      <div className="flex w-[100px] shrink-0 items-center px-4 py-2">
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full px-1.5 text-xs leading-[13px] font-normal text-[#151718]',
            'bg-[#E0E0E0]',
          )}
        >
          Draft
        </span>
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

// ── Step 2: editable L4 form (flex layout — matches EditLevel4sModal) ─────────

interface FormStepProps {
  parentCode: string
  register: ReturnType<typeof useForm<AddLevel4sFormValues>>['register']
  fields: { id: string }[]
  errors: ReturnType<typeof useForm<AddLevel4sFormValues>>['formState']['errors']
  previousProcessNames?: string[]
  onSelectSuggestion: (index: number, name: string) => void
  onRemove: (index: number) => void
  onAddRow: () => void
}

const Level4FormTable = ({
  parentCode,
  register,
  fields,
  errors,
  previousProcessNames,
  onSelectSuggestion,
  onRemove,
  onAddRow,
}: FormStepProps) => (
  <div className="flex min-h-0 flex-1 flex-col gap-3">
    {/* Info banner */}
    <div className="flex items-center gap-1">
      <Info className="size-4 shrink-0 text-[#151718]" />
      <span className="text-sm font-normal text-[#151718]">
        Level 4 changes will be applied when Level 3 is submitted.
      </span>
    </div>

    {/* Table card */}
    <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#DFE3E6] bg-white">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Header */}
        <div className="flex min-h-[56px] border-b border-[#DFE3E6]">
          <div className="flex w-[140px] shrink-0 items-center px-4 py-2">
            <span className="text-xs font-normal text-[#687076] uppercase">Process code</span>
          </div>
          <div className="flex flex-1 items-center px-4 py-2">
            <span className="text-xs font-normal text-[#687076] uppercase">Process name</span>
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
          <AddLevel4RowItem
            key={field.id}
            index={index}
            processCode={`${parentCode}.${index + 1}`}
            nameError={errors.items?.[index]?.processName?.message}
            register={register}
            previousProcessNames={previousProcessNames}
            onSelectSuggestion={(name) => onSelectSuggestion(index, name)}
            onRemove={() => onRemove(index)}
          />
        ))}

        {/* Add row trigger */}
        <div className="py-3">
          <button
            type="button"
            onClick={onAddRow}
            className="flex items-center gap-1 text-sm font-medium text-[#0047BA] hover:underline focus-visible:underline focus-visible:outline-none"
          >
            <Plus className="size-4" />
            Add Level 4
          </button>
        </div>
      </div>
    </div>
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────

const AddLevel4sModal = ({
  open,
  onOpenChange,
  parentItem,
  previousProcessNames = [],
  onSave,
}: AddLevel4sModalProps) => {
  const parentCode = parentItem?.level3Code ?? ''
  const { data: groupCompanies } = useGetGroupCompanies()

  // ── Multi-step state ──
  const [step, setStep] = useState<Step>('select')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ── Form (step 2) ──
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddLevel4sFormValues>({
    resolver: zodResolver(addLevel4sFormSchema),
    defaultValues: {
      groupCompany: '',
      companySites: [],
      items: [{ processName: '', processDescription: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  // Reset everything when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep('select')
      setSelected(new Set())
      setShowDropdown(false)
      reset({
        groupCompany: '',
        companySites: [],
        items: [{ processName: '', processDescription: '' }],
      })
    }
  }, [open, parentCode, reset])

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showDropdown])

  // ── Selection helpers ──
  const companies = useMemo(() => groupCompanies ?? [], [groupCompanies])

  const toggleSite = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])

  const removeSite = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }, [])

  // ── Computed summary ──
  const selectedKeys = useMemo(() => Array.from(selected), [selected])

  /** Build CompanySiteRef[] from the selected key set */
  const companySiteRefs = useMemo<CompanySiteRef[]>(
    () =>
      selectedKeys.map((key) => {
        const [groupCompanyId, siteId] = key.split('::')
        return { groupCompanyId, siteId }
      }),
    [selectedKeys],
  )

  /** Build display labels for tags from the key set */
  const selectedLabels = useMemo(() => {
    const lookup = new Map<string, string>()
    for (const gc of companies) {
      for (const site of gc.sites) {
        lookup.set(compSiteKey(gc.id, site.id), `${gc.name} - ${site.name}`)
      }
    }
    return selectedKeys.map((key) => ({ key, label: lookup.get(key) ?? key }))
  }, [selectedKeys, companies])

  const selectedSummary = useMemo(() => {
    const companySet = new Set<string>()
    companySiteRefs.forEach((ref) => companySet.add(ref.groupCompanyId))
    return { companies: companySet.size, sites: companySiteRefs.length }
  }, [companySiteRefs])

  // ── Navigation ──
  const handleNext = () => {
    if (selected.size === 0) return
    reset({
      groupCompany: companySiteRefs[0]?.groupCompanyId ?? '',
      companySites: companySiteRefs,
      items: [{ processName: '', processDescription: '' }],
    })
    setStep('form')
  }

  const handleBack = () => setStep('select')

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleAddRow = () => {
    append({
      processName: '',
      processDescription: '',
    })
  }

  const onSubmit = (data: AddLevel4sFormValues) => {
    onSave?.(data.companySites, data.items)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div
        className={cn(
          'flex flex-col rounded-2xl bg-[#F1F3F5] p-8 shadow-2xl',
          step === 'select' ? 'max-h-[90vh] w-full max-w-xl' : 'h-[90vh] w-full max-w-5xl',
        )}
      >
        {/* ── Header ── */}
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-foreground text-2xl font-medium">
              {step === 'select' ? 'Add Level 4' : 'Add Level 4s to selected companies & sites'}
            </h2>
            {step === 'select' ? (
              <p className="text-muted-foreground text-base">
                Please select the group company to which this process will apply.
              </p>
            ) : (
              <div className="text-muted-foreground flex items-center gap-2 text-base">
                <span>{selectedSummary.companies} Group Companies</span>
                <span>·</span>
                <span>{selectedSummary.sites} Sites selected</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Step 1: Select companies & sites ── */}
        {step === 'select' && (
          <div className="mt-8 flex min-h-0 flex-1 flex-col gap-3">
            <label className="text-muted-foreground text-base">Applicable to</label>

            {/* Selected tags + dropdown trigger */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown((p) => !p)}
                className={cn(
                  'border-border flex w-full items-center gap-2 rounded-2xl border bg-white px-4 py-3',
                  'text-start transition-colors',
                )}
              >
                <div className="flex min-h-[28px] flex-1 flex-wrap gap-1.5">
                  {selectedLabels.length === 0 ? (
                    <span className="text-muted-foreground text-base">
                      Select group companies & sites…
                    </span>
                  ) : (
                    <SelectedTags items={selectedLabels} onRemove={removeSite} />
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    'text-muted-foreground size-5 shrink-0 transition-transform',
                    showDropdown && 'rotate-180',
                  )}
                />
              </button>

              {showDropdown && (
                <div className="absolute top-full right-0 left-0 z-20 mt-1">
                  <CompanySiteSelect
                    groupCompanies={companies}
                    selected={selected}
                    onToggle={toggleSite}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto grid shrink-0 grid-cols-2 gap-3 pt-6">
              <Button
                type="button"
                variant="secondary"
                className="h-12 rounded-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-12 rounded-full"
                disabled={selected.size === 0}
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Add L4 rows table ── */}
        {step === 'form' && (
          <form
            id="add-l4-form"
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex min-h-0 flex-1 flex-col"
          >
            <Level4FormTable
              parentCode={parentCode}
              register={register}
              fields={fields}
              errors={errors}
              previousProcessNames={previousProcessNames}
              onSelectSuggestion={(index, name) =>
                setValue(`items.${index}.processName`, name, { shouldValidate: true })
              }
              onRemove={remove}
              onAddRow={handleAddRow}
            />

            {/* Footer */}
            <div className="mt-6 flex shrink-0 justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-10 w-40 rounded-full border-none hover:bg-blue-100"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="h-10 w-40 rounded-full text-white hover:bg-[#4a1ce0]"
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddLevel4sModal

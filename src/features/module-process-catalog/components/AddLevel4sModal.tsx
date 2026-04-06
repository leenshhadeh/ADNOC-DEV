import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronRight, Info, Minus, Plus, Trash2, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { useGetGroupCompanies } from '@features/module-process-catalog/hooks/useGetGroupCompanies'
import {
  addLevel4sFormSchema,
  type AddLevel4sFormValues,
  type AddLevel4Item,
} from '@features/module-process-catalog/schemas/catalog.schemas'
import type { GroupCompany } from '@features/module-process-catalog/types'

export type { AddLevel4Item }

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AddLevel4sModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentItem: { level3Name: string; level3Code: string } | null
  onSave?: (selectedCompanySites: string[], items: AddLevel4Item[]) => void
}

type Step = 'select' | 'form'

// ── Helper: build "Company - Site" key ────────────────────────────────────────

const compSiteKey = (companyName: string, site: string) => `${companyName} - ${site}`

// ── Step 1: Company / Site multi-select ───────────────────────────────────────

interface SelectStepProps {
  groupCompanies: GroupCompany[]
  selected: Set<string>
  onToggle: (key: string) => void
  onToggleCompany: (company: GroupCompany) => void
  isCompanyFullySelected: (company: GroupCompany) => boolean
  isCompanyPartiallySelected: (company: GroupCompany) => boolean
}

const CompanySiteSelect = ({
  groupCompanies,
  selected,
  onToggle,
  onToggleCompany,
  isCompanyFullySelected,
  isCompanyPartiallySelected,
}: SelectStepProps) => {
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
        const isFull = isCompanyFullySelected(gc)
        const isPartial = isCompanyPartiallySelected(gc)

        return (
          <div key={gc.id} className="border-border border-b last:border-0">
            {/* Company row */}
            <button
              type="button"
              onClick={() => toggleExpand(gc.id)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-[#ECEDEE]"
            >
              {isPartial ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleCompany(gc)
                  }}
                  className="border-primary bg-primary text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-[4px] border"
                >
                  <Minus className="size-3" />
                </button>
              ) : (
                <Checkbox
                  checked={isFull}
                  onCheckedChange={() => onToggleCompany(gc)}
                  onClick={(e) => e.stopPropagation()}
                  className="size-4"
                />
              )}
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
                const key = compSiteKey(gc.name, site)
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
                    <span className="text-foreground text-sm">{site}</span>
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
  selected,
  onRemove,
}: {
  selected: string[]
  onRemove: (key: string) => void
}) => (
  <div className="flex flex-wrap gap-1.5">
    {selected.map((key) => (
      <span
        key={key}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#2F68D9]/50 bg-[#DCE5F9] px-3 py-1 text-xs"
      >
        <span className="text-foreground max-w-[200px] truncate">{key}</span>
        <button
          type="button"
          onClick={() => onRemove(key)}
          className="text-foreground/70 hover:text-foreground transition-colors"
          aria-label={`Remove ${key}`}
        >
          <X className="size-3" />
        </button>
      </span>
    ))}
  </div>
)

// ── Step 2: editable L4 table ─────────────────────────────────────────────────

interface FormStepProps {
  parentCode: string
  register: ReturnType<typeof useForm<AddLevel4sFormValues>>['register']
  fields: { id: string }[]
  errors: ReturnType<typeof useForm<AddLevel4sFormValues>>['formState']['errors']
  onRemove: (index: number) => void
  onAddRow: () => void
}

const Level4FormTable = ({
  parentCode,
  register,
  fields,
  errors,
  onRemove,
  onAddRow,
}: FormStepProps) => (
  <div className="flex min-h-0 flex-1 flex-col gap-3">
    {/* Info banner */}
    <div className="flex items-start gap-1.5">
      <Info className="text-foreground mt-0.5 size-4 shrink-0" />
      <span className="text-foreground text-sm">
        Level 4 changes will be applied when Level 3 is submitted.
      </span>
    </div>

    {/* Table */}
    <div className="border-border min-h-0 flex-1 overflow-y-auto rounded-2xl border bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="border-border/60 border-b">
            <th className="text-muted-foreground w-32 px-4 py-3 text-start text-xs font-medium tracking-wide uppercase">
              L4 Code
            </th>
            <th className="text-muted-foreground px-4 py-3 text-start text-xs font-medium tracking-wide uppercase">
              L4 Name
            </th>
            <th className="text-muted-foreground px-4 py-3 text-start text-xs font-medium tracking-wide uppercase">
              L4 Description
            </th>
            <th className="text-muted-foreground w-16 px-4 py-3 text-start text-xs font-medium tracking-wide uppercase">
              Status
            </th>
            <th className="w-10 py-3" />
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => {
            const code = `${parentCode}.${index + 1}`
            const nameErr = errors.items?.[index]?.processName?.message
            return (
              <tr key={field.id} className="group border-border/60 border-b last:border-0">
                <td className="px-4 py-2 align-middle">
                  <span className="text-muted-foreground text-sm">{code}</span>
                </td>
                <td className="px-4 py-2 align-middle">
                  <input
                    {...register(`items.${index}.processName`)}
                    placeholder="Start writing..."
                    className={cn(
                      'text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none',
                      nameErr && 'text-destructive',
                    )}
                  />
                  {nameErr && <p className="text-destructive mt-0.5 text-xs">{nameErr}</p>}
                </td>
                <td className="px-4 py-2 align-middle">
                  <input
                    {...register(`items.${index}.processDescription`)}
                    placeholder="Start writing..."
                    className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
                  />
                </td>
                <td className="px-4 py-2 align-middle">
                  <span className="inline-block rounded-full bg-[#E0E0E0] px-2 py-0.5 text-xs">
                    Draft
                  </span>
                </td>
                <td className="px-4 py-2 align-middle">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove row"
                    >
                      <Trash2 className="text-destructive/70 size-4" />
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="px-4 py-3">
        <button
          type="button"
          onClick={onAddRow}
          className="flex items-center gap-1.5 text-sm font-medium text-[#0047BA] hover:underline"
        >
          <Plus className="size-4" />
          Add Row
        </button>
      </div>
    </div>
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────

const AddLevel4sModal = ({ open, onOpenChange, parentItem, onSave }: AddLevel4sModalProps) => {
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
    formState: { errors },
  } = useForm<AddLevel4sFormValues>({
    resolver: zodResolver(addLevel4sFormSchema),
    defaultValues: {
      groupCompany: '',
      selectedCompanySites: [],
      items: [{ processCode: `${parentCode}.1`, processName: '', processDescription: '' }],
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
        selectedCompanySites: [],
        items: [{ processCode: `${parentCode}.1`, processName: '', processDescription: '' }],
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

  const toggleCompany = useCallback((gc: GroupCompany) => {
    setSelected((prev) => {
      const next = new Set(prev)
      const allKeys = gc.sites.map((s) => compSiteKey(gc.name, s))
      const allSelected = allKeys.every((k) => next.has(k))
      if (allSelected) {
        allKeys.forEach((k) => next.delete(k))
      } else {
        allKeys.forEach((k) => next.add(k))
      }
      return next
    })
  }, [])

  const isCompanyFullySelected = useCallback(
    (gc: GroupCompany) => gc.sites.every((s) => selected.has(compSiteKey(gc.name, s))),
    [selected],
  )

  const isCompanyPartiallySelected = useCallback(
    (gc: GroupCompany) =>
      gc.sites.some((s) => selected.has(compSiteKey(gc.name, s))) &&
      !gc.sites.every((s) => selected.has(compSiteKey(gc.name, s))),
    [selected],
  )

  const removeSite = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }, [])

  // ── Computed summary ──
  const selectedArr = useMemo(() => Array.from(selected), [selected])
  const selectedSummary = useMemo(() => {
    const companySet = new Set<string>()
    selectedArr.forEach((key) => {
      const parts = key.split(' - ')
      if (parts.length >= 2) companySet.add(parts[0])
    })
    return { companies: companySet.size, sites: selectedArr.length }
  }, [selectedArr])

  // ── Navigation ──
  const handleNext = () => {
    if (selected.size === 0) return
    reset({
      groupCompany: selectedArr[0],
      selectedCompanySites: selectedArr,
      items: [{ processCode: `${parentCode}.1`, processName: '', processDescription: '' }],
    })
    setStep('form')
  }

  const handleBack = () => setStep('select')

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleAddRow = () => {
    append({
      processCode: `${parentCode}.${fields.length + 1}`,
      processName: '',
      processDescription: '',
    })
  }

  const onSubmit = (data: AddLevel4sFormValues) => {
    onSave?.(data.selectedCompanySites, data.items)
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
                  {selectedArr.length === 0 ? (
                    <span className="text-muted-foreground text-base">
                      Select group companies & sites…
                    </span>
                  ) : (
                    <SelectedTags selected={selectedArr} onRemove={removeSite} />
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
                    onToggleCompany={toggleCompany}
                    isCompanyFullySelected={isCompanyFullySelected}
                    isCompanyPartiallySelected={isCompanyPartiallySelected}
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

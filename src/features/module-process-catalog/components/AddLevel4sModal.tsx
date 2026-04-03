import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Plus, Trash2, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useGetGroupCompanies } from '@features/module-process-catalog/hooks/useGetGroupCompanies'
import {
  addLevel4sFormSchema,
  type AddLevel4sFormValues,
  type AddLevel4Item,
} from '@features/module-process-catalog/schemas/catalog.schemas'

export type { AddLevel4Item }

type FormValues = AddLevel4sFormValues

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AddLevel4sModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentItem: { level3Name: string; level3Code: string } | null
  onSave?: (groupCompany: string, items: AddLevel4Item[]) => void
}

// ── Item sub-component ────────────────────────────────────────────────────────

interface ItemProps {
  index: number
  nameError?: string
  register: ReturnType<typeof useForm<FormValues>>['register']
  onRemove: () => void
  isOnly: boolean
}

const Level4ItemFields = ({ index, nameError, register, onRemove, isOnly }: ItemProps) => (
  <div className="group relative space-y-3">
    {/* Delete button — appears on hover, hidden when only one item */}
    {!isOnly && (
      <button
        type="button"
        aria-label="Remove item"
        onClick={onRemove}
        className={cn(
          'text-muted-foreground absolute top-0 right-0 p-1 transition-opacity',
          'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
        )}
      >
        <Trash2 className="text-destructive/70 size-4" />
      </button>
    )}

    {/* Process Name */}
    <div className="space-y-1.5">
      <label className="text-muted-foreground text-sm">Level 4 Process Name</label>
      <input
        {...register(`items.${index}.processName`)}
        placeholder="Enter process name"
        className={cn(
          'border-border bg-card text-foreground placeholder:text-muted-foreground/60',
          'focus-visible:ring-ring h-12 w-full rounded-xl border px-4 text-base outline-none focus-visible:ring-2',
          nameError && 'border-destructive',
        )}
      />
      {nameError && <p className="text-destructive text-xs">{nameError}</p>}
    </div>

    {/* Description */}
    <div className="space-y-1.5">
      <label className="text-muted-foreground text-sm">Description</label>
      <textarea
        {...register(`items.${index}.processDescription`)}
        placeholder="Enter description"
        rows={4}
        className={cn(
          'border-border bg-card text-foreground placeholder:text-muted-foreground/60',
          'focus-visible:ring-ring w-full resize-none rounded-xl border px-4 py-3 text-base outline-none focus-visible:ring-2',
        )}
      />
    </div>
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────

const AddLevel4sModal = ({ open, onOpenChange, parentItem, onSave }: AddLevel4sModalProps) => {
  const parentCode = parentItem?.level3Code ?? ''

  const { data: groupCompanies } = useGetGroupCompanies()
  const groupCompanyOptions = (groupCompanies ?? []).flatMap((e) =>
    e.sites.map((s) => `${e.name} - ${s}`),
  )

  const buildDefaults = (): FormValues => ({
    groupCompany: groupCompanyOptions[0] ?? '',
    items: [{ processCode: `${parentCode}.1`, processName: '', processDescription: '' }],
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(addLevel4sFormSchema),
    defaultValues: buildDefaults(),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  useEffect(() => {
    if (open) reset(buildDefaults())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, parentCode])

  const handleAddItem = () => {
    append({
      processCode: `${parentCode}.${fields.length + 1}`,
      processName: '',
      processDescription: '',
    })
  }

  const handleCancel = () => {
    reset(buildDefaults())
    onOpenChange(false)
  }

  const onSubmit = (data: FormValues) => {
    onSave?.(data.groupCompany, data.items)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-[#F1F3F5] p-6 shadow-2xl">
        {/* ── Header ── */}
        <div className="flex shrink-0 items-start justify-between gap-4 px-2">
          <div>
            <h2 className="text-foreground text-2xl font-bold">Add Level 4s</h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Please select the group company to which this process will apply.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={handleCancel}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* ── Scrollable form body ── */}
        <form
          id="add-l4-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto px-2"
        >
          {/* Group Company Select */}
          <div className="space-y-1.5">
            <label htmlFor="add-l4-group-company" className="text-muted-foreground text-sm">
              Applicable Group Company
            </label>
            <div className="relative">
              <select
                id="add-l4-group-company"
                {...register('groupCompany')}
                className="border-border bg-card text-foreground focus-visible:ring-ring h-12 w-full appearance-none rounded-xl border px-4 pe-10 text-base outline-none focus-visible:ring-2"
              >
                {groupCompanyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
            </div>
            {errors.groupCompany && (
              <p className="text-destructive text-xs">{errors.groupCompany.message}</p>
            )}
          </div>

          {/* Items */}
          {fields.map((field, index) => (
            <Level4ItemFields
              key={field.id}
              index={index}
              nameError={errors.items?.[index]?.processName?.message}
              register={register}
              onRemove={() => remove(index)}
              isOnly={fields.length === 1}
            />
          ))}

          {/* Add another item */}
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 text-sm font-medium text-[#0047BA] hover:underline focus-visible:underline focus-visible:outline-none"
          >
            <Plus className="size-4" />
            Add another item
          </button>
        </form>

        {/* ── Footer ── */}
        <div className="mt-6 grid shrink-0 grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-12 rounded-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" form="add-l4-form" className="h-12 rounded-full">
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddLevel4sModal

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useGetGroupCompanies } from '@features/module-process-catalog/hooks/useGetGroupCompanies'

// ── Schema ────────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  /** Auto-generated from parent code — stored so the caller receives it in onSave. */
  processCode: z.string(),
  processName: z.string().min(1, 'Required'),
  processDescription: z.string().optional(),
})

const formSchema = z.object({
  groupCompany: z.string().min(1, 'Please select a group company'),
  items: z.array(itemSchema).min(1),
})

type FormValues = z.infer<typeof formSchema>
export type AddLevel4Item = FormValues['items'][number]

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AddLevel4sModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The L3 process under which new L4s will be nested. */
  parentItem: { level3Name: string; level3Code: string } | null
  /**
   * Called with the validated payload when the user clicks Save.
   * State is fully scoped to this form — callers must NOT inject items into
   * the main Process Catalog grid.
   */
  onSave?: (groupCompany: string, items: AddLevel4Item[]) => void
}

// ── Row sub-component ─────────────────────────────────────────────────────────

interface RowProps {
  index: number
  processCode: string
  nameError?: string
  register: ReturnType<typeof useForm<FormValues>>['register']
  onRemove: () => void
  isOnly: boolean
}

const Level4DraftRow = ({
  index,
  processCode,
  nameError,
  register,
  onRemove,
  isOnly,
}: RowProps) => (
  <tr className="group border-border/60 border-b last:border-0">
    {/* Code — read-only */}
    <td className="w-36 py-2 pe-3 align-top">
      <span className="text-muted-foreground block px-2 py-2 font-mono text-sm select-none">
        {processCode}
      </span>
    </td>

    {/* Process Name */}
    <td className="py-2 pe-3 align-top">
      <input
        {...register(`items.${index}.processName`)}
        placeholder="Enter process name"
        aria-label="Process name"
        className={cn(
          'text-foreground w-full border-0 border-b bg-transparent px-2 py-1.5 text-sm outline-none',
          'placeholder:text-muted-foreground/60 transition-colors',
          'focus:border-border border-transparent',
          nameError && 'border-destructive focus:border-destructive',
        )}
      />
      {nameError && <p className="text-destructive mt-0.5 px-2 text-xs">{nameError}</p>}
    </td>

    {/* Description */}
    <td className="py-2 pe-3 align-top">
      <input
        {...register(`items.${index}.processDescription`)}
        placeholder="Enter description (optional)"
        aria-label="Process description"
        className={cn(
          'text-foreground w-full border-0 border-b bg-transparent px-2 py-1.5 text-sm outline-none',
          'placeholder:text-muted-foreground/60 transition-colors',
          'focus:border-border border-transparent',
        )}
      />
    </td>

    {/* Delete */}
    <td className="w-10 py-2 align-top">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={isOnly}
        aria-label="Remove row"
        onClick={onRemove}
        className={cn(
          'text-muted-foreground mt-1.5 transition-opacity',
          'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          isOnly && 'pointer-events-none',
        )}
      >
        <Trash2 className="text-destructive/70 size-3.5" />
      </Button>
    </td>
  </tr>
)

// ── Main component ────────────────────────────────────────────────────────────

const AddLevel4sModal = ({ open, onOpenChange, parentItem, onSave }: AddLevel4sModalProps) => {
  const parentCode = parentItem?.level3Code ?? ''

  // Group companies from API lookup; select is empty until the query resolves.
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
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaults(),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const selectedCompany = watch('groupCompany')

  // Reset form each time the modal opens (or parent changes)
  useEffect(() => {
    if (open) reset(buildDefaults())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, parentCode])

  const handleAddRow = () => {
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
    // Pass validated data to caller — this modal owns the state exclusively.
    // Callers must NOT push these rows into the main catalog grid.
    onSave?.(data.groupCompany, data.items)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="bg-background flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl p-6 shadow-2xl">
        {/* ── Header ── */}
        <div className="flex shrink-0 items-start justify-between gap-4">
          <h2 className="text-foreground text-2xl font-bold">
            Add Level 4s
            {selectedCompany ? <span className="font-normal"> under {selectedCompany}</span> : null}
          </h2>
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

        {/* ── Scrollable table card ── */}
        <div className="border-border mt-5 min-h-0 flex-1 overflow-y-auto rounded-xl border">
          <form id="add-l4-form" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('groupCompany')} />
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-border/60 border-b">
                  <th className="text-muted-foreground w-36 px-4 py-3 text-start text-xs font-medium tracking-wide uppercase">
                    Process Code
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-start text-xs font-medium tracking-wide uppercase">
                    Process Name
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-start text-xs font-medium tracking-wide uppercase">
                    Process Description
                  </th>
                  <th className="w-10 py-3" />
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <Level4DraftRow
                    key={field.id}
                    index={index}
                    processCode={`${parentCode}.${index + 1}`}
                    nameError={errors.items?.[index]?.processName?.message}
                    register={register}
                    onRemove={() => remove(index)}
                    isOnly={fields.length === 1}
                  />
                ))}
              </tbody>
            </table>

            {/* Add row trigger */}
            <div className="px-4 py-3">
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1.5 text-sm font-medium text-[#0047BA] hover:underline focus-visible:underline focus-visible:outline-none"
              >
                <Plus className="size-4" />
                Add Level 4
              </button>
            </div>
          </form>
        </div>

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
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddLevel4sModal

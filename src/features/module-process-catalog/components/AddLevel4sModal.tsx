import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, Plus, Trash2, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { ENTITY_CONFIG } from '@features/module-process-catalog/types'

// ── Options ───────────────────────────────────────────────────────────────────

const GROUP_COMPANY_OPTIONS = ENTITY_CONFIG.flatMap((e) => e.sites.map((s) => `${e.name} - ${s}`))

// ── Schema ────────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  processName: z.string().min(1, 'Process name is required'),
  description: z.string().optional(),
})

const formSchema = z.object({
  groupCompany: z.string().min(1, 'Please select a group company'),
  items: z.array(itemSchema).min(1),
})

type FormValues = z.infer<typeof formSchema>

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AddLevel4sModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The L3 process under which new L4s will be added */
  parentItem: { level3Name: string; level3Code: string } | null
  onAdd?: (groupCompany: string, items: { processName: string; description?: string }[]) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

const AddLevel4sModal = ({ open, onOpenChange, parentItem, onAdd }: AddLevel4sModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupCompany: GROUP_COMPANY_OPTIONS[0] ?? '',
      items: [{ processName: '', description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const onSubmit = (data: FormValues) => {
    onAdd?.(data.groupCompany, data.items)
    reset()
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="border-border bg-background max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border p-7 shadow-2xl">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-foreground text-4xl/none font-semibold">Add Level 4s</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Please select the group company to which this process will apply.
            </p>
            {parentItem && (
              <p className="text-muted-foreground mt-2 text-sm">
                Parent: <span className="text-foreground font-medium">{parentItem.level3Name}</span>{' '}
                <span className="text-muted-foreground">({parentItem.level3Code})</span>
              </p>
            )}
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground shrink-0"
            aria-label="Close"
            onClick={handleClose}
          >
            <X className="size-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* ── Group Company ── */}
          <div className="space-y-2">
            <label htmlFor="group-company" className="text-foreground text-sm font-medium">
              Applicable Group Company
            </label>
            <div className="relative">
              <select
                id="group-company"
                {...register('groupCompany')}
                className="border-border bg-background text-foreground focus-visible:ring-ring h-12 w-full appearance-none rounded-xl border ps-4 pe-10 text-sm outline-none focus-visible:ring-2"
              >
                {GROUP_COMPANY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2" />
            </div>
            {errors.groupCompany && (
              <p className="text-destructive text-xs">{errors.groupCompany.message}</p>
            )}
          </div>

          {/* ── Dynamic items ── */}
          <div className="space-y-5">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                {fields.length > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Item {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => remove(index)}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2 className="text-destructive size-3.5" />
                    </Button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor={`items.${index}.processName`}
                    className="text-foreground text-sm font-medium"
                  >
                    Level 4 Process Name
                  </label>
                  <Input
                    id={`items.${index}.processName`}
                    {...register(`items.${index}.processName`)}
                    placeholder="Enter process name"
                    className="h-12 rounded-xl"
                  />
                  {errors.items?.[index]?.processName && (
                    <p className="text-destructive text-xs">
                      {errors.items[index].processName?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={`items.${index}.description`}
                    className="text-foreground text-sm font-medium"
                  >
                    Description
                  </label>
                  <textarea
                    id={`items.${index}.description`}
                    {...register(`items.${index}.description`)}
                    rows={3}
                    placeholder="Enter description"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus-visible:ring-2"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Add another item ── */}
          <button
            type="button"
            onClick={() => append({ processName: '', description: '' })}
            className="text-primary flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            <Plus className="size-4" />
            Add another item
          </button>

          {/* ── Footer ── */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="h-12 rounded-full"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-12 rounded-full">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLevel4sModal

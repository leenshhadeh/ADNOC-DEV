/**
 * EditLevel4sModal
 *
 * Allows users to add, edit, and delete Level 4 processes under a parent node.
 *
 * Architecture (SRP):
 *   - Schema / types  → pure Zod definitions, no UI
 *   - EditLevel4sModal → form state + submit logic only (no layout)
 *   - Level4Row        → single-row presentation (inputs + delete button)
 */

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

// ── Schema ────────────────────────────────────────────────────────────────────

const level4RowSchema = z.object({
  processCode: z.string().min(1, 'Required'),
  processName: z.string().min(1, 'Required'),
  processDescription: z.string().optional(),
})

const formSchema = z.object({
  rows: z.array(level4RowSchema),
})

type FormValues = z.infer<typeof formSchema>
type Level4Row = FormValues['rows'][number]

// ── Props ─────────────────────────────────────────────────────────────────────

export interface EditLevel4sModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  /** E.g. "ADNOC HQ - Site A" — shown in the modal title */
  parentLabel: string

  /**
   * Auto-code prefix used to generate the next code for new rows.
   * E.g. "EXP.1.1.1" → new rows get "EXP.1.1.1.1", "EXP.1.1.1.2", …
   */
  parentCode: string

  /** Pre-populate the list with existing Level 4 rows. */
  initialRows?: Level4Row[]

  /** Called with the final validated list when the user clicks Save. */
  onSave?: (rows: Level4Row[]) => void
}

// ── Sub-component: single editable row ───────────────────────────────────────

interface Level4RowProps {
  index: number
  processCode: string
  nameError?: string
  codeError?: string
  register: ReturnType<typeof useForm<FormValues>>['register']
  onRemove: () => void
  isOnly: boolean
}

const Level4RowItem = ({
  index,
  processCode,
  nameError,
  register,
  onRemove,
  isOnly,
}: Level4RowProps) => (
  <tr className="group border-border/60 border-b last:border-0">
    {/* Process Code — read-only, muted */}
    <td className="w-36 py-2 pe-3 align-top">
      <span className="text-muted-foreground block px-2 py-2 font-mono text-sm select-none">
        {processCode}
      </span>
    </td>

    {/* Process Name */}
    <td className="py-2 pe-3 align-top">
      <input
        {...register(`rows.${index}.processName`)}
        placeholder="Enter process name"
        aria-label="Process name"
        className={cn(
          'text-foreground w-full border-0 border-b bg-transparent px-2 py-1.5 text-sm outline-none',
          'placeholder:text-muted-foreground/60',
          'transition-colors',
          'focus:border-border border-transparent',
          nameError && 'border-destructive focus:border-destructive',
        )}
      />
      {nameError && <p className="text-destructive mt-0.5 px-2 text-xs">{nameError}</p>}
    </td>

    {/* Process Description */}
    <td className="py-2 pe-3 align-top">
      <input
        {...register(`rows.${index}.processDescription`)}
        placeholder="Enter description (optional)"
        aria-label="Process description"
        className={cn(
          'text-foreground w-full border-0 border-b bg-transparent px-2 py-1.5 text-sm outline-none',
          'placeholder:text-muted-foreground/60',
          'transition-colors',
          'focus:border-border border-transparent',
        )}
      />
    </td>

    {/* Delete action */}
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

export const EditLevel4sModal = ({
  open,
  onOpenChange,
  parentLabel,
  parentCode,
  initialRows = [],
  onSave,
}: EditLevel4sModalProps) => {
  const defaultRows: Level4Row[] =
    initialRows.length > 0
      ? initialRows
      : [{ processCode: `${parentCode}.1`, processName: '', processDescription: '' }]

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { rows: defaultRows },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'rows' })

  const handleAddRow = () => {
    append({
      processCode: `${parentCode}.${fields.length + 1}`,
      processName: '',
      processDescription: '',
    })
  }

  const handleSave = handleSubmit((data) => {
    onSave?.(data.rows)
    onOpenChange(false)
  })

  const handleCancel = () => {
    reset({ rows: defaultRows })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col p-0 sm:max-w-3xl">
        {/* Header */}
        <DialogHeader className="border-border/60 shrink-0 border-b px-6 py-5">
          <DialogTitle className="text-xl font-semibold">
            Add Level 4s under {parentLabel}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <table className="w-full table-fixed border-collapse">
            {/* Column headers */}
            <thead>
              <tr className="border-border/60 border-b">
                <th className="text-muted-foreground w-36 pe-3 pb-2 text-start text-xs font-medium tracking-wide uppercase">
                  Process Code
                </th>
                <th className="text-muted-foreground pe-3 pb-2 text-start text-xs font-medium tracking-wide uppercase">
                  Process Name
                </th>
                <th className="text-muted-foreground pe-3 pb-2 text-start text-xs font-medium tracking-wide uppercase">
                  Process Description
                </th>
                {/* spacer for delete column */}
                <th className="w-10 pb-2" />
              </tr>
            </thead>

            <tbody>
              {fields.map((field, index) => (
                <Level4RowItem
                  key={field.id}
                  index={index}
                  processCode={`${parentCode}.${index + 1}`}
                  nameError={errors.rows?.[index]?.processName?.message}
                  codeError={errors.rows?.[index]?.processCode?.message}
                  register={register}
                  onRemove={() => remove(index)}
                  isOnly={fields.length === 1}
                />
              ))}
            </tbody>
          </table>

          {/* Add row trigger */}
          <button
            type="button"
            onClick={handleAddRow}
            className="text-primary mt-3 flex items-center gap-1.5 text-sm font-medium hover:underline focus-visible:underline focus-visible:outline-none"
          >
            <Plus className="size-4" />
            Add Level 4
          </button>
        </div>

        {/* Footer */}
        <DialogFooter className="border-border/60 shrink-0 border-t px-6 py-4">
          <Button
            type="button"
            variant="secondary"
            className="rounded-full px-6"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-full bg-[#3B00FF] px-8 text-white hover:bg-[#3B00FF]/90"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

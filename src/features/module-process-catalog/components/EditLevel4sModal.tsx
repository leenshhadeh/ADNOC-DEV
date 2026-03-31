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

import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'

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

  /** Shows a loading skeleton while rows are being fetched. */
  isLoading?: boolean

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
  isLoading = false,
  onSave,
}: EditLevel4sModalProps) => {
  const emptyRow: Level4Row = {
    processCode: `${parentCode}.1`,
    processName: '',
    processDescription: '',
  }

  const defaultRows: Level4Row[] = initialRows.length > 0 ? initialRows : [emptyRow]

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

  // Sync fetched data into the form once it arrives
  useEffect(() => {
    if (open && !isLoading) {
      reset({
        rows:
          initialRows.length > 0
            ? initialRows
            : [{ processCode: `${parentCode}.1`, processName: '', processDescription: '' }],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isLoading, initialRows.length])

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

  if (!open) return null

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-[#F1F3F5] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4">
          <h2 className="text-foreground text-2xl font-bold">Add Level 4s under {parentLabel}</h2>
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

        {/* Scrollable table card */}
        <div className="border-border mt-5 min-h-0 flex-1 overflow-y-auto rounded-xl border bg-white">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-4">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-4 flex-1 animate-pulse rounded" />
                  <div className="bg-muted h-4 flex-1 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex shrink-0 justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-10 w-52 rounded-full border-none hover:bg-blue-100"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-10 w-52 rounded-full text-white hover:bg-[#4a1ce0]"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

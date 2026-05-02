import { useState } from 'react'
import { Textarea } from '@/shared/components/ui/textarea'

/**
 * Click-to-edit text cell. Double-click or Enter to commit; Escape to cancel.
 *
 * S — manages only local draft state and edit toggle.
 * O — value/onChange interface keeps it open for any data type.
 * I — no dependencies on table internals or domain types.
 * D — depends only on React; caller owns persistence.
 */
export interface EditableCellProps {
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textArea'
}

const EditableCell = ({ value, onChange, type }: EditableCellProps) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const commit = () => {
    onChange(draft)
    setEditing(false)
  }

  if (editing) {
    return (
      <>
        {type != 'textArea' ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') {
                setDraft(value)
                setEditing(false)
              }
            }}
            className="border-primary bg-background ring-primary/30 w-full rounded-md border px-2 py-1 text-sm ring-2 outline-none"
          />
        ) : (
          <Textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') {
                  setDraft(value)
                  setEditing(false)
                }
              }}
              className="border-primary bg-background ring-primary/30 mt-2 w-full rounded-md border px-2 py-1 text-sm ring-2 outline-none"
            />
        )}
      </>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
      className="group/edit text-foreground hover:bg-primary/8 hover:ring-primary/25 min-h-[28px] cursor-text rounded-md px-2 py-1 text-sm transition-colors hover:ring-1"
    >
      {value || <span className="text-muted-foreground">—</span>}
    </div>
  )
}

export default EditableCell

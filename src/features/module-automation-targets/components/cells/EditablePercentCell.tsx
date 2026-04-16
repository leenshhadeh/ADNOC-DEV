import { useState } from 'react'
import { Input } from '@/shared/components/ui/input'

interface EditablePercentCellProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const EditablePercentCell = ({ value, onChange, disabled }: EditablePercentCellProps) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (disabled) {
    return <span className="text-muted-foreground text-sm">{value || '—'}</span>
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="text-foreground hover:bg-muted/60 w-full cursor-pointer rounded px-2 py-1 text-left text-sm"
        onClick={() => {
          setDraft(value)
          setEditing(true)
        }}
      >
        {value || '—'}
      </button>
    )
  }

  return (
    <Input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onChange(draft)
        setEditing(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onChange(draft)
          setEditing(false)
        }
        if (e.key === 'Escape') {
          setEditing(false)
        }
      }}
      className="h-7 w-24 text-sm"
      placeholder="0%"
    />
  )
}

export default EditablePercentCell

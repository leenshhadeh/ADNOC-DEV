import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'

interface NumericEditCellProps {
  value: number | undefined
  onChange?: (value: number | undefined) => void
}

const NumericEditCell = ({ value, onChange }: NumericEditCellProps) => {
  const [editing, setEditing] = useState(false)
  const [mode, setMode] = useState<'single' | 'range'>('single')
  const [singleDraft, setSingleDraft] = useState('')
  const [minDraft, setMinDraft] = useState('')
  const [maxDraft, setMaxDraft] = useState('')

  const startEditing = () => {
    setSingleDraft(value != null ? String(value) : '')
    setMinDraft('')
    setMaxDraft('')
    setMode('single')
    setEditing(true)
  }

  const commitSingle = () => {
    const parsed = parseFloat(singleDraft)
    onChange?.(isNaN(parsed) ? undefined : parsed)
    setEditing(false)
  }

  const commitRange = () => {
    const parsed = parseFloat(minDraft)
    onChange?.(isNaN(parsed) ? undefined : parsed)
    setEditing(false)
  }

  if (!editing) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={startEditing}
        onKeyDown={(e) => e.key === 'Enter' && startEditing()}
        className="text-foreground hover:bg-primary/8 hover:ring-primary/25 min-h-[28px] cursor-text rounded-md px-2 py-1 text-sm transition-colors hover:ring-1"
      >
        {value != null ? value.toLocaleString() : <span className="text-muted-foreground">—</span>}
      </div>
    )
  }

  const toggleButton = (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setMode(mode === 'single' ? 'range' : 'single')}
      className="text-muted-foreground flex shrink-0 items-center gap-1 text-sm font-medium"
    >
      <ArrowLeftRight className="size-3.5" />
      {mode === 'single' ? 'Range' : 'Single'}
    </button>
  )

  return (
    <div className="border-brand-blue bg-muted rounded-md border p-2">
      {mode === 'single' ? (
        <div className="border-brand-blue bg-accent flex items-center gap-2 rounded-md border px-1.5 py-1">
          <input
            autoFocus
            type="number"
            value={singleDraft}
            onChange={(e) => setSingleDraft(e.target.value)}
            onBlur={commitSingle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitSingle()
              if (e.key === 'Escape') setEditing(false)
            }}
            className="text-foreground min-w-0 flex-1 [appearance:textfield] bg-transparent text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {toggleButton}
        </div>
      ) : (
        <div className="border-brand-blue bg-accent flex items-center gap-2 rounded-md border px-1.5 py-1">
          <input
            autoFocus
            type="number"
            value={minDraft}
            onChange={(e) => setMinDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
            className="text-foreground min-w-0 flex-1 [appearance:textfield] bg-transparent text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-muted-foreground shrink-0 text-sm">—</span>
          <input
            type="number"
            value={maxDraft}
            onChange={(e) => setMaxDraft(e.target.value)}
            onBlur={commitRange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRange()
              if (e.key === 'Escape') setEditing(false)
            }}
            className="text-foreground min-w-0 flex-1 [appearance:textfield] bg-transparent text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {toggleButton}
        </div>
      )}
    </div>
  )
}

export default NumericEditCell

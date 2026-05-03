import { useState } from 'react'
import { cn } from '@/shared/lib/utils'

const RadioCell = (props: any) => {
  const { value, onValChange, disabled = false } = props

  const [enabled, setEnabled] = useState(value)

  const onChange = () => {
    if (disabled) return
    setEnabled((v: any) => !v)
    if (onValChange) onValChange(enabled ? 'no' : 'yes')
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={cn(
          'focus-visible:ring-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none',
          enabled ? 'bg-brand-blue' : 'bg-input',
        )}
      >
        <span
          className={cn(
            'bg-background pointer-events-none block h-4 w-4 rounded-full shadow-md ring-0 transition-transform',
            enabled ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
      <span className="text-foreground text-sm">{enabled ? 'Yes' : 'No'}</span>
    </div>
  )
}

export default RadioCell

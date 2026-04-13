import { cn } from '@/shared/lib/utils'
import React from 'react'

export type SelectOption = {
  label: string
  value: string
}

type CustomSelectProps = {
  options: SelectOption[]
  defaultValue?: string
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
}

const Select: React.FC<CustomSelectProps> = ({
  options,
  defaultValue,
  value,
  placeholder = 'Select...',
  onChange,
  className,
}) => {
  return (
    <select
       className={cn(
             "flex h-10 w-full min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
             className
           )}
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export { Select }

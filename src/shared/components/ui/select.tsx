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
  disabled?: boolean
  border?:boolean
}

const Select: React.FC<CustomSelectProps> = ({
  options,
  defaultValue,
  value,
  placeholder = 'Select...',
  onChange,
  className,
  disabled,
  border
}) => {
  return (
    <select
      className={cn(
         'text-foreground placeholder:text-muted-foreground flex h-10 w-full min-w-0 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
          border && 'rounded-md border border-border px-1',
          className,
      )}
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
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

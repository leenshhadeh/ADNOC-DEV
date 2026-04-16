import { Select } from '@/shared/components/ui/select'

interface EditableSelectCellProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  disabled?: boolean
  placeholder?: string
}

const EditableSelectCell = ({
  value,
  onChange,
  options,
  disabled,
  placeholder = 'Select…',
}: EditableSelectCellProps) => {
  if (disabled) {
    return <span className="text-muted-foreground text-sm">{value || '—'}</span>
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options.map((opt) => ({ label: opt, value: opt }))}
      placeholder={placeholder}
      className="h-7 text-sm"
    />
  )
}

export default EditableSelectCell

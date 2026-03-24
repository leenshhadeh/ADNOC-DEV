export interface FilterOption {
  id: string
  label: string
}

export interface FilterDefinition {
  id: string
  label: string
  options: FilterOption[]
}

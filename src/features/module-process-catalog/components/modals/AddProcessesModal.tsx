import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Select } from '@/shared/components/ui/select'

export interface AddProcessesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  numberOfProcesses: string
  onNumberOfProcessesChange: (value: string) => void
  onAdd: () => void
}

const AddProcessesModal = ({
  open,
  onOpenChange,
  numberOfProcesses,
  onNumberOfProcessesChange,
  onAdd,
}: AddProcessesModalProps) => {
  if (!open) return null

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="border-border bg-background w-full max-w-[560px] rounded-2xl border p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-foreground text-2xl font-bold">Add multiple processes</h2>
            <p className="mt-2 text-[#687076]">
              Please select the number of processes you want to add.
            </p>
          </div>

          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="mt-6 space-y-2">
          <label htmlFor="process-count" className="text-[#687076]">
            How many processes you want to add?
          </label>
          <div className="relative">
            <Select
              options={[1, 2, 3, 4, 5].map((v) => ({ label: String(v), value: String(v) }))}
              value={numberOfProcesses}
              onChange={onNumberOfProcessesChange}
              className="border-border bg-background text-foreground focus-visible:ring-ring h-12 w-full appearance-none rounded-xl border ps-4 pe-12 text-base focus-visible:ring-2"
            />
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="text-muted-foreground size-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-12 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="hover:bg-button-hover h-12 rounded-full" onClick={onAdd}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddProcessesModal

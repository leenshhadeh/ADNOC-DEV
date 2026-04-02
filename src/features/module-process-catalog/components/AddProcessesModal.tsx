import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

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
            <select
              id="process-count"
              value={numberOfProcesses}
              onChange={(e) => onNumberOfProcessesChange(e.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-ring h-12 w-full appearance-none rounded-xl border ps-4 pe-12 text-base outline-none focus-visible:ring-2"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </select>
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2" />
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

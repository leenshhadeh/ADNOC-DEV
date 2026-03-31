import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export interface RenameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The current name of the process — pre-filled in the input */
  currentName: string
  /** Called with the new name when the user clicks Rename */
  onRename?: (newName: string) => void
}

const RenameModal = ({ open, onOpenChange, currentName, onRename }: RenameModalProps) => {
  const [name, setName] = useState(currentName)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync name when currentName changes (e.g. different row each time)
  useEffect(() => {
    if (open) {
      setName(currentName)
      const t = setTimeout(() => {
        inputRef.current?.select()
      }, 50)
      return () => clearTimeout(t)
    }
  }, [open, currentName])

  if (!open) return null

  const handleCancel = () => {
    setName(currentName)
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onRename?.(trimmed)
    onOpenChange(false)
  }

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[480px] rounded-2xl bg-[#F1F3F5] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-foreground text-2xl font-medium">Rename</h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Please enter a new name for this process
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={handleCancel}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mt-5 space-y-1.5">
            <label className="text-muted-foreground text-sm" htmlFor="rename-input">
              Process name
            </label>
            <input
              ref={inputRef}
              id="rename-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-ring h-12 w-full rounded-xl border px-4 text-base outline-none focus-visible:ring-2"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              className="h-12 rounded-full"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-12 rounded-full" disabled={!name.trim()}>
              Rename
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RenameModal

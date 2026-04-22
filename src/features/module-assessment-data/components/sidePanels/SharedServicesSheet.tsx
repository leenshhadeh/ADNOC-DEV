import ActionSheet from '@/shared/components/ActionSheet'
import { RadioCell } from '@/shared/components/table-primitives'
import { Button } from '@/shared/components/ui/button'
import { useEffect, useState } from 'react'
import { useProcessSharedData } from '../../hooks/useProcessSharedData'

interface SharedServicesSheetPayload {
  summary: {
    services: number
    shared: number
  }
  processSharedServices:{
    GC: string
    shared: boolean
  }[]
}

interface SharedServicesSheetProps {
  open?: boolean
  processId?: string
  process?: { id?: string; name?: string }
  handleOpenChange: (value?: SharedServicesSheetPayload) => void
  onClose: () => void
}

// Renders the shared-services sheet and syncs its rows with the shared-services APIs.
const SharedServicesSheet = ({
  open = true,
  process = { name: 'Define basin framework' },
  processId = '',
  handleOpenChange,
  onClose,
}: SharedServicesSheetProps) => {
  const [sharedServices, setSharedServices] = useState<{
    GC: string
    shared: boolean
  }[]>([])
  const targetProcessId = processId || process.id || ''
  const { processSharedServices, isPending ,isLoading} =
    useProcessSharedData(targetProcessId)

  useEffect(() => {
    if (open && processSharedServices) {
      setSharedServices(processSharedServices)
    }
  }, [open, processSharedServices])



  // Updates one group-company row when the shared toggle changes.
  const handleSharedChange = (GC: string, nextValue: string) => {
    setSharedServices((prev) =>
      prev.map((item) => (item.GC === GC ? { ...item, shared: nextValue === 'yes' } : item)),
    )
  }

  // Saves the updated rows and returns both the summary and the detailed list.
  const handleSave = async () => {
    const summary = {
      services: sharedServices.length,
      shared: sharedServices.filter((item) => item.shared).length,
    }

    // await updateProcessSharedData({
    //   processId: targetProcessId,
    //   processSharedServices: sharedServices,
    // })

    handleOpenChange({
      summary,
      processSharedServices: sharedServices,
    })
  }

  return (
    <ActionSheet
      title="Shared Service"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      subTitle="Manage Shared Service status per Group Company."
    >
      <div className="shrink-0 border-b px-6 py-4">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">Process</p>
        <p className="text-foreground mt-0.5 text-sm font-medium">{process.name}</p>
      </div>

      <div className="bg-muted grid shrink-0 grid-cols-2 gap-4 border-b px-6 py-3">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Group Company
        </p>
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Shared Service Process
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && <div className='text-center p-5'>data loading...</div>}
        {sharedServices?.map((service) => (
          <div
            key={service.GC}
            className="grid grid-cols-2 gap-4 border-b px-6 py-4 last:border-0"
          >
            <p className="text-foreground text-sm">{service.GC}</p>
            <div>
              <RadioCell
                value={service.shared}
                onValChange={(value: string) => handleSharedChange(service.GC, value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-border shrink-0 px-6 py-4">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onClose ?? (() => handleOpenChange())}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-full"
            disabled={isPending}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default SharedServicesSheet

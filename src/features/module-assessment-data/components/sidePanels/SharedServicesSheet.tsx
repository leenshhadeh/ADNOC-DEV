import ActionSheet from '@/shared/components/ActionSheet'
import { RadioCell } from '@/shared/components/table-primitives'
import { Button } from '@/shared/components/ui/button'
import { useEffect, useState } from 'react'

interface SharedServicesSheetProps {
  open?: boolean
  processId?: string
  process?: { id?: string; name?: string }
  handleOpenChange: (value?: any) => void
  onClose: () => void
  selected?: {
    services: string[]
    shared: string[]
  }
}

// Renders the shared-services sheet and syncs its rows with the shared-services APIs.
const SharedServicesSheet = ({
  open = true,
  process = { name: 'Define basin framework' },
  handleOpenChange,
  onClose,
  selected,
}: SharedServicesSheetProps) => {
  const [sharedServices, setSharedServices] = useState<{
    services: string[]
    shared: string[]
  }>()

  useEffect(() => {
    if (open) {
      console.log(selected)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSharedServices(selected)
    }
  }, [open])

  const handleSharedChange = (service: string, isShared: string) => {
    // Updates the shared services state by adding or removing the service from the shared list.
    setSharedServices((prev) => {
      if (!prev) {
        return {
          services: [service],
          shared: isShared === 'yes' ? [service] : [],
        }
      }

      const nextShared = prev.shared.includes(service)
        ? prev.shared.filter((item) => item !== service)
        : [...prev.shared, service]

      return {
        ...prev,
        shared: isShared === 'yes' ? nextShared : prev.shared.filter((item) => item !== service),
      }
    })
  }

  const handleSave = async () => {
    const summary = {
      services: sharedServices?.services || [],
      shared: sharedServices?.shared || [],
    }
    handleOpenChange(summary)
  }

  const getIsSharedService = (service: string) => {
    return selected?.shared.includes(service)
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
        {/* {isLoading && <div className='text-center p-5'>data loading...</div>} */}
        {sharedServices?.services?.map((service) => (
          <div key={service} className="grid grid-cols-2 gap-4 border-b px-6 py-4 last:border-0">
            <p className="text-foreground text-sm">{service}</p>
            <div>
              <RadioCell
                value={getIsSharedService(service)}
                onValChange={(value: string) => handleSharedChange(service, value)}
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
            // disabled={isPending}
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

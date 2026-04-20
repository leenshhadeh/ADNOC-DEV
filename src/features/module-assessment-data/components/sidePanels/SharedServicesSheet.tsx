import ActionSheet from '@/shared/components/ActionSheet'
import { RadioCell } from '@/shared/components/table-primitives'
import { Button } from '@/shared/components/ui/button'

const GCs = [
  'ADNOC Gas',
  'ADNOC Drilling',
  'ADNOC HQ',
  'ADNOC Distribution',
  'Borouge',
  'ADNOC Onshore',
  'ADNOC Offshore',
  'ADNOC Al Dhafra and Al Yasat',
  'ADNOC Refining',
  'ADNOC Sour Gas',
]

const SharedServicesSheet = (props: any) => {
  const { open = true, process = { name: 'Define basin framework' }, handleOpenChange } = props

  return (
    <ActionSheet
      title="Shared Service"
      open={open}
      onOpenChange={handleOpenChange}
      subTitle="Manage Shared Service status per Group Company."
    >
      {/* Process info */}
      <div className="shrink-0 border-b px-6 py-4">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">Process</p>
        <p className="text-foreground mt-0.5 text-sm font-medium">{process.name}</p>
      </div>

      {/* Column headers */}
      <div className="bg-muted grid shrink-0 grid-cols-2 gap-4 border-b px-6 py-3">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Group Company
        </p>
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Shared Service Process
        </p>
      </div>

      {/* Scrollable rows */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {GCs.map((GC) => (
          <div key={GC} className="grid grid-cols-2 gap-4 border-b px-6 py-4 last:border-0">
            <p className="text-foreground text-sm">{GC}</p>
            <div>
              <RadioCell value={false} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-border shrink-0 px-6 py-4">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleOpenChange}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-full"
            onClick={() => handleOpenChange('saved')}
          >
            Save
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default SharedServicesSheet

import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { BUData } from '../../constants/org-mapping-data'

const BUSheet = (props: any) => {
  const { open = true, handleOpenChange, title } = props
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')

  return (
    <ActionSheet title={title || 'Business Unit'} open={open} onOpenChange={handleOpenChange}>
      {/* Search */}
      <div className="shrink-0 px-6 pt-4 pb-2">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-xl border py-2.5 ps-11 pe-4 text-sm outline-none"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
        <div className="rounded-xl border p-4">
          <TreeSelect data={BUData} selected={selected} onChange={setSelected} />
        </div>
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
            onClick={() => handleOpenChange(selected)}
          >
            Save
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default BUSheet

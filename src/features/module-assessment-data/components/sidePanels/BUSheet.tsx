import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect, type TreeNode } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useProcessBU } from '../../hooks/useProcessBU'

function filterTreeData(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return nodes
  const lowerQuery = query.toLowerCase()
  return nodes.reduce<TreeNode[]>((acc, node) => {
    const label = node.label.toLowerCase()
    const filteredChildren = filterTreeData(node.children ?? [], query)
    if (label.includes(lowerQuery) || filteredChildren.length > 0) {
      acc.push({ ...node, children: filteredChildren })
    }
    return acc
  }, [])
}

interface BUSheetProps {
  open?: boolean
  title?: string
  selected?: string[]
  handleOpenChange: (value?: string[]) => void
  onClose?: () => void
  fieldValue?: string
}

// Renders the BU selection sheet and syncs its values with the process BU APIs.
const BUSheet = ({
  open = true,
  handleOpenChange,
  selected = [],
  title,
  onClose,
  fieldValue,
}: BUSheetProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(selected)
  const [search, setSearch] = useState('')
  const { businessUnits } = useProcessBU()

  // React's "adjusting state during render" pattern — resets selection when sheet opens
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) setSelectedValues(selected)
  }

  // Closes the sheet when the sheet component itself requests a close action.
  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleOpenChange()
    }
  }

  // Returns the selected BU list to the parent when the user saves.
  const handleSave = () => {
    handleOpenChange(selectedValues)
  }

  const filteredDTData = useMemo(
    () => filterTreeData(businessUnits as TreeNode[], search),
    [businessUnits, search],
  )

  const hasChanges = useMemo(() => {
    return JSON.stringify([...selectedValues].sort()) !== JSON.stringify([...selected].sort())
  }, [selectedValues, selected])

  return (
    <ActionSheet title={title || 'Business Unit'} open={open} onOpenChange={handleSheetOpenChange}>
      {/* Search */}
      <div className="shrink-0 px-6 pt-4 pb-2">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-8 w-full min-w-0 rounded-md border ps-11 pe-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
        <div className="rounded-xl border p-4">
          <TreeSelect
            data={filteredDTData}
            selected={selectedValues}
            onChange={setSelectedValues}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-border shrink-0 px-6 py-4">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full bg-[#C7D6F9]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-full"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            {fieldValue === 'businessUnit' ? 'Apply changes' : 'Save'}
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default BUSheet

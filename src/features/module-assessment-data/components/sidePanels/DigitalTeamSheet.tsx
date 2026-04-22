import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useProcessDigitalTeam } from '../../hooks/useProcessDigitalTeam'
import type { TreeNode } from '@/shared/components/TreeSelect'

interface DigitalTeamSheetProps {
  open?: boolean
  title?: string
  selected?: string[]
  handleOpenChange: (value?: string[]) => void
  onClose?: () => void
}

const getNodeLabel = (node: TreeNode) =>
  (node.label || '').toLowerCase()

const filterTreeData = (nodes: TreeNode[], query: string): TreeNode[] => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return nodes
  }

  return nodes.reduce<TreeNode[]>((acc, node) => {
    const filteredChildren = filterTreeData(node.children ?? [], normalizedQuery)
    const matchesCurrentNode = getNodeLabel(node).includes(normalizedQuery)

    if (matchesCurrentNode || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren,
      })
    }

    return acc
  }, [])
}

// Renders the digital team selection sheet and syncs its values with the digital team APIs.
const DigitalTeamSheet = ({
  open = true,
  handleOpenChange,
  selected = [],
  title,
  onClose,
}: DigitalTeamSheetProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(selected)
  const [search, setSearch] = useState('')
  const { digitalTeams } = useProcessDigitalTeam()

  useEffect(() => {
    setSelectedValues(selected)
  }, [selected])

  const filteredDigitalTeamData = useMemo(() => {
    return filterTreeData(digitalTeams, search)
  }, [digitalTeams, search])

  // Closes the sheet when the sheet component itself requests a close action.
  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleOpenChange()
    }
  }

  // Returns the selected digital team list to the parent when the user saves.
  const handleSave = () => {
    handleOpenChange(selectedValues)
  }

  return (
    <ActionSheet
      title={title || 'Responsible Digital Team'}
      open={open}
      onOpenChange={handleSheetOpenChange}
    >
      {/* Search */}
      <div className="shrink-0 px-6 pt-4 pb-2">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="ps-11 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-8 w-full min-w-0 rounded-md border pe-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
        <div className="rounded-xl border p-4">
          <TreeSelect
            data={filteredDigitalTeamData}
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
            className="flex-1 rounded-full"
            onClick={onClose ?? (() => handleOpenChange())}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-full"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default DigitalTeamSheet

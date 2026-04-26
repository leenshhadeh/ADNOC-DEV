import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import { BUData, DigitalTeam } from '../../constants/org-mapping-data'

type TreeNode = {
  label: string
  value: string
  children?: TreeNode[]
}

type ApiPayload = {
  unit: string
  subUnits: string[]
}

const OrgMappingSheet = (props: any) => {
  const { open = true, handleOnSubmitData, title, handleOpenChange, currentOrgData } = props

  const [selectedBU, setSelectedBU] = useState<any[]>(currentOrgData.BU[0]?.subUnits)
  const [selectedDT, setSelectedDT] = useState<any[]>(currentOrgData.DT[0]?.subUnits)
  const [activeStep, setActiveStep] = useState<'unit' | 'team'>('unit')
  const [orgBUData, setOrgBUData] = useState<any[]>([])
  const [orgDTData, setOrgDTData] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setOrgBUData(BUData)
    setOrgDTData(DigitalTeam)
  }, [])

  // reset search when switching between steps
  useEffect(() => {
    setSearchValue('')
  }, [activeStep])

  const filterTreeData = (nodes: any[], query: string): any[] => {
    if (!query.trim()) return nodes

    const lowerQuery = query.toLowerCase()

    return nodes.reduce((acc: any[], node: any) => {
      const label =
        node.label?.toLowerCase?.() ||
        node.name?.toLowerCase?.() ||
        node.title?.toLowerCase?.() ||
        ''

      const children = node.children || []
      const filteredChildren = filterTreeData(children, query)

      if (label.includes(lowerQuery) || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
        })
      }

      return acc
    }, [])
  }

  const filteredBUData = useMemo(() => {
    return filterTreeData(orgBUData, searchValue)
  }, [orgBUData, searchValue])

  const filteredDTData = useMemo(() => {
    return filterTreeData(orgDTData, searchValue)
  }, [orgDTData, searchValue])

  const handleCancel = () => {
    handleOpenChange?.(false)
  }

  const mapSelectedToUnits = (tree: TreeNode[], selectedValues: string[]): ApiPayload[] => {
    const selectedSet = new Set(selectedValues.map((item) => item.toLowerCase()))
    const grouped: Record<string, string[]> = {}

    const traverse = (nodes: TreeNode[], topParentLabel?: string) => {
      for (const node of nodes) {
        const currentTopParent = topParentLabel ?? node.label
        const nodeValue = node.value.toLowerCase()

        if (selectedSet.has(nodeValue)) {
          if (!grouped[currentTopParent]) {
            grouped[currentTopParent] = []
          }
          grouped[currentTopParent].push(node.value)
        }

        if (node.children?.length) {
          traverse(node.children, currentTopParent)
        }
      }
    }

    traverse(tree)

    return Object.entries(grouped).map(([unit, subUnits]) => ({
      unit,
      subUnits,
    }))
  }

  const onSubmit = () => {
    const formattedBU = mapSelectedToUnits(BUData, selectedBU)
    const formattedDT = mapSelectedToUnits(DigitalTeam, selectedDT)
    handleOnSubmitData({
      BU: formattedBU,
      DT: formattedDT,
    })
    setActiveStep('unit')
  }

  return (
    <ActionSheet title={title} open={open} onOpenChange={handleOpenChange}>
      <div className="relative flex-1 overflow-hidden">
        {/* progress */}
        <div>
          <div className="m-4 flex items-center gap-2">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div className="bg-brand-blue h-2 rounded-full"></div>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              {activeStep === 'team' && <div className="bg-brand-blue h-2 rounded-full"></div>}
            </div>
            <span className="text-foreground text-sm">
              <span className="text-primary text-[14px] font-bold">
                {activeStep === 'team' ? 2 : 1}
              </span>
              /2
            </span>
          </div>
        </div>

        {/* title and search input */}
        <div className="m-4">
          <p className="text-md text-muted-foreground mb-1">
            {activeStep === 'unit' ? 'Business Unit' : 'Responsible Digital Team'}
          </p>

          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-8 w-full min-w-0 rounded-md border px-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2"
          />
        </div>

        {/* Main scrollable body */}
        <div className="m-4 h-full overflow-y-scroll rounded-md border p-3">
          {activeStep === 'unit' && (
            <TreeSelect data={filteredBUData} selected={selectedBU} onChange={setSelectedBU} />
          )}

          {activeStep === 'team' && (
            <TreeSelect data={filteredDTData} selected={selectedDT} onChange={setSelectedDT} />
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="border-border shrink-0 px-6 py-4">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          {activeStep === 'unit' ? (
            <Button
              type="button"
              className="flex-1 rounded-full"
              onClick={() => setActiveStep('team')}
            >
              Next
            </Button>
          ) : (
            <Button type="button" className="flex-1 rounded-full" onClick={() => onSubmit()}>
              Save
            </Button>
          )}
        </div>
      </div>
    </ActionSheet>
  )
}

export default OrgMappingSheet

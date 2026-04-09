import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export type TreeNode = {
  label: string
  value: string
  children?: TreeNode[]
}

type TreeSelectProps = {
  data: TreeNode[]
  selected: string[]
  onChange: (values: string[]) => void
}

const getAllNodeValues = (node: TreeNode): string[] => {
  return [node.value, ...(node.children?.flatMap(getAllNodeValues) ?? [])]
}
const getAllExpandableKeys = (nodes: TreeNode[]): Record<string, boolean> => {
  return nodes.reduce((acc, node) => {
    acc[node.value] = true

    if (node.children) {
      Object.assign(acc, getAllExpandableKeys(node.children))
    }

    return acc
  }, {} as Record<string, boolean>)
}

const isNodeChecked = (node: TreeNode, selectedSet: Set<string>): boolean => {
  const values = getAllNodeValues(node)
  return values.every((value) => selectedSet.has(value))
}

const isNodeIndeterminate = (
  node: TreeNode,
  selectedSet: Set<string>
): boolean => {
  const values = getAllNodeValues(node)
  const checkedCount = values.filter((value) => selectedSet.has(value)).length

  return checkedCount > 0 && checkedCount < values.length
}

const toggleNode = (node: TreeNode, selected: string[]): string[] => {
  const nodeValues = getAllNodeValues(node)
  const selectedSet = new Set(selected)
  const shouldSelectAll = !nodeValues.every((value) => selectedSet.has(value))

  if (shouldSelectAll) {
    nodeValues.forEach((value) => selectedSet.add(value))
  } else {
    nodeValues.forEach((value) => selectedSet.delete(value))
  }

  return Array.from(selectedSet)
}

const TreeCheckbox: React.FC<{
  checked: boolean
  indeterminate: boolean
  onChange: () => void
}> = ({ checked, indeterminate, onChange }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4"
    />
  )
}

export const TreeSelect: React.FC<TreeSelectProps> = ({
  data,
  selected,
  onChange,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    () => getAllExpandableKeys(data)
  )

  const selectedSet = useMemo(() => new Set(selected), [selected])

  const toggleExpand = (value: string) => {
    setExpanded((prev) => ({
      ...prev,
      [value]: !prev[value],
    }))
  }

  const renderNode = (node: TreeNode, level = 0): React.ReactNode => {
    const hasChildren = !!node.children?.length
    const isExpanded = expanded[node.value]
    const checked = isNodeChecked(node, selectedSet)
    const indeterminate = isNodeIndeterminate(node, selectedSet)

    return (
      <div key={node.value}>
        <div
          className="flex items-center gap-2 py-1 my-[10px]"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(node.value)}
              className="flex h-4 w-4 items-center justify-center"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="inline-block h-4 w-4" />
          )}

          <TreeCheckbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={() => onChange(toggleNode(node, selected))}
          />

          <span>{node.label}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return <div>{data.map((node) => renderNode(node))}</div>
}
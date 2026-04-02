import type { Level4Row } from '../../types'
import CellMenuOptions from '../CellMenuOptions'

interface Level4CellProps {
  item: Level4Row | null
}

/**
 * Renders an individual Level 4 process item (title + code + action menu),
 * or a "No Level 4 processes" placeholder when item is null.
 */
const Level4Cell = ({ item }: Level4CellProps) => {
  if (!item) {
    return (
      <span className="text-sm italic text-muted-foreground">No Level 4 processes</span>
    )
  }

  return (
    <div className="group/l4 flex w-full items-center gap-2">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground leading-tight">
          {item.level4Name}
        </span>
        <span className="text-xs text-muted-foreground">{item.level4Code}</span>
      </div>

      <CellMenuOptions item={item} />
    </div>
  )
}

export default Level4Cell

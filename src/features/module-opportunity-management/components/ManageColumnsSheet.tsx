import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, EyeOff, GripVertical, Search, X } from 'lucide-react'

// ── Column config ─────────────────────────────────────────────────────────────

const COLUMN_CONFIG: Record<string, { label: string; type: string; locked?: boolean }> = {
  name: { label: 'Name + Code', type: 'Read-only', locked: true },
  domain: { label: 'Domain', type: 'Read-only' },
  gcOwner: { label: 'GC Owner', type: 'Read-only' },
  applicability: { label: 'Opportunity Applicability', type: 'Read-only' },
  status: { label: 'Status', type: 'Read-only' },
  workflowStatus: { label: 'Lifecycle Stage', type: 'Read-only' },
  description: { label: 'Description', type: 'Input text' },
  aiOpportunity: { label: 'AI Opportunity', type: 'Input text' },
  businessValue: { label: 'Business Value', type: 'Dropdown' },
  estimatedEffort: { label: 'Estimated Effort', type: 'Dropdown' },
  priorityScore: { label: 'Priority Score', type: 'Input text' },
  implementationComplexity: { label: 'Implementation Complexity', type: 'Dropdown' },
  timeToValue: { label: 'Time to Value', type: 'Dropdown' },
  estimatedFteSavings: { label: 'Estimated FTE Savings', type: 'Input text' },
  estimatedCostSavingsAed: { label: 'Estimated Cost Savings (AED)', type: 'Input text' },
  estimatedRevenueImpactAed: { label: 'Estimated Revenue Impact (AED)', type: 'Input text' },
  riskLevel: { label: 'Risk Level', type: 'Dropdown' },
  technologyEnabler: { label: 'Technology Enabler', type: 'Tags' },
  owner: { label: 'Owner', type: 'Input text' },
  createdOn: { label: 'Created On', type: 'Read-only' },
  lastUpdated: { label: 'Last Updated', type: 'Read-only' },
}

// ── Sortable column item ──────────────────────────────────────────────────────

interface SortableColumnItemProps {
  id: string
  label: string
  type: string
  visible: boolean
  onToggleVisibility: () => void
}

const SortableColumnItem = ({
  id,
  label,
  type,
  visible,
  onToggleVisibility,
}: SortableColumnItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-border flex items-center gap-3 rounded-2xl border px-6 py-4 ${visible ? 'bg-white' : 'bg-white opacity-60'}`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-[#889096] active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <button
        type="button"
        onClick={onToggleVisibility}
        className="text-foreground hover:text-muted-foreground shrink-0 transition-colors"
        aria-label={visible ? 'Hide column' : 'Show column'}
      >
        {visible ? (
          <Eye size={16} className="text-foreground" />
        ) : (
          <EyeOff size={16} className="text-[#889096]" />
        )}
      </button>

      <span className="text-foreground min-w-0 flex-1 truncate text-[14px]">{label}</span>

      <span className="text-muted-foreground shrink-0 rounded-full bg-[#ECEDED] px-3 py-1 text-[12px]">
        {type}
      </span>
    </div>
  )
}

// ── Locked column item ────────────────────────────────────────────────────────

interface LockedColumnItemProps {
  label: string
  type: string
}

const LockedColumnItem = ({ label, type }: LockedColumnItemProps) => (
  <div className="border-border flex items-center gap-3 rounded-2xl border bg-[#F2F2F2] px-6 py-4">
    <GripVertical size={16} className="text-[#889096]" />
    <EyeOff size={16} className="text-[#889096]" aria-label="Column locked" />
    <span className="text-foreground min-w-0 flex-1 truncate text-[14px]">{label}</span>
    <span className="text-muted-foreground shrink-0 rounded-full bg-[#ECEDED] px-3 py-1 text-[12px]">
      {type}
    </span>
  </div>
)

// ── ManageColumnsSheet ────────────────────────────────────────────────────────

interface ManageColumnsSheetProps {
  open: boolean
  onClose: () => void
  columnOrder: string[]
  columnVisibility: Record<string, boolean>
  onColumnOrderChange: (newOrder: string[]) => void
  onColumnVisibilityChange: (visibility: Record<string, boolean>) => void
}

const ManageColumnsSheet = ({
  open,
  onClose,
  columnOrder,
  columnVisibility,
  onColumnOrderChange,
  onColumnVisibilityChange,
}: ManageColumnsSheetProps) => {
  const [search, setSearch] = useState('')
  const [localOrder, setLocalOrder] = useState<string[]>(columnOrder)

  useEffect(() => {
    if (open) {
      setLocalOrder(columnOrder.length > 0 ? columnOrder : Object.keys(COLUMN_CONFIG))
    }
  }, [open, columnOrder])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = localOrder.indexOf(String(active.id))
    const newIndex = localOrder.indexOf(String(over.id))
    if (oldIndex < 0 || newIndex < 0) return
    const newOrder = arrayMove(localOrder, oldIndex, newIndex)
    setLocalOrder(newOrder)
    onColumnOrderChange(newOrder)
  }

  const handleToggleVisibility = (id: string) => {
    const current = columnVisibility[id] !== false
    onColumnVisibilityChange({ ...columnVisibility, [id]: !current })
  }

  const filteredIds = localOrder.filter((id) => {
    const config = COLUMN_CONFIG[id]
    if (!config) return false
    return config.label.toLowerCase().includes(search.toLowerCase())
  })

  const sortableIds = filteredIds.filter((id) => !COLUMN_CONFIG[id]?.locked)

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog" aria-label="Manage Columns">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <aside className="absolute inset-y-0 right-0 flex w-[480px] flex-col bg-[#FDFDFD] shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]">
        {/* Header */}
        <div className="shrink-0 px-6 pt-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-[24px] font-[500] text-[#111827]">Manage Columns</h2>
              <p className="text-muted-foreground text-[16px] font-[400]">
                Drag columns to arrange them the way you want. Tap the view icon to hide or show any
                column.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-accent mt-1 shrink-0 rounded-full p-1 transition-colors"
              aria-label="Close manage columns panel"
            >
              <X className="text-muted-foreground size-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-6 mb-4">
            <Search className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search columns…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border text-foreground placeholder:text-muted-foreground w-full rounded-2xl border bg-white py-2.5 ps-9 pe-3 text-[14px] outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col gap-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                {filteredIds.map((id) => {
                  const config = COLUMN_CONFIG[id]
                  if (!config) return null
                  if (config.locked) {
                    return <LockedColumnItem key={id} label={config.label} type={config.type} />
                  }
                  const visible = columnVisibility[id] !== false
                  return (
                    <SortableColumnItem
                      key={id}
                      id={id}
                      label={config.label}
                      type={config.type}
                      visible={visible}
                      onToggleVisibility={() => handleToggleVisibility(id)}
                    />
                  )
                })}
              </SortableContext>
            </DndContext>

            {filteredIds.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-[14px]">
                No columns match your search.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}

export default ManageColumnsSheet

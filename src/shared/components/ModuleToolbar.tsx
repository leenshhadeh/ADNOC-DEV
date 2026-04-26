/**
 * ModuleToolbar — shared toolbar row used across data-module pages.
 *
 * Renders (left → right):
 *   [Tabs]  [Search input]  [Filter icon]  [Bulk action]  |  [action…]  |  [action…]
 *
 * Every element is opt-in via props — pass only what you need.
 */

import type { LucideProps } from 'lucide-react'
import { Layers, Search, X } from 'lucide-react'

import ShapeIcon from '@/assets/icons/Shape.svg?react'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { cn } from '../lib/utils'
import Dropdown from './ui/Dropdown'

// ── Public types ──────────────────────────────────────────────────────────────

export interface TabConfig {
  value: string
  label: string
}

export interface ToolbarAction {
  id: string
  label: string
  /** Any Lucide icon component */
  icon: React.ComponentType<LucideProps>
  onClick?: () => void
  disabled?: boolean
  /** Highlights the button as active (e.g. comment mode toggled on) */
  active?: boolean
}

export interface BulkModeState {
  isActive: boolean
  selectedCount: number
  onToggle: () => void
  /** Text shown on the confirm button. Default: "Add multiple" */
  actionLabel?: string
  onAction?: () => void
}

export interface ModuleToolbarProps {
  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabs?: TabConfig[]
  activeTab?: string
  onTabChange?: (value: string) => void
  moreOptions?: TabConfig[]

  // ── Search ────────────────────────────────────────────────────────────────
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showFilter?: boolean
  showSearch?: boolean

  // ── Filter ────────────────────────────────────────────────────────────────
  /** Called when the filter icon button is clicked */
  onFilterClick?: () => void
  /** When >0, shows a pill badge on the filter icon button */
  activeFilterCount?: number

  // ── Actions ───────────────────────────────────────────────────────────────
  /** Optional: renders the Bulk Action button (or active-selection pill) */
  bulkMode?: BulkModeState
  /** Additional action buttons rendered after a separator following bulk action */
  actions?: ToolbarAction[]
}

// ── Component ─────────────────────────────────────────────────────────────────

const ModuleToolbar = ({
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search',
  onFilterClick,
  activeFilterCount,
  bulkMode,
  actions = [],
  showFilter = true,
  showSearch = true,
  moreOptions,
}: ModuleToolbarProps) => {
  return (
    /**
     * Outer wrapper wraps naturally when the viewport is too narrow.
     *
     * Layout tiers:
     *   sm+  — [Tabs] [Search  Filter]  ···  [Actions]  (single row)
     *   <sm  — Row 1: [Tabs — full width, scrollable]
     *          Row 2: [Search  Filter]  [Actions → right]
     */
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {/* ── Tabs row ────────────────────────────────────────────────────────
           On mobile (< sm): basis-full forces tabs onto their own dedicated
           row so they never compete for space with search.
           On sm+: shrinks back to content width and sits inline with search. */}
      {((tabs && tabs.length > 0) || (moreOptions && moreOptions.length > 0)) && (
        <div className="w-full overflow-x-auto sm:w-auto sm:shrink-0 [&::-webkit-scrollbar]:hidden">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-fit gap-0">
            <TabsList className="font-small h-11 px-1.5">
              {tabs?.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    'h-8 rounded-xl px-4',
                    'font-light',
                    'data-[state=active]:font-medium',
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}

              {moreOptions && moreOptions.length > 0 && (
                <div className="flex h-8 rounded-xl">
                  <Dropdown
                    defaultValue="More"
                    options={moreOptions}
                    onValueChange={(newValue: string) => {
                      onTabChange?.(newValue)
                    }}
                    activeTab={activeTab}
                  />
                </div>
              )}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* ── Search + filter ─────────────────────────────────────────────────
           flex-1 + min-w-0 lets this row grow to fill remaining space on sm+;
           on mobile it is already on its own row so w-full inside is enough. */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showSearch && (
          <div className="relative w-full sm:max-w-[340px] sm:min-w-[180px] sm:flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="h-11 rounded-2xl ps-9 pe-3"
            />
          </div>
        )}

        {showFilter && (
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              aria-label="Open filters"
              onClick={onFilterClick}
            >
              <ShapeIcon className="size-4" />
            </Button>
            {activeFilterCount != null && activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Right group: bulk action + extra actions ─────────────────────────
           ms-auto keeps this group right-aligned even when it wraps to a new
           line (e.g. on very narrow viewports).                               */}
      <div className="ms-auto flex shrink-0 items-center">
        {/* Bulk action — active pill or default trigger button */}
        {bulkMode && (
          <>
            {bulkMode.isActive ? (
              bulkMode.onAction ? (
                <div className="border-primary/30 bg-primary/5 flex items-center gap-2 rounded-xl border px-3 py-1.5">
                  <span className="text-primary text-sm font-medium">
                    <span className="sm:hidden">{bulkMode.selectedCount}</span>
                    <span className="hidden sm:inline">{bulkMode.selectedCount} selected</span>
                  </span>
                  <Separator orientation="vertical" className="h-5" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10 h-7 px-2 text-xs font-medium disabled:opacity-40"
                    disabled={bulkMode.selectedCount === 0}
                    onClick={bulkMode.onAction}
                  >
                    <span className="hidden sm:inline">
                      {bulkMode.actionLabel ?? 'Add multiple'}
                    </span>
                    <span className="sm:hidden">✓</span>
                  </Button>
                  <Separator orientation="vertical" className="h-5" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Exit bulk selection"
                    onClick={bulkMode.onToggle}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : null
            ) : (
              <Button
                type="button"
                className="text-brand-blue h-9 bg-transparent px-3"
                onClick={bulkMode.onToggle}
              >
                <Layers className="size-4" />
                {/* Label hidden on very small screens */}
                <span className="hidden sm:inline">Bulk Action</span>
              </Button>
            )}

            {actions.length > 0 && <Separator orientation="vertical" className="h-8!" />}
          </>
        )}

        {/* Extra action buttons — icon-only on mobile, icon+label on sm+ */}
        {actions.map((action, index) => (
          <div key={action.id} className="flex items-center">
            {index > 0 && <Separator orientation="vertical" className="h-8!" />}
            <Button
              type="button"
              className={`text-brand-blue h-9 bg-transparent px-3 ${action.active ? 'bg-brand-blue/10' : ''}`}
              disabled={action.disabled}
              onClick={action.onClick}
              aria-label={action.label}
            >
              <action.icon className="size-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModuleToolbar

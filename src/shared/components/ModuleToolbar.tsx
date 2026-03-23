/**
 * ModuleToolbar — shared toolbar row used across data-module pages.
 *
 * Renders (left → right):
 *   [Tabs]  [Search input]  [Filter icon]  [Bulk action]  |  [action…]  |  [action…]
 *
 * Every element is opt-in via props — pass only what you need.
 */

import type { LucideProps } from 'lucide-react'
import { ChevronDown, Filter, Layers, Search, X } from 'lucide-react'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

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
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (value: string) => void

  // ── Search ────────────────────────────────────────────────────────────────
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string

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
  bulkMode,
  actions = [],
}: ModuleToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">

      {/* ── Left: pill tabs ──────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="gap-0">
        <TabsList className="h-11 rounded-2xl px-1.5">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="h-8 rounded-xl px-4">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ── Middle: search + filter ──────────────────────────────────────── */}
      <div className="relative w-full sm:w-[340px]">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue ?? ''}
          onChange={e => onSearchChange?.(e.target.value)}
          className="h-11 rounded-2xl ps-9 pe-3"
        />
      </div>

      <Button type="button" variant="ghost" size="icon" className="h-11 w-11">
        <Filter className="size-4" />
      </Button>

      {/* ── Right: bulk action + other actions ──────────────────────────── */}
      <div className="flex items-center">

        {/* Bulk action — active pill or default button */}
        {bulkMode && (
          <>
            {bulkMode.isActive ? (
              <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-1.5">
                <span className="text-sm font-medium text-primary">
                  {bulkMode.selectedCount} selected
                </span>
                <Separator orientation="vertical" className="h-5" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-40"
                  disabled={bulkMode.selectedCount === 0}
                  onClick={bulkMode.onAction}
                >
                  {bulkMode.actionLabel ?? 'Add multiple'}
                </Button>
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
            ) : (
              <Button
                type="button"
                className="bg-transparent h-9 px-3 text-[#0047BA]"
                onClick={bulkMode.onToggle}
              >
                <Layers className="size-4" />
                Bulk Action
                <ChevronDown className="size-4" />
              </Button>
            )}

            {actions.length > 0 && (
              <Separator orientation="vertical" className="hidden h-8 sm:block" />
            )}
          </>
        )}

        {/* Remaining actions with separators between them */}
        {actions.map((action, index) => (
          <div key={action.id} className="flex items-center">
            {index > 0 && (
              <Separator orientation="vertical" className="hidden h-8 sm:block" />
            )}
            <Button
              type="button"
              className="bg-transparent h-9 px-3 text-[#0047BA]"
              disabled={action.disabled}
              onClick={action.onClick}
            >
              <action.icon className="size-4" />
              {action.label}
            </Button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ModuleToolbar

import { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import { Button } from '@/shared/components/ui/button'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { ASSESSMENT_ACTIONS, ASSESSMENT_TABS } from '../constants/assessment-toolbar'

import AssessmentDataTable from './AssessmentDataTable'
import { ASSESSMENT_DATA } from '../constants/assessment-data'
import { ASSESSMENT_ENTITY_CONFIG } from '../types'

// ── Component ──────────────────────────────────────────────────────────────────

const AssessmentDataModule = () => {
  const [activeTab, setActiveTab] = useState('processes')
  const [search, setSearch] = useState('')

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Assessment Data Processes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Title bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-foreground text-xl font-semibold">Assessment Data Processes</h1>
        <Button variant="outline" size="sm" className="gap-1.5">
          Published processes
          <ChevronDown className="size-4" />
        </Button>
      </div>

      {/* ── Tabs + search + filter + toolbar ──────────────────────────── */}
      <div className="px-6 py-3">
        <ModuleToolbar
          tabs={ASSESSMENT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={search}
          onSearchChange={setSearch}
          bulkMode={{ isActive: false, selectedCount: 0, onToggle: () => {} }}
          actions={ASSESSMENT_ACTIONS}
        />
      </div>
      {/* ── Info bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-blue-50/60 px-6 py-2 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
        <Info className="size-4 shrink-0" />
        <span>
          You can edit values inline at the lowest level (L3 or L4) only. Editable cells are
          highlighted on hover.
        </span>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-6">
        <AssessmentDataTable data={ASSESSMENT_DATA} entityConfig={ASSESSMENT_ENTITY_CONFIG} />
      </div>
    </div>
  )
}

export default AssessmentDataModule

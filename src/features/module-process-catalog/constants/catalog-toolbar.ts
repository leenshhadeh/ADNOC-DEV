import { Download, Save, ShieldCheck, Upload } from 'lucide-react'

import type { TabConfig, ToolbarAction } from '@/shared/components/ModuleToolbar'

export const CATALOG_TABS: TabConfig[] = [
  { value: 'processes', label: 'Processes' },
  { value: 'myTasks', label: 'My Tasks' },
  { value: 'submittedRequests', label: 'Submitted Requests' },
]

export const CATALOG_ACTIONS: ToolbarAction[] = [
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'export', label: 'Export', icon: Download },
]

export const CATALOG_DRAFT_ACTIONS: ToolbarAction[] = [
  { id: 'save', label: 'Save', icon: Save },
  { id: 'validate', label: 'Validate', icon: ShieldCheck },
]

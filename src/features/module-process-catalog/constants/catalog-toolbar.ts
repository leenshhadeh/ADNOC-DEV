import { Download, Upload } from 'lucide-react'

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

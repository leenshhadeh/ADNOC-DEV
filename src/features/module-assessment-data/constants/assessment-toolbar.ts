import { Download, Settings2, Upload } from 'lucide-react'

import type { TabConfig, ToolbarAction } from '@/shared/components/ModuleToolbar'

export const ASSESSMENT_TABS: TabConfig[] = [
  { value: 'processes', label: 'Processes' },
  { value: 'my-tasks', label: 'My Tasks' },
  { value: 'submittedRequests', label: 'Submitted Requests' },
]

export const ASSESSMENT_ACTIONS: ToolbarAction[] = [
  { id: 'manage-columns', label: 'Manage columns', icon: Settings2 },
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'export', label: 'Export', icon: Download },
]

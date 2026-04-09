import { Download, Save, Send, Settings2, Upload } from 'lucide-react'

import type { TabConfig, ToolbarAction } from '@/shared/components/ModuleToolbar'

export const ASSESSMENT_TABS: TabConfig[] = [
  { value: 'processes', label: 'Processes' },
  { value: 'my-tasks', label: 'My Tasks' },
  { value: 'submittedRequests', label: 'Submitted Requests' },
]

/** Shown when bulk mode is NOT active */
export const ASSESSMENT_DEFAULT_ACTIONS: ToolbarAction[] = [
  { id: 'manage-columns', label: 'Manage columns', icon: Settings2 },
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'export', label: 'Export', icon: Download },
]

/** Shown when bulk mode IS active */
export const ASSESSMENT_BULK_ACTIONS: ToolbarAction[] = [
  { id: 'save', label: 'Save', icon: Save },
  { id: 'submit', label: 'Submit', icon: Send },
]

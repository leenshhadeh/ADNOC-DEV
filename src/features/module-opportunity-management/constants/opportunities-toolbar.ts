import { Download, Pencil, Plus, Settings2, Upload } from 'lucide-react'
import type { TabConfig, ToolbarAction } from '@/shared/components/ModuleToolbar'

export const OPPORTUNITY_TABS: TabConfig[] = [
  { value: 'opportunities', label: 'Opportunities' },
  { value: 'my-tasks', label: 'My Tasks' },
  { value: 'submitted-requests', label: 'Submitted Requests' },
]

export const OPPORTUNITY_DEFAULT_ACTIONS: ToolbarAction[] = [
  { id: 'manage-columns', label: 'Manage columns', icon: Settings2 },
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'export', label: 'Export', icon: Download },
]

export const OPPORTUNITY_ADD_ACTION: ToolbarAction = {
  id: 'add-new',
  label: '+ Add new',
  icon: Plus,
}

export const OPPORTUNITY_BULK_ACTION: ToolbarAction = {
  id: 'bulk-action',
  label: 'Bulk action',
  icon: Pencil,
}

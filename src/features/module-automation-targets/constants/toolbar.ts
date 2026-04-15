import type { ToolbarAction } from '@/shared/components/ModuleToolbar'

export const AUTOMATION_TARGETS_TABS = [
  { label: 'Processes', value: 'processes' },
  { label: 'My Tasks', value: 'myTasks' },
  { label: 'Submitted Requests', value: 'submittedRequests' },
]

export const AUTOMATION_TARGETS_BULK_ACTIONS: ToolbarAction[] = [
  {
    label: 'Submit',
    value: 'submit',
    variant: 'default',
  },
]

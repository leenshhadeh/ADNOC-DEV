import { exportSheet } from '@/shared/lib/excel'
import type { SheetColumn } from '@/shared/lib/excel'
import type { TaskItem } from '../types/my-tasks'

const MY_TASKS_COLUMNS: SheetColumn<TaskItem>[] = [
  { header: 'Process Name', key: 'processName', width: 36 },
  { header: 'Process Code', key: 'processCode', width: 18 },
  { header: 'Request ID', key: 'requestId', width: 16 },
  { header: 'Domain', key: 'domain', width: 24 },
  { header: 'Group Company', key: 'groupCompany', width: 22 },
  { header: 'Requester', key: 'requester', width: 22 },
  { header: 'Status', key: 'status', width: 20 },
  { header: 'Return Comment', key: 'returnComment', width: 30 },
  { header: 'Action Required', key: 'actionRequired', width: 24 },
  { header: 'Submitted On', key: 'submittedOn', width: 18 },
]

export interface MyTasksExportOptions {
  rows: TaskItem[]
  filename?: string
}

export async function exportMyTasksToExcel({
  rows,
  filename = 'my-tasks-export',
}: MyTasksExportOptions): Promise<void> {
  await exportSheet({
    rows,
    columns: MY_TASKS_COLUMNS,
    sheetName: 'My Tasks',
    filename,
    creator: 'ADNOC Assessment Data',
  })
}

import { useState, useCallback } from 'react'
import { useGetMyTasks } from './useGetMyTasks'
import { exportMyTasksToExcel } from '../utils/exportMyTasksToExcel'

interface UseMyTasksExportReturn {
  isExporting: boolean
  exportTasks: () => Promise<void>
}

export function useMyTasksExport(): UseMyTasksExportReturn {
  const [isExporting, setIsExporting] = useState(false)
  const { data: tasks } = useGetMyTasks()

  const exportTasks = useCallback(async () => {
    if (!tasks?.length) return
    setIsExporting(true)
    try {
      await exportMyTasksToExcel({ rows: tasks })
    } finally {
      setIsExporting(false)
    }
  }, [tasks])

  return { isExporting, exportTasks }
}

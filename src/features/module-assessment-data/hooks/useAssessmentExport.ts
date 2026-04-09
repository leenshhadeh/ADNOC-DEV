import { useState, useCallback } from 'react'
import type { FlatAssessmentRow } from '../types/process'
import { exportAssessmentToExcel } from '../utils/exportAssessmentToExcel'

interface UseAssessmentExportReturn {
  isExporting: boolean
  exportRows: (rows: FlatAssessmentRow[]) => Promise<void>
}

export function useAssessmentExport(): UseAssessmentExportReturn {
  const [isExporting, setIsExporting] = useState(false)

  const exportRows = useCallback(async (rows: FlatAssessmentRow[]) => {
    setIsExporting(true)
    try {
      await exportAssessmentToExcel({ rows })
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { isExporting, exportRows }
}

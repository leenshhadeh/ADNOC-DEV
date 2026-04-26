import { useMutation } from '@tanstack/react-query'
import {
  saveAssessmentDraftRows,
} from '../api/processAssesmentService'
import type { FlatAssessmentRow } from '../types/process'

// Calls the save API for changed assessment rows.
export function useSaveAssessmentDraftRows() {
  return useMutation({
    mutationFn: (rows: FlatAssessmentRow[]) => saveAssessmentDraftRows(rows),
  })
}



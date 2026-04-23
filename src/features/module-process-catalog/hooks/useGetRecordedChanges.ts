import { useQuery } from '@tanstack/react-query'
import type { ChangeLogEntry } from '../types'
import { getRecordedChanges } from '../api/processCatalogService'

export const recordedChangesQueryKeys = {
  byProcess: (processId: string) => ['recordedChanges', processId] as const,
}

export function useGetRecordedChanges(processId: string | undefined) {
  return useQuery<ChangeLogEntry[], Error>({
    queryKey: recordedChangesQueryKeys.byProcess(processId ?? ''),
    queryFn: () => getRecordedChanges(processId!),
    enabled: Boolean(processId),
    staleTime: 2 * 60 * 1_000,
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProcessSharedServices,
  updateProcessSharedServices,
  type ProcessSharedServiceItem,
  type UpdateProcessSharedServicesPayload,
} from '../api/processSharedServicesService'

const EMPTY_SHARED_SERVICES: ProcessSharedServiceItem[] = []

export const processSharedDataQueryKeys = {
  all: () => ['processSharedData'] as const,
  byProcessId: (processId: string) => ['processSharedData', processId] as const,
}

// Loads and updates the shared-services mapping for a single process.
export function useProcessSharedData(processId?: string) {
  const queryClient = useQueryClient()

  const processSharedDataQuery = useQuery<ProcessSharedServiceItem[], Error>({
    queryKey: processSharedDataQueryKeys.byProcessId(processId ?? ''),
    queryFn: () => getProcessSharedServices(processId ?? ''),
    staleTime: 30_000,
  })

  const updateProcessSharedDataMutation = useMutation({
    mutationFn: (payload: UpdateProcessSharedServicesPayload) => updateProcessSharedServices(payload),
    onSuccess: (_response, variables) => {
      queryClient.setQueryData(processSharedDataQueryKeys.byProcessId(variables.processId), [
        ...variables.processSharedServices,
      ])
    },
  })

  // Exposes the shared-services list together with the update action for the sheet.
  return {
    processSharedServices: processSharedDataQuery.data ?? EMPTY_SHARED_SERVICES,
    isLoading: processSharedDataQuery.isLoading,
    updateProcessSharedData: updateProcessSharedDataMutation.mutateAsync,
    isPending: updateProcessSharedDataMutation.isPending,
  }
}

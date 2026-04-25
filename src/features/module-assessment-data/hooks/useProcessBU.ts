import { useQuery } from '@tanstack/react-query'
import { getBusinessUnits } from '../api/processBUService'

export const processBUQueryKeys = {
  all: () => ['processBU'] as const,
}

// Loads the full BU tree for the BU sheet.
export function useProcessBU() {
  const processBUQuery = useQuery<any[], Error>({
    queryKey: processBUQueryKeys.all(),
    queryFn: () => getBusinessUnits(),
    staleTime: 86_400_000, // 24 hours
  })

  // Exposes the BU options returned by the API.
  return {
    businessUnits: processBUQuery.data ?? [],
    isLoadingProcessBU: processBUQuery.isLoading,
  }
}

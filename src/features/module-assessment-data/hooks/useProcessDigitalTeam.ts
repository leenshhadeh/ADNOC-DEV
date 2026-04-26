import { useQuery } from '@tanstack/react-query'
import { getDigitalTeams } from '../api/processDigitalTeamService'

export const processDigitalTeamQueryKeys = {
  all: () => ['processDigitalTeam'] as const,
}

// Loads the full digital team tree for the digital team sheet.
export function useProcessDigitalTeam() {
  const processDigitalTeamQuery = useQuery<any[], Error>({
    queryKey: processDigitalTeamQueryKeys.all(),
    queryFn: () => getDigitalTeams(),
    staleTime: 86_400_000,
  })

  // Exposes the digital team options returned by the API.
  return {
    digitalTeams: processDigitalTeamQuery.data ?? [],
    isLoadingProcessDigitalTeam: processDigitalTeamQuery.isLoading,
  }
}

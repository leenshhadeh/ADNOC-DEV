import { useQuery } from '@tanstack/react-query'
import { getAutomationTargets } from '../api/automationTargetsService'

export const useGetAutomationTargets = () => {
  return useQuery({
    queryKey: ['automation-targets'],
    queryFn: getAutomationTargets,
  })
}

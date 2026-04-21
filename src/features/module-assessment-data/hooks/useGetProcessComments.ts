import { useQuery } from '@tanstack/react-query'
import { getProcessComments , getProcessCommentsByFiled} from '../api/processAssesmentService'

export const processComments = {
  all: () => ['processComments'] as const,
  byCol:(fieldId:string)=>['processCommentsByField',fieldId] as const,
}

export function useGetProcessCommentsByField(processId:string,fieldId: string) {
  return useQuery<any[], Error>({
    queryKey: processComments.byCol(fieldId),
    queryFn: () => getProcessCommentsByFiled(fieldId),
    enabled: !!fieldId,
    staleTime: 2 * 60 * 1_000,
  })
}

export function useGetProcessComments(processId:string) {
  return useQuery<any[], Error>({
    queryKey: processComments.all(),
    queryFn: () => getProcessComments(),
    staleTime: 2 * 60 * 1_000,
  })
}
import { useMutation } from '@tanstack/react-query'
import { validateProcess } from '../api/automationTargetsService'

export const useValidateProcess = () => {
  return useMutation({
    mutationFn: (processId: string) => validateProcess(processId),
  })
}

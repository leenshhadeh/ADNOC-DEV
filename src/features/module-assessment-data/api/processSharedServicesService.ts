export interface ProcessSharedServiceItem {
  GC: string
  shared: boolean
}

export interface UpdateProcessSharedServicesPayload {
  processId: string
  processSharedServices: ProcessSharedServiceItem[]
}

export interface UpdateProcessSharedServicesResponse {
  message: string
}

export const processSharedServices: ProcessSharedServiceItem[] = [
  { GC: 'ADNOC Gas', shared: true },
  { GC: 'ADNOC Drilling', shared: true },
  { GC: 'ADNOC HQ', shared: false },
  { GC: 'ADNOC Distribution', shared: false },
  { GC: 'Borouge', shared: false },
  { GC: 'ADNOC Onshore', shared: false },
  { GC: 'ADNOC Offshore', shared: false },
  { GC: 'ADNOC Al Dhafra and Al Yasat', shared: false },
  { GC: 'ADNOC Refining', shared: false },
  { GC: 'ADNOC Sour Gas', shared: false },
]

// Returns the mock shared-services list for a process.
export function getProcessSharedServices(processId: string): Promise<ProcessSharedServiceItem[]> {
  void processId

  return new Promise((resolve) => {
    setTimeout(() => resolve([...processSharedServices]), 500)
  })
}

// Saves the shared-services list for a process and returns a success message.
export function updateProcessSharedServices({
  processId,
  processSharedServices,
}: UpdateProcessSharedServicesPayload): Promise<UpdateProcessSharedServicesResponse> {
  void processId
  void processSharedServices

  return new Promise((resolve) => {
    setTimeout(() => resolve({ message: 'Process shared services updated successfully.' }), 500)
  })
}

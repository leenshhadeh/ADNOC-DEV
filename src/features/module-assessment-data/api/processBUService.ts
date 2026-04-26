import { BUData } from '../constants/org-mapping-data'

// Returns list of Business units 
export function getBusinessUnits(): Promise<any[]> {
  // console.log('Call API [getProcessBU]')
  return new Promise((resolve) => {
    setTimeout(() => resolve(BUData), 500)
  })
}

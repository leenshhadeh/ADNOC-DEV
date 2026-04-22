import { DigitalTeam } from '../constants/org-mapping-data'

// Returns the full digital team tree used by the digital team sheet.
export function getDigitalTeams(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DigitalTeam), 500)
  })
}

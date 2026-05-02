import type { Opportunity } from '../types'
import { OPPORTUNITIES_DATA } from '../constants/opportunities-data'

const simulateDelay = (ms = 600) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getOpportunities(): Promise<Opportunity[]> {
  await simulateDelay()
  return [...OPPORTUNITIES_DATA]
}

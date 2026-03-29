export interface Level4Row {
  id: string
  level4Name: string
  level4Code: string
  /** Per-entity-site editable values for this L4 process. */
  entities: Record<string, Record<string, string>>

}

export interface AssessmentLevel3 {
  id: string
  level3Name: string
  level3Code: string
  level4Items: Level4Row[]
  groupCompany?: string
  status?:string

}

export interface AssessmentLevel2 {
  id: string
  level2Name: string
  level2Code: string
  level3Items: AssessmentLevel3[]
}

export interface AssessmentLevel1 {
  id: string
  level1Name: string
  level1Code: string
  level2Items: AssessmentLevel2[]

}

export interface AssessmentDomain {
  id: string
  domain: string
  level1Items: AssessmentLevel1[]
}

/** Defines one entity group and its sites for the matrix columns. */
export interface EntityConfig {
  name: string
  sites: string[]
}

export const ASSESSMENT_ENTITY_CONFIG: EntityConfig[] = [
  { name: 'ADNOC HQ', sites: ['Site', 'status', 'description','centrallyGovernedProcess','shared service','business unit','Process Criticality'] },
  // { name: 'ADNOC AL DHAFRA AND AL YASAT', sites: ['General', 'Site A'] },
]

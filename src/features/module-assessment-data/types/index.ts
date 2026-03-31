export interface Level4Row {
  id: string
  level4Name?: string
  level4Code?: string
  /** Per-entity-site editable values for this L4 process. */
  status?:any
  site?: string
  description?: string
  centrallyGovernedProcess?: string
  sharedService?: {services:number,shared:number}
  businessUnit?: string[]
  processCriticality?: string

}

export interface AssessmentLevel3 {
  id: string
  level3Name: string
  level3Code: string
  level4Items: Level4Row[]
  groupCompany?: string
  status?:string
  site?: string
  description?: string
  centrallyGovernedProcess?: string
  sharedService: {services:number,shared:number},
  businessUnit?: string[]
  ResponsibleDigitalTeam ?: string[]
  processCriticality?: string

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
  assmntCol: any
}

export const ASSESSMENT_ENTITY_CONFIG: EntityConfig[] = [
  { assmntCol: ['Site', 'status', 'description','centrallyGovernedProcess','sharedService','business unit','Responsible Digital Team','Process Criticality'] },
]

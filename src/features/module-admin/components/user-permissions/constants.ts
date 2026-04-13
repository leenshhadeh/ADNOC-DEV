import type { UserDirectoryItem } from './types'

export const groupCompanies = [
  { publicId: 'gc-guid-001', name: 'ADNOC HQ' },
  { publicId: 'gc-guid-002', name: 'ADNOC Drilling' },
  { publicId: 'gc-guid-003', name: 'ADNOC Sour Gas' },
  { publicId: 'gc-guid-004', name: 'Al Dhafra & Al Yasat' },
  { publicId: 'gc-guid-005', name: 'ADNOC Distribution' },
  { publicId: 'gc-guid-006', name: 'ADNOC Gas' },
  { publicId: 'gc-guid-007', name: 'ADNOC Logistics and Services' },
  { publicId: 'gc-guid-008', name: 'ADNOC Refining' },
  { publicId: 'gc-guid-009', name: 'ADNOC Offshore' },
  { publicId: 'gc-guid-010', name: 'ADNOC Onshore' },
  { publicId: 'gc-guid-011', name: 'ADNOC Global Trading' },
  { publicId: 'gc-guid-012', name: 'Borouge' },
] as const

export const domains = [
  { publicId: 'domain-guid-001', code: 'EXP', name: 'Exploration and planning' },
  { publicId: 'domain-guid-002', code: 'CAP', name: 'Capital Projects' },
  { publicId: 'domain-guid-003', code: 'ENG', name: 'Technical Engineering' },
  { publicId: 'domain-guid-004', code: 'DFS', name: 'Drilling and Field Services' },
  { publicId: 'domain-guid-005', code: 'PRD', name: 'Production' },
  { publicId: 'domain-guid-006', code: 'OPS', name: 'Sites Operations' },
  {
    publicId: 'domain-guid-007',
    code: 'AMIR',
    name: 'Assets Maintenance, Integrity and Reliability',
  },
  { publicId: 'domain-guid-008', code: 'REF', name: 'Refining' },
  { publicId: 'domain-guid-009', code: 'GAS', name: 'Gas Processing' },
  { publicId: 'domain-guid-010', code: 'PET', name: 'Petrochemicals' },
  { publicId: 'domain-guid-011', code: 'MKS', name: 'Marketing and Sales' },
  { publicId: 'domain-guid-012', code: 'RET', name: 'Retail Distribution' },
  { publicId: 'domain-guid-013', code: 'TRD', name: 'Trading' },
  { publicId: 'domain-guid-014', code: 'TIQ', name: 'Technical Innovation and Quality' },
  { publicId: 'domain-guid-015', code: 'LOG', name: 'Transportation and Logistics' },
  { publicId: 'domain-guid-016', code: 'PIN', name: 'Procurement and Inventory' },
  { publicId: 'domain-guid-017', code: 'HSE', name: 'Health, safety and environment' },
  { publicId: 'domain-guid-018', code: 'SLC', name: 'Sustainability and Low Carbon' },
  { publicId: 'domain-guid-019', code: 'SCP', name: 'Strategy and Corporate Planning' },
  { publicId: 'domain-guid-020', code: 'FIN', name: 'Finance' },
  { publicId: 'domain-guid-021', code: 'HR', name: 'Human Capital' },
  { publicId: 'domain-guid-022', code: 'LGC', name: 'Legal, Governance & Compliance' },
  { publicId: 'domain-guid-023', code: 'AUD', name: 'Audit and Assurance' },
  { publicId: 'domain-guid-024', code: 'IRM', name: 'Integrated Risk Management' },
  { publicId: 'domain-guid-025', code: 'BUS', name: 'Business Support' },
  { publicId: 'domain-guid-026', code: 'COM', name: 'Corporate Communications' },
  { publicId: 'domain-guid-027', code: 'IT', name: 'Digital, IT, Data and Cybersecurity' },
] as const

export type GroupCompanyItem = (typeof groupCompanies)[number]
export type DomainItem = (typeof domains)[number]

export type GroupCompanyWithDomains = GroupCompanyItem & {
  domains: readonly DomainItem[]
}

export const groupCompaniesWithDomains: GroupCompanyWithDomains[] = groupCompanies.map((group) => ({
  ...group,
  domains,
}))

export const userDirectory: UserDirectoryItem[] = [
  { id: 'u1', name: 'Fatima Al Nuaimi', email: 'fnuiaimi@adnoc.ae', img: '' },
  { id: 'u2', name: 'Ahmed Al Mansoori', email: 'amansoori@adnoc.ae', img: '' },
  { id: 'u3', name: 'Noor Al Hammadi', email: 'nhammadi@adnoc.ae', img: '' },
  { id: 'u4', name: 'Khalid Al Mazrouei', email: 'kmazrouei@adnoc.ae', img: '' },
  { id: 'u5', name: 'Khawla Al Ketbi', email: 'kketbi@adnoc.ae', img: '' },
]

export const availableRoles = [
  'Digital Focal Point',
  'Digital Admin',
  'Super Admin',
  'Opportunity Evaluator',
  'Opportunity Manager',
  'BPA Program Manager',
  'Digital VP',
  'Business Focal Point',
] as const

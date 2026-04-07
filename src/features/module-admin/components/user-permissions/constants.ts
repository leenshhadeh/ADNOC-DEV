import type { UserDirectoryItem } from './types'

export const groupCompanies = [
  { id: 'adnoc-hq', name: 'ADNOC HQ' },
  { id: 'adnoc-drilling', name: 'ADNOC Drilling' },
  { id: 'adnoc-sour-gas', name: 'ADNOC Sour Gas' },
  { id: 'al-dhafra-al-yasat', name: 'Al Dhafra & Al Yasat' },
  { id: 'adnoc-distribution', name: 'ADNOC Distribution' },
  { id: 'adnoc-gas', name: 'ADNOC Gas' },
  { id: 'adnoc-logistics-services', name: 'ADNOC Logistics and Services' },
  { id: 'adnoc-refining', name: 'ADNOC Refining' },
  { id: 'adnoc-offshore', name: 'ADNOC Offshore' },
  { id: 'adnoc-onshore', name: 'ADNOC Onshore' },
  { id: 'adnoc-global-trading', name: 'ADNOC Global Trading' },
  { id: 'borouge', name: 'Borouge' },
] as const

export const domains = [
  { id: 'exploration-and-planning', name: 'Exploration and planning' },
  { id: 'capital-projects', name: 'Capital Projects' },
  { id: 'technical-engineering', name: 'Technical Engineering' },
  { id: 'drilling-and-field-services', name: 'Drilling and Field Services' },
  { id: 'production', name: 'Production' },
  { id: 'sites-operations', name: 'Sites Operations' },
  {
    id: 'assets-maintenance-integrity-and-reliability',
    name: 'Assets Maintenance, Integrity and Reliability',
  },
  { id: 'refining', name: 'Refining' },
  { id: 'gas-processing', name: 'Gas Processing' },
  { id: 'petrochemicals', name: 'Petrochemicals' },
  { id: 'marketing-and-sales', name: 'Marketing and Sales' },
  { id: 'retail-distribution', name: 'Retail Distribution' },
  { id: 'trading', name: 'Trading' },
  { id: 'technical-innovation-and-quality', name: 'Technical Innovation and Quality' },
  { id: 'transportation-and-logistics', name: 'Transportation and Logistics' },
  { id: 'procurement-and-inventory', name: 'Procurement and Inventory' },
  { id: 'health-safety-and-environment', name: 'Health, safety and environment' },
  { id: 'sustainability-and-low-carbon', name: 'Sustainability and Low Carbon' },
  { id: 'strategy-and-corporate-planning', name: 'Strategy and Corporate Planning' },
  { id: 'finance', name: 'Finance' },
  { id: 'human-capital', name: 'Human Capital' },
  { id: 'legal-governance-and-compliance', name: 'Legal, Governance & Compliance' },
  { id: 'audit-and-assurance', name: 'Audit and Assurance' },
  { id: 'integrated-risk-management', name: 'Integrated Risk Management' },
  { id: 'business-support', name: 'Business Support' },
  { id: 'corporate-communications', name: 'Corporate Communications' },
  { id: 'digital-it-data-and-cybersecurity', name: 'Digital, IT, Data and Cybersecurity' },
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
  { id: 'u1', name: 'Fatima Al Nuaimi', email: 'fnuiaimi@adnoc.ae' },
  { id: 'u2', name: 'Ahmed Al Mansoori', email: 'amansoori@adnoc.ae' },
  { id: 'u3', name: 'Noor Al Hammadi', email: 'nhammadi@adnoc.ae' },
  { id: 'u4', name: 'Khalid Al Mazrouei', email: 'kmazrouei@adnoc.ae' },
  { id: 'u5', name: 'Khawla Al Ketbi', email: 'kketbi@adnoc.ae' },
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

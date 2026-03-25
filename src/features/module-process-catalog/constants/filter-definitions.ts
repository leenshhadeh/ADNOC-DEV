import type { FilterDefinition } from '@/shared/types/filters'

export const PROCESS_FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    id: 'applicability',
    label: 'Applicability',
    options: [
      { id: 'not-applicable', label: 'Not applicable to any group company' },
      { id: 'adnoc-al-dhafra', label: 'ADNOC Al Dhafra and Al Yasat' },
      { id: 'adnoc-gas', label: 'ADNOC Gas' },
      { id: 'adnoc-refining', label: 'ADNOC Refining' },
      { id: 'adnoc-logistics', label: 'ADNOC Logistics and Services' },
      { id: 'adnoc-onshore', label: 'ADNOC Onshore' },
      { id: 'adnoc-offshore', label: 'ADNOC Offshore' },
      { id: 'adnoc-distribution', label: 'ADNOC Distribution' },
      { id: 'adnoc-drilling', label: 'ADNOC Drilling' },
      { id: 'adnoc-global-trading', label: 'ADNOC Global Trading' },
      { id: 'adnoc-hq', label: 'ADNOC HQ' },
      { id: 'adnoc-sour-gas', label: 'ADNOC Sour Gas' },
      { id: 'borouge', label: 'Borouge' },
    ],
  },
  {
    id: 'domain',
    label: 'Domain',
    options: [
      { id: 'exploration-planning', label: 'Exploration & Planning' },
      { id: 'field-development', label: 'Field Development' },
      { id: 'production-operations', label: 'Production Operations' },
      { id: 'corporate-communications', label: 'Corporate Communications' },
      { id: 'finance', label: 'Finance' },
      { id: 'human-resources', label: 'Human Resources' },
      { id: 'information-technology', label: 'Information Technology' },
      { id: 'legal-compliance', label: 'Legal & Compliance' },
      { id: 'procurement', label: 'Procurement' },
      { id: 'sustainability', label: 'Sustainability' },
    ],
  },
]

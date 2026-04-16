import type { GroupCompanyRow } from './types'

export const initialGroupCompaniesData: GroupCompanyRow[] = [
  {
    id: '1',
    groupCompany: 'ADNOC Al Dhafra and Al Yasat',
    code: 'ADY',
    status: 'Active',
    sites: [
      { id: 's1', name: 'General', isDefault: true },
      { id: 's2', name: 'A' },
      { id: 's3', name: 'B' },
    ],
  },
  {
    id: '2',
    groupCompany: 'ADNOC Distribution',
    code: 'DIS',
    status: 'Archived',

    sites: [
      { id: 's1', name: 'General', isDefault: true },
      { id: 's5', name: 'A' },
    ],
  },
  {
    id: '3',
    groupCompany: 'ADNOC Drilling',
    code: 'DRI',
    status: 'Archived',
    sites: [{ id: 's1', name: 'General', isDefault: true }],
  },
  {
    id: '4',
    groupCompany: 'ADNOC Gas',
    code: 'GAS',
    status: 'Active',

    sites: [{ id: 's1', name: 'General', isDefault: true }],
  },
  {
    id: '5',
    groupCompany: 'ADNOC Global Trading',
    code: 'AGT',
    status: 'Active',

    sites: [
      { id: 's1', name: 'General', isDefault: true },
      { id: 's7', name: 'A' },
      { id: 's8', name: 'B' },
    ],
  },
  {
    id: '6',
    groupCompany: 'ADNOC Group Company',
    code: 'TST',
    status: 'Active',

    sites: [{ id: 's1', name: 'General', isDefault: true }],
  },
  {
    id: '7',
    groupCompany: 'ADNOC HQ',
    code: 'AHQ',
    status: 'Active',

    sites: [{ id: 's1', name: 'General', isDefault: true }],
  },
  {
    id: '8',
    groupCompany: 'ADNOC Logistics and Services',
    code: 'LNS',
    status: 'Active',

    sites: [
      { id: 's1', name: 'General', isDefault: true },
      { id: 's11', name: 'A' },
      { id: 's12', name: 'B' },
    ],
  },
  {
    id: '9',
    groupCompany: 'ADNOC Offshore',
    code: 'OFF',
    status: 'Active',

    sites: [{ id: 's1', name: 'General', isDefault: true }],
  },
  {
    id: '10',
    groupCompany: 'ADNOC Refining',
    code: 'REF',
    status: 'Archived',
    sites: [{ id: 's1', name: 'General', isDefault: true }],
  },
]

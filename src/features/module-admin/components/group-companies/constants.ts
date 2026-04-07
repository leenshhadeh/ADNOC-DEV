import type { GroupCompanyRow } from './types'

export const initialGroupCompaniesData: GroupCompanyRow[] = [
  {
    id: '1',
    groupCompany: 'ADNOC Al Dhafra and Al Yasat',
    code: 'ADY',
    sites: [
      { id: 's1', name: 'General' },
      { id: 's2', name: 'A' },
      { id: 's3', name: 'B' },
    ],
  },
  {
    id: '2',
    groupCompany: 'ADNOC Distribution',
    code: 'DIS',
    sites: [
      { id: 's4', name: 'General' },
      { id: 's5', name: 'A' },
    ],
  },
  {
    id: '3',
    groupCompany: 'ADNOC Drilling',
    code: 'DRI',
    sites: [],
  },
  {
    id: '4',
    groupCompany: 'ADNOC Gas',
    code: 'GAS',
    sites: [],
  },
  {
    id: '5',
    groupCompany: 'ADNOC Global Trading',
    code: 'AGT',
    sites: [
      { id: 's6', name: 'General' },
      { id: 's7', name: 'A' },
      { id: 's8', name: 'B' },
    ],
  },
  {
    id: '6',
    groupCompany: 'ADNOC Group Company',
    code: 'TST',
    sites: [{ id: 's9', name: 'General' }],
  },
  {
    id: '7',
    groupCompany: 'ADNOC HQ',
    code: 'AHQ',
    sites: [],
  },
  {
    id: '8',
    groupCompany: 'ADNOC Logistics and Services',
    code: 'LNS',
    sites: [
      { id: 's10', name: 'General' },
      { id: 's11', name: 'A' },
      { id: 's12', name: 'B' },
    ],
  },
  {
    id: '9',
    groupCompany: 'ADNOC Offshore',
    code: 'OFF',
    sites: [],
  },
  {
    id: '10',
    groupCompany: 'ADNOC Refining',
    code: 'REF',
    sites: [],
  },
]

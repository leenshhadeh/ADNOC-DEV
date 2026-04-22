import type { TaskItem } from '@features/module-assessment-data/types/my-tasks'
import { withSubRows } from '@features/module-assessment-data/types/my-tasks'

export const MY_TASKS: TaskItem[] = [
  withSubRows({
    id: 'task-1',
    processId: 'r1',
    groupCompany: 'ADNOC Onshore',
    processName: 'Establish fraud risk indicators',
    processCode: 'EXP.1.1.3',
    requestId: '9377353',
    domain: 'dom-011',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'Please revise section 2',
    actionRequired: 'Review and update',
    submittedOn: '08 Apr 2024',
    changes: [
      {
        id: 'c1-0',
        name: 'Automation level 1',
        comment:
          'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
      },
      {
        id: 'c1-1',
        name: 'Automation level 2',
        comment:
          'The proposed automation level of 75% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
      },
      {
        id: 'c1-2',
        name: 'Automation level 3',
        comment:
          'The proposed automation level of 85% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
      },
    ],
  }),
  withSubRows({
    id: 'task-2',
    processId: 'r2',
    groupCompany: 'ADNOC Onshore',
    processName: 'Prepare media materials and press releases',
    processCode: 'CC.2.1.1',
    requestId: '9377354',
    domain: 'dom-011',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'Please revise section 2',
    actionRequired: 'Review and update',
    submittedOn: '08 Apr 2024',
    changes: [
      {
        id: 'c2-0',
        name: 'Automation level',
        comment:
          'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
      },
    ],
  }),
  withSubRows({
    id: 'task-3',
    processId: 'r3',
    groupCompany: 'ADNOC Gas',
    processName: 'Conduct internal communications campaigns',
    processCode: 'CC.3.2.4',
    requestId: '9377355',
    domain: 'dom-011',
    stageCurrent: 2,
    stageTotal: 3,
    stageText: 'Under review',
    requester: 'Ahmed Al Muhairi',
    status: 'Under review',
    returnComment: undefined,
    actionRequired: 'Approve or return',
    submittedOn: '05 Apr 2024',
    changes: [
      {
        id: 'c3-0',
        name: 'Process Criticality',
        comment: 'Criticality should be elevated given impact scope.',
        oldValue: 'Low',
        newValue: 'Medium',
      },
      {
        id: 'c3-1',
        name: 'Total Personnel Executing (FTE)',
        comment: 'Updated FTE count based on latest org chart.',
        oldValue: '3',
        newValue: '5',
      },
    ],
  }),
]

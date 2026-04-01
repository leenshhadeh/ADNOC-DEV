import type { TaskItem } from '@features/module-assessment-data/types/my-tasks'
import { withSubRows } from '@features/module-assessment-data/types/my-tasks'

export const MY_TASKS: TaskItem[] = [
  withSubRows({
    id: 'task-1',
    processId: 'r1',
    groupCompany: 'ADNOC Onshore',
    processName: 'Establish fraud risk indicators',
    requestId: '9377353',
    domain: 'Corporate Communications',
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
        name: 'Automation level',
        comment: 'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
      },
      {
        name: 'Automation level',
        comment: 'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
      },
      {
        name: 'Automation level',
        comment: 'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
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
    requestId: '9377353',
    domain: 'Corporate Communications',
    stageCurrent: 1,
    stageTotal: 3,
    stageText: 'Pending updates',
    requester: 'Maryam Al Shamsi',
    status: 'Returned draft',
    returnComment: 'Please revise section 2',
    actionRequired: 'Review and update',
    submittedOn: '08 Apr 2024',
    changes: [{
      name: 'Automation level',
      comment: 'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
      oldValue: '10%',
      newValue: '40%'
    }
    ],
  }),

]
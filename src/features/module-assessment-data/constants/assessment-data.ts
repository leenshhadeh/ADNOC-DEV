import type { AssessmentDomain } from '../types'

export const ASSESSMENT_DATA: AssessmentDomain[] = [
  {
    id: 'd1',
    domain: 'Exploration & Planning',
    level1Items: [
      {
        id: 'l1-1',
        level1Name: 'Exploration',
        level1Code: 'EXP.1',
        level2Items: [
          {
            id: 'l2-1',
            level2Name: 'Regional Studies',
            level2Code: 'EXP.1.1',
            level3Items: [
              {
                id: 'l3-1',
                level3Name: 'Basin Modeling',
                level3Code: 'EXP.1.1.3',
                groupCompany: 'ADNOC SA',
                status:'Pending approval',
                level4Items: [
                  {
                    id: 'l4-1-1',
                    level4Name: 'Define basin framework',
                    level4Code: 'EXP.1.1.3.1',
                    entities: { 'ADNOC HQ': { 
                      General: 'R', 
                      'status': 'Published', 
                      'Site': 'A',
                      "description": 'Define the structural and stratigraphic framework of the basin, including major faults, horizons, and depositional environments.',
                      "centrallyGovernedProcess": 'Yes',
                      "sharedService": {services:12,shared:3},
                      "business unit": 'Exploration',
                      "process criticality": 'High',
                     } },
                  },
                  {
                    id: 'l4-1-2',
                    level4Name: 'Thermal history modeling',
                    level4Code: 'EXP.1.1.3.2',
                    entities: { 'ADNOC HQ': { General: 'A', 'status': 'Published', 'Site': 'A' ,                       
                      "description": 'Define the structural and stratigraphic framework of the basin, including major faults, horizons, and depositional environments.',
                      "centrallyGovernedProcess": 'Yes',
                      "sharedService": {services:12,shared:3},
                      "business unit": 'Exploration',
                      "process criticality": 'High'                    
                    } },
                  },
                  {
                    id: 'l4-1-3',
                    level4Name: 'Source rock maturity assessment',
                    level4Code: 'EXP.1.1.3.3', 
                    entities: {},
                  },
                  {
                    id: 'l4-1-4',
                    level4Name: 'Charge and migration modeling',
                    level4Code: 'EXP.1.1.3.4',
                    entities: { 'ADNOC HQ': { General: 'A', 'status': 'Published', 'Site': 'General',
                      "description": 'Define the structural and stratigraphic framework of the basin, including major faults, horizons, and depositional environments.',
                      "centrallyGovernedProcess": 'Yes',
                      "sharedService": {services:12,shared:3},
                      "business unit": 'Exploration',
                      "process criticality": 'High',
                     } },
                  },
                ],
              },
              {
                id: 'l3-2',
                level3Name: 'Geophysical Data Interpretation',
                level3Code: 'EXP.1.1.4',
                groupCompany: 'ADNOC HQ',
                status:'Pending approval',
                level4Items: [],
              },
            ],
          },
          {
            id: 'l2-2',
            level2Name: 'Play Assessment (PA)',
            level2Code: 'EXP.1.2',
            level3Items: [
              {
                id: 'l3-3',
                level3Name: 'Dashboard Exploration Test',
                level3Code: 'EXP.1.2.1',
                groupCompany: 'ADNOC HQ',
                status:'Pending approval',
                level4Items: [],
              },
              {
                id: 'l3-4',
                level3Name: 'Project & Workflow Strategy (PA-01)',
                level3Code: 'EXP.1.2.2',
                groupCompany: 'ADNOC HQ',
                status:'Pending approval',
                level4Items: [
                  {
                    id: 'l4-4-1',
                    level4Name: 'Define exploration KPIs',
                    level4Code: 'EXP.1.2.2.1',
                    entities: {},
                  },
                ],
              },
              {
                id: 'l3-5',
                level3Name: 'Regional Data Gathering & QC (PA-02)',
                level3Code: 'EXP.1.2.3',
                groupCompany: 'ADNOC HQ',
                status:'Pending approval',
                level4Items: [
                  {
                    id: 'l4-5-1',
                    level4Name: 'Seismic data conditioning',
                    level4Code: 'EXP.1.2.3.1',
                    entities: {},
                  },
                  {
                    id: 'l4-5-2',
                    level4Name: 'Regional seismic interpretation',
                    level4Code: 'EXP.1.2.3.2',
                    entities: {},
                  },
                ],
              },
              {
                id: 'l3-6',
                level3Name: 'Regional Subsurface Interpretation',
                level3Code: 'EXP.1.2.4',
                groupCompany:'ADNOC HQ',
                status:'Pending approval',
                level4Items: [
                  {
                    id: 'l4-9-1',
                    level4Name: 'Define basin framework',
                    level4Code: 'EXP.1.5.3.1',
                    entities: { 'ADNOC HQ': { 
                      General: 'R', 
                      'status': 'Published', 
                      'Site': 'A',
                      "description": 'Define the structural and stratigraphic framework of the basin, including major faults, horizons, and depositional environments.',
                      "centrallyGovernedProcess": 'Yes',
                      "sharedService": {services:12,shared:3},
                      "business unit": 'Exploration',
                      "process criticality": 'High',
                     } },
                  }],
              },
            ],
          },
        ],
      },
      {
        id: 'l1-2',
        level1Name: 'Field Development Planning',
        level1Code: 'EXP.2',
        level2Items: [
          {
            id: 'l2-3',
            level2Name: 'Subsurface Modeling',
            level2Code: 'EXP.2.1',
            level3Items: [
              {
                id: 'l3-7',
                level3Name: 'Static Model Construction',
                level3Code: 'EXP.2.1.1',
                groupCompany: 'ADNOC HQ',
                status:'Pending approval',
                level4Items: [
                  {
                    id: 'l4-7-1',
                    level4Name: 'Structural framework build',
                    level4Code: 'EXP.2.1.1.1',
                    entities: {},
                  },
                  {
                    id: 'l4-7-2',
                    level4Name: 'Facies and property modelling',
                    level4Code: 'EXP.2.1.1.2',
                    entities: {},
                  },
                ],
              },
              {
                id: 'l3-8',
                level3Name: 'Play Fairway Evaluation & Risk Assessment',
                level3Code: 'EXP.2.1.2',
                groupCompany: 'ADNOC HQ',
                status:'Pending approval',
                level4Items: [],
              },
            ],
          },
        ],
      },
    ],
  },
]

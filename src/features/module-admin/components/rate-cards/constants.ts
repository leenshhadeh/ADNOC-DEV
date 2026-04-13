import type { RateCardCompanyRow } from './types'
export const initialRateCardsData: RateCardCompanyRow[] = [
  {
    id: 'company-1',
    groupCompany: {
      id: 'gc-1',
      name: 'ADNOC Sour Gas',
    },
    domains: [
      {
        id: 'domain-1',
        name: 'Exploration & Planning',
        code: 'EXP',
        level1Items: [
          {
            id: 'l1-1',
            name: 'Exploration',
            code: 'EXP.1',
            level2Items: [
              {
                id: 'l2-1',
                name: 'Regional studies',
                code: 'EXP.1.1',
                level3Items: [
                  {
                    id: 'l3-1',
                    name: 'Basin Modeling',
                    code: 'EXP.1.1.3',
                    level4Items: [
                      {
                        id: 'l4-1',
                        name: 'Define basin framework',
                        code: 'EXP.1.1.3.1',
                        rateCardValue: 100,
                      },
                      {
                        id: 'l4-2',
                        name: 'Thermal history modeling',
                        code: 'EXP.1.1.3.2',
                        rateCardValue: 1285.375,
                      },
                    ],
                  },
                  {
                    id: 'l3-2',
                    name: 'Geophysical data interpretation',
                    code: 'EXP.1.1.4',
                    level4Items: [
                      {
                        id: 'l4-3',
                        name: 'Source rock maturity assessment',
                        code: 'EXP.1.1.4.1',
                        rateCardValue: 1334,
                      },
                    ],
                  },
                ],
              },
              {
                id: 'l2-2',
                name: 'Play Assessment',
                code: 'EXP.1.2',
                level3Items: [
                  {
                    id: 'l3-3',
                    name: 'Dashboard Exploration Test',
                    code: 'EXP.1.2.1',
                    rateCardValue: 150,
                  },
                  {
                    id: 'l3-4',
                    name: 'Project & Workflow Strategy',
                    code: 'EXP.1.2.2',
                    level4Items: [
                      {
                        id: 'l4-4',
                        name: 'Geological mapping techniques',
                        code: 'EXP.1.2.2.1',
                        rateCardValue: 1805,
                      },
                      {
                        id: 'l4-5',
                        name: 'Hydrocarbon reservoir evaluation',
                        code: 'EXP.1.2.2.2',
                        rateCardValue: 190,
                      },
                      {
                        id: 'l4-6',
                        name: 'Petrophysical property analysis',
                        code: 'EXP.1.2.2.3',
                        rateCardValue: 250,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

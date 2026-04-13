export const BUData = [
  {
    label: 'Shared Service',
    value: 'shared-service',
    children: [
      {
        label: 'Procurement',
        value: 'procurement',
        children: [
          {
            label: 'Strategic Sourcing',
            value: 'strategic-sourcing',
            children: [
              {
                label: 'Supplier Evaluation',
                value: 'supplier-evaluation',
              },
              {
                label: 'Inventory Control',
                value: 'Inventory Control',
              },
            ],
          },
        ],
      },
      {
        label: 'Payment Processing',
        value: 'Payment Processing',
        children: [
          {
            label: 'Vendor Reconciliation',
            value: 'Invoice Processing',
            children: [
              { label: 'onlne Invoice', value: 'v1' },
              { label: 'offline Invoice', value: 'v2' },
            ],
          },
        ],
      },
    ],
  },
  { label: 'Finance & Accounting', value: 'shared-service', children: [] },
]

export const DigitalTeam = [
  {
    label: 'Business Support',
    value: 'Business Support',
    children: [
      {
        label: 'Digital Operations',
        value: 'Digital Operations',
      },
      {
        label: 'Business Support',
        value: 'Business Support',
      },
      {
        label: 'Data Analytics',
        value: 'Data Analytics',
      },
    ],
  },
  {
    label: 'Enterprise Technology',
    value: 'Enterprise Technology',
    Children: [
      {
        label: 'Infrastructure Services',
        value: 'Infrastructure Services',
        Children: [
          {
            label: 'Application Services',
            value: 'Application Services',
          },
          {
            label: 'Cybersecurity',
            value: 'Cybersecurity',
          },
        ],
      },
    ],
  },
]

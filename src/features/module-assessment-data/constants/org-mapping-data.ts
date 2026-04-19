export const BUData = [
  {
    label: 'Shared service',
    value: 'shared service',
    children: [
      {
        label: 'Procurement',
        value: 'procurement',
        children: [
          {
            label: 'Strategic Sourcing',
            value: 'strategic sourcing',
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
            value: 'Vendor Reconciliation',
            children: [
              { label: 'onlne Invoice', value: 'onlne Invoice' },
              { label: 'offline Invoice', value: 'offline Invoice' },
            ],
          },
        ],
      },
    ],
  },
  { label: 'Finance & Accounting', value: 'Finance & Accounting', children: [ { label: 'Tax', value: 'Tax' },] },
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

/**
 * Mock Level 4 data — placeholder until the .NET backend is ready.
 *
 * Structure mirrors the catalogue hierarchy used in the app:
 *   EXP.1.1.1  (Level 3: "Basin Modeling")
 *     EXP.1.1.1.1  Define basin framework
 *     EXP.1.1.1.2  Thermal history modeling
 *     EXP.1.1.1.3  Source rock evaluation
 *
 *   EXP.1.1.2  (Level 3: "Geophysical data Interpretation")
 *     EXP.1.1.2.1  2D seismic interpretation
 *     EXP.1.1.2.2  3D seismic attribute analysis
 *     EXP.1.1.2.3  Velocity model building
 *
 *   EXP.1.1.3  (Level 3: "Subsurface Interpretation")
 *     EXP.1.1.3.1  Structural mapping
 *     EXP.1.1.3.2  Stratigraphic correlation
 *
 * Replace the `parentId` values below with real UUIDs once the DB is seeded.
 */

import type { Level4Item } from '../types'

// Parent IDs — must match ProcessItem.id values in catalog-data.ts
const PARENT = {
  EXP_1_1_1: 'r1', // Basin Modeling
  EXP_1_1_2: 'r2', // Geophysical data Interpretation
  EXP_1_1_3: 'r3', // Dashboard Exploration Test
} as const

export const MOCK_LEVEL4_DATA: Level4Item[] = [
  // ── EXP.1.1.1 Basin Modeling ─────────────────────────────────────────────
  {
    id: 'l4-001',
    processCode: 'EXP.1.1.1.1',
    name: 'Define basin framework',
    description:
      'Defines the structural and stratigraphic framework of the basin to support basin-scale modeling.',
    status: 'Published',
    parentId: PARENT.EXP_1_1_1,
  },
  {
    id: 'l4-002',
    processCode: 'EXP.1.1.1.2',
    name: 'Thermal history modeling',
    description:
      'Models burial and thermal evolution to understand heat flow and maturation history.',
    status: 'Published',
    parentId: PARENT.EXP_1_1_1,
  },
  {
    id: 'l4-003',
    processCode: 'EXP.1.1.1.3',
    name: 'Source rock evaluation',
    description:
      'Evaluates source rock potential through geochemical analysis and organic richness assessment.',
    status: 'Published',
    parentId: PARENT.EXP_1_1_1,
  },

  // ── EXP.1.1.2 Geophysical Data Interpretation ────────────────────────────
  {
    id: 'l4-004',
    processCode: 'EXP.1.1.2.1',
    name: '2D seismic interpretation',
    description:
      'Interprets 2D seismic lines to identify subsurface structures and stratigraphic features.',
    status: 'Published',
    parentId: PARENT.EXP_1_1_2,
  },
  {
    id: 'l4-005',
    processCode: 'EXP.1.1.2.2',
    name: '3D seismic attribute analysis',
    description:
      'Extracts and analyses seismic attributes from 3D volumes to characterise reservoir properties.',
    status: 'Published',
    parentId: PARENT.EXP_1_1_2,
  },
  {
    id: 'l4-006',
    processCode: 'EXP.1.1.2.3',
    name: 'Velocity model building',
    description:
      'Constructs velocity models to support seismic depth conversion and structural imaging.',
    status: 'Draft',
    parentId: PARENT.EXP_1_1_2,
  },

  // ── EXP.1.1.3 Subsurface Interpretation ─────────────────────────────────
  {
    id: 'l4-007',
    processCode: 'EXP.1.1.3.1',
    name: 'Structural mapping',
    description:
      'Generates structural maps and cross-sections to define trap geometry and closure.',
    status: 'Published',
    parentId: PARENT.EXP_1_1_3,
  },
  {
    id: 'l4-008',
    processCode: 'EXP.1.1.3.2',
    name: 'Stratigraphic correlation',
    description:
      'Correlates stratigraphic units across wells and seismic data to establish the depositional framework.',
    status: 'Pending approval',
    parentId: PARENT.EXP_1_1_3,
  },
]

import { z } from 'zod'

// ── Add Level 4s (multi-step flow from L3 dropdown) ───────────────────────────

export const addLevel4ItemSchema = z.object({
  processName: z.string().min(1, 'Required'),
  processDescription: z.string().optional(),
})

/** Step 1 – select group companies & sites (multi-select) */
export const addLevel4sSelectionSchema = z.object({
  /** Array of "CompanyName - SiteName" strings */
  selectedCompanySites: z
    .array(z.string())
    .min(1, 'Please select at least one group company / site'),
})

/** Step 2 – add L4 rows */
export const addLevel4sFormSchema = z.object({
  groupCompany: z.string().min(1, 'Please select a group company'),
  selectedCompanySites: z.array(z.string()).min(1),
  items: z.array(addLevel4ItemSchema).min(1),
})

export type AddLevel4sFormValues = z.infer<typeof addLevel4sFormSchema>
export type AddLevel4Item = AddLevel4sFormValues['items'][number]
export type AddLevel4sSelectionValues = z.infer<typeof addLevel4sSelectionSchema>

// ── Edit Level 4s ─────────────────────────────────────────────────────────────

export const editLevel4RowSchema = z.object({
  processName: z.string().min(1, 'Required'),
  processDescription: z.string().optional(),
  status: z.enum(['Published', 'Draft']).default('Draft'),
})

export const editLevel4sFormSchema = z.object({
  rows: z.array(editLevel4RowSchema),
})

export type EditLevel4sFormValues = z.infer<typeof editLevel4sFormSchema>
export type EditLevel4Row = EditLevel4sFormValues['rows'][number]

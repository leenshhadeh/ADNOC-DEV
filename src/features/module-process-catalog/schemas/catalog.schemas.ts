import { z } from 'zod'

// ── Add Level 4s ──────────────────────────────────────────────────────────────

export const addLevel4ItemSchema = z.object({
  processCode: z.string(),
  processName: z.string().min(1, 'Required'),
  processDescription: z.string().optional(),
})

export const addLevel4sFormSchema = z.object({
  groupCompany: z.string().min(1, 'Please select a group company'),
  items: z.array(addLevel4ItemSchema).min(1),
})

export type AddLevel4sFormValues = z.infer<typeof addLevel4sFormSchema>
export type AddLevel4Item = AddLevel4sFormValues['items'][number]

// ── Edit Level 4s ─────────────────────────────────────────────────────────────

export const editLevel4RowSchema = z.object({
  processCode: z.string().min(1, 'Required'),
  processName: z.string().min(1, 'Required'),
  processDescription: z.string().optional(),
})

export const editLevel4sFormSchema = z.object({
  rows: z.array(editLevel4RowSchema),
})

export type EditLevel4sFormValues = z.infer<typeof editLevel4sFormSchema>
export type EditLevel4Row = EditLevel4sFormValues['rows'][number]

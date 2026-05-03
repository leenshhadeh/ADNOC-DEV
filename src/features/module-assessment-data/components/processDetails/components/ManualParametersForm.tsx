import { Input } from '@/shared/components/ui/input'
import { Select } from '@/shared/components/ui/select'
import React, { useState } from 'react'
import RichTextEditor from '@/shared/components/ui/RichTextEditor'
import { PROCESS_CYCLE } from '@/constants/dropdownOptions'
import CommentableField from '../CommentableField'
const ManualParametersForm = (props: any) => {
  const { process, isEditable } = props
  const [formData, setFormData] = useState({
    numberOfPeopleInvolved: process.numberOfPeopleInvolved || '',
    automationLevel: process.automationLevel || '',
    keyManualSteps: process.keyManualSteps || '',
    processRepetitionWithinCycle: process.processRepetitionWithinCycle || 0,
    totalPersonnelExecutingFTE: process.totalPersonnelExecutingFTE,
    totalProcessDurationDays: process.totalProcessDurationDays,
    timeSpentOnManualTasksPercent: process.timeSpentOnManualTasksPercent,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleKeyStepsChange = (val: string) => {
    setFormData((prev) => ({ ...prev, keyManualSteps: val }))
  }

  return (
    <div>
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* row 1 */}
        <CommentableField
          fieldId="numberOfPeopleInvolved"
          fieldName="How Often the Process Happens (Cycle)"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              {'How Often the Process Happens (Cycle)'}
            </label>
            <Select
              options={PROCESS_CYCLE.map((option) => ({
                label: option,
                value: option,
              }))}
              border
              value={formData.numberOfPeopleInvolved}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, numberOfPeopleInvolved: value }))
              }
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField
          fieldId="processRepetitionWithinCycle"
          fieldName="Number of Times the Process is Repeated within Selected Cycle"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              Number of Times the Process is Repeated within Selected Cycle
            </label>
            <Input
              value={formData.processRepetitionWithinCycle}
              onChange={handleChange}
              type="number"
              name="processRepetitionWithinCycle"
              min={0}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField
          fieldId="totalProcessDurationDays"
          fieldName="Total Process Duration (Days)"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Total Process Duration (Days)</label>
            <Input
              value={formData.totalProcessDurationDays}
              onChange={handleChange}
              type="number"
              name="totalProcessDurationDays"
              min={0}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        {/* row 2 */}
        <CommentableField
          fieldId="totalPersonnelExecutingFTE"
          fieldName="Total Personnel Executing the Process (FTE)"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              {' Total Personnel Executing the Process (FTE)'}
            </label>
            <Input
              value={formData.totalPersonnelExecutingFTE}
              onChange={handleChange}
              type="number"
              name="totalPersonnelExecutingFTE"
              min={0}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>
        <CommentableField
          fieldId="timeSpentOnManualTasksPercent"
          fieldName="Time Spent on Manual Tasks (%)"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              {'Time Spent on Manual Tasks (%)'}
            </label>
            <Input
              name="automationLevel"
              className="rounded-md border p-2"
              value={formData.automationLevel}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField fieldId="dailyRateCard" fieldName="Daily Rate Card (AED)">
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Daily Rate Card (AED)</label>
            <Input
              className="rounded-md border p-2"
              value={formData.automationLevel}
              onChange={handleChange}
              disabled
              name="automationLevel"
            />
          </div>
        </CommentableField>

        {/* row 3  */}
        <CommentableField fieldId="keyManualSteps" fieldName="Key Manual Steps">
          <div className="col-span-2 flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Key Manual Steps</label>
            <div className="">
              <RichTextEditor
                value={formData.keyManualSteps}
                onChange={(text: any) => handleKeyStepsChange(text)}
                disabled={!isEditable}
              />
            </div>
          </div>
        </CommentableField>
      </form>
    </div>
  )
}
export default ManualParametersForm

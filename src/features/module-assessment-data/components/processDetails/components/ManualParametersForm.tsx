import { Input } from '@/shared/components/ui/input'
import { Select } from '@/shared/components/ui/select'
import React, { useState } from 'react'
import RichTextEditor from '@/shared/components/ui/RichTextEditor'
import { PROCESS_CYCLE } from '@/constants/dropdownOptions'

const ManualParametersForm = (props: any) => {
  const { process } = props
  const [formData, setFormData] = useState({
    numberOfPeopleInvolved: process.numberOfPeopleInvolved || '',
    automationLevel: process.automationLevel || '',
    keyManualSteps: process.keyManualSteps || '',
    processRepetitionWithinCycle: process.processRepetitionWithinCycle || 0 ,
    totalPersonnelExecutingFTE: process.totalPersonnelExecutingFTE,
    totalProcessDurationDays: process.totalProcessDurationDays,
    timeSpentOnManualTasksPercent: process.timeSpentOnManualTasksPercent,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    debugger
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleKeyStepsChange = (val: String) => {
    setFormData((prev) => ({ ...prev, keyManualSteps: val }))
  }

  return (
    <div>
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* row 1 */}
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            {'How Often the Process Happens (Cycle)'}​
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
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            Number of Times the Process is Repeated within Selected Cycle
          </label>
          <Input
            value={formData.processRepetitionWithinCycle}
            onChange={handleChange}
            type="number"
            name='processRepetitionWithinCycle'
            min={0}
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Total Process Duration (Days)</label>
          <Input
            value={formData.totalProcessDurationDays}
            onChange={handleChange}
            type="number"
            name='totalProcessDurationDays'
            min={0}
          />
        </div>

        {/* row 2 */}
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            {' Total Personnel Executing the Process (FTE)'}
          </label>
          <Input
            value={formData.totalPersonnelExecutingFTE}
            onChange={handleChange}
            type="number"
            name='totalPersonnelExecutingFTE'
            min={0}
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            {'Time Spent on Manual Tasks (%)'}​
          </label>
          <Input
          name='automationLevel'
            className="rounded-md border p-2"
            value={formData.automationLevel}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Daily Rate Card (AED)</label>
          <Input
            className="rounded-md border p-2"
            value={formData.automationLevel}
            onChange={handleChange}
            disabled
            name='automationLevel'
          />
        </div>

        {/* row 3  */}
        <div className="col-span-2 flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Key Manual Steps​</label>
          <div className="">
            <RichTextEditor
              value={formData.keyManualSteps}
              onChange={(text: any) => handleKeyStepsChange(text)}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
export default ManualParametersForm

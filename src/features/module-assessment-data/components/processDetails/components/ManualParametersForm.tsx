import { Input } from '@/shared/components/ui/input'
import { Select } from '@/shared/components/ui/select'
import React, { useState } from 'react'
import { Editor } from 'primereact/editor'

const ManualParametersForm = (props: any) => {
  const { process } = props
  const [formData, setFormData] = useState({
    peopleInvoled: '',
    numberOfPeopleInvolved: process.numberOfPeopleInvolved || '',
    scaleOfProcess: process.scaleOfProcess || '',
    currentApplicationsSystems: process.currentApplicationsSystems || [],
    automationMaturityLevel: process.automationMaturityLevel || '',
    OngoingAutomationDigitalInitiatives: process.OngoingAutomationDigitalInitiatives || '',
    automationLevel: process.automationLevel || '',
    processCriticality: process.processCriticality || '',
    challengesAndNeeds: '',
    AIPowered: '',
    businessRecommendationForAutomation: 'should kept as it is',
    keyManualSteps: process.keyManualSteps || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* row 1 */}
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            {'How Often the Process Happens (Cycle)'}​
          </label>
          <Input
            className="rounded-md border p-2"
            onChange={handleChange}
            value={formData.processCriticality}
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            Number of Times the Process is Repeated within Selected Cycle
          </label>
          <Select
            options={['High (500-1000)', 'Medium (50-500)', 'Small (1-50)'].map((option) => ({
              label: option,
              value: option,
            }))}
            value={formData.numberOfPeopleInvolved}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, numberOfPeopleInvolved: value }))
            }
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Total Process Duration (Days)</label>
          <Select
            options={[
              'Medium: (bigger team within one department)',
              'Small: (100 - 200)',
              'Site-specific',
            ].map((option) => ({
              label: option,
              value: option,
            }))}
            value={formData.scaleOfProcess}
            onChange={(value) => setFormData((prev) => ({ ...prev, scaleOfProcess: value }))}
          />
        </div>

        {/* row 2 */}
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            {' Total Personnel Executing the Process (FTE)'}
          </label>
          <Select
            options={['Should be kept as is', 'Should be Automated'].map((option) => ({
              label: option,
              value: option,
            }))}
            value={formData.automationMaturityLevel}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, automationMaturityLevel: value }))
            }
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            {'Time Spent on Manual Tasks (%)'}​
          </label>
          <Input
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
          />
        </div>

        {/* row 3  */}
        <div className="col-span-2 flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Key Manual Steps​</label>
          <div className="rounded-[16px] border border-[#DFE3E6]">
            <Editor
              value={formData.keyManualSteps}
              onTextChange={(e: any) => handleChange(e.htmlValue)}
              className="text-editor"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
export default ManualParametersForm

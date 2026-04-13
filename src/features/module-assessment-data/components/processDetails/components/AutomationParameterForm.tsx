import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
import { DIGITAL_FP_USERS } from '../../../constants/CurrentApplication'
import { Select } from '@/shared/components/ui/select'
import React, { useState } from 'react'
import { RadioCell } from '@/shared/components/table-primitives'

const AutomationParameterForm = (props:any) => {
  const {process} = props
  const [formData, setFormData] = useState({
    peopleInvoled: '',
    numberOfPeopleInvolved: process.numberOfPeopleInvolved || '',
    scaleOfProcess: process.scaleOfProcess||'',
    currentApplicationsSystems: process.currentApplicationsSystems || [],
    automationMaturityLevel:process.automationMaturityLevel || '',
    OngoingAutomationDigitalInitiatives: process.OngoingAutomationDigitalInitiatives || '',
    automationLevel: process.automationLevel ||  '',
    processCriticality:process.processCriticality|| '',
    challengesAndNeeds: '',
    AIPowered:'',
    businessRecommendationForAutomation:'should kept as it is'
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
          <label className="text-muted-foreground text-sm">Process Criticality​</label>
          <Input
            className="rounded-md border p-2"
            onChange={handleChange}
            value={formData.processCriticality}
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Number of People Involved</label>
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
          <label className="text-muted-foreground text-sm">Scale of Process</label>
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
            Process Automation Maturity Level ​
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
          <label className="text-muted-foreground text-sm">{'Automation level (%)'}​</label>
          <Input
            className="rounded-md border p-2"
            value={formData.automationLevel}
            onChange={handleChange}
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Current Applications / Systems</label>
          <div className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-10 w-full min-w-0 rounded-md border p-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50">
            <TagsSelect
              tags={[
                {
                  id: 'user1',
                  name: 'Audit Management System (RSA Archer)',
                  img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
                },
              ]}
              allTags={DIGITAL_FP_USERS}
            />
          </div>
        </div>

        {/* row 3  */}

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
          Business Recommendation for Automation​
          </label>
          <Select
            options={['Should be kept as is', 'Should be Automated'].map((option) => ({
              label: option,
              value: option,
            }))}
            value={formData.businessRecommendationForAutomation}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, automationMaturityLevel: value }))
            }
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">
            Key Challenges & Automation Needs​
          </label>
          <Input
            className="rounded-md border p-2"
            onChange={handleChange}
            value={formData.challengesAndNeeds}
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Ongoing Digital Initiatives</label>
          <textarea
            name="processDescription"
            value={formData.OngoingAutomationDigitalInitiatives}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
          />
        </div>

               {/* row 4 , 2 radio */}

               <div className="flex w-full flex-col">
                  <label className="text-muted-foreground text-sm">AI-Powered​</label>
                  <RadioCell
                    value={formData.AIPowered}
                  />
               
               </div>
               <div className="flex w-full flex-col">
                  <label className="text-muted-foreground text-sm">AI-Powered​</label>
                  <RadioCell
                    value={formData.AIPowered}
                  />
               
               </div>
               <div className="flex w-full flex-col"></div>


           {/* row 5 textrea */}
           <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Ongoing Digital Initiatives</label>
          <textarea
            name="processDescription"
            value={formData.OngoingAutomationDigitalInitiatives}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
          />
        </div>

      </form>
    </div>
  )
}
export default AutomationParameterForm

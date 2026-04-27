import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { ASSESSMENT_APPLICATIONS } from '../../../constants/CurrentApplication'
import { Select } from '@/shared/components/ui/select'
import React, { useEffect, useState } from 'react'
import { RadioCell } from '@/shared/components/table-primitives'
import {
  AUTOMATION_MATURITY_LEVEL,
  BUSINESS_RECOMMENDATION_FOR_AUTOMATION,
  NUMBER_OF_PEOPLE_IMPACTED,
  PROCESS_CRITICALITY,
  SCALE_OF_PROCESS,
} from '@/constants/dropdownOptions'
import CommentableField from '../CommentableField'

const AutomationParameterForm = (props: any) => {
  const { process, isEditable, validateTrigger } = props
  const [formData, setFormData] = useState({
    peopleInvoled: process.numberOfPeopleInvolved || '',
    numberOfPeopleInvolved: process.numberOfPeopleInvolved || '',
    scaleOfProcess: process.scaleOfProcess || '',
    currentApplicationsSystems: process.currentApplicationsSystems || [],
    automationMaturityLevel: process.automationMaturityLevel || '',
    OngoingAutomationDigitalInitiatives: process.OngoingAutomationDigitalInitiatives || '',
    automationLevel: process.automationLevel || '',
    processCriticality: process.processCriticality || '',
    challengesAndNeeds: process.keyChallengesAutomationNeeds || '',
    AIPowered: process.AIPowered || '',
    AIPoweredUseCase: process.AIPoweredUseCase || '',
    businessRecommendationForAutomation: process.businessRecommendationForAutomation || '',
    autonomousUseCaseEnabled: process.autonomousUseCaseEnabled,
  })
  const [automationLevelError, setAutomationLevelError] = useState('')

  const validateAutomationLevel = (value: string, maturityLevel: string) => {
    const numericValue = Number.parseFloat(String(value).replace('%', '').trim())

    if (Number.isNaN(numericValue) || !maturityLevel) {
      setAutomationLevelError('')
      return
    }

    if (maturityLevel === 'Fully Automated' && numericValue !== 100) {
      setAutomationLevelError(
        'Automation level must be exactly 100% when maturity level is Fully Automated.',
      )
      return
    }

    if (maturityLevel === 'Medium' && numericValue <= 40) {
      setAutomationLevelError(
        'Automation level must be more than 40% when maturity level is Medium.',
      )
      return
    }

    if (maturityLevel === 'Low' && numericValue >= 40) {
      setAutomationLevelError('Automation level must be less than 40% when maturity level is Low.')
      return
    }

    setAutomationLevelError('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'automationLevel' && automationLevelError) {
      validateAutomationLevel(value, String(formData.automationMaturityLevel ?? ''))
    }
  }
  const handleRadioChange = (filed: string, value: string) => {
    setFormData((prev) => ({ ...prev, [filed]: value }))
  }

  useEffect(() => {
    if (validateTrigger > 0) {
      validateAutomationLevel(
        String(formData.automationLevel ?? ''),
        String(formData.automationMaturityLevel ?? ''),
      )
    }
  }, [validateTrigger, formData.automationLevel, formData.automationMaturityLevel])

  return (
    <div>
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* row 1 */}
        <CommentableField fieldId="processCriticality" fieldName="Process Criticality">
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Process Criticality​</label>
            <Select
              options={PROCESS_CRITICALITY.map((option) => ({
                label: option,
                value: option,
              }))}
              value={formData.processCriticality}
              onChange={(value) => setFormData((prev) => ({ ...prev, processCriticality: value }))}
              border
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField fieldId="numberOfPeopleInvolved" fieldName="Number of People Involved">
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Number of People Involved</label>
            <Select
              options={NUMBER_OF_PEOPLE_IMPACTED.map((option) => ({
                label: option,
                value: option,
              }))}
              value={formData.numberOfPeopleInvolved}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, numberOfPeopleInvolved: value }))
              }
              border
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField fieldId="scaleOfProcess" fieldName="Scale of Process">
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Scale of Process</label>
            <Select
              options={SCALE_OF_PROCESS.map((option) => ({
                label: option,
                value: option,
              }))}
              border
              value={formData.scaleOfProcess}
              onChange={(value) => setFormData((prev) => ({ ...prev, scaleOfProcess: value }))}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        {/* row 2 */}
        <CommentableField
          fieldId="automationMaturityLevel"
          fieldName="Process Automation Maturity Level"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              Process Automation Maturity Level ​
            </label>
            <Select
              name={'ProcessAutomationMaturityLevel'}
              options={AUTOMATION_MATURITY_LEVEL.map((option) => ({
                label: option,
                value: option,
              }))}
              border
              value={formData.automationMaturityLevel}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, automationMaturityLevel: value }))

                if (automationLevelError) {
                  validateAutomationLevel(String(formData.automationLevel ?? ''), value)
                }
              }}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>
        <CommentableField fieldId="automationLevel" fieldName="Automation level (%)">
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">{'Automation level (%)'}​</label>
            <Input
              name="automationLevel"
              className="rounded-md border p-2"
              value={formData.automationLevel}
              onChange={handleChange}
              disabled={!isEditable}
            />
            {automationLevelError && (
              <p className="mt-1 text-sm text-red-600">{automationLevelError}</p>
            )}
          </div>
        </CommentableField>

        <CommentableField
          fieldId="currentApplicationsSystems"
          fieldName="Current Applications / Systems"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Current Applications / Systems</label>
            <div className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-10 w-full min-w-0 rounded-md border p-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50">
              <TagsSelect
                tags={formData.currentApplicationsSystems}
                allTags={ASSESSMENT_APPLICATIONS}
                onChange={(tags: any[]) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentApplicationsSystems: tags || [],
                  }))
                }
                disabled={!isEditable}
              />
            </div>
          </div>
        </CommentableField>

        {/* row 3  */}

        <CommentableField
          fieldId="businessRecommendationForAutomation"
          fieldName="Business Recommendation for Automation"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              {' '}
              Business Recommendation for Automation{' '}
            </label>
            <Select
              options={BUSINESS_RECOMMENDATION_FOR_AUTOMATION.map((option) => ({
                label: option,
                value: option,
              }))}
              border
              value={formData.businessRecommendationForAutomation}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, businessRecommendationForAutomation: value }))
              }
              disabled={!isEditable}
            />
          </div>
        </CommentableField>
        <CommentableField
          fieldId="challengesAndNeeds"
          fieldName="Key Challenges & Automation Needs"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">
              Key Challenges & Automation Needs​
            </label>
            <Input
              className="rounded-md border p-2"
              onChange={handleChange}
              value={formData.challengesAndNeeds}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField
          fieldId="OngoingAutomationDigitalInitiatives"
          fieldName="Ongoing Digital Initiatives"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Ongoing Digital Initiatives</label>
            <Textarea
              name="processDescription"
              value={formData.OngoingAutomationDigitalInitiatives}
              onChange={handleChange}
              className="text-sm"
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        {/* row 4 , 2 radio */}

        <CommentableField fieldId="AIPowered" fieldName="AI-Powered">
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">AI-Powered​</label>
            <RadioCell
              value={formData.AIPowered}
              onValChange={(val: string) => handleRadioChange('AIPowered', val)}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>
        <CommentableField
          fieldId="autonomousUseCaseEnabled"
          fieldName="Autonomous Use-case Enabled"
        >
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">Autonomous Use-case Enabled​</label>
            <RadioCell
              value={formData.autonomousUseCaseEnabled}
              onValChange={(val: string) => handleRadioChange('autonomousUseCaseEnabled', val)}
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        {/* row 5 textrea */}
        <CommentableField fieldId="AIPoweredUseCase" fieldName="AI-Powered Use-case">
          <div className="flex w-full flex-col gap-2">
            <label className="text-muted-foreground text-sm">AI-Powered Use-case</label>
            <Textarea
              name="processDescription"
              value={formData.AIPoweredUseCase}
              onChange={handleChange}
              className="text-sm"
              disabled={!isEditable}
            />
          </div>
        </CommentableField>
      </form>
    </div>
  )
}
export default AutomationParameterForm

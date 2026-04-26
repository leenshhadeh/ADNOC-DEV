import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
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
import commentIcon from '@/assets/icons/Comment-circle.svg'

const AutomationParameterForm = (props: any) => {
  const { process, isEditable, canComment, showComments, validateTrigger } = props
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
        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Process Criticality​</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('processCriticality')}
                />
              </div>
            )}
          </div>
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

        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Number of People Involved</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('numberOfPeopleInvolved')}
                />
              </div>
            )}
          </div>
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

        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Scale of Process</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('scaleOfProcess')}
                />
              </div>
            )}
          </div>
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

        {/* row 2 */}
        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              Process Automation Maturity Level ​
            </label>{' '}
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('automationMaturityLevel')}
                />
              </div>
            )}
          </div>
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
        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">{'Automation level (%)'}​</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('automationLevel')}
                />
              </div>
            )}
          </div>
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

        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Current Applications / Systems</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('currentApplicationsSystems')}
                />
              </div>
            )}
          </div>
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

        {/* row 3  */}

        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              {' '}
              Business Recommendation for Automation{' '}
            </label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('businessRecommendationForAutomation')}
                />
              </div>
            )}
          </div>

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
        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              Key Challenges & Automation Needs​
            </label>{' '}
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('challengesAndNeeds')}
                />
              </div>
            )}
          </div>
          <Input
            className="rounded-md border p-2"
            onChange={handleChange}
            value={formData.challengesAndNeeds}
            disabled={!isEditable}
          />
        </div>

        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Ongoing Digital Initiatives</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('OngoingAutomationDigitalInitiatives')}
                />
              </div>
            )}
          </div>
          <textarea
            name="processDescription"
            value={formData.OngoingAutomationDigitalInitiatives}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
            disabled={!isEditable}
          />
        </div>

        {/* row 4 , 2 radio */}

        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">AI-Powered​</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('AIPowered')}
                />
              </div>
            )}
          </div>
          <RadioCell
            value={formData.AIPowered}
            onValChange={(val: string) => handleRadioChange('AIPowered', val)}
            disabled={!isEditable}
          />
        </div>
        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Autonomous Use-case Enabled​</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('autonomousUseCaseEnabled')}
                />
              </div>
            )}
          </div>
          <RadioCell
            value={formData.autonomousUseCaseEnabled}
            onValChange={(val: string) => handleRadioChange('autonomousUseCaseEnabled', val)}
            disabled={!isEditable}
          />
        </div>

        {/* row 5 textrea */}
        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">AI-Powered Use-case</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img
                  src={commentIcon}
                  width={'23px'}
                  className="mb-1"
                  onClick={() => showComments('AIPoweredUseCase')}
                />
              </div>
            )}
          </div>
          <textarea
            name="processDescription"
            value={formData.AIPoweredUseCase}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
            disabled={!isEditable}
          />
        </div>
      </form>
    </div>
  )
}
export default AutomationParameterForm

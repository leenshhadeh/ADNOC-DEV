import { Input } from '@/shared/components/ui/input'
import { Select } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { useState } from 'react'

const TargerRecommendationsForm = (props: any) => {
  const { process } = props
  const [formData] = useState({
    northStarTargetAutomation: process.northStarTargetAutomation,
    targetAutomationLevelPercent: process.targetAutomationLevelPercent || '',
    SMEFeedback: process.SMEFeedback || '',
    toBeAIPowered: process.toBeAIPowered || [],
    toBeAIPoweredComments: process.toBeAIPoweredComments || '',
  })

  return (
    <div className="mr-auto w-full max-w-2xl">
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* row 1 */}
        <div className="flex w-full flex-col gap-2">
          <label className="text-muted-foreground text-sm">“North Star” Target Automation</label>
          <Input
            className="rounded-md border p-2"
            value={formData.northStarTargetAutomation}
            disabled={true}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-muted-foreground text-sm">Target Automation Level (%)</label>
          <Select
            options={['High (500-1000)', 'Medium (50-500)', 'Small (1-50)'].map((option) => ({
              label: option,
              value: option,
            }))}
            value={formData.targetAutomationLevelPercent}
            disabled={true}
          />
        </div>

        {/* row 2 */}
        <div className="col-span-2 flex w-full flex-col gap-2">
          <label className="text-muted-foreground text-sm">SME Feedback</label>
          <Textarea
            name="processDescription"
            value={formData.SMEFeedback}
            disabled={true}
            className="text-sm"
            rows={8}
          />
        </div>

        {/* row 3 */}

        <div className="flex w-full flex-col gap-2">
          <label className="text-muted-foreground text-sm">To be AI-powered</label>
          <Select
            options={[{ label: formData.toBeAIPowered, value: formData.toBeAIPowered }]}
            value={formData.toBeAIPowered}
            disabled={true}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-muted-foreground text-sm">To be AI-powered comments</label>
          <Textarea
            name="processDescription"
            value={formData.toBeAIPoweredComments}
            disabled={true}
            className="text-sm"
            rows={4}
          />
        </div>
      </form>
    </div>
  )
}
export default TargerRecommendationsForm

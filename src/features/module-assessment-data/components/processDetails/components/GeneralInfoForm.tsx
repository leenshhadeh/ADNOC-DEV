import { useState } from 'react'
import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
import { DIGITAL_FP_USERS } from '../../../constants/CurrentApplication'

const GeneralInfoForm = (props:any) => {
  const {onFormSubmit , initialData} = props

  const [formData, setFormData] = useState({
    customName: initialData.customName || '',
    customDescription: initialData.customDescription || '',
    processDescription: initialData.processDescription ||'',
    responsibleBusinessFocalPoint:initialData.responsibleBusinessFocalPoint || [],
    responsibleDigitalFocalPoint: initialData.responsibleDigitalFocalPoint || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    onFormSubmit()
  }

  return (
    <div className="mt-[24px]">
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Custom Name</label>
          <Input
            name="customName"
            value={formData.customName}
            onChange={handleChange}
            className="rounded-md border p-2"
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Custom Description</label>
          <textarea
            name="customDescription"
            value={formData.customDescription}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Process Description</label>
          <textarea
            name="processDescription"
            value={formData.processDescription}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Responsible Business Focal Point</label>
          <div className="flex h-auto w-full min-w-0 border-border bg-background text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 rounded-md border p-2">
            <TagsSelect
              tags={formData.responsibleBusinessFocalPoint}
              allTags={DIGITAL_FP_USERS}
              onChange={(tags:any) =>
                setFormData((prev) => ({
                  ...prev,
                  responsibleBusinessFocalPoint: tags,
                }))
              }
            />
          </div>
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Responsible Digital Focal Point</label>
          <div className="flex h-auto w-full min-w-0 border-border bg-background text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 rounded-md border p-2">
            <TagsSelect
              tags={formData.responsibleDigitalFocalPoint}
              allTags={DIGITAL_FP_USERS}
              onChange={(tags:any) =>
                setFormData((prev) => ({
                  ...prev,
                  responsibleDigitalFocalPoint: tags,
                }))
              }
            />
          </div>
        </div>

        {/* <button
          type="submit"
          className="col-span-full mt-4 rounded-md bg-blue-500 p-2 text-white"
        >
          Submit
        </button> */}
      </form>
    </div>
  )
}

export default GeneralInfoForm

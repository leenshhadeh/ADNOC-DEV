import { useState } from 'react'
import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
import { DIGITAL_FP_USERS } from '../../../constants/CurrentApplication'
import { cn } from '@/shared/lib/utils'
import CommentableField from '../CommentableField'

const GeneralInfoForm = (props: any) => {
  const { onFormSubmit, onFormChanged, initialData, isEditable } = props

  const [formData, setFormData] = useState({
    customName: initialData.customName || '',
    customDescription: initialData.customDescription || '',
    processDescription: initialData.processDescription || '',
    responsibleBusinessFocalPoint: initialData.responsibleBusinessFocalPoint || [],
    responsibleDigitalFocalPoint: initialData.responsibleDigitalFocalPoint || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    const newChanges = { ...formData, [name]: value }
    onFormChanged(newChanges)
  }

  return (
    <div className="mt-[24px]">
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        onSubmit={onFormSubmit}
      >
        <CommentableField fieldId="customName" fieldName="Custom Name">
          <div className="flex w-full flex-col">
            <label className="text-muted-foreground text-sm">Custom Name</label>
            <Input
              name="customName"
              value={formData.customName}
              onChange={handleChange}
              className="rounded-md border p-2"
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField fieldId="customDescription" fieldName="Custom Description">
          <div className="flex w-full flex-col">
            <label className="text-muted-foreground text-sm">Custom Description</label>
            <textarea
              name="customDescription"
              value={formData.customDescription}
              onChange={handleChange}
              className="rounded-md border p-2 text-sm"
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField fieldId="processDescription" fieldName="Process Description">
          <div className="flex w-full flex-col">
            <label className="text-muted-foreground text-sm">Process Description</label>
            <textarea
              name="processDescription"
              value={formData.processDescription}
              onChange={handleChange}
              className="rounded-md border p-2 text-sm"
              disabled={!isEditable}
            />
          </div>
        </CommentableField>

        <CommentableField
          fieldId="responsibleBusinessFocalPoint"
          fieldName="Responsible Business Focal Point"
        >
          <div className="flex w-full flex-col">
            <label className="text-muted-foreground text-sm">
              Responsible Business Focal Point
            </label>
            <div
              className={cn(
                'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-auto w-full min-w-0 rounded-md border p-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3',
                !isEditable && 'bg-accent',
              )}
            >
              <TagsSelect
                tags={formData.responsibleBusinessFocalPoint}
                allTags={DIGITAL_FP_USERS}
                onChange={(tags: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    responsibleBusinessFocalPoint: tags,
                  }))
                }
                disabled={!isEditable}
              />
            </div>
          </div>
        </CommentableField>

        <CommentableField
          fieldId="responsibleDigitalFocalPoint"
          fieldName="Responsible Digital Focal Point"
        >
          <div className="flex w-full flex-col">
            <label className="text-muted-foreground text-sm">Responsible Digital Focal Point</label>
            <div
              className={cn(
                'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-auto w-full min-w-0 rounded-md border p-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3',
                !isEditable && 'bg-accent',
              )}
            >
              <TagsSelect
                tags={formData.responsibleDigitalFocalPoint}
                allTags={DIGITAL_FP_USERS}
                onChange={(tags: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    responsibleDigitalFocalPoint: tags,
                  }))
                }
                disabled={!isEditable}
              />
            </div>
          </div>
        </CommentableField>
      </form>
    </div>
  )
}

export default GeneralInfoForm

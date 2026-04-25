import { useState } from 'react'
import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
import { DIGITAL_FP_USERS } from '../../../constants/CurrentApplication'
import { cn } from '@/shared/lib/utils'
import commentIcon from '@/assets/icons/Comment-circle.svg'

const GeneralInfoForm = (props: any) => {
  const { onFormSubmit, onFormChanged, initialData, isEditable, canComment, showComments } = props

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
        <div className="group flex w-full flex-col">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Custom Name</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img src={commentIcon} width={'23px'} className="mb-1" onClick={()=>showComments('customName')} />
              </div>
            )}
          </div>
          <Input
            name="customName"
            value={formData.customName}
            onChange={handleChange}
            className="rounded-md border p-2"
            disabled={!isEditable}
          />
        </div>

        <div className="group flex w-full flex-col">
          
          <div className="flex items-center justify-between">
          <label className="text-muted-foreground text-sm">Custom Description</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img src={commentIcon} width={'23px'} className="mb-1" onClick={()=>showComments('customDescription')} />
              </div>
            )}
          </div>
          <textarea
            name="customDescription"
            value={formData.customDescription}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
            disabled={!isEditable}
          />
        </div>

        <div className="flex w-full flex-col group">
          
          <div className="flex items-center justify-between">
          <label className="text-muted-foreground text-sm">Process Description</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img src={commentIcon} width={'23px'} className="mb-1" onClick={()=>showComments('processDescription')} />
              </div>
            )}
          </div>
          <textarea
            name="processDescription"
            value={formData.processDescription}
            onChange={handleChange}
            className="rounded-md border p-2 text-sm"
            disabled={!isEditable}
          />
        </div>

        <div className="flex w-full flex-col group">
          <div className="flex items-center justify-between">
          <label className="text-muted-foreground text-sm">Responsible Business Focal Point</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img src={commentIcon} width={'23px'} className="mb-1" onClick={()=>showComments('responsibleBusinessFocalPoint')} />
              </div>
            )}
          </div>
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

        <div className="flex w-full flex-col group">
          <div className="flex items-center justify-between">
          <label className="text-muted-foreground text-sm">Responsible Digital Focal Point</label>
            {canComment && (
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <img src={commentIcon} width={'23px'} className="mb-1" onClick={()=>showComments('responsibleDigitalFocalPoint')} />
              </div>
            )}
          </div>
          <div
            className={cn(
              'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-auto w-full min-w-0 rounded-md border p-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3',
              !isEditable && 'bg-accent',
            )}
          >
            {' '}
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
      </form>
    </div>
  )
}

export default GeneralInfoForm

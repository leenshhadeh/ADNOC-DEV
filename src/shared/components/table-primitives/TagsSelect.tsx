import React, { useState } from 'react'
import { X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/shared/components/ui/dropdown-menu'

interface TagsListProps {
  tags: { id: string; name: string }[]
  allTags: { id: string; name: string }[] // Assuming you have a list of all available tags
}

const TagsSelect: React.FC<TagsListProps> = ({ tags, allTags }) => {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(tags.map((tag) => tag.id))
  const [selectedTags, setSelectedTags] = useState(tags)

  const handleToggleTag = (id: string, checked: boolean) => {
    const updated = checked ? [...selectedIds, id] : selectedIds.filter((itemId) => itemId !== id)

    setSelectedIds(updated)
    if (checked) {
      const addedTag = allTags.find((tag) => tag.id === id)
      if (addedTag) {
        setSelectedTags((prev) => [...prev, addedTag])
      }
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag.id !== id))
    }
  }

  return (
    <>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center space-x-2 rounded-full border border-[#2F68D9] bg-[#DCE5F9] px-3 py-1 text-gray-800"
              >
                <span className="text-nowrap">{tag.name}</span>
                <button
                  className="text-gray-500 hover:text-gray-800"
                  aria-label={`Remove ${tag.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </DropdownMenuTrigger>


        <DropdownMenuContent
          className="w-[420px] border-0 bg-transparent p-0 shadow-none"
          align="start"
        >
          <div className="rounded-md border border-[#E0E0E0] bg-[#F1F3F5] p-2 shadow-sm flex items-center justify-start flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <div
                key={tag.id}
                className="m-1 flex w-auto items-center rounded-full border border-[#2F68D9] bg-[#DCE5F9] px-1 py-1 text-gray-800"
              >
                <span>{tag.name}</span>
                <button
                  onClick={() => handleToggleTag(tag.id, false)}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label={`Remove ${tag.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

            {/* multi checkbox: --------------------------------------------------------------------- */}
          <div className="mt-2 rounded-md border border-[#E0E0E0] bg-white p-0 shadow-sm">
            <DropdownMenuLabel className="mb-2 p-0 text-sm font-medium text-gray-700">
             <div className="border-[#E0E0E0] bg-[#F1F3F5] p-2">
Search
             </div>
            </DropdownMenuLabel>
            {allTags.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={selectedIds.includes(option.id)}
                onCheckedChange={(checked) => handleToggleTag(option.id, checked === true)}
                onSelect={(e) => e.preventDefault()}
              >
                {option.name}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TagsSelect

import React, { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/shared/components/ui/dropdown-menu'

interface TagsListProps {
  tags: { id: string; name: string; img?: string }[]
  allTags: { id: string; name: string; img?: string }[] // Assuming you have a list of all available tags
  isUsers?: boolean
}

const TagsSelect: React.FC<TagsListProps> = ({ tags, allTags, isUsers }) => {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(tags.map((tag) => tag.id))
  const [selectedTags, setSelectedTags] = useState(tags)
  const [tagSearch, setTagSearch] = useState('')

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

  const filteredTagsList = useMemo(() => {
    return allTags.filter((tag) => tag.name.toLowerCase().includes(tagSearch.toLowerCase()))
  }, [tagSearch])

  return (
    <>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-1">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center space-x-2 rounded-full border border-[0.5px] border-[#2F68D9] bg-[#DCE5F9] px-3 py-1 text-gray-800"
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
          className="w-[350px] border-0 bg-transparent p-0 shadow-none"
          align="start"
        >
          <div className="flex flex-wrap items-center justify-start gap-1 rounded-md border border-[#E0E0E0] bg-[#F1F3F5] p-2 shadow-sm">
            {selectedTags.map((tag) => (
              <div
                key={tag.id}
                className="flex w-auto items-center rounded-full border border-[0.5px] border-[#2F68D9] bg-[#DCE5F9] px-1 py-1 text-gray-800"
              >
                <span className="text-[12px]">{tag.name}</span>
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
          <div className="mt-2 rounded-md  border border-[#E0E0E0] p-0 shadow-sm">
            <DropdownMenuLabel className="p-0 text-sm font-medium text-gray-700">
              <div className="rounded-md  rounded-b-none border-[#E0E0E0] bg-[#F1F3F5] p-2">
                {/* add search input to filter the list  */}
                <div className="p flex items-center gap-2 border-b border-gray-100">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    autoFocus
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search"
                    className="w-full border-0 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="max-h-[200px] overflow-scroll bg-white rounded-b ">
              {filteredTagsList.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={selectedIds.includes(option.id)}
                  onCheckedChange={(checked) => handleToggleTag(option.id, checked === true)}
                  onSelect={(e) => e.preventDefault()}
                  className={
                    'rounded-none border-b px-4 py-2 text-sm font-normal hover:bg-[#DCE5F9] ' +
                    (selectedIds.includes(option.id) ? 'font-bold' : '')
                  }
                >
                  {isUsers ? (
                    <>
                      <div className="inline-flex items-center gap-2">
                        <img
                          src={
                            option.img ||
                            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                          }
                          alt="Profile"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#889096]">{option.name}</p>
                          <p className="text-sm font-medium text-[#687076]">amansoori@adnoc.ae</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-600">{option.name}</span>
                  )}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TagsSelect

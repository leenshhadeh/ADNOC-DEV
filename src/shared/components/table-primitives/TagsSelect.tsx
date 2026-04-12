import React, { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/shared/components/ui/dropdown-menu'

interface TagItem {
  id: string
  name: string
  img?: string
  email?: string
}

interface TagsListProps {
  tags: TagItem[]
  allTags: TagItem[]
  isUsers?: boolean
  singleSelect?: boolean
  placeholder?: string
  variant?: 'tags' | 'user'
  onChange?: (selected: TagItem[]) => void
}

const TagsSelect: React.FC<TagsListProps> = ({
  tags,
  allTags,
  isUsers,
  singleSelect = false,
  placeholder = 'Select',
  variant = 'tags',
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const [tagSearch, setTagSearch] = useState('')

  const selectedTags = tags
  const selectedIds = useMemo(() => tags.map((tag) => tag.id), [tags])

  const handleToggleTag = (id: string, checked: boolean) => {
    const selectedTag = allTags.find((tag) => tag.id === id)
    if (!selectedTag) return

    if (singleSelect) {
      const nextTags = checked ? [selectedTag] : []
      onChange?.(nextTags)
      setOpen(false)
      return
    }

    const nextTags = checked ? [...tags, selectedTag] : tags.filter((tag) => tag.id !== id)

    onChange?.(nextTags)
  }

  const filteredTagsList = useMemo(() => {
    return allTags.filter((tag) => tag.name.toLowerCase().includes(tagSearch.toLowerCase()))
  }, [allTags, tagSearch])

  const renderTriggerContent = () => {
    if (variant === 'user') {
      const selectedUser = selectedTags[0]

      if (!selectedUser) {
        return <span className="text-sm text-gray-400">{placeholder}</span>
      }

      return (
        <div className="flex min-w-0 items-center gap-3 text-left">
          {selectedUser.img ? (
            <img
              src={selectedUser.img}
              alt={selectedUser.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
              {selectedUser.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[16px] font-[500] text-[#151718]">
              {selectedUser.name}
            </span>
            {selectedUser.email ? (
              <span className="truncate text-[14px] font-[300] text-[#687076]">
                {selectedUser.email}
              </span>
            ) : null}
          </div>
        </div>
      )
    }

    if (selectedTags.length === 0) {
      return <span className="text-sm text-gray-400">{placeholder}</span>
    }

    return (
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center space-x-2 rounded-full border border-[0.5px] border-[#2F68D9] bg-[#DCE5F9] px-3 py-1 text-gray-800"
          >
            <span className="text-nowrap">{tag.name}</span>

            {!singleSelect && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleTag(tag.id, false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleTag(tag.id, false)
                  }
                }}
                className="text-gray-500 hover:text-gray-800"
                aria-label={`Remove ${tag.name}`}
              >
                <X size={16} />
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="flex min-w-0 flex-1 text-left">
          {renderTriggerContent()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[350px] border-0 bg-transparent p-0 shadow-none"
        align="start"
      >
        {variant === 'tags' && !singleSelect && selectedTags.length > 0 && (
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
        )}

        <div className="mt-2 rounded-md border border-[#E0E0E0] p-0 shadow-sm">
          <DropdownMenuLabel className="p-0 text-sm font-medium text-gray-700">
            <div className="rounded-md rounded-b-none border-[#E0E0E0] bg-[#F1F3F5] p-2">
              <div className="flex items-center gap-2 border-b border-gray-100">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  autoFocus
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </DropdownMenuLabel>

          <div className="max-h-[200px] overflow-scroll rounded-b bg-white">
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
                      <p className="text-sm font-medium text-[#687076]">{option.email || ''}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-600">{option.name}</span>
                )}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TagsSelect

import React from 'react'
import { X } from 'lucide-react'

interface TagsListProps {
  tags: { id: string; text: string }[]
  onRemoveTag: (id: string) => void
}

const TagsList: React.FC<TagsListProps> = ({ tags, onRemoveTag }) => {
  return (
    <div className="flex gap-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center space-x-2 rounded-full border border-[#2F68D9] bg-[#DCE5F9] px-3 py-1 text-gray-800"
        >
          <span className="text-nowrap">{tag.text}</span>
          <button
            onClick={() => onRemoveTag(tag.id)}
            className="text-gray-500 hover:text-gray-800"
            aria-label={`Remove ${tag.text}`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default TagsList

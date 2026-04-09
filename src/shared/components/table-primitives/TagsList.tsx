import React from 'react'
import { Maximize2, } from 'lucide-react'

interface TagsListProps {
  tags: { id: string; text: string }[]
  allTags?: { id: string; name: string }[] // Optional, in case you want to use it for a select component in the future
  onExpand?: () => void
  readOnly?: boolean
}

const TagsList: React.FC<TagsListProps> = ({ tags, onExpand , readOnly}) => {
  return (
    <div className="flex gap-2 justify-between items-center">
      <div className='max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap flex gap-2'>
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center space-x-2 rounded-full border-[0.5px] border-[#2F68D9] bg-[#DCE5F9]  px-3  text-gray-800 "
        >
          <span className="text-nowrap">{tag.text}</span>
        </div>
      ))}
      </div>
      {!readOnly && <Maximize2 size={16} className='cursor-pointer color-[#292929]' 
      onClick={onExpand} />}
    </div>
  )
}

export default TagsList

import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import React from 'react'

const TagsSelectCell = (peops: any) => {
  const { list, onUpdate, allTags , isUsers } = peops
  const [currentTags, setCurrentTags] = React.useState(list)
  return (
    <TagsSelect
      tags={currentTags}
      allTags={allTags}
      isUsers={isUsers}
      onChange={(newTags) => {
        setCurrentTags(newTags)
        const newValue = newTags.map((tag) => tag.name)
        console.log('New current applications/systems:', newValue)
        if (onUpdate) {
          onUpdate
        }
      }}
    />
  )
}

export default TagsSelectCell

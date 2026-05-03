import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import React from 'react'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TagsSelectCell = (peops: any) => {
  const { list, onUpdate, allTags, isUsers } = peops
  const [currentTags, setCurrentTags] = React.useState(list)
  return (
    <TagsSelect
      tags={currentTags}
      allTags={allTags}
      isUsers={isUsers}
      onChange={(newTags) => {
        setCurrentTags(newTags)
        if (onUpdate) {
          onUpdate(newTags)
        }
      }}
    />
  )
}

export default TagsSelectCell

import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
import { DIGITAL_FP_USERS } from '../../../constants/CurrentApplication'

const AutomationParameterForm = () => {
  return (
    <div className="mt-[24px]">
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Process Criticality​</label>
          <Input className="rounded-md border p-2" />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Number of People  Involved</label>
          <Input className="rounded-md border p-2" />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Scale of Process</label>
          <Input className="rounded-md border p-2" />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Current Applications / Systems</label>
          <div className="flex h-10 w-full min-w-0 border-border bg-background text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 rounded-md border p-2">
            <TagsSelect
              tags={[
                {
                  id: 'user1',
                  name: 'Audit Management System (RSA Archer)',
                  img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
                },
              ]}
              allTags={DIGITAL_FP_USERS}
            />
          </div>
        </div>

     
      </form>
    </div>
  )
}
export default AutomationParameterForm

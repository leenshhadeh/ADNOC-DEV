import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { Input } from '@/shared/components/ui/input'
import { DIGITAL_FP_USERS } from '../../constants/CurrentApplication'

const GeneralInfoForm = () => {
  return (
    <div className="mt-[24px]">
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Custom Name</label>
          <Input className="rounded-md border p-2" />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Custom Description</label>
          <textarea className="rounded-md border p-2" />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Process Description</label>
          <textarea className="rounded-md border p-2" />
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Responsible Business Focal Point</label>
          <div className="max-w-[100%] overflow-hidden rounded-md  border p-2">
            <TagsSelect
              tags={[
                {
                  id: 'user1',
                  name: 'Fatima Al Nuaimi',
                  img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
                },
              ]}
              allTags={DIGITAL_FP_USERS}
            />
          </div>
        </div>

        <div className="flex w-full flex-col">
          <label className="text-muted-foreground text-sm">Responsible Digital Focal Point</label>
          <div className="max-w-[100%] overflow-hidden rounded-md border p-2">
            <TagsSelect
              tags={[
                {
                  id: 'user12',
                  name: 'Ahmed Al Mansoori',
                  img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
                },
              ]}
              allTags={DIGITAL_FP_USERS}
            />{' '}
          </div>
        </div>
      </form>
    </div>
  )
}
export default GeneralInfoForm

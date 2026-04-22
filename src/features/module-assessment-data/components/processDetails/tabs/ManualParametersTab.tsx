import ManualParametersForm from '../components/ManualParametersForm'

const ManualParametersTab = (props: any) => {
  const { process, isEditable, canComment, onShowComment } = props
  return (
    <>
      {/* Form: */}
      <ManualParametersForm
        process={process}
        isEditable={isEditable}
        canComment={canComment}
        showComments={onShowComment}
      />
      <div className="bg-sidebar-accent mt-[32px] p-6">
        <p className="text-muted-forground">Annual Cost of Manual Effort (AED)</p>
        <p className="font-bold">11,696,400.00000 AED</p>
      </div>
    </>
  )
}
export default ManualParametersTab

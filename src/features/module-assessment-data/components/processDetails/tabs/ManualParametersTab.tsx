import ManualParametersForm from '../components/ManualParametersForm'

const ManualParametersTab = (props: any) => {
  const { process } = props
  return (
    <>
      {/* Form: */}
      <ManualParametersForm process={process} />
      <div className="bg-sidebar-accent mt-[32px] p-6">
        <p className="text-muted-forground">Annual Cost of Manual Effort (AED)</p>
        <p className="font-bold">11,696,400.00000 AED</p>
      </div>
    </>
  )
}
export default ManualParametersTab

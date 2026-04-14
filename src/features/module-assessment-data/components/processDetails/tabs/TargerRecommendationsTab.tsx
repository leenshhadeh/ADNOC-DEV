import TargerRecommendationsForm from '../components/TargerRecommendationsForm'

const TargerRecommendationsTab = (props: any) => {
  const { process } = props
  return (
    <>
      {/* Tag */}
      <span className="bg-sidebar-accent absolute top-2 right-2 mt-[-18px] rounded px-2 py-1 text-xs">
        Read-only
      </span>
      {/* Form: */}
      <TargerRecommendationsForm process={process} />
    </>
  )
}
export default TargerRecommendationsTab

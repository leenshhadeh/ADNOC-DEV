import AutomationParameterForm from '../components/AutomationParameterForm'

const AutomationParameterTab = (props: any) => {
  const { process, isEditable, canComment, onShowComment, validateTrigger } = props
  return (
    <>
      {/* Form: */}
      <AutomationParameterForm
        process={process}
        isEditable={isEditable}
        canComment={canComment}
        showComments={onShowComment}
        validateTrigger={validateTrigger}
      />
    </>
  )
}
export default AutomationParameterTab

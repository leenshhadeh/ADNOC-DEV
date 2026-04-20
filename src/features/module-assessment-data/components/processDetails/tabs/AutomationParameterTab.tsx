
import AutomationParameterForm from '../components/AutomationParameterForm'

const AutomationParameterTab = (props:any) => {
const {process , isEditable}=props
  return (
    <>
      {/* Form: */}
      <AutomationParameterForm process={process} isEditable={isEditable}/>
    </>
  )
}
export default AutomationParameterTab

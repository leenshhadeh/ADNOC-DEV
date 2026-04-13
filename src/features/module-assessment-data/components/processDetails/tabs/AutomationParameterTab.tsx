
import AutomationParameterForm from '../components/AutomationParameterForm'

const AutomationParameterTab = (props:any) => {
const {process}=props
  return (
    <>
      {/* Form: */}
      <AutomationParameterForm process={process}/>
    </>
  )
}
export default AutomationParameterTab

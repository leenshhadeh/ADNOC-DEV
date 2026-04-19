
import ProcessDetails from './processDetails/components/ProcessDetails'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import GeneralInfoTab from './processDetails/tabs/GeneralInfoTab'
import AutomationParameterTab from './processDetails/tabs/AutomationParameterTab'
import ManualParametersTab from './processDetails/tabs/ManualParametersTab'
import { useGetProcessDetails } from '@features/module-assessment-data/hooks/useGetProcessDetails'
import TargerRecommendationsTab from './processDetails/tabs/TargerRecommendationsTab'
import OpprtunitiesTab from './processDetails/tabs/OpprtunitiesTab'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'
import RecordedChangesTab from './processDetails/tabs/RecordedChangesTab'
import CommentsTab from './processDetails/tabs/CommentsTab'
import { Settings2, Upload } from 'lucide-react'
import Breadcrumb from '@/shared/components/Breadcrumb'


const ProcessDetailsPage = () => {
  const { processId } = useParams<{ processId: string }>()
  const [activeTab, setActiveTab] = useState('GeneralInfo')
  const { data, isLoading, isError } = useGetProcessDetails(processId || '')
  const [processData, setProcessData] = useState([{}])
  const [processGeneralInfo, setProcessGeneralInfo] = useState([{}])
  const [disableSubmit , setDisableSubmit]=useState(true)
  const [updatedData,setUpdatedData] = useState([{}])

  useEffect(() => {
    //TODO: call getProcessDetails(processId) API
    if (data) {
      const domainName = DOMAINS_DATA.find((d) => d.id === data[0]?.domain)?.name ?? data[0]?.domain
      setProcessData([
        { label: 'Group Company', value: data[0]?.groupCompany },
        { label: 'Domain', value: domainName },
        { label: 'Process Code', value: data[0]?.code, canCopy: true },
        {
          label: 'Status',
          value: data[0]?.status,
        },
        {
          label: 'Process stage',
          value: 'Quality review',
          stageTotal: data[0]?.stageTotal,
          stageCurrent: data[0]?.stageCurrent,
        },
        { label: 'Process Applicapility', value: data[0]?.processApplicapility ? 'Yes' : 'No' },
        { label: 'Last Published Date', value: data[0]?.lastPublishedDate },
        { label: 'Marked Review Date', value: data[0]?.markedReviewDate },
      ])
      setProcessGeneralInfo([
        { label: 'Process Level 1', value: data[0]?.level1Name },
        { label: 'Process Level 2', value: data[0]?.level2Name },
        { label: 'Process Level 3', value: data[0]?.level3Name },
        {
          label: 'Process Level 4',
          value: data[0]?.level4Name,
        },
        {
          label: 'Centrally Governed Process',
          value: data[0]?.centrallyGovernedProcess ? 'Yes' : 'No',
          isEditable: true,
        },
        {
          label: 'Shared Service process',
          value: data[0]?.sharedServiceProcess ? 'Yes' : 'No',
          isEditable: true,
        },
      ])
    }
  }, [data])

  const handelOnSubmit=()=>{
    // call API to submit the new changes 
    console.log('[submit] payload:',updatedData)
  }

  const handelDataChanged=(updatedData:any)=>{
    setDisableSubmit(false);
    console.log('onFormChanged:',updatedData)
    setUpdatedData(updatedData)
  }
  

  const mainActions = useMemo<any[]>(
    () => [
      { id: 'submit', label: 'submit', icon: Settings2 ,disabled:disableSubmit, onClick:handelOnSubmit},
      { id: 'save', label: 'save', icon: Upload ,disabled:disableSubmit},
      { id: 'validate', label: 'validate', icon: Upload },
      {id:'Markasreviewed' , label:'Mark as reviewed', icon: Upload }
    ],
    [disableSubmit],
  )


  return (
    <>
      <div className="flex flex-col gap-0 overflow-hidden px-6">
          <Breadcrumb
          links={[
            {title:'Assessment Data Processes',url:'/assessment-data'},
            {title:'Process Details', isCurrentPage:true}
            ]} />

        <div className="mb-[24px] flex items-center py-3">
          {!isLoading && data && (
            <h1 className="text-foreground text-2xl font-bold">{data[0].name}</h1>
          )}
        </div>

        {isLoading ? (
          <>Loading data...</>
        ) : (
          <>
            {data && (
              <>
                <ProcessDetails data={processData} />
                <div className="mb-[24px]"></div>
                <ModuleToolbar
                  tabs={[
                    { label: 'General Info', value: 'GeneralInfo' },
                    { label: 'Automation Parameters', value: 'AutomationParameters' },
                    {
                      label: 'Manual operations volume parameters',
                      value: 'ManualParameters',
                    },
                   
                    
                  ]}
                  moreOptions={[
                    { label: 'Target Recommendations​', value: 'TargetRecommendations​​'},
                    { label: 'Opportunities', value: 'Opportunities' },
                    { label: 'Recorded changes', value: 'RecordedChanges' },
                    { label: 'Comments', value: 'Comments' }
                  ]}
                  activeTab={activeTab}
                  onTabChange={(newActiveTab) => {
                    setActiveTab(newActiveTab);
                    setDisableSubmit(true)
                  }}
                  showFilter={false}
                  showSearch={false}
                  actions={mainActions}
                />

                <div className="flex flex-col gap-0 overflow-hidden">
                  <div className="mt-[24px] rounded-2xl bg-[linear-gradient(90.49deg,rgba(78,241,228,0.1)_0.03%,rgba(17,24,39,0.1)_99.89%)] p-[1px]">
                    <div className="rounded-2xl bg-white p-[24px] relative">
                      {activeTab == 'GeneralInfo' && (
                        <GeneralInfoTab
                          processGeneralInfo={processGeneralInfo}
                          process={data[0]}
                          onFormSubmit={(payload:any) => handelOnSubmit()}
                          onFormChanged={(data:any)=>{handelDataChanged(data)}}
                        />
                      )}
                      {activeTab == 'AutomationParameters' && (
                        <AutomationParameterTab process={data[0]} />
                      )}
                      {activeTab == 'ManualParameters' && <ManualParametersTab process={data[0]} />}
                      {activeTab == 'TargetRecommendations​​' && <TargerRecommendationsTab process={data[0]} />}
                      {activeTab == 'Opportunities' && <OpprtunitiesTab process={data[0]} />}
                      {activeTab == 'RecordedChanges' && <RecordedChangesTab process={data[0]} />}
                      {activeTab == 'Comments' && <CommentsTab comments={data[0].comments}/>}
                    </div>
                  </div>
                </div>
              </>
            )}

            {isError && <> Somthing went wrong</>}
          </>
        )}
      </div>
    </>
  )
}
export default ProcessDetailsPage

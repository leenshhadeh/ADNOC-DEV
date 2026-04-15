import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import ModuleToolbar from '@/shared/components/ModuleToolbar'
import { Loader2 } from 'lucide-react'
import { useGetAutomationProcessDetail } from '../hooks/useGetAutomationProcessDetail'
import ProcessDetailHeader from './processDetails/ProcessDetailHeader'
import GeneralInfoTab from './processDetails/tabs/GeneralInfoTab'
import AutomationParametersTab from './processDetails/tabs/AutomationParametersTab'
import ManualParametersTab from './processDetails/tabs/ManualParametersTab'
import TargetRecommendationsTab from './processDetails/tabs/TargetRecommendationsTab'
import OpportunitiesTab from './processDetails/tabs/OpportunitiesTab'
import RecordedChangesTab from './processDetails/tabs/RecordedChangesTab'
import CommentsTab from './processDetails/tabs/CommentsTab'

const AutomationProcessDetailsPage = () => {
  const { processId } = useParams<{ processId: string }>()
  const { data, isLoading, isError } = useGetAutomationProcessDetail(processId ?? '')
  const [activeTab, setActiveTab] = useState('GeneralInfo')

  return (
    <div className="flex flex-col gap-0 overflow-hidden px-6">
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="pt-5 pb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/automation-targets">Automation Targets</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Process Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Title ────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center py-3">
        {!isLoading && data && <h1 className="text-foreground text-2xl font-bold">{data.name}</h1>}
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      ) : isError || !data ? (
        <p className="text-destructive text-sm">Something went wrong loading process details.</p>
      ) : (
        <>
          {/* ── Process detail header strip ─────────────────────────────── */}
          <ProcessDetailHeader process={data} />

          <div className="mb-6" />

          {/* ── Tabs toolbar ────────────────────────────────────────────── */}
          <ModuleToolbar
            tabs={[
              { label: 'General Info', value: 'GeneralInfo' },
              { label: 'Automation Parameters', value: 'AutomationParameters' },
              { label: 'Manual Operations Volume Parameters', value: 'ManualParameters' },
            ]}
            moreOptions={[
              { label: 'Target Recommendations', value: 'TargetRecommendations' },
              { label: 'Opportunities', value: 'Opportunities' },
              { label: 'Recorded Changes', value: 'RecordedChanges' },
              { label: 'Comments', value: 'Comments' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showFilter={false}
            showSearch={false}
          />

          {/* ── Tab content ─────────────────────────────────────────────── */}
          <div className="mt-6 rounded-2xl bg-[linear-gradient(90.49deg,rgba(78,241,228,0.1)_0.03%,rgba(17,24,39,0.1)_99.89%)] p-[1px]">
            <div className="relative rounded-2xl bg-white p-6">
              {activeTab === 'GeneralInfo' && <GeneralInfoTab process={data} />}
              {activeTab === 'AutomationParameters' && <AutomationParametersTab process={data} />}
              {activeTab === 'ManualParameters' && <ManualParametersTab process={data} />}
              {activeTab === 'TargetRecommendations' && <TargetRecommendationsTab process={data} />}
              {activeTab === 'Opportunities' && <OpportunitiesTab process={data} />}
              {activeTab === 'RecordedChanges' && <RecordedChangesTab process={data} />}
              {activeTab === 'Comments' && <CommentsTab comments={data.comments} />}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AutomationProcessDetailsPage

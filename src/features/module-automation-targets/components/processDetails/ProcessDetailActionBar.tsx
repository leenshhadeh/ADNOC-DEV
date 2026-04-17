import { ChevronDown, Loader2, Save, ShieldCheck, SquareCheckBig } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useCurrentUser } from '@/shared/auth/useUserStore'
import { useProcessDetailActions } from '../../context/ProcessDetailActionsContext'
import { useSubmitProcess } from '../../hooks/useSubmitProcess'
import { useValidateProcess } from '../../hooks/useValidateProcess'
import { useDiscardDraft } from '../../hooks/useDiscardDraft'
import { useReturnProcess } from '../../hooks/useReturnProcess'

interface ProcessDetailActionBarProps {
  processId: string
  activeTab: string
}

const ActionBarButton = ({
  onClick,
  disabled,
  isPending,
  icon,
  label,
}: {
  onClick: () => void
  disabled?: boolean
  isPending?: boolean
  icon?: React.ReactNode
  label: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isPending}
    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#0047BA] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {isPending ? <Loader2 className="size-4 animate-spin" /> : icon}
    {label}
  </button>
)

const ProcessDetailActionBar = ({ processId, activeTab }: ProcessDetailActionBarProps) => {
  const isEditable = activeTab === 'TargetRecommendations'
  const { role } = useCurrentUser()
  const { triggerSave } = useProcessDetailActions()

  const submitMutation = useSubmitProcess()
  const validateMutation = useValidateProcess()
  const discardMutation = useDiscardDraft()
  const returnMutation = useReturnProcess()

  const isAnyPending =
    submitMutation.isPending ||
    validateMutation.isPending ||
    discardMutation.isPending ||
    returnMutation.isPending

  return (
    <div className="flex items-center px-1">
      {/* Submit */}
      <ActionBarButton
        label="Submit"
        icon={<SquareCheckBig className="size-4" />}
        isPending={submitMutation.isPending}
        disabled={isAnyPending}
        onClick={() => submitMutation.mutate(processId)}
      />

      {isEditable && (
        <>
          <div className="h-5 w-px bg-[#DFE3E6]" />

          {/* Save */}
          <ActionBarButton
            label="Save"
            icon={<Save className="size-4" />}
            disabled={isAnyPending}
            onClick={triggerSave}
          />

          <div className="h-5 w-px bg-[#DFE3E6]" />

          {/* Validate */}
          <ActionBarButton
            label="Validate"
            icon={<ShieldCheck className="size-4" />}
            isPending={validateMutation.isPending}
            disabled={isAnyPending}
            onClick={() => validateMutation.mutate(processId)}
          />
        </>
      )}

      <div className="h-5 w-px bg-[#DFE3E6]" />

      {isEditable ? (
        <>
          {/* More dropdown — when Save/Validate are shown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isAnyPending}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#0047BA] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                More
                <ChevronDown className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-48 rounded-2xl bg-[#F1F3F5] p-0 shadow-[0px_10px_30px_rgba(0,0,0,0.2)]"
            >
              <DropdownMenuItem
                className="text-destructive focus:text-destructive gap-4 rounded-none px-4 py-2 text-base"
                onSelect={() => discardMutation.mutate(processId)}
                disabled={discardMutation.isPending}
              >
                {discardMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Discard Draft
              </DropdownMenuItem>
              {role === 'Digital Focal Point' && (
                <>
                  <DropdownMenuSeparator className="mx-0 my-0 bg-[#DFE3E6]" />
                  <DropdownMenuItem
                    className="gap-4 rounded-none px-4 py-2 text-base"
                    onSelect={() => returnMutation.mutate(processId)}
                    disabled={returnMutation.isPending}
                  >
                    {returnMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                    Return
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          {/* Inline actions — when Save/Validate are hidden */}
          <ActionBarButton
            label="Discard Draft"
            isPending={discardMutation.isPending}
            disabled={isAnyPending}
            onClick={() => discardMutation.mutate(processId)}
          />
          {role === 'Digital Focal Point' && (
            <>
              <div className="h-5 w-px bg-[#DFE3E6]" />
              <ActionBarButton
                label="Return"
                isPending={returnMutation.isPending}
                disabled={isAnyPending}
                onClick={() => returnMutation.mutate(processId)}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProcessDetailActionBar

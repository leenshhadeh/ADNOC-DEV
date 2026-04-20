import { useState } from 'react'
import {
  ArrowLeftRight,
  CheckSquare,
  ChevronDown,
  Loader2,
  MessageSquare,
  Save,
  ShieldCheck,
  SquareCheckBig,
  X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { ApproveModal } from '@/shared/components/modals/ApproveModal'
import { ReturnModal } from '@/shared/components/modals/ReturnModal'
import { RejectModal } from '@/shared/components/modals/RejectModal'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { useCurrentUser } from '@/shared/auth/useUserStore'
import { hasPermission } from '@/shared/lib/permissions'
import { useProcessDetailActionsStore } from '../../store/processDetailActionsStore'
import { useSubmitProcess } from '../../hooks/useSubmitProcess'
import { useValidateProcess } from '../../hooks/useValidateProcess'
import { useDiscardDraft } from '../../hooks/useDiscardDraft'
import { useReturnProcess } from '../../hooks/useReturnProcess'
import { useApproveProcess } from '../../hooks/useApproveProcess'
import { useRejectProcess } from '../../hooks/useRejectProcess'

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
  variant = 'default',
  active,
}: {
  onClick: () => void
  disabled?: boolean
  isPending?: boolean
  icon?: React.ReactNode
  label: string
  variant?: 'default' | 'destructive'
  active?: boolean
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || isPending}
    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 ${variant === 'destructive' ? 'text-[#EB3865]' : 'text-[#0047BA]'} ${active ? 'bg-[#0047BA]/10' : ''}`}
  >
    {isPending ? <Loader2 className="size-4 animate-spin" /> : icon}
    {label}
  </button>
)

const Divider = () => <div className="h-5 w-px bg-[#DFE3E6]" />

const ProcessDetailActionBar = ({ processId, activeTab }: ProcessDetailActionBarProps) => {
  const isEditable = activeTab === 'TargetRecommendations'
  const { role } = useCurrentUser()
  const { triggerSave, isCommentMode, setIsCommentMode, clearField } =
    useProcessDetailActionsStore()

  const [activeModal, setActiveModal] = useState<'approve' | 'return' | 'reject' | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const submitMutation = useSubmitProcess()
  const validateMutation = useValidateProcess()
  const discardMutation = useDiscardDraft()
  const returnMutation = useReturnProcess()
  const approveMutation = useApproveProcess()
  const rejectMutation = useRejectProcess()

  const isAnyPending =
    submitMutation.isPending ||
    validateMutation.isPending ||
    discardMutation.isPending ||
    returnMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending

  const canSave = hasPermission(role, 'AT_SAVE')
  const canSubmit = hasPermission(role, 'AT_SUBMIT')
  const canValidate = hasPermission(role, 'AT_VALIDATE')
  const canDiscard = hasPermission(role, 'AT_DISCARD_DRAFT')
  const canApprove = hasPermission(role, 'AT_APPROVE')
  const canReject = hasPermission(role, 'AT_REJECT')
  const canReturn = hasPermission(role, 'AT_RETURN')
  const canComment = hasPermission(role, 'AT_COMMENT_ON_FIELD')

  const hasSmeActions = canSave || canSubmit || canValidate
  const hasReviewerActions = canApprove || canReturn || canReject || canComment

  // BFP / DFP — view only, no action bar
  if (!hasSmeActions && !hasReviewerActions) return null

  // ── Reviewer actions (QM / BPA Program Manager) ─────────────────────────
  if (hasReviewerActions && !hasSmeActions) {
    return (
      <div className="flex items-center px-1">
        {canApprove && (
          <ActionBarButton
            label="Approve"
            icon={<CheckSquare className="size-4" />}
            isPending={approveMutation.isPending}
            disabled={isAnyPending}
            onClick={() => setActiveModal('approve')}
          />
        )}

        {canReturn && (
          <>
            <Divider />
            <ActionBarButton
              label="Return"
              icon={<ArrowLeftRight className="size-4" />}
              isPending={returnMutation.isPending}
              disabled={isAnyPending}
              onClick={() => setActiveModal('return')}
            />
          </>
        )}

        {canReject && (
          <>
            <Divider />
            <ActionBarButton
              label="Reject"
              icon={<X className="size-4" />}
              isPending={rejectMutation.isPending}
              disabled={isAnyPending}
              onClick={() => setActiveModal('reject')}
              variant="destructive"
            />
          </>
        )}

        {canComment && (
          <>
            <Divider />
            <ActionBarButton
              label="Comment on field"
              icon={<MessageSquare className="size-4" />}
              disabled={isAnyPending}
              active={isCommentMode}
              onClick={() => {
                setIsCommentMode(!isCommentMode)
                if (isCommentMode) clearField()
              }}
            />
          </>
        )}

        <ApproveModal
          open={activeModal === 'approve'}
          title="Approve this request"
          description="This request will be forwarded for BPA Program Manager review. Are you sure you want to approve it?"
          onConfirm={() => {
            approveMutation.mutate(processId, {
              onSuccess: () => {
                setActiveModal(null)
                setToastMessage('Request approved and forwarded successfully.')
                setShowToast(true)
              },
            })
          }}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null)
          }}
        />
        <ReturnModal
          open={activeModal === 'return'}
          title="Return this request"
          description="This request will be returned to the SME Expert. Please add the return reason below."
          onConfirm={(reason) => {
            returnMutation.mutate(
              { processId, reason },
              {
                onSuccess: () => {
                  setActiveModal(null)
                  setToastMessage('Request has been returned.')
                  setShowToast(true)
                },
              },
            )
          }}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null)
          }}
        />
        <RejectModal
          open={activeModal === 'reject'}
          title="Reject this request"
          description="This request will be rejected. Please add the rejection reason below."
          requireReason
          onConfirm={(reason) => {
            rejectMutation.mutate(
              { processId, reason },
              {
                onSuccess: () => {
                  setActiveModal(null)
                  setToastMessage('Request has been rejected.')
                  setShowToast(true)
                },
              },
            )
          }}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null)
          }}
        />
        <SuccessToast open={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
      </div>
    )
  }

  // ── SME Expert actions (Save / Validate / Submit / More) ────────────────
  return (
    <div className="flex items-center px-1">
      {canSubmit && (
        <ActionBarButton
          label="Submit"
          icon={<SquareCheckBig className="size-4" />}
          isPending={submitMutation.isPending}
          disabled={isAnyPending}
          onClick={() => submitMutation.mutate(processId)}
        />
      )}

      {isEditable && canSave && (
        <>
          <Divider />
          <ActionBarButton
            label="Save"
            icon={<Save className="size-4" />}
            disabled={isAnyPending}
            onClick={triggerSave}
          />
        </>
      )}

      {isEditable && canValidate && (
        <>
          <Divider />
          <ActionBarButton
            label="Validate"
            icon={<ShieldCheck className="size-4" />}
            isPending={validateMutation.isPending}
            disabled={isAnyPending}
            onClick={() => validateMutation.mutate(processId)}
          />
        </>
      )}

      <Divider />

      {isEditable ? (
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
            {canDiscard && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive gap-4 rounded-none px-4 py-2 text-base"
                onSelect={() => discardMutation.mutate(processId)}
                disabled={discardMutation.isPending}
              >
                {discardMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Discard Draft
              </DropdownMenuItem>
            )}
            {canReturn && (
              <>
                <DropdownMenuSeparator className="mx-0 my-0 bg-[#DFE3E6]" />
                <DropdownMenuItem
                  className="gap-4 rounded-none px-4 py-2 text-base"
                  onSelect={() => setActiveModal('return')}
                  disabled={returnMutation.isPending}
                >
                  {returnMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Return
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          {canDiscard && (
            <ActionBarButton
              label="Discard Draft"
              isPending={discardMutation.isPending}
              disabled={isAnyPending}
              onClick={() => discardMutation.mutate(processId)}
            />
          )}
          {canReturn && (
            <>
              <Divider />
              <ActionBarButton
                label="Return"
                icon={<ArrowLeftRight className="size-4" />}
                isPending={returnMutation.isPending}
                disabled={isAnyPending}
                onClick={() => setActiveModal('return')}
              />
            </>
          )}
        </>
      )}

      <ReturnModal
        open={activeModal === 'return'}
        title="Return this request"
        description="This request will be returned to the SME Expert. Please add the return reason below."
        onConfirm={(reason) => {
          returnMutation.mutate(
            { processId, reason },
            {
              onSuccess: () => {
                setActiveModal(null)
                setToastMessage('Request has been returned.')
                setShowToast(true)
              },
            },
          )
        }}
        onOpenChange={(open) => {
          if (!open) setActiveModal(null)
        }}
      />
      <SuccessToast open={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  )
}

export default ProcessDetailActionBar

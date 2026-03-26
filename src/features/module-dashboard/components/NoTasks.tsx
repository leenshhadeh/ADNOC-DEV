import NoTasksIcon from '../../../assets/NoTasks.svg'

const NoTasks = () => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 text-center">
      <img src={NoTasksIcon} alt="No tasks" className="h-[120px] w-[120px] object-contain" />
      <span className="text-[14px] text-[#687076]">
        You don’t have any assigned tasks right now.
      </span>
    </div>
  )
}

export default NoTasks

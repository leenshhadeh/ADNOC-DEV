interface UserBadgeCellProps {
  name: string
}

const UserBadgeCell = ({ name }: UserBadgeCellProps) => {
  return (
    <span className="border-border bg-muted text-muted-foreground inline-flex h-8 max-w-full items-center rounded-full border px-4 text-xs font-medium">
      <span className="truncate">{name}</span>
    </span>
  )
}

export default UserBadgeCell

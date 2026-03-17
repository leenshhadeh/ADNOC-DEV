interface UserBadgeCellProps {
  name: string
}

const UserBadgeCell = ({ name }: UserBadgeCellProps) => {
  return (
    <span className="inline-flex h-8 max-w-full items-center rounded-full border border-border bg-muted px-4 text-xs font-medium text-muted-foreground">
      <span className="truncate">{name}</span>
    </span>
  )
}

export default UserBadgeCell

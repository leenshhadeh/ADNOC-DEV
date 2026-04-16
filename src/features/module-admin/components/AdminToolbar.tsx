export interface AdminToolbarProps {
  title: string
}

const AdminToolbar = ({ title }: AdminToolbarProps) => {
  return (
    <div>
      <h1 className="text-[16px] text-[#4A5565]">{title}</h1>
    </div>
  )
}

export default AdminToolbar

interface TagProps {
  title: string
}
const Tag = ({ title }: TagProps) => {
  return (
    <div className="w-fit rounded-[2rem] border border-[#2F68D9] bg-[#DCE5F9] px-3">{title}</div>
  )
}
export default Tag

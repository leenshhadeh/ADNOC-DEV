import { cn } from "@/shared/lib/utils";

const Avatar = ({ name ,small}: { name: string ;small?:boolean}) => {
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  
    return (
      <div
        className={cn(small?"size-6":"size-10","flex flex-shrink-0 items-center justify-center rounded-full")}
        style={{ background: 'linear-gradient(180deg, #785FDC 0%, #30284D 100%)' }}
      >
        <span className="text-xs font-medium text-white">{initials}</span>
      </div>
    )
  }

  export default Avatar
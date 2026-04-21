
const LoadingTable= () => {
  return (
    <div className="space-y-3 py-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-muted h-17 w-full animate-pulse rounded-xl" />
    ))}
  </div>
  )
}

export default LoadingTable
export default function Loading() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <div className="h-5 w-20 bg-[#1a1a1a] rounded mb-3 animate-pulse" />
        <div className="h-10 w-56 bg-[#1a1a1a] rounded mb-4 animate-pulse" />
        <div className="h-5 w-72 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
      <div className="h-4 w-16 bg-[#1a1a1a] rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden animate-pulse">
            <div className="h-52 bg-[#1a1a1a]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
              <div className="h-3 bg-[#1a1a1a] rounded w-full" />
              <div className="h-3 bg-[#1a1a1a] rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

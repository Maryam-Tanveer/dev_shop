import { ChevronDown } from 'lucide-react'

export default function CatalogPagination({
  currentCount = 6,
  totalCount = 48,
  onLoadMore
}) {
  const percentage = Math.min(100, Math.round((currentCount / totalCount) * 100))

  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-6">
      {/* Progress Bar */}
      <div className="w-48 sm:w-64 h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[#c81d25] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="text-xs font-semibold text-neutral-500 mb-5">
        Showing {currentCount} of {totalCount} items
      </span>

      {/* Load More Button */}
      {currentCount < totalCount && (
        <button
          type="button"
          onClick={onLoadMore}
          className="inline-flex items-center gap-2 border-2 border-[#c81d25] text-[#c81d25] hover:bg-[#c81d25] hover:text-white px-8 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition active:scale-95 shadow-2xs"
        >
          <span>Load more products</span>
          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  )
}

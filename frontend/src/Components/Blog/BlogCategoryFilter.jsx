import { BLOG_FILTERS } from '../../data/blog'

export default function BlogCategoryFilter({
  activeFilter = 'all',
  onSelectFilter
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 w-full">
      <div className="bg-[#f5f3ee] rounded-3xl p-6 sm:p-7 text-center border border-neutral-200/80 shadow-2xs">
        <span className="text-[#c81d25] text-[10px] font-extrabold uppercase tracking-widest block mb-1">
          ARCHIVED & LIVE DISPATCHES
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mb-4">
          Latest News
        </h2>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {BLOG_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id

            return (
              <button
                key={filter.id}
                onClick={() => onSelectFilter && onSelectFilter(filter.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs ${
                  isActive
                    ? 'bg-[#b91c1c] text-white shadow-xs'
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

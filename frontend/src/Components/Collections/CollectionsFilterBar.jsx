import { COLLECTION_FILTERS } from '../../data/collections'

export default function CollectionsFilterBar({
  activeFilter = 'all',
  onSelectFilter
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-3 w-full">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {COLLECTION_FILTERS.map((tab) => {
          const isActive = activeFilter === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onSelectFilter && onSelectFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap shadow-2xs ${
                isActive
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 border border-neutral-200/60'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

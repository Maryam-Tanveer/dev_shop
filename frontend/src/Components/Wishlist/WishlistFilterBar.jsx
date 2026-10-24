import { Bell } from 'lucide-react'

export default function WishlistFilterBar({
  activeFilter = 'ALL',
  onSelectFilter,
  totalCount = 4,
  inStockCount = 3,
  rareCount = 1
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-3 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onSelectFilter && onSelectFilter('ALL')}
            className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition active:scale-95 whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-[#c81d25] text-white shadow-xs'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300'
            }`}
          >
            ALL ITEMS ({totalCount})
          </button>

          <button
            onClick={() => onSelectFilter && onSelectFilter('IN_STOCK')}
            className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition active:scale-95 whitespace-nowrap ${
              activeFilter === 'IN_STOCK'
                ? 'bg-[#c81d25] text-white shadow-xs'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300'
            }`}
          >
            IN STOCK ({inStockCount})
          </button>

          <button
            onClick={() => onSelectFilter && onSelectFilter('RARE')}
            className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition active:scale-95 whitespace-nowrap ${
              activeFilter === 'RARE'
                ? 'bg-[#c81d25] text-white shadow-xs'
                : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300'
            }`}
          >
            RARE DROPS ({rareCount})
          </button>
        </div>

        {/* Right Price Alert Tracking Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
          <Bell className="w-3.5 h-3.5 text-[#c81d25]" />
          <span>Price alert tracking active for all {totalCount} items</span>
        </div>
      </div>
    </div>
  )
}

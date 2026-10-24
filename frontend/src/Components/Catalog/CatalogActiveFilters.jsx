import { X, ChevronDown } from 'lucide-react'

export default function CatalogActiveFilters({
  collection = 'All',
  onRemoveCollection,
  sizes = ['9', '9.5'],
  onRemoveSizes,
  priceRange = [50, 800],
  onResetPrice,
  sortBy = 'Featured',
  onSortChange
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-neutral-200">
      {/* Active Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mr-1">
          ACTIVE:
        </span>

        {/* Collection Tag */}
        {collection && (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-[#c81d25] text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <span>Collection: {collection}</span>
            <button
              type="button"
              onClick={onRemoveCollection}
              className="hover:text-neutral-900 transition"
              title="Remove collection filter"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </span>
        )}

        {/* Sizes Tag */}
        {sizes.length > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <span>Size: {sizes.join(', ')}</span>
            <button
              type="button"
              onClick={onRemoveSizes}
              className="hover:text-[#c81d25] transition"
              title="Remove size filter"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </span>
        )}

        {/* Price Tag */}
        {priceRange && (
          <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <span>${priceRange[0]} – ${priceRange[1]}</span>
            <button
              type="button"
              onClick={onResetPrice}
              className="hover:text-[#c81d25] transition"
              title="Reset price filter"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </span>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="text-xs text-neutral-400 font-medium">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-1.5 text-xs font-bold text-neutral-800 transition outline-none appearance-none cursor-pointer pr-8 shadow-2xs"
          >
            <option value="Featured">Featured</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Newest Drops">Newest Drops</option>
            <option value="Most Hyped">Most Hyped</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

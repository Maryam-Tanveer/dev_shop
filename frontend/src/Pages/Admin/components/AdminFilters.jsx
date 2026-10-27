export default function AdminFilters({
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
}) {
  const statuses = ['All', 'In Stock', 'Low Stock', 'Sold Out']
  const categories = ['All', 'Sneakers', 'Apparel', 'Outerwear']

  return (
    <section aria-label="Drop Inventory Filters" className="bg-[#16161f] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input with ARIA */}
      <div className="relative w-full md:w-80">
        <label htmlFor="admin-search-input" className="sr-only">
          Search drops by title, brand, or ID
        </label>
        <input
          id="admin-search-input"
          type="text"
          placeholder="Search by title, brand, or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search by title, brand, or product ID"
          className="w-full bg-[#0e0e14] border border-white/10 focus:border-[#c81d25] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear search input"
            className="absolute right-3 top-2.5 text-neutral-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Buttons with role="group" & aria-pressed */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div role="group" aria-label="Filter by Stock Status" className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-500 text-[11px] uppercase font-mono" id="status-filter-label">Status:</span>
          {statuses.map((st) => {
            const isSelected = selectedStatus === st
            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusChange(st)}
                aria-pressed={isSelected}
                aria-label={`Filter drops by status ${st}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#c81d25] text-white shadow-sm'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            )
          })}
        </div>

        <div role="group" aria-label="Filter by Category" className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-500 text-[11px] uppercase font-mono" id="cat-filter-label">Category:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                aria-pressed={isSelected}
                aria-label={`Filter drops by category ${cat}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

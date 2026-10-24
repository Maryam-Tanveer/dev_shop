import { useState } from 'react'
import { SlidersHorizontal, Check } from 'lucide-react'
import {
  CATALOG_COLLECTIONS as COLLECTIONS,
  CATALOG_SIZES as SIZES,
  CATALOG_BRANDS as BRANDS
} from '../../data/catalog'

export default function CatalogSidebarFilters({
  selectedCollection = 'All',
  onSelectCollection,
  selectedSizes = ['9', '9.5'],
  onToggleSize,
  priceRange = [50, 800],
  onPriceChange,
  selectedBrands = ['nike', 'jordan'],
  onToggleBrand,
  onClearAll
}) {
  const [minPrice, setMinPrice] = useState(priceRange[0])
  const [maxPrice, setMaxPrice] = useState(priceRange[1])

  const handleMinChange = (e) => {
    const val = Number(e.target.value)
    setMinPrice(val)
    if (onPriceChange) onPriceChange([val, maxPrice])
  }

  const handleMaxChange = (e) => {
    const val = Number(e.target.value)
    setMaxPrice(val)
    if (onPriceChange) onPriceChange([minPrice, val])
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#c81d25]" />
          <h2 className="text-sm sm:text-base font-extrabold text-neutral-900 tracking-tight">
            Filter products
          </h2>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] font-extrabold uppercase tracking-wider text-[#c81d25] hover:text-[#991b1b] transition"
        >
          CLEAR ALL
        </button>
      </div>

      {/* 1. COLLECTIONS */}
      <div>
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-800 mb-3">
          COLLECTIONS
        </h3>
        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.map((col) => {
            const isSelected = selectedCollection === col
            return (
              <button
                key={col}
                type="button"
                onClick={() => onSelectCollection && onSelectCollection(col)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-2xs ${
                  isSelected
                    ? 'bg-[#c81d25] text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700'
                }`}
              >
                {col}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. PRICE RANGE */}
      <div className="pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-800">
            PRICE RANGE
          </h3>
          <span className="text-xs font-bold text-neutral-600">
            ${minPrice} – ${maxPrice}
          </span>
        </div>

        {/* Dual Slider bar visual */}
        <div className="relative pt-2 pb-4">
          <div className="h-1.5 bg-neutral-200 rounded-full relative">
            <div
              className="absolute h-full bg-[#c81d25] rounded-full"
              style={{
                left: `${Math.min(100, Math.max(0, (minPrice / 1000) * 100))}%`,
                right: `${Math.min(100, Math.max(0, 100 - (maxPrice / 1000) * 100))}%`
              }}
            />
          </div>
          {/* Handles */}
          <div
            className="absolute top-1.5 w-4 h-4 bg-white border-2 border-[#c81d25] rounded-full -translate-x-1/2 shadow-xs cursor-pointer"
            style={{ left: `${Math.min(100, Math.max(0, (minPrice / 1000) * 100))}%` }}
          />
          <div
            className="absolute top-1.5 w-4 h-4 bg-white border-2 border-[#c81d25] rounded-full -translate-x-1/2 shadow-xs cursor-pointer"
            style={{ left: `${Math.min(100, Math.max(0, (maxPrice / 1000) * 100))}%` }}
          />
        </div>

        {/* Min & Max Inputs */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              MIN PRICE
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                $
              </span>
              <input
                type="number"
                value={minPrice}
                onChange={handleMinChange}
                className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-neutral-800 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              MAX PRICE
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                $
              </span>
              <input
                type="number"
                value={maxPrice}
                onChange={handleMaxChange}
                className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-neutral-800 outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIZE (US MEN) */}
      <div className="pt-2 border-t border-neutral-100">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-800 mb-3">
          SIZE (US MEN)
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((sz) => {
            const isSelected = selectedSizes.includes(sz)
            return (
              <button
                key={sz}
                type="button"
                onClick={() => onToggleSize && onToggleSize(sz)}
                className={`w-full aspect-square rounded-full text-xs font-bold flex items-center justify-center transition active:scale-95 shadow-2xs ${
                  isSelected
                    ? 'bg-[#c81d25] text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                {sz}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. BRAND */}
      <div className="pt-2 border-t border-neutral-100">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-800 mb-3">
          BRAND
        </h3>

        <div className="space-y-2.5">
          {BRANDS.map((brand) => {
            const isChecked = selectedBrands.includes(brand.id)
            return (
              <label
                key={brand.id}
                className="flex items-center justify-between cursor-pointer group select-none"
                onClick={() => onToggleBrand && onToggleBrand(brand.id)}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                      isChecked
                        ? 'bg-[#c81d25] border-[#c81d25] text-white shadow-2xs'
                        : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 group-hover:text-neutral-900 transition">
                    {brand.name}
                  </span>
                </div>

                <span className="text-[11px] font-medium text-neutral-400">
                  {brand.count}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { SlidersHorizontal, Check } from 'lucide-react'
import {
  CATALOG_COLLECTIONS as COLLECTIONS,
  CATALOG_SIZES as SIZES,
  CATALOG_BRANDS as BRANDS
} from '../../data/catalog'

export default function CatalogSidebarFilters({
  selectedCollection = 'All',
  onSelectCollection,
  selectedSizes = [],
  onToggleSize,
  priceRange = [50, 800],
  onPriceChange,
  selectedBrands = [],
  onToggleBrand,
  onClearAll
}) {
  const [minPrice, setMinPrice] = useState(priceRange[0] ?? 50)
  const [maxPrice, setMaxPrice] = useState(priceRange[1] ?? 800)

  // Keep local state in sync when parent priceRange changes (e.g. Reset or Clear All)
  useEffect(() => {
    if (Array.isArray(priceRange) && priceRange.length === 2) {
      setMinPrice(priceRange[0])
      setMaxPrice(priceRange[1])
    }
  }, [priceRange])

  const handleMinSliderChange = (e) => {
    const currentMax = Number(maxPrice) || 800
    const val = Math.min(Number(e.target.value), currentMax - 10)
    setMinPrice(val)
    if (onPriceChange) onPriceChange([val, currentMax])
  }

  const handleMaxSliderChange = (e) => {
    const currentMin = Number(minPrice) || 50
    const val = Math.max(Number(e.target.value), currentMin + 10)
    setMaxPrice(val)
    if (onPriceChange) onPriceChange([currentMin, val])
  }

  const handleMinInputChange = (e) => {
    const raw = e.target.value
    if (raw === '') {
      setMinPrice('')
      return
    }
    const val = Number(raw)
    setMinPrice(val)
    const currentMax = Number(maxPrice) || 1000
    if (!isNaN(val) && val >= 0 && val <= currentMax) {
      if (onPriceChange) onPriceChange([val, currentMax])
    }
  }

  const handleMaxInputChange = (e) => {
    const raw = e.target.value
    if (raw === '') {
      setMaxPrice('')
      return
    }
    const val = Number(raw)
    setMaxPrice(val)
    const currentMin = Number(minPrice) || 0
    if (!isNaN(val) && val >= currentMin && val <= 1000) {
      if (onPriceChange) onPriceChange([currentMin, val])
    }
  }

  const handleMinBlur = () => {
    if (minPrice === '' || isNaN(minPrice)) {
      const fallback = 0
      setMinPrice(fallback)
      if (onPriceChange) onPriceChange([fallback, Number(maxPrice) || 1000])
    }
  }

  const handleMaxBlur = () => {
    if (maxPrice === '' || isNaN(maxPrice)) {
      const fallback = 1000
      setMaxPrice(fallback)
      if (onPriceChange) onPriceChange([Number(minPrice) || 0, fallback])
    }
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
          className="text-[11px] font-extrabold uppercase tracking-wider text-[#c81d25] hover:text-[#991b1b] transition cursor-pointer"
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
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-2xs cursor-pointer ${
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
            ${minPrice || 0} – ${maxPrice || 1000}
          </span>
        </div>

        {/* Dual Interactive Range Slider */}
        <div className="relative h-6 flex items-center select-none my-2">
          {/* Base Gray Bar */}
          <div className="w-full h-1.5 bg-neutral-200 rounded-full relative pointer-events-none">
            {/* Active Red Highlight Bar */}
            <div
              className="absolute h-full bg-[#c81d25] rounded-full pointer-events-none"
              style={{
                left: `${Math.min(100, Math.max(0, ((Number(minPrice) || 0) / 1000) * 100))}%`,
                right: `${Math.min(100, Math.max(0, 100 - ((Number(maxPrice) || 1000) / 1000) * 100))}%`
              }}
            />
          </div>

          {/* Min Slider Thumb */}
          <input
            type="range"
            min={0}
            max={1000}
            step={5}
            value={Number(minPrice) || 0}
            onChange={handleMinSliderChange}
            aria-label="Minimum price"
            className="dev-range-slider absolute inset-0 w-full h-full bg-transparent appearance-none pointer-events-none cursor-pointer"
            style={{ zIndex: (Number(minPrice) || 0) > 850 ? 25 : 20 }}
          />

          {/* Max Slider Thumb */}
          <input
            type="range"
            min={0}
            max={1000}
            step={5}
            value={Number(maxPrice) || 1000}
            onChange={handleMaxSliderChange}
            aria-label="Maximum price"
            className="dev-range-slider absolute inset-0 w-full h-full bg-transparent appearance-none pointer-events-none cursor-pointer"
            style={{ zIndex: 21 }}
          />
        </div>

        {/* Min & Max Numeric Inputs */}
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
                min="0"
                max="1000"
                value={minPrice}
                onChange={handleMinInputChange}
                onBlur={handleMinBlur}
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
                min="0"
                max="1000"
                value={maxPrice}
                onChange={handleMaxInputChange}
                onBlur={handleMaxBlur}
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

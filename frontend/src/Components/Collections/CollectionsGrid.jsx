import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { api } from '../../services/api'
import { COLLECTIONS_DATA as FALLBACK_DATA } from '../../data/collections'

export default function CollectionsGrid({
  activeFilter = 'all',
  onSelectCollection
}) {
  const [collections, setCollections] = useState(FALLBACK_DATA)

  useEffect(() => {
    let isMounted = true
    api
      .getCollections()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCollections(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load collections from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const displayedCollections = activeFilter === 'all'
    ? collections
    : collections.filter((col) => col.category === activeFilter)

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCollections.map((col) => (
          <div
            key={col.id}
            onClick={() => onSelectCollection && onSelectCollection(col)}
            className="group relative rounded-3xl overflow-hidden h-[440px] sm:h-[460px] cursor-pointer shadow-sm border border-neutral-200/90 flex flex-col justify-between p-6 sm:p-7 transition-all duration-500 hover:shadow-xl"
          >
            {/* Background Image with Dark Vignette Gradient */}
            <div className="absolute inset-0 z-0">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 brightness-[0.75] group-hover:brightness-[0.65]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />
            </div>

            {/* Top Row: Badge & Up-Right Arrow Button */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-[#c81d25] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                {col.badge}
              </span>

              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-xs">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 text-white">
              {/* Series Label */}
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-300 block mb-1.5 drop-shadow-xs">
                {col.series}
              </span>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase mb-2 drop-shadow-xs">
                {col.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-neutral-200/90 leading-relaxed font-normal line-clamp-2 mb-5 drop-shadow-xs">
                {col.description}
              </p>

              {/* Action Button & Sub-tag */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectCollection && onSelectCollection(col)
                  }}
                  className="bg-[#c81d25] group-hover:bg-[#a8161d] text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md transition active:scale-95"
                >
                  <span>{col.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-300/90">
                  {col.subTag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { api } from '../../services/api'
import { FEATURED_LANDING_COLLECTIONS as FALLBACK_COLLECTIONS } from '../../data/collections'

export default function CollectionsSection({ onSelectCollection }) {
  const navigate = useNavigate()
  const [collections, setCollections] = useState(FALLBACK_COLLECTIONS)

  useEffect(() => {
    let isMounted = true
    api
      .getFeaturedLandingCollections()
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

  const handleSelect = (col) => {
    if (onSelectCollection) {
      onSelectCollection(col)
      return
    }
    if (col?.productId) {
      navigate(`/product/${col.productId}`)
    } else {
      navigate('/collections')
    }
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[#c81d25] font-extrabold text-[11px] uppercase tracking-wider block mb-1">
            CURATED CATALOGUES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Shop by Collection
          </h2>
        </div>

        <Link
          to="/collections"
          onClick={() => onSelectCollection && onSelectCollection('All')}
          className="text-xs font-bold text-[#c81d25] hover:text-[#991b1b] flex items-center gap-1 group transition"
        >
          <span>Explore all categories</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {collections.map((col) => (
          <div
            key={col.id}
            onClick={() => handleSelect(col)}
            className="relative rounded-2xl overflow-hidden h-[340px] group cursor-pointer shadow-xs border border-neutral-200"
          >
            {/* Image */}
            <img
              src={col.image}
              alt={col.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/90 transition duration-300" />

            {/* Top Row: Badge & Arrow Circle */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs ${col.badgeClass}`}>
                {col.badge}
              </span>

              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition duration-300">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-5 inset-x-5 z-10 text-white">
              <h3 className="text-xl font-black tracking-tight uppercase mb-1">
                {col.title}
              </h3>
              <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                {col.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

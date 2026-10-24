import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, ArrowRight, ShieldCheck, RotateCcw, Lock } from 'lucide-react'
import { api } from '../../services/api'
import { TRENDING_SEARCHES, TRENDING_SILHOUETTES as FALLBACK_SILHOUETTES } from '../../data/cartSuggestions'

export default function CartEmptyState({
  onExploreDrops,
  onViewWishlist,
  onQuickAdd,
  onSelectProduct,
  onSearchTag,
  wishlist = {},
  onToggleWishlist
}) {
  const navigate = useNavigate()
  const [silhouettes, setSilhouettes] = useState(FALLBACK_SILHOUETTES)

  useEffect(() => {
    let isMounted = true
    api
      .getDeals()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setSilhouettes(data.slice(0, 4))
        }
      })
      .catch((err) => {
        console.error('Failed to load trending silhouettes from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSelect = (productId) => {
    if (onSelectProduct) {
      onSelectProduct(productId)
    } else {
      navigate(`/product/${productId}`)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-3 w-full">
      {/* 1. Large Hero Empty Bag Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-14 text-center shadow-xs relative overflow-hidden mb-12">
        {/* Exclamation Bag Graphic */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-red-100/60 rounded-full blur-xl" />

          {/* Circle Icon Base */}
          <div className="relative w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25]">
            <ShoppingBag className="w-8 h-8 stroke-[1.8]" />

            {/* Top-Right Notification Dot with ! */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-[10px] font-black text-neutral-800 shadow-xs">
              !
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-2.5">
          Your Shopping Bag is Empty
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed mb-6 font-normal">
          Looks like you haven't added any grail sneakers or streetwear pieces yet. Explore our curated drops and authentic deadstock releases.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Link
            to="/products"
            onClick={onExploreDrops}
            className="bg-[#c81d25] hover:bg-[#a8161d] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
          >
            <span>Explore Drops</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

          <Link
            to="/wishlist"
            onClick={onViewWishlist}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs px-6 py-3.5 rounded-full border border-neutral-200 shadow-2xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-neutral-600" />
            <span>View Wishlist</span>
          </Link>
        </div>

        {/* Trending Searches Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-neutral-100 text-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mr-1">
            TRENDING SEARCHES :
          </span>

          {TRENDING_SEARCHES.map((query) => (
            <button
              key={query}
              onClick={() => onSearchTag && onSearchTag(query)}
              className="bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-md transition shadow-2xs cursor-pointer"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Trending Silhouettes Section */}
      <section className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[#c81d25] font-extrabold text-[11px] uppercase tracking-wider block mb-1">
              CURATED SELECTION
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Trending Silhouettes
            </h3>
          </div>

          <Link
            to="/products"
            onClick={onExploreDrops}
            className="text-xs font-bold text-[#c81d25] hover:text-[#991b1b] flex items-center gap-1 group transition cursor-pointer"
          >
            <span>View All Drops</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {silhouettes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative"
            >
              <div>
                {/* Image Frame with Badge & Heart */}
                <div className="relative bg-[#f5f5f5] rounded-2xl p-4 h-48 flex items-center justify-center overflow-hidden mb-3">
                  {item.badge && (
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-2xs z-10 ${
                        item.badgeColor || 'bg-neutral-900 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleWishlist && onToggleWishlist(item.id)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-400 hover:text-[#c81d25] transition shadow-2xs z-10"
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${wishlist[item.id] ? 'fill-[#c81d25] text-[#c81d25]' : ''}`} />
                  </button>

                  <div
                    onClick={() => handleSelect(item.id)}
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>

                {/* Brand */}
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  {item.brand}
                </span>

                {/* Title */}
                <h4
                  onClick={() => handleSelect(item.id)}
                  className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#c81d25] transition truncate mb-3 cursor-pointer"
                  title={item.fullTitle || item.title}
                >
                  {item.title}
                </h4>
              </div>

              {/* Price & Quick Add Button */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block leading-tight">
                    VERIFIED PRICE
                  </span>
                  <span className="text-base font-black text-[#c81d25]">
                    ${item.price.toFixed(0)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickAdd && onQuickAdd(item)
                  }}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#c81d25] text-neutral-700 hover:text-white flex items-center justify-center transition shadow-2xs active:scale-90"
                  title="Quick Add to Drop Bag"
                >
                  <span className="text-xs font-black">«</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bottom 3-Column Value Proposition Strip */}
      <div className="bg-[#f5f3ee] rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center flex-shrink-0 text-[#c81d25]">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-neutral-900 mb-0.5">100% Verified Authentic</h5>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Multi-point physical inspection by expert deadstock authenticators.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center flex-shrink-0 text-[#c81d25]">
              <RotateCcw className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-neutral-900 mb-0.5">30-Day Free Returns</h5>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Hassle-free return policy on unworn sneakers in original packaging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center flex-shrink-0 text-[#c81d25]">
              <Lock className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-neutral-900 mb-0.5">Vault-Tier Encryption</h5>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                256-bit high security checkout with protected payment methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

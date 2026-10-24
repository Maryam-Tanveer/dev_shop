import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star, Plus, ArrowRight } from 'lucide-react'
import { api } from '../../services/api'
import { WISHLIST_RECOMMENDATIONS as FALLBACK_RECOMMENDATIONS } from '../../data/wishlist'

export default function WishlistRecommendations({
  onAddToCart,
  onAddToWishlist,
  onSelectProduct,
  wishlist = {}
}) {
  const navigate = useNavigate()
  const [items, setItems] = useState(FALLBACK_RECOMMENDATIONS)

  useEffect(() => {
    let isMounted = true
    api
      .getWishlistRecommendations()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setItems(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load wishlist recommendations:', err)
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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[#c81d25] font-extrabold text-[11px] uppercase tracking-wider block mb-1">
            CURATED FOR YOU
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Recently Viewed & Recommendations
          </h2>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-[#c81d25] hover:text-[#991b1b] flex items-center gap-1 group transition"
        >
          <span>View all trending</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative"
          >
            <div>
              {/* Image Frame with Wishlist Heart */}
              <div className="relative bg-[#f5f5f5] rounded-2xl p-4 h-44 flex items-center justify-center overflow-hidden mb-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToWishlist && onAddToWishlist(item)
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-400 hover:text-[#c81d25] transition shadow-2xs z-10"
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 transition ${wishlist[item.id] ? 'fill-[#c81d25] text-[#c81d25]' : ''}`} />
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

              {/* Category */}
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                {item.category}
              </span>

              {/* Title */}
              <h3
                onClick={() => handleSelect(item.id)}
                className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#c81d25] transition truncate mb-1 cursor-pointer"
                title={item.title}
              >
                {item.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 text-xs text-neutral-400">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-neutral-900 ml-1">{item.rating}</span>
                <span>({item.reviews})</span>
              </div>
            </div>

            {/* Price & Quick Add Circle Button */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <span className="text-base font-black text-neutral-900">
                ${item.price.toFixed(2)}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart && onAddToCart(item)
                }}
                className="w-8 h-8 rounded-full bg-[#f4f2ee] hover:bg-[#c81d25] text-neutral-800 hover:text-white flex items-center justify-center transition shadow-2xs active:scale-90"
                title="Quick Add to Drop Bag"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

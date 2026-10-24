import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react'
import { api } from '../../services/api'
import { RELATED_PRODUCTS as FALLBACK_RELATED } from '../../data/related'

export default function RelatedProducts({ onSelectProduct, onAddToCart, onToggleWishlist, wishlist = {} }) {
  const navigate = useNavigate()
  const [items, setItems] = useState(FALLBACK_RELATED)

  useEffect(() => {
    let isMounted = true
    api
      .getRelatedProducts()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setItems(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load related products:', err)
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
            CURATED PAIRINGS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            You May Also Like
          </h2>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-[#c81d25] hover:text-[#991b1b] flex items-center gap-1 group transition"
        >
          <span>Explore All Drops</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex flex-col justify-between hover:shadow-lg transition group relative cursor-pointer"
            onClick={() => handleSelect(item.id)}
          >
            <div>
              {/* Badge & Wishlist */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {item.badge}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onToggleWishlist) onToggleWishlist(item.id)
                  }}
                  className="p-1 rounded-full text-neutral-400 hover:text-[#c81d25] transition"
                >
                  <Heart className={`w-4 h-4 ${wishlist[item.id] ? 'fill-[#c81d25] text-[#c81d25]' : ''}`} />
                </button>
              </div>

              {/* Image Frame */}
              <div className="bg-[#f5f5f5] rounded-xl p-3 h-40 flex items-center justify-center overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Category */}
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                {item.category}
              </span>

              {/* Title */}
              <h3 className="text-xs font-bold text-neutral-900 truncate mb-1">
                {item.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3 text-xs text-neutral-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-neutral-800">{item.rating}</span>
                <span>({item.reviews})</span>
              </div>

              {/* Price */}
              <div className="text-sm font-black text-neutral-900 mb-3">
                {item.formattedPrice || `$${item.price.toFixed(2)}`}
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onAddToCart) onAddToCart(item)
              }}
              className="w-full py-2 px-3 rounded-full bg-[#f5f2ed] hover:bg-[#eae5dc] text-neutral-800 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#c81d25]" />
              <span>Add to Cart</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

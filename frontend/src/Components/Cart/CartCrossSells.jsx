import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../../services/api'
import { CROSS_SELL_ITEMS as FALLBACK_CROSS_SELLS } from '../../data/cartSuggestions'

export default function CartCrossSells({
  onAddToCart,
  onAddToWishlist,
  onSelectProduct,
  wishlist = {}
}) {
  const navigate = useNavigate()
  const [items, setItems] = useState(FALLBACK_CROSS_SELLS)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let isMounted = true
    api
      .getCartSuggestions()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setItems(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load cart cross sells from API:', err)
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

  const handleNext = () => {
    setOffset((prev) => (prev + 1) % items.length)
  }

  const handlePrev = () => {
    setOffset((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[#c81d25] font-extrabold text-[11px] uppercase tracking-wider block mb-1">
            FREQUENTLY PAIRED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Complete The Look
          </h2>
        </div>

        {/* Carousel Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 transition active:scale-95 shadow-2xs"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 transition active:scale-95 shadow-2xs"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Items Grid */}
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

              {/* Category */}
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                {item.category}
              </span>

              {/* Title */}
              <h3
                onClick={() => handleSelect(item.id)}
                className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#c81d25] transition truncate mb-2 cursor-pointer"
                title={item.title}
              >
                {item.title}
              </h3>

              {/* Price */}
              <div className="text-base font-black text-[#c81d25] mb-4">
                ${item.price.toFixed(2)}
              </div>
            </div>

            {/* Quick Add Pill Button */}
            <button
              onClick={() => onAddToCart && onAddToCart(item)}
              className="w-full py-2.5 px-4 rounded-full bg-[#f4f2ee] hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add to Bag</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

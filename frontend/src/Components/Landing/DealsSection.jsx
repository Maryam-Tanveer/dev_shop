import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Clock, Heart, Star, ShoppingBag, Check, ChevronRight } from 'lucide-react'
import { api } from '../../services/api'

export default function DealsSection({ onAddToCart, wishlist = {}, onToggleWishlist, onSelectProduct }) {
  const navigate = useNavigate()
  const [deals, setDeals] = useState([])
  const [offset, setOffset] = useState(0)
  const [addedId, setAddedId] = useState(null)
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 20, seconds: 6 })

  const handleSelect = (productId) => {
    if (onSelectProduct) {
      onSelectProduct(productId)
    } else {
      navigate(`/product/${productId}`)
    }
  }

  useEffect(() => {
    let isMounted = true
    api
      .getDeals()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setDeals(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load deals from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 12, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleQuickAdd = (product) => {
    if (onAddToCart) onAddToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const handleNext = () => {
    const maxOffset = Math.max(0, deals.length - 4)
    setOffset((prev) => (maxOffset > 0 ? (prev + 1) % (maxOffset + 1) : 0))
  }

  const displayedDeals = deals.slice(offset, offset + 4)

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#c81d25] fill-[#c81d25]" />
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Top Best Deals!
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Flash allocation ends automatically upon timer expiration. Click any item to explore full drop specs.
          </p>
        </div>

        {/* Countdown Badge */}
        <div className="self-start sm:self-auto">
          <div className="bg-[#881337] text-white text-xs font-mono font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-rose-300" />
            <span>
              ENDS IN : {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Product Cards Row with Navigation Arrow */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedDeals.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex flex-col justify-between hover:shadow-xl hover:border-neutral-300 transition-all duration-300 group relative cursor-pointer"
            >
              <div>
                {/* Top badges & Wishlist */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      product.badgeType === 'discount'
                        ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
                        : product.badgeType === 'hot'
                        ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    {product.badge}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleWishlist && onToggleWishlist(product.id)
                    }}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-[#c81d25] transition"
                    title="Add to wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 transition ${
                        wishlist[product.id] ? 'fill-[#c81d25] text-[#c81d25]' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Product Image Frame */}
                <div className="relative bg-[#f5f5f5] rounded-xl p-3 h-44 flex items-center justify-center overflow-hidden mb-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition duration-500"
                  />
                  {/* Tag badge on image bottom-left */}
                  <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-neutral-600 px-2 py-0.5 rounded-md border border-neutral-200/60 shadow-2xs">
                    {product.tag}
                  </span>
                </div>

                {/* Category / Brand */}
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  {product.brand}
                </p>

                {/* Title */}
                <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#c81d25] transition truncate mb-1.5" title={product.fullTitle}>
                  {product.title}
                </h3>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium ml-1">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="text-lg font-black text-neutral-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.priceSub && (
                    <span className="text-xs text-neutral-400 font-medium">
                      {product.priceSub}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Add Pill Button */}
              <button
                id={`quick-add-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuickAdd(product)
                }}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 ${
                  addedId === product.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#f5f2ed] hover:bg-[#eae5dc] text-neutral-800'
                }`}
              >
                {addedId === product.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Carousel Next Arrow Button */}
        <button
          onClick={handleNext}
          className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-neutral-300 shadow-md items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-50 transition z-10"
          title="Next deals"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}

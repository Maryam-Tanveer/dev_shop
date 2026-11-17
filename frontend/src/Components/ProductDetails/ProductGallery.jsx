import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export default function ProductGallery({ product, isWishlisted, onToggleWishlist }) {
  const thumbnails = product?.thumbnails || [
    { id: 'profile', label: 'PROFILE', image: product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80' }
  ]

  const [activeThumb, setActiveThumb] = useState(thumbnails[0])

  // Update active thumbnail when product changes
  useEffect(() => {
    if (thumbnails && thumbnails.length > 0) {
      setActiveThumb(thumbnails[0])
    }
  }, [product?.id])

  return (
    <div className="flex flex-col gap-4">
      {/* Main Showcase Card */}
      <div className="relative bg-[#f5f5f5] rounded-3xl border border-neutral-200/90 p-6 sm:p-10 flex items-center justify-center min-h-[420px] sm:min-h-[480px] overflow-hidden group">
        {/* Favorite Heart Button */}
        <button
          onClick={onToggleWishlist}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-neutral-400 hover:text-[#c81d25] shadow-xs border border-neutral-200/60 transition z-10"
          title="Add to wishlist"
        >
          <Heart className={`w-5 h-5 transition ${isWishlisted ? 'fill-[#c81d25] text-[#c81d25]' : ''}`} />
        </button>

        {/* Product Image */}
        <div className="relative w-full max-w-md flex items-center justify-center py-6">
          <img
            src={activeThumb?.image || product?.image}
            alt={product?.title || 'Product'}
            className="w-full max-h-[340px] object-contain transition-all duration-500 transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Thumbnails Row */}
      {thumbnails.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {thumbnails.map((thumb) => {
            const isActive = activeThumb?.id === thumb.id
            return (
              <button
                key={thumb.id}
                onClick={() => setActiveThumb(thumb)}
                className={`bg-white rounded-2xl border p-2 flex flex-col items-center gap-1.5 transition overflow-hidden ${
                  isActive
                    ? 'border-[#c81d25] ring-2 ring-[#c81d25]/20 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="w-full h-16 bg-[#f7f7f7] rounded-xl overflow-hidden flex items-center justify-center p-1">
                  <img src={thumb.image} alt={thumb.label} className="w-full h-full object-contain" />
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isActive ? 'text-[#c81d25]' : 'text-neutral-500'
                  }`}
                >
                  {thumb.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

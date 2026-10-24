import { useNavigate } from 'react-router-dom'
import { Heart, ImageOff } from 'lucide-react'

export default function CatalogProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onSelectProduct
}) {
  const navigate = useNavigate()
  const {
    id,
    badge,
    badgeColor = 'bg-[#c81d25] text-white',
    brand,
    title,
    fullTitle,
    price,
    originalPrice,
    stockStatus,
    image,
    isUnavailable
  } = product

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(id)
    } else {
      navigate(`/product/${id}`)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative cursor-pointer"
    >
      <div>
        {/* Image Container with Badge and Heart */}
        <div className="relative bg-[#f5f5f5] rounded-2xl h-48 sm:h-52 flex items-center justify-center p-4 overflow-hidden mb-3">
          {/* Badge */}
          {badge && (
            <span
              className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-2xs z-10 ${badgeColor}`}
            >
              {badge}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleWishlist && onToggleWishlist(id)
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-400 hover:text-[#c81d25] transition shadow-2xs z-10"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#c81d25] text-[#c81d25]' : ''}`} />
          </button>

          {/* Product Image or Unavailable Graphic */}
          {isUnavailable ? (
            <div className="flex flex-col items-center justify-center text-neutral-300">
              <ImageOff className="w-10 h-10 stroke-[1.5] mb-2" />
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                IMAGE PREVIEW UNAVAILABLE
              </span>
            </div>
          ) : (
            <img
              src={image}
              alt={title}
              className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition duration-500"
            />
          )}
        </div>

        {/* Brand */}
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
          {brand}
        </span>

        {/* Title */}
        <h3
          className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#c81d25] transition truncate mb-2 leading-snug"
          title={fullTitle || title}
        >
          {title}
        </h3>
      </div>

      {/* Price & Stock Status Row */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-black text-[#c81d25]">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {stockStatus && (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              stockStatus === 'TBA'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {stockStatus}
          </span>
        )}
      </div>
    </div>
  )
}

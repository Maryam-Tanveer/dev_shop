import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star, ShoppingBag } from 'lucide-react'

export default function WishlistGrid({
  items = [],
  onMoveToCart,
  onRemoveItem,
  onSelectProduct
}) {
  const navigate = useNavigate()

  const handleSelect = (productId) => {
    if (onSelectProduct) {
      onSelectProduct(productId)
    } else {
      navigate(`/product/${productId}`)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 w-full text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#c81d25] flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">Your wishlist is empty</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
          Explore upcoming drops, grail archive collections, and click the heart icon on any sneaker to save it here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-[#c81d25] text-white text-xs font-bold px-6 py-2.5 rounded-full transition cursor-pointer"
        >
          Explore Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              {/* Product Image Frame with Heart & Badge */}
              <div className="relative bg-[#f5f5f5] rounded-2xl p-4 h-48 sm:h-52 flex items-center justify-center overflow-hidden mb-3">
                {/* Wishlist Heart Top Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveItem && onRemoveItem(item.id)
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#c81d25] hover:scale-110 transition shadow-2xs z-10"
                  title="Remove from Wishlist"
                >
                  <Heart className="w-4 h-4 fill-[#c81d25]" />
                </button>

                {/* Sneaker Image */}
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

                {/* Category Badge on Bottom-Left */}
                <span
                  className={`absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-2xs ${
                    item.badgeColor || 'bg-neutral-800 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              {/* Style Code & Stock Status Row */}
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-neutral-400 font-medium">
                  Style: {item.style}
                </span>

                <div className="flex items-center gap-1.5 font-bold text-[#c81d25]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25] animate-pulse"></span>
                  <span>{item.stockStatus}</span>
                </div>
              </div>

              {/* Product Title */}
              <h3
                onClick={() => handleSelect(item.id)}
                className="text-sm font-bold text-neutral-900 group-hover:text-[#c81d25] transition line-clamp-2 leading-snug cursor-pointer mb-2 min-h-[40px]"
                title={item.title}
              >
                {item.title}
              </h3>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3 text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-neutral-900 ml-1">{item.rating}</span>
                <span className="text-neutral-400 font-normal">({item.reviews})</span>
              </div>

              {/* Price & Size Row */}
              <div className="flex items-baseline justify-between mb-4 pt-2 border-t border-neutral-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-neutral-900">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                  {item.size}
                </span>
              </div>
            </div>

            {/* Actions: Move to Cart & Remove */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onMoveToCart && onMoveToCart(item)}
                className="w-full py-2.5 px-4 rounded-full bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>

              <button
                onClick={() => onRemoveItem && onRemoveItem(item.id)}
                className="w-full text-center text-xs text-neutral-400 hover:text-neutral-700 transition py-1 block"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { Heart, Trash2, ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react'

export default function CartItemList({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onSaveToWishlist,
  onContinueShopping,
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
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-10 text-center shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 mb-1">Your Drop Bag is Empty</h3>
        <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto">
          Explore our latest sneakers, apparel, and vault hardware to claim limited allocations.
        </p>
        <Link
          to="/products"
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 bg-[#c81d25] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#a8161d] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore Drops</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const itemTotal = item.price * (item.quantity || 1)

        return (
          <div
            key={item.id || item.cartItemId}
            className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs transition hover:border-neutral-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left Image & Info Block */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Image Frame with Badge */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#f5f5f5] rounded-2xl flex items-center justify-center p-2 flex-shrink-0 border border-neutral-100 overflow-hidden">
                  {item.badge && (
                    <span
                      className={`absolute top-2 left-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-2xs z-10 ${
                        item.badgeColor || 'bg-neutral-900 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <div
                    onClick={() => handleSelect(item.productId || item.id)}
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain transform hover:scale-105 transition duration-300"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
                    {item.category || item.brand || 'DROP EDITION'}
                  </span>

                  <h3
                    onClick={() => handleSelect(item.productId || item.id)}
                    className="text-sm sm:text-base font-extrabold text-neutral-900 hover:text-[#c81d25] transition truncate cursor-pointer leading-snug"
                    title={item.title}
                  >
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500 mt-1">
                    {item.colorway && <span>Colorway: <strong className="text-neutral-700 font-semibold">{item.colorway}</strong></span>}
                    {item.size && (
                      <>
                        <span className="text-neutral-300">•</span>
                        <span>Size: <strong className="text-neutral-700 font-semibold">{item.size}</strong></span>
                      </>
                    )}
                    {item.spec && (
                      <>
                        <span className="text-neutral-300">•</span>
                        <span>Spec: <strong className="text-neutral-700 font-semibold">{item.spec}</strong></span>
                      </>
                    )}
                  </div>

                  {/* Authenticity verification tag */}
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-600 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c81d25]" />
                    <span>{item.tag || 'Deadstock Authentic'}</span>
                  </div>
                </div>
              </div>

              {/* Right Price Block */}
              <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-neutral-100 flex sm:flex-col justify-between sm:justify-start items-baseline sm:items-end">
                <div className="flex items-baseline gap-2">
                  {item.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-lg font-black text-[#c81d25]">
                    ${itemTotal.toFixed(2)}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Unit: ${item.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bottom Row: Quantity Controls & Sub-actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-neutral-100">
              {/* Quantity Pill */}
              <div className="inline-flex items-center border border-neutral-200 rounded-full bg-[#fcfbfa] px-1 py-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.cartItemId || item.id, Math.max(1, (item.quantity || 1) - 1))}
                  className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition font-bold"
                  title="Decrease"
                >
                  —
                </button>
                <span className="w-7 text-center text-xs font-black text-neutral-900">
                  {item.quantity || 1}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.cartItemId || item.id, (item.quantity || 1) + 1)}
                  className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition font-bold"
                  title="Increase"
                >
                  +
                </button>
              </div>

              {/* Save to Wishlist & Remove */}
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
                <button
                  type="button"
                  onClick={() => onSaveToWishlist && onSaveToWishlist(item)}
                  className="flex items-center gap-1.5 hover:text-[#c81d25] transition"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Save to Wishlist</span>
                </button>

                <span className="text-neutral-300">|</span>

                <button
                  type="button"
                  onClick={() => onRemoveItem && onRemoveItem(item.cartItemId || item.id)}
                  className="flex items-center gap-1.5 hover:text-[#c81d25] transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Bottom Footer Navigation Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 px-2">
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-[#c81d25] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping Sneakers & Vault</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-medium text-neutral-500">
          <span className="flex items-center gap-1 text-neutral-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c81d25]" />
            <span>100% Genuine</span>
          </span>
          <span className="text-neutral-300">•</span>
          <span className="flex items-center gap-1 text-neutral-600">
            <RotateCcw className="w-3.5 h-3.5 text-[#c81d25]" />
            <span>Easy Returns</span>
          </span>
        </div>
      </div>
    </div>
  )
}

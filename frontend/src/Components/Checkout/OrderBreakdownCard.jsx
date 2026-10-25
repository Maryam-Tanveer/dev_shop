import { useState } from 'react'
import { ShieldCheck, Tag } from 'lucide-react'

export default function OrderBreakdownCard({
  items = [],
  shippingCost = 0,
  taxRate = 0.08875,
  onEditBag,
  onApplyPromo
}) {
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  // Subtotal & Exact Breakdown matching items in cart
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
  const tax = Number((subtotal * taxRate).toFixed(2))
  const total = Number((Math.max(0, subtotal - discount + shippingCost + tax)).toFixed(2))

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (!promoCode.trim()) return
    if (promoCode.trim().toUpperCase() === 'DEVSHOP' || promoCode.trim().toUpperCase() === 'HEAT50') {
      setDiscount(50)
      if (onApplyPromo) onApplyPromo(50, promoCode.trim().toUpperCase())
    } else {
      setDiscount(20)
      if (onApplyPromo) onApplyPromo(20, promoCode.trim().toUpperCase())
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-neutral-800">
          ORDER BREAKDOWN ({items.length} ITEMS)
        </h3>
        <button
          type="button"
          onClick={onEditBag}
          className="text-xs font-bold text-neutral-500 hover:text-[#c81d25] transition"
        >
          Edit Bag
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-4 mb-6">
        {items.length === 0 ? (
          <div className="py-8 text-center text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="font-bold text-xs text-neutral-600">Your bag is empty</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Explore drops in the catalog to add items.</p>
          </div>
        ) : (
          items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 group">
            {/* Image Thumbnail with count badge */}
            <div className="relative w-16 h-16 rounded-2xl bg-neutral-100 p-1 flex items-center justify-center flex-shrink-0 border border-neutral-200/80 overflow-visible">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                {item.quantity || 1}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
                {item.brand}
              </span>
              <h4
                className="text-xs sm:text-sm font-bold text-neutral-900 truncate"
                title={item.fullTitle || item.title}
              >
                {item.title}
              </h4>
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                Size: {item.size} • {item.condition}
              </p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <span className="text-sm sm:text-base font-black text-[#c81d25]">
                ${item.price.toFixed(2)}
              </span>
            </div>
          </div>
        )))}
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="PROMO CODE OR GIFT VOUCHER"
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-800 placeholder-neutral-400 transition outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1a1a1a] hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs active:scale-95"
        >
          Apply
        </button>
      </form>

      {/* Calculations */}
      <div className="space-y-2.5 text-xs border-t border-neutral-100 pt-4 mb-5">
        <div className="flex items-center justify-between text-neutral-600 font-medium">
          <span>Subtotal ({items.length} items)</span>
          <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-[#c81d25] font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Promo Discount</span>
            </span>
            <span className="font-bold">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-neutral-600 font-medium">
          <span className="flex items-center gap-1">
            <span>Shipping</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#c81d25]" />
          </span>
          <span className="font-bold text-[#c81d25]">
            {shippingCost === 0 ? 'FREE (EXPRESS)' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-600 font-medium">
          <span>Estimated Sales Tax (NYC 8.875%)</span>
          <span className="font-bold text-neutral-900">${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total Due Callout Box */}
      <div className="bg-[#f9f8f6] rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-neutral-200/80">
        <div>
          <div className="text-sm font-black text-neutral-900">
            Total Due
          </div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
            INCLUDES DUTY & TAXES
          </div>
        </div>

        <div className="text-xl sm:text-2xl font-black text-[#c81d25]">
          ${total.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

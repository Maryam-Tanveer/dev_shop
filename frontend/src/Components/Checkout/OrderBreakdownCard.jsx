import { ShieldCheck, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function OrderBreakdownCard({
  items: propItems,
  shippingCost = 0,
  taxRate = 0.08,
  onEditBag,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const { items: contextItems, updateQuantity, removeFromCart } = useCart()
  const items = propItems || contextItems || []

  const handleUpdateQty = (item, newQty) => {
    if (newQty <= 0) {
      if (onRemoveItem) onRemoveItem(item.cartItemId || item.id)
      else if (removeFromCart) removeFromCart(item.cartItemId || item.id || item)
      return
    }
    if (onUpdateQuantity) {
      onUpdateQuantity(item.cartItemId || item.id, newQty)
    } else if (updateQuantity) {
      updateQuantity(item.cartItemId || item.id || item, newQty)
    }
  }

  const handleRemove = (item) => {
    if (onRemoveItem) {
      onRemoveItem(item.cartItemId || item.id)
    } else if (removeFromCart) {
      removeFromCart(item.cartItemId || item.id || item)
    }
  }

  // Subtotal & Exact Breakdown matching items in cart
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0)
  const tax = Number((subtotal * taxRate).toFixed(2))
  const total = Number((subtotal + shippingCost + tax).toFixed(2))

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
          className="text-xs font-bold text-neutral-500 hover:text-[#c81d25] transition cursor-pointer"
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
          items.map((item, idx) => (
            <div key={item.cartItemId || item.id || idx} className="flex items-center gap-4 group">
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
                <p className="text-[11px] text-neutral-500 font-medium mt-0.5 truncate">
                  Size: {item.size || 'One Size'}{item.colorway ? ` • ${item.colorway}` : ''}
                </p>

                {/* Quantity Stepper & Remove */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="inline-flex items-center border border-neutral-200 rounded-full bg-neutral-50 px-1 py-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item, (item.quantity || 1) - 1)}
                      className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-full transition font-bold text-xs cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-neutral-900">
                      {item.quantity || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item, (item.quantity || 1) + 1)}
                      className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-full transition font-bold text-xs cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <span className="text-sm sm:text-base font-black text-[#c81d25]">
                  ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
                {(item.quantity || 1) > 1 && (
                  <span className="block text-[10px] text-neutral-400 font-medium">
                    ${(Number(item.price) || 0).toFixed(2)} each
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Calculations */}
      <div className="space-y-2.5 text-xs border-t border-neutral-100 pt-4 mb-5">
        <div className="flex items-center justify-between text-neutral-600 font-medium">
          <span>Subtotal ({items.length} items)</span>
          <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-neutral-600 font-medium">
          <span className="flex items-center gap-1">
            <span>Shipping</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#c81d25]" />
          </span>
          <span className="font-bold text-[#c81d25]">
            {shippingCost === 0 ? 'FREE (STANDARD)' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-600 font-medium">
          <span>Estimated Sales Tax (8%)</span>
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

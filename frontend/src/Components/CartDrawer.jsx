import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onCheckout
}) {
  if (!isOpen) return null

  const subtotal = Number(
    items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  ).toFixed(2)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c81d25]" />
              <h3 className="font-extrabold text-lg text-neutral-900">Your Drop Bag</h3>
              <span className="bg-[#fde8e8] text-[#c81d25] text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          {items.length === 0 ? (
            <div className="py-20 text-center text-neutral-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-25 text-neutral-400" />
              <p className="font-bold text-sm text-neutral-600">Your drop bag is empty.</p>
              <p className="text-xs text-neutral-400 mt-1">Explore our latest drops to claim items.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {items.map((item, idx) => (
                <div key={item.cartItemId || item.id || idx} className="py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-14 object-cover rounded-xl bg-neutral-100 border border-neutral-200/80"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#c81d25] uppercase tracking-wider">
                      {item.brand}
                    </p>
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{item.title}</h4>
                    {(item.colorway || item.size) && (
                      <p className="text-[10px] text-neutral-500 font-medium truncate">
                        {item.colorway}{item.size ? ` • ${item.size}` : ''}
                      </p>
                    )}
                    <p className="text-xs font-extrabold text-neutral-900 mt-0.5">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      {(item.quantity || 1) > 1 && (
                        <span className="text-neutral-500 font-normal ml-1">× {item.quantity}</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem && onRemoveItem(item.cartItemId || item.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 pt-4 mt-4">
            <div className="flex justify-between items-center text-sm font-bold mb-4">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-neutral-900 text-base font-black">${subtotal}</span>
            </div>

            <button
              onClick={() => onCheckout && onCheckout()}
              className="w-full py-3 bg-[#c81d25] hover:bg-[#a5151c] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import { ShieldCheck, Tag } from 'lucide-react'
import { ORDER_PURCHASED_ITEMS as items } from '../../data/orders'

export default function OrderPurchasedItems({ items: customItems }) {
  const items = (customItems && customItems.length > 0)
    ? customItems.map((item, idx) => ({
        id: item.id || item._id || item.productId || idx,
        title: item.title || item.name || 'Drop Grail Item',
        image: item.image || item.thumbnails?.[0]?.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400',
        price: Number(item.price || 0),
        size: item.size || '10.5 US',
        condition: item.condition || 'Deadstock / Unworn',
        qty: item.quantity || item.qty || 1,
        skuTag: item.skuTag || 'VERIFIED AUTHENTIC',
        sku: item.sku || `SKU-DEV-${1000 + idx}`,
        badge: item.badge || 'VERIFIED',
        badgeColor: item.badgeColor || 'bg-black text-white',
        subBadge: item.subBadge || 'Vault Verified',
        subBadgeColor: item.subBadgeColor || 'text-emerald-600',
      }))
    : ORDER_PURCHASED_ITEMS

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-2">
        <h3 className="text-base font-black text-neutral-900 tracking-tight">
          Purchased Items ({items.length})
        </h3>
        <span className="text-[11px] font-bold text-neutral-400">
          Packaging: Drop-Proof Tamper Shield
        </span>
      </div>

      {/* Items List */}
      <div className="divide-y divide-neutral-100">
        {items.map((item) => (
          <div key={item.id} className="py-4 sm:py-5 flex items-center justify-between gap-4">
            {/* Left Thumbnail with Badge & Details */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-20 h-20 rounded-2xl bg-neutral-100 p-2 flex items-center justify-center flex-shrink-0 border border-neutral-200/80 overflow-hidden">
                <span
                  className={`absolute top-1.5 left-1.5 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-2xs z-10 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#c81d25]">
                    {item.skuTag}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-[10px] font-bold text-neutral-400 font-mono">
                    {item.sku}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                  {item.title}
                </h4>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 font-medium mt-1">
                  <span>Size: <strong className="text-neutral-700">{item.size}</strong></span>
                  <span className="text-neutral-300">•</span>
                  <span>Condition: <strong className="text-neutral-700">{item.condition}</strong></span>
                  <span className="text-neutral-300">•</span>
                  <span>Qty: <strong className="text-neutral-700">{item.qty}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Price & Sub-badge */}
            <div className="text-right flex-shrink-0">
              <span className="text-base sm:text-lg font-black text-neutral-900 block">
                ${item.price.toFixed(2)}
              </span>
              <span className={`text-[10px] font-bold ${item.subBadgeColor}`}>
                {item.subBadge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

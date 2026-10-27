import { Link } from 'react-router-dom'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'

export default function AdminProductTable({
  products,
  loading,
  stockEdits,
  onStockEditChange,
  onSaveStockCount,
  onUpdateStatus,
  onDeleteDrop,
  onClearFilters,
}) {
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="py-20 text-center text-neutral-500 font-mono text-xs bg-[#16161f] border border-white/10 rounded-2xl"
      >
        <div className="w-8 h-8 border-2 border-[#c81d25] border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
        <span>SYNCING VAULT TELEMETRY...</span>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div
        role="status"
        className="py-16 text-center text-neutral-400 bg-[#16161f] border border-white/10 rounded-2xl"
      >
        <p className="text-sm font-semibold">No streetwear drops found matching filter.</p>
        <button
          type="button"
          onClick={onClearFilters}
          aria-label="Clear active search and status filters"
          className="mt-3 text-xs text-[#c81d25] hover:underline cursor-pointer"
        >
          Clear active filters
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#16161f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Drop Inventory Allocation Table">
          <thead className="bg-[#111118] text-neutral-400 font-mono text-[10px] uppercase border-b border-white/10">
            <tr>
              <th scope="col" className="py-3.5 px-4">Streetwear Drop</th>
              <th scope="col" className="py-3.5 px-4">Price</th>
              <th scope="col" className="py-3.5 px-4">Stock Status Switcher</th>
              <th scope="col" className="py-3.5 px-4 text-center">Remaining Stock</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => {
              const currentCount = p.stock !== undefined ? p.stock : 15
              const editValue = stockEdits[p.id] !== undefined ? stockEdits[p.id] : currentCount

              return (
                <tr key={p.id} className="hover:bg-white/[0.02] transition">
                  {/* Product Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || p.thumbnails?.[0]?.image || DEFAULT_IMAGE}
                        alt={`${p.title} product thumbnail`}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-white/10 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-sm hover:text-[#c81d25] transition">
                          <Link
                            to={`/product/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View live product page for ${p.title}`}
                          >
                            {p.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                          <span className="font-mono text-neutral-500">{p.brand}</span>
                          <span aria-hidden="true">•</span>
                          <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">
                            {p.category}
                          </span>
                          {p.badge && (
                            <span className="bg-[#c81d25]/20 text-[#ff4d5a] border border-[#c81d25]/30 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-white text-sm" aria-label={`Price: $${Number(p.price).toFixed(2)}`}>
                      ${Number(p.price).toFixed(2)}
                    </div>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <div className="text-[10px] text-neutral-500 line-through font-mono" aria-label={`Original price: $${Number(p.originalPrice).toFixed(2)}`}>
                        ${Number(p.originalPrice).toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Stock Status Switcher Pills */}
                  <td className="py-4 px-4">
                    <div role="group" aria-label={`Update stock status for ${p.title}`} className="flex items-center gap-1.5">
                      {['In Stock', 'Low Stock', 'Sold Out', 'TBA'].map((st) => {
                        const isCurrent = p.stockStatus === st
                        let activeClass = 'bg-emerald-500 text-black font-bold shadow-sm'
                        if (st === 'Low Stock') activeClass = 'bg-amber-500 text-black font-bold shadow-sm'
                        if (st === 'Sold Out') activeClass = 'bg-red-500 text-white font-bold shadow-sm'
                        if (st === 'TBA') activeClass = 'bg-purple-600 text-white font-bold shadow-sm'

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => onUpdateStatus(p.id, st, currentCount)}
                            aria-pressed={isCurrent}
                            aria-label={`Set status to ${st} for ${p.title}`}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                              isCurrent ? activeClass : 'bg-white/5 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      })}
                    </div>
                  </td>

                  {/* Stock Count Inline Editor */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-[#0e0e14] border border-white/10 rounded-xl px-2 py-1">
                      <label htmlFor={`stock-input-${p.id}`} className="sr-only">
                        Stock count for {p.title}
                      </label>
                      <input
                        id={`stock-input-${p.id}`}
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => onStockEditChange(p.id, e.target.value)}
                        aria-label={`Stock count for ${p.title}`}
                        className="w-14 bg-transparent text-center font-mono text-xs font-bold text-white focus:outline-none"
                      />
                      {stockEdits[p.id] !== undefined && Number(stockEdits[p.id]) !== currentCount && (
                        <button
                          type="button"
                          onClick={() => onSaveStockCount(p.id)}
                          aria-label={`Save stock count for ${p.title}`}
                          className="bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-bold px-2 py-1 rounded transition cursor-pointer"
                        >
                          ✓ Save
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/product/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${p.title} in storefront`}
                        className="text-[11px] text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition"
                      >
                        Live ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteDrop(p.id, p.title)}
                        aria-label={`Delete ${p.title} from vault catalog`}
                        className="text-[11px] text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

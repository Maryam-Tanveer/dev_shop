import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  FileText,
  Headphones,
  RotateCcw,
  PenTool,
  Award,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { api } from '../../services/api'
import { RECENT_DROP_ORDERS as FALLBACK_ORDERS } from '../../data/orders'

export default function RecentDropOrders({
  onTrackOrder,
  onViewInvoice,
  onOrderHelp,
  onWriteReview,
  onViewCertificate,
  onReorder,
}) {
  const [orders, setOrders] = useState(FALLBACK_ORDERS)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    let isMounted = true
    api
      .getOrders()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setOrders(data)
        }
      })
      .catch((err) => {
        console.error('Failed to load orders from API:', err)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ACTIVE') return order.statusType === 'in-vault'
    if (filter === 'DELIVERED') return order.statusType === 'delivered'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
            Recent Drop Orders{' '}
            <span className="text-xs font-normal text-neutral-400">
              (Showing last 90 days)
            </span>
          </h2>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-1.5 text-xs font-bold text-neutral-800 transition outline-none appearance-none cursor-pointer pr-8 shadow-2xs"
          >
            <option value="ALL">FILTER: ALL</option>
            <option value="ACTIVE">ACTIVE VAULT</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Orders Map */}
      {filteredOrders.map((order) => {
        const isInVault = order.statusType === 'in-vault'

        return (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-7 shadow-xs"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-neutral-900">
                    {order.orderNumber}
                  </span>
                  {isInVault ? (
                    <span className="bg-rose-50 text-[#c81d25] border border-rose-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25] animate-pulse" />
                      <span>{order.status}</span>
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <span>{order.status}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Placed on {order.placedDate} • {order.carrier}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block leading-tight">
                  Total Amount
                </span>
                <span
                  className={`text-xl sm:text-2xl font-black ${
                    isInVault ? 'text-[#c81d25]' : 'text-neutral-900'
                  }`}
                >
                  {order.formattedTotal}
                </span>
              </div>
            </div>

            {/* Stepper (Only for In-Vault orders) */}
            {isInVault && order.stepperSteps && (
              <div className="py-5 border-b border-neutral-100">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[10px] font-extrabold uppercase tracking-wider">
                  {order.stepperSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1 ${
                        step.completed
                          ? 'text-emerald-600'
                          : step.current
                          ? 'text-[#c81d25]'
                          : 'text-neutral-400'
                      }`}
                    >
                      {step.current && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c81d25] animate-ping" />
                      )}
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-3">
                  <div
                    style={{ width: `${order.progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-[#c81d25] to-[#c81d25] rounded-full"
                  />
                </div>

                {order.note && (
                  <div className="bg-[#fcfbfa] p-3 rounded-xl border border-neutral-200/80 flex items-start gap-2 text-xs text-neutral-600">
                    <ShieldCheck className="w-4 h-4 text-[#c81d25] flex-shrink-0 mt-0.5" />
                    <span>{order.note}</span>
                  </div>
                )}
              </div>
            )}

            {/* Items in Order */}
            <div className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 p-2 flex items-center justify-center flex-shrink-0 border border-neutral-200/80">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
                      {item.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {item.specs}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-black text-neutral-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      Qty: {item.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-neutral-100">
              {isInVault ? (
                <>
                  <div className="flex items-center gap-4 text-xs font-bold text-neutral-500">
                    <button
                      onClick={onViewInvoice}
                      className="flex items-center gap-1.5 hover:text-neutral-900 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Invoice</span>
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      onClick={onOrderHelp}
                      className="flex items-center gap-1.5 hover:text-neutral-900 transition"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Order Help</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onTrackOrder && onTrackOrder(order)}
                    className="bg-[#c81d25] hover:bg-[#a8161d] text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-md active:scale-95"
                  >
                    Track Shipment
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 text-xs font-bold text-neutral-500">
                    <button
                      onClick={onWriteReview}
                      className="flex items-center gap-1.5 hover:text-neutral-900 transition text-[#c81d25]"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Write Review (+50 Pts)</span>
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      onClick={onViewCertificate}
                      className="flex items-center gap-1.5 hover:text-neutral-900 transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate of Authenticity</span>
                    </button>
                  </div>

                  <button
                    onClick={onReorder}
                    className="bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-md active:scale-95"
                  >
                    Reorder Silhouette
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}

      {/* Bottom Archive Callout */}
      <div className="bg-[#f5f3ee] rounded-3xl p-6 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-neutral-900 mb-0.5">
            Looking for past drop archives?
          </h3>
          <p className="text-xs text-neutral-500">
            You have 12 past completed deliveries from 2023–2024.
          </p>
        </div>

        <button
          type="button"
          className="bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-bold px-5 py-2.5 rounded-full border border-neutral-200/90 shadow-2xs flex items-center gap-2 self-start sm:self-auto transition active:scale-95"
        >
          <span>View All 14 Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

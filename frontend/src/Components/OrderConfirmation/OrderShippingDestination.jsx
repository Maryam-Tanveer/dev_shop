import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function OrderShippingDestination({
  onAddGateCode
}) {
  let auth = null
  try {
    auth = useAuth()
  } catch (e) {
    // fallback outside provider
  }
  const recipientName = auth?.currentUser?.name || 'Customer'

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#c81d25]" />
          <h3 className="text-base font-black text-neutral-900 tracking-tight">
            Shipping & Delivery Destination
          </h3>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200 shadow-2xs">
          SIGNATURE REQUIRED
        </span>
      </div>

      {/* 2-Column Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Recipient */}
        <div className="bg-[#fcfbfa] rounded-2xl border border-neutral-200/80 p-4">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            RECIPIENT NAME
          </span>
          <h4 className="text-sm font-black text-neutral-900 mb-0.5">
            {recipientName}
          </h4>
          <p className="text-xs text-neutral-500 font-medium">
            Dev Shop Elite VIP Member (#DS-ELITE-99)
          </p>
        </div>

        {/* Address */}
        <div className="bg-[#fcfbfa] rounded-2xl border border-neutral-200/80 p-4">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            SHIPPING ADDRESS
          </span>
          <h4 className="text-sm font-black text-neutral-900 mb-0.5">
            482 Mercer Street, Loft 3B
          </h4>
          <p className="text-xs text-neutral-500 font-medium">
            Soho District, New York, NY 10013
          </p>
        </div>
      </div>

      {/* Footer Window & Gate Code */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
        <div className="flex items-center gap-2 text-neutral-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span>Delivery Time Window: <strong className="text-neutral-800">Mon-Wed, 9:00 AM – 7:00 PM</strong></span>
        </div>

        <button
          type="button"
          onClick={onAddGateCode}
          className="text-xs font-bold text-[#c81d25] hover:text-[#991b1b] flex items-center gap-1 transition self-start sm:self-auto"
        >
          <span>Add Specific Gate Code</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

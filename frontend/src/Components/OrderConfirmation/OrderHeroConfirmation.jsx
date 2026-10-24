import { Check, Calendar, Truck, CreditCard, Hash } from 'lucide-react'

export default function OrderHeroConfirmation({
  orderNumber = 'DS-8492019',
  customerName = 'Marcus',
  estDelivery = 'Oct 28 – Oct 30',
  trackingNumber = 'FEDEX-98234-EXPRESS',
  paymentMethod = 'Apple Pay (Visa •••• 8821)'
}) {
  return (
    <div className="bg-gradient-to-b from-[#fdf6f5] via-white to-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center shadow-xs relative overflow-hidden mb-8">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Red Checkmark in Circular Badge */}
      <div className="relative w-16 h-16 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center mx-auto mb-4 text-[#c81d25] shadow-xs">
        <Check className="w-8 h-8 stroke-[2.5]" />
      </div>

      {/* Tag */}
      <span className="text-[#c81d25] font-extrabold text-[11px] uppercase tracking-wider block mb-2">
        CONFIRMED & SECURED DROP
      </span>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight mb-2.5">
        Thank You for Your Order, {customerName}!
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed mb-6 font-normal">
        Your drop order has been placed and is currently undergoing vault physical authentication with specialized NFC provenance tagging.
      </p>

      {/* Metadata Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold text-neutral-700">
        {/* Order # */}
        <div className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 px-3.5 py-1.5 rounded-full shadow-2xs transition">
          <Hash className="w-3.5 h-3.5 text-[#c81d25]" />
          <span className="font-bold text-neutral-900">{orderNumber}</span>
        </div>

        {/* Est Delivery */}
        <div className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 px-3.5 py-1.5 rounded-full shadow-2xs transition">
          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
          <span>Est. Delivery: <strong className="text-neutral-900">{estDelivery}</strong></span>
        </div>

        {/* Tracking */}
        <div className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 px-3.5 py-1.5 rounded-full shadow-2xs transition">
          <Truck className="w-3.5 h-3.5 text-neutral-500" />
          <span>FedEx: <strong className="text-neutral-900 font-mono text-[11px]">{trackingNumber}</strong></span>
        </div>

        {/* Payment */}
        <div className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 px-3.5 py-1.5 rounded-full shadow-2xs transition">
          <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
          <span>{paymentMethod}</span>
        </div>
      </div>
    </div>
  )
}

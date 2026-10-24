import { Plane, Zap, ShieldCheck } from 'lucide-react'

export default function ShippingMethodCard({
  selectedMethod = 'standard',
  onSelectMethod
}) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25]">
            <Plane className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            Shipping Method
          </h2>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-[#c81d25] bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
          <ShieldCheck className="w-3 h-3 text-[#c81d25]" />
          <span>GUARANTEED AUTHENTIC</span>
        </span>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {/* Option 1: Standard Authenticated Express */}
        <div
          onClick={() => onSelectMethod && onSelectMethod('standard')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
            selectedMethod === 'standard'
              ? 'border-[#c81d25] bg-rose-50/20 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-start gap-3.5">
            {/* Custom Radio */}
            <div className="pt-0.5">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition border ${
                  selectedMethod === 'standard'
                    ? 'border-[#c81d25] bg-[#c81d25]'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {selectedMethod === 'standard' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs sm:text-sm font-bold text-neutral-900">
                  Standard Authenticated Express
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-white bg-[#c81d25] px-2 py-0.5 rounded-full shadow-2xs">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-normal">
                Includes signature physical authentication tag • 2–4 business days
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-sm font-black text-[#c81d25]">
              FREE
            </span>
          </div>
        </div>

        {/* Option 2: Priority Vault Air Dispatch */}
        <div
          onClick={() => onSelectMethod && onSelectMethod('priority')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
            selectedMethod === 'priority'
              ? 'border-[#c81d25] bg-rose-50/20 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-start gap-3.5">
            {/* Custom Radio */}
            <div className="pt-0.5">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition border ${
                  selectedMethod === 'priority'
                    ? 'border-[#c81d25] bg-[#c81d25]'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {selectedMethod === 'priority' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs sm:text-sm font-bold text-neutral-900">
                  Priority Vault Air Dispatch
                </span>
                <Zap className="w-3.5 h-3.5 text-[#ea580c] fill-[#ea580c]" />
              </div>
              <p className="text-[11px] text-neutral-500 font-normal">
                Next business day air transfer • Armored hand-off package insurance
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-sm font-black text-neutral-900">
              $25.00
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

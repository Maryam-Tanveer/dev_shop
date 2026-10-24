import { Check, ShieldCheck, Truck, MapPin, Fingerprint, Lock } from 'lucide-react'

export default function OrderFulfillmentTracker({
  onViewDigitalPass
}) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#c81d25] animate-ping" />
            <span className="text-[#c81d25] font-extrabold text-[10px] uppercase tracking-wider">
              LIVE VAULT PIPELINE
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
            Authenticity & Fulfillment Tracker
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#fcfbfa] px-3.5 py-1.5 rounded-full border border-neutral-200 text-neutral-600 text-[11px] font-bold shadow-2xs self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-[#c81d25]" />
          <span>100% Guaranteed Legitimate</span>
        </div>
      </div>

      {/* 4-Step Tracker */}
      <div className="py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {/* Step 1: Order Placed */}
          <div className="flex flex-col items-start relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#c81d25] text-white flex items-center justify-center text-xs font-black mb-2.5 shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <h4 className="text-xs font-black text-neutral-900 mb-0.5">
              Order Placed
            </h4>
            <span className="text-[11px] text-neutral-500 mb-1.5">
              Today, 14:32 EST
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              COMPLETED
            </span>
          </div>

          {/* Step 2: Vault Verification (Active) */}
          <div className="flex flex-col items-start relative z-10">
            <div className="w-8 h-8 rounded-full bg-rose-50 border-2 border-[#c81d25] text-[#c81d25] flex items-center justify-center text-xs font-black mb-2.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.5] animate-pulse" />
            </div>
            <h4 className="text-xs font-black text-[#c81d25] mb-0.5">
              Vault Verification
            </h4>
            <span className="text-[11px] text-neutral-500 mb-1.5">
              Physical UV & Stitch Inspection
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-[#c81d25] px-2 py-0.5 rounded-md shadow-2xs">
              ACTIVE NOW
            </span>
          </div>

          {/* Step 3: Armored Dispatch */}
          <div className="flex flex-col items-start relative z-10">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center text-xs font-bold mb-2.5">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-neutral-700 mb-0.5">
              Armored Dispatch
            </h4>
            <span className="text-[11px] text-neutral-400 mb-1.5">
              FedEx Priority Air Carrier
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
              UPCOMING
            </span>
          </div>

          {/* Step 4: Doorstep Arrival */}
          <div className="flex flex-col items-start relative z-10">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center text-xs font-bold mb-2.5">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-neutral-700 mb-0.5">
              Doorstep Arrival
            </h4>
            <span className="text-[11px] text-neutral-400 mb-1.5">
              Est. Oct 28 – 30
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
              PENDING
            </span>
          </div>
        </div>
      </div>

      {/* NFT Provenance & Vault Tag Callout */}
      <div className="bg-[#fcfbfa] rounded-2xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-[#c81d25] flex items-center justify-center flex-shrink-0">
            <Fingerprint className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h5 className="text-xs font-black text-neutral-900 tracking-tight mb-0.5">
              NFT Provenance & Vault Tag #VLT-0849-NY
            </h5>
            <p className="text-[11px] text-neutral-500">
              Digital certificate will automatically bind to your Dev Shop Vault wallet.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewDigitalPass}
          className="bg-[#121212] hover:bg-neutral-800 text-white text-[10px] font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full transition shadow-xs active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          VIEW DIGITAL PASS
        </button>
      </div>
    </div>
  )
}

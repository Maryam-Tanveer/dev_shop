import { Headphones, MessageSquare, Phone, ArrowRight, Plus } from 'lucide-react'

export default function OrderHelpConcierge({
  onChatClick,
  onHotlineClick,
  onAddSuggested
}) {
  return (
    <div className="space-y-4">
      {/* 1. Concierge Help Box */}
      <div className="bg-[#fcfbfa] rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25] flex-shrink-0">
            <Headphones className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
              Need Help With This Drop?
            </h4>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              Dedicated concierge available 24/7 for authenticity queries & transit adjustments.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 mb-3 pt-2">
          <button
            onClick={onChatClick}
            className="w-full bg-white hover:bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 flex items-center justify-between transition shadow-2xs group"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#c81d25]" />
              <span>Launch 24/7 Live Drop Chat</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition" />
          </button>

          <button
            onClick={onHotlineClick}
            className="w-full bg-white hover:bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 flex items-center justify-between transition shadow-2xs group"
          >
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#c81d25]" />
              <span>1-800-DEV-DROP Hotline</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
          Dev Shop Authenticity Warranty: 100% money back guarantee if unverified.
        </p>
      </div>

      {/* 2. Suggested Pair Widget */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-neutral-100 p-1 flex items-center justify-center flex-shrink-0 border border-neutral-200/80 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=150&q=80"
              alt="Eastside Archive Hoodie"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#c81d25] block">
              SUGGESTED PAIR
            </span>
            <h5 className="text-xs font-bold text-neutral-900 truncate">
              Eastside Archive Hoodie
            </h5>
            <span className="text-[11px] text-neutral-500 font-medium">
              $140.00 • <span className="text-neutral-400 font-normal">Reserved for VIPs</span>
            </span>
          </div>
        </div>

        <button
          onClick={onAddSuggested}
          className="w-8 h-8 rounded-full bg-rose-50 hover:bg-[#c81d25] text-[#c81d25] hover:text-white flex items-center justify-center transition shadow-2xs flex-shrink-0 active:scale-90"
          title="Add to order"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  )
}

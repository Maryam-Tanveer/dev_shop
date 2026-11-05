import { Truck } from 'lucide-react'

export default function CartDeliveryProgress({
  progress = 0,
  isUnlocked = false,
  remaining = 0,
  threshold = 150,
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xs mb-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-50 text-[#c81d25] flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 leading-snug">
              {isUnlocked ? 'Free Standard Delivery Unlocked' : 'Unlock Free Standard Delivery'}
            </h4>
            <p className="text-[11px] text-neutral-500">
              {isUnlocked
                ? 'Free Delivery Unlocked! (Qualified ✓)'
                : `Add $${remaining.toFixed(2)} more to reach $${threshold.toFixed(2)} for Free Delivery!`}
            </p>
          </div>
        </div>

        <span className="bg-[#fde8e8] text-[#c81d25] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#fecaca]">
          {progress}% COMPLETE
        </span>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#c81d25] rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}

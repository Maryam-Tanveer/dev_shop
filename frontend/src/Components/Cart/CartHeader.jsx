import { Link } from 'react-router-dom'
import { PanelRight, Lock } from 'lucide-react'

export default function CartHeader({
  itemCount = 2,
  onOpenSlideOver,
  onBackToHome
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full">
      {/* Top Breadcrumb */}
      <div className="text-[11px] text-neutral-400 font-medium mb-3">
        <Link
          to="/"
          onClick={onBackToHome}
          className="hover:text-neutral-700 transition"
        >
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-800 font-semibold">Shopping Bag</span>
      </div>

      {/* Main Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Your Shopping Bag
          </h1>
          <span className="bg-[#fde8e8] text-[#c81d25] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border border-[#fecaca] tracking-wider">
            {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {/* Right Badges: Slide-Over View & SSL Secured */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSlideOver}
            className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2 rounded-xl border border-neutral-200 shadow-2xs transition active:scale-95"
          >
            <PanelRight className="w-3.5 h-3.5 text-neutral-700" />
            <span>Slide-Over View</span>
          </button>

          <div className="inline-flex items-center gap-1.5 bg-[#fcfbfa] text-neutral-600 text-xs font-semibold px-3 py-2 rounded-xl border border-neutral-200 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-neutral-700" />
            <span>SSL 256-Bit Secured</span>
          </div>
        </div>
      </div>
    </div>
  )
}

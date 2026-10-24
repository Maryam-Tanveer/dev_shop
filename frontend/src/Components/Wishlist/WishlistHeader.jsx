import { Link } from 'react-router-dom'
import { Share2 } from 'lucide-react'

export default function WishlistHeader({
  itemCount = 4,
  onShare,
  onClearAll,
  onBackToHome
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full">
      {/* Top Breadcrumb */}
      <div className="text-[11px] text-neutral-400 font-medium mb-4">
        <Link
          to="/"
          onClick={onBackToHome}
          className="hover:text-neutral-700 transition"
        >
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-600 font-semibold">Shop Experience</span>
      </div>

      {/* Main Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              My Wishlist
            </h1>
            <span className="bg-[#fde8e8] text-[#c81d25] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border border-[#fecaca] tracking-wider">
              {itemCount} SAVED ITEMS
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1.5">
            Items saved for upcoming drops, sudden restocks, and automatic price drop alerts.
          </p>
        </div>

        {/* Right Actions: Share Wishlist & Clear All */}
        <div className="flex items-center gap-4">
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold px-4 py-2 rounded-full border border-neutral-300 shadow-2xs transition active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-neutral-700" />
            <span>Share Wishlist</span>
          </button>

          <button
            onClick={onClearAll}
            className="text-xs font-bold text-neutral-600 hover:text-[#c81d25] transition"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

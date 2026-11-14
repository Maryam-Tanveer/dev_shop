import { Link } from 'react-router-dom'

export default function CartHeader({
  itemCount = 2,
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

      {/* Main Title Row */}
      <div className="flex items-center gap-3 pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
          Your Shopping Bag
        </h1>
        <span className="bg-[#fde8e8] text-[#c81d25] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border border-[#fecaca] tracking-wider">
          {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
        </span>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export default function CatalogHeader({
  itemCount = 48,
  collectionName = null,
  onBackToHome
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-4 w-full">
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
        <Link
          to="/products"
          className="hover:text-neutral-700 transition"
        >
          Products
        </Link>
        {collectionName && (
          <>
            <span className="mx-1.5">/</span>
            <span className="text-neutral-900 font-bold">{collectionName}</span>
          </>
        )}
      </div>

      {/* Main Title Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight">
            {collectionName ? `${collectionName} Collection` : 'All Products'}
          </h1>
        </div>

        {/* Right Inventory Badge */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200/90 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#c81d25]" />
          <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
            {itemCount} Items Available
          </span>
        </div>
      </div>
    </div>
  )
}

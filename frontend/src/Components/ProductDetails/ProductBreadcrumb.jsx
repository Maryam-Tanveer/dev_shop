import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Flame } from 'lucide-react'

export default function ProductBreadcrumb({ product, onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/products')
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full flex flex-col gap-2">
      {/* Top breadcrumb */}
      <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
        <Link to="/" className="hover:text-neutral-700 transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-neutral-700 transition">Products</Link>
        <span>/</span>
        <span className="text-neutral-600 truncate max-w-[200px]">{product?.title || 'Details'}</span>
      </div>

      {/* Sub-header navigation row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-neutral-200/50">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 font-bold text-neutral-900 hover:text-[#c81d25] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span className="text-neutral-300">/</span>
          <Link to="/products" className="text-neutral-500 font-medium hover:text-neutral-900 transition">
            Products
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="font-extrabold text-neutral-900 truncate max-w-[220px] sm:max-w-md">
            {product?.title || 'Snowboard: Liquid'}
          </span>
        </div>

        {/* Right meta tags */}
        <div className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-wider">
          <span className="text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
            {product?.dropCode || 'DROP 04'}
          </span>
          <span className="text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
            {product?.edition || 'EDITION 2025'}
          </span>
          {product?.isNew && (
            <span className="inline-flex items-center gap-1 bg-[#fde8e8] text-[#c81d25] px-2.5 py-1 rounded-md border border-[#fecaca]">
              <Flame className="w-3 h-3 fill-[#c81d25]" />
              <span>NEW ARRIVAL!</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

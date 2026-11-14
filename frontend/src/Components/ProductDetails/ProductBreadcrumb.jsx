import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 w-full">
      <div className="flex items-center justify-between gap-3 text-xs">
        {/* Single Clean Breadcrumb */}
        <div className="text-[11px] font-medium text-neutral-500 flex items-center gap-1.5 truncate">
          <Link to="/" className="hover:text-neutral-900 transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-neutral-900 transition">
            Products
          </Link>
          <span>/</span>
          <span className="font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-md">
            {product?.title || 'Details'}
          </span>
        </div>

        {/* Back Link */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-[#c81d25] transition cursor-pointer flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Products</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>
    </div>
  )
}

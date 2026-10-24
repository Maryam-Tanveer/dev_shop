import { Link } from 'react-router-dom'

export default function CheckoutHeader({
  currentStep = 1,
  onNavigate
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-6 w-full">
      {/* Top Breadcrumb & Stepper Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        {/* Breadcrumb */}
        <div className="text-[11px] text-neutral-400 font-medium flex items-center">
          <Link
            to="/"
            onClick={() => onNavigate && onNavigate('HOME')}
            className="hover:text-neutral-700 transition"
          >
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            to="/cart"
            onClick={() => onNavigate && onNavigate('CART')}
            className="hover:text-neutral-700 transition"
          >
            Cart
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-800 font-semibold">Checkout</span>
        </div>

        {/* Stepper (1 SHIPPING — 2 PAYMENT — 3 CONFIRMATION) */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
          {/* Step 1 */}
          <div className="flex items-center gap-1.5 text-[#c81d25]">
            <span className="w-5 h-5 rounded-full bg-[#c81d25] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
              1
            </span>
            <span>SHIPPING</span>
          </div>

          <div className="w-8 sm:w-12 h-[2px] bg-[#c81d25]/30" />

          {/* Step 2 */}
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span>PAYMENT</span>
          </div>

          <div className="w-8 sm:w-12 h-[2px] bg-neutral-200" />

          {/* Step 3 */}
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span>CONFIRMATION</span>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="pt-6">
        <span className="text-[#c81d25] font-extrabold text-[11px] uppercase tracking-wider block mb-1">
          SECURE ORDER TERMINAL
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight">
          Checkout & Verification
        </h1>
      </div>
    </div>
  )
}

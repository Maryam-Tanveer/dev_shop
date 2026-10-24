import { useState } from 'react'
import { ArrowRight, ShieldCheck, RotateCcw, Lock, Info, MessageSquare } from 'lucide-react'

export default function CartOrderSummary({
  subtotal = 959.95,
  itemCount = 2,
  onProceedCheckout,
  onOpenChat,
  onApplyPromo
}) {
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedPromo, setAppliedPromo] = useState(null)

  const tax = Number((subtotal * 0.08).toFixed(2))
  const total = Number((subtotal + tax - discount).toFixed(2))

  const handleApply = (e) => {
    e.preventDefault()
    if (!promoCode.trim()) return

    if (promoCode.trim().toUpperCase() === 'DEV10' || promoCode.trim().toUpperCase() === 'VAULT') {
      const discAmount = Number((subtotal * 0.1).toFixed(2))
      setDiscount(discAmount)
      setAppliedPromo(promoCode.trim().toUpperCase())
      if (onApplyPromo) onApplyPromo(discAmount, promoCode.trim().toUpperCase())
    } else {
      const discAmount = 15.00
      setDiscount(discAmount)
      setAppliedPromo(promoCode.trim().toUpperCase())
      if (onApplyPromo) onApplyPromo(discAmount, promoCode.trim().toUpperCase())
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Order Summary Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
            Order Summary
          </h2>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
            USD CURRENCY
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3 py-4 border-b border-neutral-100 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-neutral-600">
            <span className="flex items-center gap-1">
              <span>Estimated Express Shipping</span>
              <Info className="w-3 h-3 text-neutral-400" />
            </span>
            <span className="font-extrabold text-[#c81d25]">FREE</span>
          </div>

          <div className="flex justify-between items-center text-neutral-600">
            <span className="flex items-center gap-1">
              <span>Authenticity Verification</span>
              <Info className="w-3 h-3 text-neutral-400" />
            </span>
            <span className="font-extrabold text-[#c81d25]">$0.00 FREE</span>
          </div>

          <div className="flex justify-between text-neutral-600">
            <span>Estimated Sales Tax</span>
            <span className="font-bold text-neutral-900">${tax.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-[#c81d25] font-bold">
              <span>Promo ({appliedPromo})</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Discount Code Section */}
        <div className="py-4 border-b border-neutral-100">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2">
            DISCOUNT CODE OR VOUCHER
          </label>
          <form onSubmit={handleApply} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 bg-[#f7f6f4] focus:bg-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#c81d25] transition"
            />
            <button
              type="submit"
              className="bg-[#1a1a1a] hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs active:scale-95"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Total Line */}
        <div className="pt-4 pb-5 flex items-baseline justify-between">
          <div>
            <span className="text-sm font-extrabold text-neutral-900 block">Total Due</span>
            <span className="text-[10px] text-neutral-400">Including import duties & tax</span>
          </div>
          <span className="text-2xl font-black text-[#c81d25]">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Primary Checkout Button */}
        <button
          onClick={onProceedCheckout}
          className="w-full py-4 px-6 rounded-full bg-[#a8161d] hover:bg-[#881337] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 active:scale-95"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Payment Methods */}
        <div className="text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest pt-4 pb-2">
          Apple Pay • Google Pay • Visa • Mastercard • Klarna 4x
        </div>

        {/* 3 Trust Strip Cards */}
        <div className="space-y-2 pt-3 border-t border-neutral-100">
          <div className="flex items-start gap-3 bg-[#fcfbfa] p-3 rounded-2xl border border-neutral-100">
            <ShieldCheck className="w-4 h-4 text-[#c81d25] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-neutral-900">100% Authentic Guarantee</h5>
              <p className="text-[10px] text-neutral-400">Verified deadstock by sneaker experts</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#fcfbfa] p-3 rounded-2xl border border-neutral-100">
            <RotateCcw className="w-4 h-4 text-[#c81d25] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-neutral-900">30-Day Free Returns</h5>
              <p className="text-[10px] text-neutral-400">Hassle-free labels & instant store credit</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#fcfbfa] p-3 rounded-2xl border border-neutral-100">
            <Lock className="w-4 h-4 text-[#c81d25] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-neutral-900">Encrypted Bank-Grade Checkout</h5>
              <p className="text-[10px] text-neutral-400">Payment details never stored on servers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Support Box */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#c81d25] flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Have questions about sizing?</h4>
            <p className="text-[11px] text-neutral-500">Chat live with our streetwear specialists 24/7</p>
          </div>
        </div>

        <button
          onClick={onOpenChat}
          className="text-xs font-bold text-[#c81d25] hover:underline whitespace-nowrap"
        >
          Chat Now
        </button>
      </div>
    </div>
  )
}

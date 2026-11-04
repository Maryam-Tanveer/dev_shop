import { useState } from 'react'
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ExternalLink,
} from 'lucide-react'

export default function PaymentMethodCard({
  totalAmount = 228.64,
  onPlaceOrder,
  isProcessing = false,
}) {
  const [paymentType, setPaymentType] = useState('stripe') // 'stripe' | 'cod'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onPlaceOrder) {
      onPlaceOrder({
        paymentType,
      })
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25]">
            <CreditCard className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
              Payment Method
            </h2>
          </div>
        </div>

        {/* PCI-DSS Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PCI-DSS Level 1 Compliant</span>
        </div>
      </div>

      {/* PCI Notice */}
      <div className="mb-5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5 text-xs text-neutral-600">
        <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-neutral-900">Secure Hosted Checkout.</strong> Card details are handled directly by Stripe. No sensitive card data is ever stored on or handled by our servers.
        </p>
      </div>

      {/* Methods Stack */}
      <div className="space-y-3 mb-6">
        {/* Option 1: Pay with card (Stripe) */}
        <div
          onClick={() => setPaymentType('stripe')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            paymentType === 'stripe'
              ? 'border-[#c81d25] bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition border ${
                paymentType === 'stripe'
                  ? 'border-[#c81d25] bg-[#c81d25]'
                  : 'border-neutral-300 bg-white'
              }`}
            >
              {paymentType === 'stripe' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>

            <div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 block leading-tight">
                Pay with card (Stripe)
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                Visa, Mastercard, AMEX, Discover, Apple Pay • Hosted by Stripe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-[#1a1f71] text-white">
              VISA
            </span>
            <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-[#eb001b] text-white">
              MC
            </span>
            <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-[#006fcf] text-white">
              AMEX
            </span>
          </div>
        </div>

        {/* Option 2: Cash On Delivery (COD) */}
        <div
          onClick={() => setPaymentType('cod')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            paymentType === 'cod'
              ? 'border-[#c81d25] bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition border ${
                paymentType === 'cod'
                  ? 'border-[#c81d25] bg-[#c81d25]'
                  : 'border-neutral-300 bg-white'
              }`}
            >
              {paymentType === 'cod' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>

            <div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 block leading-tight">
                Cash on Delivery
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                Verify authentication on delivery before payment
              </span>
            </div>
          </div>

          <Truck className="w-4 h-4 text-neutral-600" />
        </div>
      </div>

      {/* Place Order CTA Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleSubmit}
        className="w-full bg-[#c81d25] hover:bg-[#a8161d] text-white font-black text-sm uppercase tracking-wider py-4 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition duration-200 active:scale-98 mb-4 disabled:opacity-75 cursor-pointer"
      >
        <span>
          {isProcessing
            ? 'Processing Secure Request...'
            : paymentType === 'cod'
            ? `Confirm Order (COD) • $${totalAmount.toFixed(2)}`
            : `Pay with card (Stripe) • $${totalAmount.toFixed(2)}`}
        </span>
        {paymentType === 'stripe' ? (
          <ExternalLink className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      {/* Security Footnote */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-neutral-800 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c81d25]" />
          <span>PCI-DSS LEVEL 1 CERTIFIED • STRIPE POWERED CHECKOUT</span>
        </div>
        <p className="text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed font-medium">
          Payments are securely encrypted and processed by Stripe.
        </p>
      </div>
    </div>
  )
}

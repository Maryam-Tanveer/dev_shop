import { useState } from 'react'
import {
  CreditCard,
  Wallet,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Truck,
} from 'lucide-react'

export default function PaymentMethodCard({
  totalAmount = 1036.75,
  onPlaceOrder,
}) {
  const [paymentType, setPaymentType] = useState('stripe') // 'stripe' | 'digital' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    if (onPlaceOrder) {
      onPlaceOrder({
        paymentType,
        gateway: paymentType === 'stripe' ? 'Stripe Checkout (PCI Level 1)' : paymentType === 'cod' ? 'Cash on Delivery' : 'Stripe Digital Pay',
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
          <span>PCI-DSS Certified</span>
        </div>
      </div>

      {/* PCI-DSS Compliance Architecture Notice */}
      <div className="mb-5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5 text-xs text-neutral-600">
        <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-neutral-900">100% PCI-DSS Level 1 Compliant.</strong> Raw credit card numbers and CVV codes are never stored, captured, or transmitted through our servers. All transactions are securely processed directly via Stripe's encrypted payment vault.
        </p>
      </div>

      {/* Methods Stack */}
      <div className="space-y-3 mb-6">
        {/* Option 1: Stripe Secure Checkout (Cards / Apple Pay / Google Pay) */}
        <div
          onClick={() => setPaymentType('stripe')}
          className={`rounded-2xl border transition overflow-hidden cursor-pointer ${
            paymentType === 'stripe'
              ? 'border-[#c81d25] bg-rose-50/10 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="p-4 flex items-center justify-between">
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
                  Stripe Hosted Checkout
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  Credit / Debit Card, Apple Pay, Google Pay
                </span>
              </div>
            </div>

            {/* Card Brand Badges */}
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

          {paymentType === 'stripe' && (
            <div className="px-4 pb-4 pt-1 text-xs text-neutral-500 border-t border-neutral-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>You will complete payment securely on Stripe's encrypted payment page.</span>
            </div>
          )}
        </div>

        {/* Option 2: Digital Fast Pay */}
        <div
          onClick={() => setPaymentType('digital')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            paymentType === 'digital'
              ? 'border-[#c81d25] bg-rose-50/10 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition border ${
                paymentType === 'digital'
                  ? 'border-[#c81d25] bg-[#c81d25]'
                  : 'border-neutral-300 bg-white'
              }`}
            >
              {paymentType === 'digital' && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>

            <div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 block leading-tight">
                Digital Wallet (1-Click)
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                Apple Pay / Google Pay / Link by Stripe
              </span>
            </div>
          </div>

          <Wallet className="w-4 h-4 text-neutral-600" />
        </div>

        {/* Option 3: Cash On Delivery / Vault Hand Delivery */}
        <div
          onClick={() => setPaymentType('cod')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            paymentType === 'cod'
              ? 'border-[#c81d25] bg-rose-50/10 shadow-xs'
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
                Pay on Delivery (COD)
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
            ? 'Connecting to Stripe Checkout...'
            : paymentType === 'cod'
            ? `Confirm Order • $${totalAmount.toFixed(2)}`
            : `Pay with Stripe • $${totalAmount.toFixed(2)}`}
        </span>
        <ExternalLink className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Security Guarantee Footnote */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-neutral-800 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c81d25]" />
          <span>PCI-DSS LEVEL 1 CERTIFIED • END-TO-END 256-BIT ENCRYPTION</span>
        </div>
        <p className="text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed font-medium">
          Powered by Stripe. Card credentials never touch merchant code or database.
        </p>
      </div>
    </div>
  )
}

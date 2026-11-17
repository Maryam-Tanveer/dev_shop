import { useState } from 'react'
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  Sparkles,
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
        gateway:
          paymentType === 'stripe'
            ? 'Stripe Secure Checkout'
            : 'Cash on Delivery',
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
          <span>PCI-DSS Level 1</span>
        </div>
      </div>

      {/* PCI-DSS / Stripe Notice */}
      <div className="mb-5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5 text-xs text-neutral-600">
        <Lock className="w-4 h-4 text-[#635BFF] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-neutral-900">100% Encrypted Stripe Payment Gateway.</strong> Transactions are authenticated directly via Stripe's PCI-DSS Level 1 certified payment infrastructure.
        </p>
      </div>

      {/* Payment Options */}
      <div className="space-y-3 mb-6">
        {/* Option 1: Stripe Secure Checkout */}
        <div
          onClick={() => setPaymentType('stripe')}
          className={`rounded-2xl border transition overflow-hidden cursor-pointer ${
            paymentType === 'stripe'
              ? 'border-[#635BFF] bg-[#635BFF]/[0.03] shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          {/* Option Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition border ${
                  paymentType === 'stripe'
                    ? 'border-[#635BFF] bg-[#635BFF]'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {paymentType === 'stripe' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block leading-tight">
                    Stripe Secure Checkout
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#635BFF] text-white">
                    stripe
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 font-medium">
                  Cards, Apple Pay, Google Pay • Instant 3D-Secure
                </span>
              </div>
            </div>

            {/* Supported Card Logos */}
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

          {/* Details dropdown when selected */}
          {paymentType === 'stripe' && (
            <div className="px-4 pb-4 pt-2 border-t border-neutral-200/80 bg-white">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
                    Official Stripe Payment Terminal
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    256-Bit SSL Encrypted
                  </span>
                </div>

                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Upon clicking below, you will be securely redirected to Stripe's payment portal where you can enter your card details (Card Number, Expiry, CVV) or checkout instantly with Apple Pay / Google Pay.
                </p>

                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 pt-1 font-medium">
                  <Lock className="w-3 h-3 text-[#635BFF]" />
                  <span>All payment details are entered directly and securely by you on Stripe.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Option 2: Cash on Delivery (COD) */}
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
                Cash on Delivery (COD)
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                Inspect items upon arrival before payment
              </span>
            </div>
          </div>

          <Truck className="w-4 h-4 text-neutral-600" />
        </div>
      </div>

      {/* Place Order / Stripe CTA Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleSubmit}
        className={`w-full text-white font-black text-sm uppercase tracking-wider py-4 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition duration-200 active:scale-98 mb-4 disabled:opacity-75 cursor-pointer ${
          paymentType === 'stripe'
            ? 'bg-[#635BFF] hover:bg-[#5349e4]'
            : 'bg-[#c81d25] hover:bg-[#a8161d]'
        }`}
      >
        <span>
          {isProcessing
            ? paymentType === 'stripe'
              ? 'Opening Stripe Checkout...'
              : 'Processing Order...'
            : paymentType === 'stripe'
            ? `Proceed to Stripe Checkout • $${totalAmount.toFixed(2)}`
            : `Confirm Order (COD) • $${totalAmount.toFixed(2)}`}
        </span>
        {paymentType === 'stripe' ? (
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      {/* Security Guarantee Footnote */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-neutral-800 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#635BFF]" />
          <span>PCI-DSS LEVEL 1 COMPLIANT • END-TO-END 256-BIT ENCRYPTION</span>
        </div>
        <p className="text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed font-medium">
          Powered by Stripe. Your payment credentials are encrypted and never stored on our servers.
        </p>
      </div>
    </div>
  )
}

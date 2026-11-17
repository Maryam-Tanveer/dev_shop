import { useState } from 'react'
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Info,
} from 'lucide-react'

export default function PaymentMethodCard({
  totalAmount = 228.64,
  onPlaceOrder,
  isProcessing = false,
}) {
  const [paymentType, setPaymentType] = useState('stripe') // 'stripe' | 'cod'
  const [copied, setCopied] = useState(false)

  const handleCopyCard = (e) => {
    e.stopPropagation()
    navigator.clipboard?.writeText('4242424242424242')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

        {/* Free Test Mode Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free Sandbox</span>
        </div>
      </div>

      {/* PCI-DSS / Stripe Notice */}
      <div className="mb-5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5 text-xs text-neutral-600">
        <Lock className="w-4 h-4 text-[#635BFF] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-neutral-900">Stripe Live Sandbox Mode.</strong> Test real-world checkout workflows for free without entering personal bank cards.
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
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Free Demo
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
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
                    Official Stripe Sandbox (Rs. 0 Cost)
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live & Active
                  </span>
                </div>

                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Clicking below will securely redirect you to Stripe's hosted checkout page. You can complete the payment using Stripe's official free demo card:
                </p>

                {/* Free Demo Card Helper Box */}
                <div className="p-3 rounded-lg bg-white border border-neutral-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                      Stripe Free Test Card
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCard}
                      className="flex items-center gap-1 text-[10px] font-bold text-[#635BFF] hover:text-[#5349e4] bg-[#635BFF]/10 px-2 py-0.5 rounded transition cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Card</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono text-[11px]">
                    <div className="bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <div className="text-[9px] text-neutral-400 font-sans uppercase">Card Number</div>
                      <div className="font-bold text-neutral-800">4242 •••• 4242</div>
                    </div>
                    <div className="bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <div className="text-[9px] text-neutral-400 font-sans uppercase">Expiry</div>
                      <div className="font-bold text-neutral-800">12 / 28</div>
                    </div>
                    <div className="bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <div className="text-[9px] text-neutral-400 font-sans uppercase">CVC</div>
                      <div className="font-bold text-neutral-800">123</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-[10px] text-neutral-500 pt-0.5">
                  <Info className="w-3.5 h-3.5 text-[#635BFF] flex-shrink-0 mt-0.5" />
                  <span>
                    Zero real money will be charged. Upon completion, Stripe will redirect back with verified manifest and dispatch a real confirmation receipt.
                  </span>
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
                Inspect items upon arrival before payment • 100% Free
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
          <span>PCI-DSS LEVEL 1 COMPLIANT • ZERO PAYMENT FEES</span>
        </div>
        <p className="text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed font-medium">
          Powered by Stripe Sandbox. No personal credit or debit cards required.
        </p>
      </div>
    </div>
  )
}

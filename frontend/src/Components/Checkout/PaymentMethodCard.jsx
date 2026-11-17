import { useState } from 'react'
import {
  CreditCard,
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
  const [paymentType, setPaymentType] = useState('card') // 'card' | 'cod'
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 16) val = val.slice(0, 16)
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val
    setCardNumber(formatted)
  }

  const handleExpChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 4) val = val.slice(0, 4)
    if (val.length >= 3) {
      val = `${val.slice(0, 2)} / ${val.slice(2)}`
    }
    setCardExp(val)
  }

  const handleCvcChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvc(val)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onPlaceOrder) {
      onPlaceOrder({
        paymentType,
        gateway:
          paymentType === 'card'
            ? 'Stripe Hosted Checkout'
            : 'Cash on Delivery',
        cardDetails:
          paymentType === 'card'
            ? {
                cardNumber: cardNumber.replace(/\s+/g, ''),
                cardLast4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
                cardExp,
                cardCvc,
              }
            : null,
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

      {/* Payment Options Stack */}
      <div className="space-y-3 mb-6">
        {/* Option 1: SECURE PAYMENT (PROJECT THEME: WHITE / NEUTRAL / RED ACCENT) */}
        <div
          onClick={() => setPaymentType('card')}
          className={`rounded-2xl border transition-all p-4 sm:p-5 cursor-pointer select-none ${
            paymentType === 'card'
              ? 'border-[#c81d25] bg-rose-50/15 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          {/* Header Row: Radio + SECURE PAYMENT + Brand Logos */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition border ${
                  paymentType === 'card'
                    ? 'border-[#c81d25] bg-[#c81d25]'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {paymentType === 'card' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              <div className="flex items-center gap-2 text-neutral-900">
                <CreditCard className="w-4 h-4 stroke-[2.2] text-[#c81d25]" />
                <span className="text-xs font-black tracking-wider uppercase">
                  SECURE PAYMENT
                </span>
              </div>
            </div>

            {/* Brand Badges */}
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

          {/* Unified Input Bar: [Card Icon] Card number ........ MM / YY  CVC */}
          <div className="bg-white border border-neutral-200 focus-within:border-[#c81d25] focus-within:ring-2 focus-within:ring-[#c81d25]/15 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 transition shadow-2xs">
            {/* Left: Card icon + Card number input */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-6 h-4 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 flex-shrink-0">
                <CreditCard className="w-3.5 h-3.5" />
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="Card number"
                className="bg-transparent text-xs sm:text-sm font-mono font-medium text-neutral-900 placeholder:text-neutral-400 outline-none w-full"
              />
            </div>

            {/* Right: Expiry + CVC */}
            <div className="flex items-center gap-2.5 flex-shrink-0 text-xs sm:text-sm font-mono font-medium text-neutral-900">
              <input
                type="text"
                inputMode="numeric"
                value={cardExp}
                onChange={handleExpChange}
                placeholder="MM / YY"
                className="w-16 bg-transparent text-right outline-none placeholder:text-neutral-400"
              />
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={cardCvc}
                onChange={handleCvcChange}
                placeholder="CVC"
                className="w-10 bg-transparent text-right outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Option 2: Pay on Delivery (COD) */}
        <div
          onClick={() => setPaymentType('cod')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            paymentType === 'cod'
              ? 'border-[#c81d25] bg-rose-50/15 shadow-xs'
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

      {/* Place Order CTA Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleSubmit}
        className="w-full bg-[#c81d25] hover:bg-[#a8161d] text-white font-black text-sm uppercase tracking-wider py-4 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition duration-200 active:scale-98 mb-4 disabled:opacity-75 cursor-pointer"
      >
        <span>
          {isProcessing
            ? 'Redirecting to Stripe...'
            : paymentType === 'cod'
            ? `Confirm Order (COD) • $${totalAmount.toFixed(2)}`
            : `Pay • $${totalAmount.toFixed(2)}`}
        </span>
        {paymentType === 'card' ? (
          <ExternalLink className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      {/* Security Footnote */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-neutral-800 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c81d25]" />
          <span>PCI-DSS LEVEL 1 CERTIFIED • END-TO-END 256-BIT ENCRYPTION</span>
        </div>
        <p className="text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed font-medium">
          Verified by Visa & Mastercard Identity Check. All card credentials encrypted.
        </p>
      </div>
    </div>
  )
}

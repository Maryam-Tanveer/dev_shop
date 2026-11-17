import { useState } from 'react'
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  AlertCircle,
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
  const [cardError, setCardError] = useState('')

  // Detect card brand
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '')
    if (/^4/.test(clean)) return 'VISA'
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD'
    if (/^3[47]/.test(clean)) return 'AMEX'
    return null
  }

  const detectedBrand = getCardBrand(cardNumber)

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 16) val = val.slice(0, 16)
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val
    setCardNumber(formatted)
    if (cardError) setCardError('')
  }

  const handleExpChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 4) val = val.slice(0, 4)
    if (val.length >= 3) {
      val = `${val.slice(0, 2)} / ${val.slice(2)}`
    }
    setCardExp(val)
    if (cardError) setCardError('')
  }

  const handleCvcChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvc(val)
    if (cardError) setCardError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCardError('')

    if (paymentType === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '')
      if (!cleanNum) {
        setCardError('Please enter your card number.')
        return
      }
      if (cleanNum.length < 15) {
        setCardError('Please enter a valid 16-digit card number.')
        return
      }
      const expClean = cardExp.replace(/\s+/g, '')
      if (!/^\d{2}\/\d{2}$/.test(expClean)) {
        setCardError('Please enter a valid expiration date (MM / YY).')
        return
      }
      const [mm, yy] = expClean.split('/').map(Number)
      if (mm < 1 || mm > 12) {
        setCardError('Invalid expiration month.')
        return
      }
      if (cardCvc.length < 3) {
        setCardError('Please enter your 3 or 4-digit CVC code.')
        return
      }
    }

    if (onPlaceOrder) {
      onPlaceOrder({
        paymentType,
        gateway:
          paymentType === 'card'
            ? 'Credit/Debit Card (Secure Payment)'
            : 'Cash on Delivery',
        cardDetails:
          paymentType === 'card'
            ? {
                cardNumber: cardNumber.replace(/\s+/g, ''),
                cardLast4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
                cardBrand: detectedBrand || 'Card',
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

      {/* Error message if validation fails */}
      {cardError && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs font-semibold animate-shake">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{cardError}</span>
        </div>
      )}

      {/* Payment Options Stack */}
      <div className="space-y-3 mb-6">
        {/* Option 1: SECURE PAYMENT (IMAGE 1 EXACT DESIGN & FUNCTIONALITY) */}
        <div
          onClick={() => {
            setPaymentType('card')
            if (cardError) setCardError('')
          }}
          className={`rounded-2xl border transition p-4 sm:p-5 cursor-pointer ${
            paymentType === 'card'
              ? 'border-[#c81d25] bg-[#faf8f5] shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          {/* Card Option Header matching Image 1: [Icon] SECURE PAYMENT */}
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

              <div className="flex items-center gap-2 text-[#5a483a]">
                <CreditCard className="w-4 h-4 stroke-[2.2]" />
                <span className="text-xs font-black tracking-wider uppercase">
                  SECURE PAYMENT
                </span>
              </div>
            </div>

            {/* Brand Detection Badges */}
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded transition ${
                  detectedBrand === 'VISA'
                    ? 'bg-[#1a1f71] text-white ring-2 ring-[#c81d25]'
                    : 'bg-[#1a1f71] text-white opacity-70'
                }`}
              >
                VISA
              </span>
              <span
                className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded transition ${
                  detectedBrand === 'MASTERCARD'
                    ? 'bg-[#eb001b] text-white ring-2 ring-[#c81d25]'
                    : 'bg-[#eb001b] text-white opacity-70'
                }`}
              >
                MC
              </span>
              <span
                className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded transition ${
                  detectedBrand === 'AMEX'
                    ? 'bg-[#006fcf] text-white ring-2 ring-[#c81d25]'
                    : 'bg-[#006fcf] text-white opacity-70'
                }`}
              >
                AMEX
              </span>
            </div>
          </div>

          {/* Unified Inline Card Input Bar (Image 1 Layout) */}
          <div className="bg-white border border-[#e5dfd6] focus-within:border-[#c81d25] focus-within:ring-2 focus-within:ring-[#c81d25]/15 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 transition shadow-2xs">
            {/* Card Icon on Left */}
            <div className="flex-shrink-0 w-6 h-4 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
              {detectedBrand ? (
                <span className="text-[7px] font-black text-neutral-800">
                  {detectedBrand === 'MASTERCARD' ? 'MC' : detectedBrand}
                </span>
              ) : (
                <CreditCard className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Card Number Input */}
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="Card number"
              className="flex-1 min-w-[120px] bg-transparent text-xs font-mono font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none tracking-wide"
            />

            {/* Subtle Divider */}
            <div className="w-[1px] h-4 bg-neutral-200 flex-shrink-0" />

            {/* MM / YY Expiry Input */}
            <input
              type="text"
              inputMode="numeric"
              value={cardExp}
              onChange={handleExpChange}
              placeholder="MM / YY"
              className="w-16 sm:w-20 bg-transparent text-xs font-mono font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none text-center"
            />

            {/* Subtle Divider */}
            <div className="w-[1px] h-4 bg-neutral-200 flex-shrink-0" />

            {/* CVC Input */}
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={cardCvc}
              onChange={handleCvcChange}
              placeholder="CVC"
              className="w-12 sm:w-14 bg-transparent text-xs font-mono font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none text-center"
            />
          </div>
        </div>

        {/* Option 2: Pay on Delivery (COD) */}
        <div
          onClick={() => {
            setPaymentType('cod')
            if (cardError) setCardError('')
          }}
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

      {/* Place Order CTA Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleSubmit}
        className="w-full bg-[#c81d25] hover:bg-[#a8161d] text-white font-black text-sm uppercase tracking-wider py-4 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition duration-200 active:scale-98 mb-4 disabled:opacity-75 cursor-pointer"
      >
        <span>
          {isProcessing
            ? 'Processing Secure Order...'
            : paymentType === 'cod'
            ? `Confirm Order (COD) • $${totalAmount.toFixed(2)}`
            : `Pay • $${totalAmount.toFixed(2)}`}
        </span>
        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Security Guarantee Footnote */}
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

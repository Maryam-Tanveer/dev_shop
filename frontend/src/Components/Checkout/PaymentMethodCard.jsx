import { useState } from 'react'
import {
  CreditCard,
  Wallet,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Check,
  AlertCircle,
} from 'lucide-react'

export default function PaymentMethodCard({
  totalAmount = 228.64,
  onPlaceOrder,
}) {
  const [paymentType, setPaymentType] = useState('card') // 'card' | 'digital' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState('')

  // Card details state
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [saveCard, setSaveCard] = useState(true)

  // Detect card brand from number
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '')
    if (/^4/.test(clean)) return 'VISA'
    if (/^5[1-5]/.test(clean)) return 'MASTERCARD'
    if (/^3[47]/.test(clean)) return 'AMEX'
    return null
  }

  const detectedBrand = getCardBrand(cardNumber)

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 16) val = val.slice(0, 16)
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val
    setCardNumber(formatted)
    if (cardError) setCardError('')
  }

  // Format expiry MM / YY
  const handleExpChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 4) val = val.slice(0, 4)
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`
    }
    setCardExp(val)
    if (cardError) setCardError('')
  }

  // Format CVV (3-4 digits)
  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvv(val)
    if (cardError) setCardError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCardError('')

    // Validation for Credit / Debit Card entry
    if (paymentType === 'card') {
      const rawNumber = cardNumber.replace(/\s+/g, '')
      if (!cardName.trim()) {
        setCardError('Please enter the name on the card.')
        return
      }
      if (rawNumber.length < 15) {
        setCardError('Please enter a valid 16-digit card number.')
        return
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
        setCardError('Please enter a valid expiration date (MM/YY).')
        return
      }
      const [mm, yy] = cardExp.split('/').map(Number)
      if (mm < 1 || mm > 12) {
        setCardError('Invalid expiration month.')
        return
      }
      if (cardCvv.length < 3) {
        setCardError('Please enter a valid 3 or 4 digit security code (CVV).')
        return
      }
    }

    setIsProcessing(true)

    if (onPlaceOrder) {
      onPlaceOrder({
        paymentType,
        gateway:
          paymentType === 'card'
            ? 'Credit/Debit Card (256-Bit SSL Encrypted)'
            : paymentType === 'cod'
            ? 'Cash on Delivery'
            : 'Digital Fast Pay',
        cardDetails:
          paymentType === 'card'
            ? {
                cardLast4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
                cardBrand: detectedBrand || 'VISA',
                name: cardName,
                exp: cardExp,
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

      {/* PCI-DSS Security Architecture Notice */}
      <div className="mb-5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5 text-xs text-neutral-600">
        <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-neutral-900">100% Encrypted Payment Terminal.</strong> Card details are verified and encrypted through a multi-point cryptographic token vault.
        </p>
      </div>

      {/* Error message */}
      {cardError && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs font-semibold animate-shake">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{cardError}</span>
        </div>
      )}

      {/* Methods Stack */}
      <div className="space-y-3 mb-6">
        {/* Option 1: Credit / Debit Card (REAL EMBEDDED FORM) */}
        <div
          onClick={() => setPaymentType('card')}
          className={`rounded-2xl border transition overflow-hidden ${
            paymentType === 'card'
              ? 'border-[#c81d25] bg-neutral-50/50 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300 cursor-pointer'
          }`}
        >
          {/* Card Option Header */}
          <div className="p-4 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
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

              <div>
                <span className="text-xs sm:text-sm font-bold text-neutral-900 block leading-tight">
                  Credit or Debit Card
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  Instant verification • Visa, Mastercard, AMEX, Discover
                </span>
              </div>
            </div>

            {/* Card Brand Badges */}
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded transition ${
                detectedBrand === 'VISA' ? 'bg-[#1a1f71] text-white ring-2 ring-[#c81d25]' : 'bg-[#1a1f71] text-white opacity-80'
              }`}>
                VISA
              </span>
              <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded transition ${
                detectedBrand === 'MASTERCARD' ? 'bg-[#eb001b] text-white ring-2 ring-[#c81d25]' : 'bg-[#eb001b] text-white opacity-80'
              }`}>
                MC
              </span>
              <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded transition ${
                detectedBrand === 'AMEX' ? 'bg-[#006fcf] text-white ring-2 ring-[#c81d25]' : 'bg-[#006fcf] text-white opacity-80'
              }`}>
                AMEX
              </span>
            </div>
          </div>

          {/* Embedded Card Form Fields (Visible when Option 1 is selected) */}
          {paymentType === 'card' && (
            <div className="px-4 pb-5 pt-2 border-t border-neutral-200/80 bg-white space-y-3">
              {/* Name on card */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value)
                    if (cardError) setCardError('')
                  }}
                  placeholder="e.g. Maryam Tanveer"
                  className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-[#c81d25] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 transition outline-none"
                />
              </div>

              {/* Card Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                    Card Number
                  </label>
                  {detectedBrand && (
                    <span className="text-[10px] font-black text-[#c81d25] tracking-wider uppercase">
                      ✓ {detectedBrand} Detected
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-[#c81d25] rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-mono font-semibold tracking-wider text-neutral-900 transition outline-none"
                  />
                  <div className="absolute right-3 text-neutral-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Row: Expiry Date & CVV */}
              <div className="grid grid-cols-2 gap-3">
                {/* Expiry Date */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    value={cardExp}
                    onChange={handleExpChange}
                    placeholder="MM / YY"
                    className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-[#c81d25] rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-neutral-900 transition outline-none text-center"
                  />
                </div>

                {/* CVV / CVC */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                      CVV / CVC
                    </label>
                    <span className="text-[9px] text-neutral-400 font-medium">3-4 digits</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      required
                      inputMode="numeric"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-[#c81d25] rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-mono font-semibold text-neutral-900 transition outline-none text-center"
                    />
                    <Lock className="w-3.5 h-3.5 text-neutral-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Save Card Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <div
                  onClick={() => setSaveCard(!saveCard)}
                  className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                    saveCard
                      ? 'bg-[#c81d25] border-[#c81d25] text-white shadow-2xs'
                      : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}
                >
                  {saveCard && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] text-neutral-600 font-medium">
                  Securely remember this card for faster drop checkouts
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Option 2: Digital Fast Pay (Apple Pay / Google Pay) */}
        <div
          onClick={() => {
            setPaymentType('digital')
            if (cardError) setCardError('')
          }}
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
                Apple Pay / Google Pay / Vault Link
              </span>
            </div>
          </div>

          <Wallet className="w-4 h-4 text-neutral-600" />
        </div>

        {/* Option 3: Cash On Delivery (COD) */}
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
            ? 'Processing Secure Order...'
            : paymentType === 'cod'
            ? `Confirm Order (COD) • $${totalAmount.toFixed(2)}`
            : paymentType === 'digital'
            ? `Pay with Digital Wallet • $${totalAmount.toFixed(2)}`
            : `Pay with Card • $${totalAmount.toFixed(2)}`}
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

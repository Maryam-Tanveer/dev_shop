import { useState, useEffect } from 'react'
import { Contact, Check } from 'lucide-react'

export default function ContactInformationCard({
  email = '',
  phone = '',
  onLoginClick,
  onChange,
}) {
  const [emailVal, setEmailVal] = useState(email)
  const [phoneVal, setPhoneVal] = useState(phone)
  const [keepUpdated, setKeepUpdated] = useState(true)

  useEffect(() => {
    if (email) setEmailVal(email)
  }, [email])

  useEffect(() => {
    if (phone) setPhoneVal(phone)
  }, [phone])

  const handleEmailChange = (val) => {
    setEmailVal(val)
    if (onChange) onChange({ email: val, phone: phoneVal })
  }

  const handlePhoneChange = (val) => {
    setPhoneVal(val)
    if (onChange) onChange({ email: emailVal, phone: val })
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25]">
            <Contact className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            Contact Information
          </h2>
        </div>

        <div className="text-xs text-neutral-500 font-medium">
          Already a member?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-[#c81d25] font-bold hover:underline transition"
          >
            Log in
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={emailVal}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Phone Number for Drop Dispatch
          </label>
          <input
            type="tel"
            value={phoneVal}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none group">
          <div
            onClick={() => setKeepUpdated(!keepUpdated)}
            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition border ${
              keepUpdated
                ? 'bg-[#c81d25] border-[#c81d25] text-white shadow-2xs'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            {keepUpdated && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-relaxed group-hover:text-neutral-800 transition">
            Keep me updated on exclusive sneaker drops, vault raffles, and flash deals
          </span>
        </label>
      </div>
    </div>
  )
}

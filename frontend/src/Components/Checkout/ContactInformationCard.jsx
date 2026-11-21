import { useState, useEffect } from 'react'
import { Contact, Check, AlertCircle } from 'lucide-react'
import { formatPakistanPhone } from '../../utils/geoData'

export default function ContactInformationCard({
  email = '',
  phone = '',
  errors = {},
  clearFieldError,
  onLoginClick,
  onChange,
}) {
  const [emailVal, setEmailVal] = useState(email)
  const [phoneVal, setPhoneVal] = useState(phone ? formatPakistanPhone(phone) : '')
  const [keepUpdated, setKeepUpdated] = useState(true)

  useEffect(() => {
    if (email) setEmailVal(email)
  }, [email])

  useEffect(() => {
    if (phone) {
      setPhoneVal(formatPakistanPhone(phone))
    }
  }, [phone])

  const handleEmailChange = (val) => {
    setEmailVal(val)
    if (clearFieldError) clearFieldError('email')
    if (onChange) onChange({ email: val, phone: phoneVal })
  }

  const handlePhoneChange = (raw) => {
    if (!raw || raw.trim() === '+' || raw.trim() === '+92') {
      setPhoneVal('')
      if (clearFieldError) clearFieldError('phone')
      if (onChange) onChange({ email: emailVal, phone: '' })
      return
    }
    const formatted = formatPakistanPhone(raw)
    setPhoneVal(formatted)
    if (clearFieldError) clearFieldError('phone')
    if (onChange) onChange({ email: emailVal, phone: formatted })
  }

  const handlePhoneFocus = () => {
    if (!phoneVal) {
      setPhoneVal('+92 ')
    }
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
            Email Address <span className="text-[#c81d25]">*</span>
          </label>
          <input
            type="email"
            value={emailVal}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition outline-none ${
              errors.email
                ? 'bg-red-50/50 border-2 border-red-500 text-red-900 focus:bg-white'
                : 'bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-neutral-800'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-[11px] font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              Phone Number <span className="text-[#c81d25]">*</span>
            </label>
            <span className="text-[10px] font-mono font-bold text-neutral-400">
              Format: +92 300 1234567
            </span>
          </div>
          <input
            type="tel"
            value={phoneVal}
            onFocus={handlePhoneFocus}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={`w-full font-mono rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition outline-none ${
              errors.phone
                ? 'bg-red-50/50 border-2 border-red-500 text-red-900 focus:bg-white'
                : 'bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-neutral-800'
            }`}
            placeholder="+92 300 1234567"
          />
          {errors.phone && (
            <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-[11px] font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.phone}</span>
            </div>
          )}
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

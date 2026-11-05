import { useState, useEffect, useMemo } from 'react'
import { Truck, ChevronDown } from 'lucide-react'
import { ALL_COUNTRIES, POPULAR_COUNTRIES, getStatesForCountry } from '../../utils/geoData'

const normalizeCountryName = (c) => {
  if (!c) return 'Pakistan'
  const norm = String(c).trim().toLowerCase()
  if (norm === 'pk' || norm === 'pakistan') return 'Pakistan'
  if (norm === 'us' || norm === 'usa' || norm === 'united states' || norm === 'united states of america') return 'United States'
  if (norm === 'ca' || norm === 'canada') return 'Canada'
  if (norm === 'uk' || norm === 'gb' || norm === 'united kingdom') return 'United Kingdom'
  if (norm === 'ae' || norm === 'uae' || norm === 'united arab emirates') return 'United Arab Emirates'
  if (norm === 'sa' || norm === 'ksa' || norm === 'saudi arabia') return 'Saudi Arabia'
  if (norm === 'au' || norm === 'australia') return 'Australia'
  if (norm === 'in' || norm === 'india') return 'India'
  if (norm === 'de' || norm === 'germany') return 'Germany'
  if (norm === 'fr' || norm === 'france') return 'France'
  return c
}

export default function ShippingAddressCard({
  initialAddress,
  onChange,
}) {
  const defaultCountry = normalizeCountryName(initialAddress?.country || 'Pakistan')
  const initialStates = getStatesForCountry(defaultCountry)

  const [formData, setFormData] = useState({
    firstName: initialAddress?.firstName || '',
    lastName: initialAddress?.lastName || '',
    streetAddress: initialAddress?.address || initialAddress?.streetAddress || '',
    apartment: initialAddress?.apartment || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || (initialStates.length > 0 ? initialStates[0] : ''),
    postalCode: initialAddress?.zipCode || initialAddress?.postalCode || '',
    country: defaultCountry,
  })

  const [isCustomState, setIsCustomState] = useState(false)

  // Dynamically resolve states whenever country changes
  const availableStates = useMemo(() => {
    return getStatesForCountry(formData.country)
  }, [formData.country])

  useEffect(() => {
    if (initialAddress) {
      const resolvedCountry = normalizeCountryName(initialAddress.country || formData.country)
      const states = getStatesForCountry(resolvedCountry)
      const resolvedState = initialAddress.state || (states.length > 0 ? states[0] : '')

      setFormData((prev) => ({
        firstName: initialAddress.firstName !== undefined ? initialAddress.firstName : prev.firstName,
        lastName: initialAddress.lastName !== undefined ? initialAddress.lastName : prev.lastName,
        streetAddress: initialAddress.address || initialAddress.streetAddress || prev.streetAddress,
        apartment: initialAddress.apartment || prev.apartment,
        city: initialAddress.city || prev.city,
        state: resolvedState || prev.state,
        postalCode: initialAddress.zipCode || initialAddress.postalCode || prev.postalCode,
        country: resolvedCountry,
      }))

      if (states.length > 0 && resolvedState && !states.includes(resolvedState)) {
        setIsCustomState(true)
      } else if (states.length > 0) {
        setIsCustomState(false)
      } else {
        setIsCustomState(true)
      }
    }
  }, [initialAddress])

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (onChange) onChange(updated)
  }

  const handleCountryChange = (newCountry) => {
    const states = getStatesForCountry(newCountry)
    let newState = formData.state

    if (states.length > 0) {
      if (!states.includes(formData.state)) {
        newState = states[0]
      }
      setIsCustomState(false)
    } else {
      setIsCustomState(true)
    }

    const updated = {
      ...formData,
      country: newCountry,
      state: newState,
    }
    setFormData(updated)
    if (onChange) onChange(updated)
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c81d25]">
          <Truck className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            Shipping Address
          </h2>
          <p className="text-[11px] text-neutral-500 font-medium">
            Physical street delivery with verified vault authentication
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Street Address
          </label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
            placeholder="Street Address, House/Building Number, P.O. Box"
          />
        </div>

        {/* Apartment / Suite */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Apartment, Suite, Unit (Optional)
          </label>
          <input
            type="text"
            value={formData.apartment}
            onChange={(e) => handleChange('apartment', e.target.value)}
            className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
            placeholder="Apartment, suite, unit, floor, etc."
          />
        </div>

        {/* Country / Region */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
            Country / Region
          </label>
          <div className="relative">
            <select
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none appearance-none cursor-pointer pr-10"
            >
              <optgroup label="Popular Countries">
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={`pop-${c}`} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All Countries">
                {ALL_COUNTRIES.filter((c) => !POPULAR_COUNTRIES.includes(c)).map((c) => (
                  <option key={`all-${c}`} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* City, State / Province, Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="e.g. Chak Jhumra, Lahore, New York"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                State / Province
              </label>
              {availableStates.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isCustomState
                    setIsCustomState(nextMode)
                    if (nextMode) {
                      handleChange('state', '')
                    } else if (availableStates.length > 0) {
                      handleChange('state', availableStates[0])
                    }
                  }}
                  className="text-[10px] font-bold text-[#c81d25] hover:underline cursor-pointer"
                >
                  {isCustomState ? 'Select from list' : 'Type manually'}
                </button>
              )}
            </div>

            {availableStates.length > 0 && !isCustomState ? (
              <div className="relative">
                <select
                  value={formData.state}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomState(true)
                      handleChange('state', '')
                    } else {
                      handleChange('state', e.target.value)
                    }
                  }}
                  className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none appearance-none cursor-pointer pr-10"
                >
                  {!availableStates.includes(formData.state) && (
                    <option value="" disabled>
                      Select State / Province
                    </option>
                  )}
                  {availableStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                  <option value="__custom__">— Other / Enter manually —</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
                placeholder={availableStates.length > 0 ? "Enter state or province" : "State / Province / Region"}
              />
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-neutral-800 transition outline-none"
              placeholder="e.g. 38000, 10013"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { Truck, ChevronDown, AlertCircle } from 'lucide-react'
import {
  ALL_COUNTRIES,
  POPULAR_COUNTRIES,
  getStatesForCountry,
  getCitiesForProvince,
} from '../../utils/geoData'

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
  errors = {},
  clearFieldError,
}) {
  const defaultCountry = normalizeCountryName(initialAddress?.country || 'Pakistan')
  const initialStates = getStatesForCountry(defaultCountry)

  const [formData, setFormData] = useState({
    firstName: initialAddress?.firstName || '',
    lastName: initialAddress?.lastName || '',
    streetAddress: initialAddress?.address || initialAddress?.streetAddress || '',
    apartment: initialAddress?.apartment || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || (initialStates.length > 0 ? initialStates[0] : 'Punjab'),
    postalCode: initialAddress?.zipCode || initialAddress?.postalCode || '',
    country: defaultCountry,
  })

  const [isCustomState, setIsCustomState] = useState(false)

  // Dynamically resolve states whenever country changes
  const availableStates = useMemo(() => {
    return getStatesForCountry(formData.country)
  }, [formData.country])

  // Dynamically resolve cities for the chosen province
  const availableCities = useMemo(() => {
    return getCitiesForProvince(formData.state)
  }, [formData.state])

  useEffect(() => {
    if (initialAddress) {
      const resolvedCountry = normalizeCountryName(initialAddress.country || formData.country)
      const states = getStatesForCountry(resolvedCountry)
      const resolvedState = initialAddress.state || (states.length > 0 ? states[0] : 'Punjab')

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
    let updated = { ...formData, [field]: value }

    // If province changes, clear errors for state and city
    if (field === 'state') {
      if (clearFieldError) {
        clearFieldError('state')
        clearFieldError('city')
      }
      // Check if current city is valid in new province; if not, reset city
      const newCities = getCitiesForProvince(value)
      if (newCities.length > 0 && formData.city && !newCities.map(c => c.toLowerCase()).includes(formData.city.toLowerCase())) {
        updated.city = ''
      }
    } else if (clearFieldError) {
      clearFieldError(field)
    }

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
      city: '',
    }
    setFormData(updated)
    if (clearFieldError) {
      clearFieldError('country')
      clearFieldError('state')
      clearFieldError('city')
    }
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
              First Name <span className="text-[#c81d25]">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition outline-none ${
                errors.firstName
                  ? 'bg-red-50/50 border-2 border-red-500 text-red-900 focus:bg-white'
                  : 'bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-neutral-800'
              }`}
              placeholder="First Name"
            />
            {errors.firstName && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-[11px] font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.firstName}</span>
              </div>
            )}
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
            Street Address <span className="text-[#c81d25]">*</span>
          </label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
            className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition outline-none ${
              errors.streetAddress
                ? 'bg-red-50/50 border-2 border-red-500 text-red-900 focus:bg-white'
                : 'bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-neutral-800'
            }`}
            placeholder="Street Address, House/Building Number, P.O. Box"
          />
          {errors.streetAddress && (
            <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-[11px] font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.streetAddress}</span>
            </div>
          )}
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

        {/* State / Province (First) then City (linked to Province) and Postal Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. State / Province */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                State / Province <span className="text-[#c81d25]">*</span>
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
                  className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition outline-none appearance-none cursor-pointer pr-10 ${
                    errors.state
                      ? 'bg-red-50/50 border-2 border-red-500 text-red-900 focus:bg-white'
                      : 'bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-neutral-800'
                  }`}
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
                className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition outline-none ${
                  errors.state
                    ? 'bg-red-50/50 border-2 border-red-500 text-red-900 focus:bg-white'
                    : 'bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-neutral-800'
                }`}
                placeholder={availableStates.length > 0 ? "Enter state or province" : "State / Province / Region"}
              />
            )}
            {errors.state && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-[11px] font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.state}</span>
              </div>
            )}
          </div>

          {/* 2. City (Strictly validated for the selected Province) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                City <span className="text-[#c81d25]">*</span>
              </label>
              {availableCities.length > 0 && (
                <span className="text-[10px] text-neutral-400 font-medium">
                  {formData.state ? `${formData.state.split(' ')[0]} cities` : ''}
                </span>
              )}
            </div>
            <input
              type="text"
              list="province-city-datalist"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition outline-none ${
                errors.city
                  ? 'bg-red-50/50 border-2 border-red-500 text-red-900 focus:bg-white'
                  : 'bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-neutral-800'
              }`}
              placeholder={
                availableCities.length > 0
                  ? `e.g. ${availableCities.slice(0, 3).join(', ')}`
                  : 'Enter City name'
              }
            />

            {/* Datalist auto-suggesting cities for the selected province */}
            {availableCities.length > 0 && (
              <datalist id="province-city-datalist">
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c} ({formData.state})
                  </option>
                ))}
              </datalist>
            )}

            {errors.city && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-[11px] font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.city}</span>
              </div>
            )}
          </div>

          {/* 3. Postal Code */}
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
